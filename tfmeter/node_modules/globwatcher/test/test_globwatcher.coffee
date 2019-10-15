fs = require 'fs'
minimatch = require 'minimatch'
mocha_sprinkles = require 'mocha-sprinkles'
path = require 'path'
Q = require 'q'
shell = require 'shelljs'
should = require 'should'
touch = require 'touch'
util = require 'util'

future = mocha_sprinkles.future
withTempFolder = mocha_sprinkles.withTempFolder

globwatcher = require("../lib/globwatcher/globwatcher")

dump = (x) -> util.inspect x, false, null, true

makeFixtures = (folder, ts) ->
  if not ts? then ts = Date.now() - 1000
  [
    "#{folder}/one.x"
    "#{folder}/sub/one.x"
    "#{folder}/sub/two.x"
    "#{folder}/nested/three.x"
    "#{folder}/nested/weird.jpg"
  ].map (file) ->
    shell.mkdir "-p", path.dirname(file)
    touch.sync file, mtime: ts

fixtures = (f) ->
  future withTempFolder (folder) ->
    makeFixtures(folder)
    f(folder)

# create a new globwatch, run a test, and close it
withGlobwatcher = (pattern, options, f) ->
  if not f?
    f = options
    options = {}
  options.persistent = false
  g = globwatcher.globwatcher(pattern, options)
  g.ready.fin ->
    f(g)
  .fin ->
    g.close()

# capture add/remove/change into an object for later inspection
capture = (g) ->
  summary = {}
  g.on "added", (filename) ->
    (summary["added"] or= []).push filename
    summary["added"].sort()
  g.on "deleted", (filename) ->
    (summary["deleted"] or= []).push filename
    summary["deleted"].sort()
  g.on "changed", (filename) ->
    (summary["changed"] or= []).push filename
    summary["changed"].sort()
  summary

describe "globwatcher", ->
  it "folderMatchesMinimatchPrefix", ->
    set = new minimatch.Minimatch("/home/commie/**/*.js", nonegate: true).set[0]
    globwatcher.folderMatchesMinimatchPrefix([ "", "home" ], set).should.equal(true)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "commie" ], set).should.equal(true)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "robey" ], set).should.equal(false)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "commie", "rus" ], set).should.equal(true)
    set = new minimatch.Minimatch("/home/commie/l*/*.js", nonegate: true).set[0]
    globwatcher.folderMatchesMinimatchPrefix([ "", "home" ], set).should.equal(true)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "commie" ], set).should.equal(true)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "robey" ], set).should.equal(false)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "commie", "rus" ], set).should.equal(false)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "commie", "lola" ], set).should.equal(true)
    globwatcher.folderMatchesMinimatchPrefix([ "", "home", "commie", "lola", "prissy" ], set).should.equal(false)

  it "addWatch", future ->
    withGlobwatcher "/wut", (g) ->
      for f in [
        "/absolute.txt"
        "/sub/absolute.txt"
        "/deeply/nested/file/why/nobody/knows.txt"
      ] then g.addWatch(f)
      g.watchMap.getFolders().sort().should.eql [ "/", "/deeply/nested/file/why/nobody/", "/sub/" ]
      g.watchMap.getFilenames("/").should.eql [ "/absolute.txt" ]
      g.watchMap.getFilenames("/sub/").should.eql [ "/sub/absolute.txt" ]
      g.watchMap.getFilenames("/deeply/nested/file/why/nobody/").should.eql [ "/deeply/nested/file/why/nobody/knows.txt" ]

  it "can parse patterns", fixtures (folder) ->
    withGlobwatcher "#{folder}/**/*.x", (g) ->
      g.patterns.should.eql [ "#{folder}/**/*.x" ]
      Object.keys(g.watchers).sort().should.eql [ "#{folder}/", "#{folder}/nested/", "#{folder}/sub/" ]
      g.watchMap.getFolders().sort().should.eql [ "#{folder}/", "#{folder}/nested/", "#{folder}/sub/" ]
      g.watchMap.getFilenames("#{folder}/").should.eql [ "#{folder}/one.x" ]
      g.watchMap.getFilenames("#{folder}/nested/").should.eql [ "#{folder}/nested/three.x" ]
      g.watchMap.getFilenames("#{folder}/sub/").should.eql [ "#{folder}/sub/one.x", "#{folder}/sub/two.x" ]

  it "can parse patterns relative to cwd", fixtures (folder) ->
    withGlobwatcher "**/*.x", { cwd: "#{folder}/sub" }, (g) ->
      g.patterns.should.eql [ "#{folder}/sub/**/*.x" ]
      Object.keys(g.watchers).sort().should.eql [ "#{folder}/sub/" ]
      g.watchMap.getFolders().sort().should.eql [ "#{folder}/sub/" ]
      g.watchMap.getFilenames("#{folder}/sub/").should.eql [ "#{folder}/sub/one.x", "#{folder}/sub/two.x" ]

  it "handles odd relative paths", fixtures (folder) ->
    withGlobwatcher "../sub/**/*.x", { cwd: "#{folder}/nested" }, (g) ->
      Object.keys(g.watchers).sort().should.eql [ "#{folder}/sub/" ]
      g.watchMap.getFolders().sort().should.eql [ "#{folder}/sub/" ]
      g.watchMap.getFilenames("#{folder}/sub/").should.eql [ "#{folder}/sub/one.x", "#{folder}/sub/two.x" ]

  it "notices new files", fixtures (folder) ->
    summary = null
    withGlobwatcher "#{folder}/**/*.x", (g) ->
      summary = capture(g)
      touch.sync "#{folder}/nested/four.x"
      touch.sync "#{folder}/sub/not-me.txt"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/nested/four.x" ]
        }

  it "doesn't emit signals when turned off", fixtures (folder) ->
    summary = null
    withGlobwatcher "#{folder}/**/*.x", (g) ->
      summary = capture(g)
      g.stopWatches()
      Q.delay(25).then ->
        touch.sync "#{folder}/nested/four.x"
        touch.sync "#{folder}/sub/not-me.txt"
        g.check()
      .then ->
        # just in case, make sure the timer goes off too
        Q.delay(g.interval * 2)
      .then ->
        summary.should.eql { }

  it "notices new files only in cwd", fixtures (folder) ->
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}/sub" }, (g) ->
      summary = capture(g)
      touch.sync "#{folder}/nested/four.x"
      touch.sync "#{folder}/sub/not-me.txt"
      touch.sync "#{folder}/sub/four.x"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/sub/four.x" ]
        }

  it "notices new files nested deeply", fixtures (folder) ->
    summary = null
    withGlobwatcher "#{folder}/**/*.x", (g) ->
      summary = capture(g)
      shell.mkdir "-p", "#{folder}/nested/more/deeply"
      touch.sync "#{folder}/nested/more/deeply/nine.x"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/nested/more/deeply/nine.x" ]
        }

  it "notices deleted files", fixtures (folder) ->
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      fs.unlinkSync("#{folder}/sub/one.x")
      g.check().then ->
        summary.should.eql {
          deleted: [ "#{folder}/sub/one.x" ]
        }

  it "notices a rename as an add + delete", fixtures (folder) ->
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      fs.renameSync "#{folder}/sub/two.x", "#{folder}/sub/twelve.x"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/sub/twelve.x" ]
          deleted: [ "#{folder}/sub/two.x" ]
        }

  it "handles a nested delete", fixtures (folder) ->
    shell.mkdir "-p", "#{folder}/nested/more/deeply"
    touch.sync "#{folder}/nested/more/deeply/here.x"
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      shell.rm "-r", "#{folder}/nested"
      g.check().then ->
        summary.should.eql {
          deleted: [ "#{folder}/nested/more/deeply/here.x", "#{folder}/nested/three.x" ]
        }

  it "handles a changed file", fixtures (folder) ->
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      fs.writeFileSync "#{folder}/sub/one.x", "gahhhhhh"
      g.check().then ->
        summary.should.eql {
          changed: [ "#{folder}/sub/one.x" ]
        }

  it "follows a safe-write", fixtures (folder) ->
    summary = null
    savee = "#{folder}/one.x"
    backup = "#{folder}/one.x~"
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      fs.writeFileSync backup, fs.readFileSync(savee)
      fs.unlinkSync savee
      fs.renameSync backup, savee
      g.check().then ->
        summary.should.eql {
          changed: [ savee ]
        }

  it "only emits once for a changed file", fixtures (folder) ->
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      fs.writeFileSync "#{folder}/one.x", "whee1"
      g.check().then ->
        summary.should.eql {
          changed: [ "#{folder}/one.x" ]
        }
        g.check()
      .then ->
        summary.should.eql {
          changed: [ "#{folder}/one.x" ]
        }

  it "emits twice if a file was changed twice", fixtures (folder) ->
    summary = null
    withGlobwatcher "**/*.x", { cwd: "#{folder}" }, (g) ->
      summary = capture(g)
      fs.writeFileSync "#{folder}/one.x", "whee1"
      g.check().then ->
        summary.should.eql {
          changed: [ "#{folder}/one.x" ]
        }
        fs.writeFileSync "#{folder}/one.x", "whee123"
        g.check()
      .then ->
        summary.should.eql {
          changed: [ "#{folder}/one.x", "#{folder}/one.x" ]
        }

  it "doesn't mind watching a nonexistent folder", fixtures (folder) ->
    withGlobwatcher "#{folder}/not/there/*", (g) ->
      3.should.equal(3)

  it "sees a new matching file even if the whole folder was missing when it started", future withTempFolder (folder) ->
    summary = null
    withGlobwatcher "#{folder}/not/there/*", (g) ->
      summary = capture(g)
      shell.mkdir "-p", "#{folder}/not/there"
      fs.writeFileSync "#{folder}/not/there/ten.x", "wheeeeeee"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/not/there/ten.x" ]
        }

  it "sees a new matching file even if nested folders were missing when it started", fixtures (folder) ->
    summary = null
    withGlobwatcher "#{folder}/sub/deeper/*.x", (g) ->
      summary = capture(g)
      shell.mkdir "-p", "#{folder}/sub/deeper"
      fs.writeFileSync "#{folder}/sub/deeper/ten.x", "wheeeeeee"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/sub/deeper/ten.x" ]
        }

  it "sees a new matching file even if the entire tree was erased and re-created", fixtures (folder) ->
    shell.rm "-rf", "#{folder}/nested"
    shell.mkdir "-p", "#{folder}/nested/deeper/still"
    touch.sync "#{folder}/nested/deeper/still/four.x"
    summary = null
    withGlobwatcher "#{folder}/**/*", (g) ->
      summary = capture(g)
      shell.rm "-r", "#{folder}/nested"
      g.check().then ->
        summary.should.eql {
          deleted: [ "#{folder}/nested/deeper/still/four.x" ]
        }
        delete summary.deleted
        shell.mkdir "-p", "#{folder}/nested/deeper/still"
        fs.writeFileSync "#{folder}/nested/deeper/still/ten.x", "wheeeeeee"
        g.check()
      .then ->
        summary.should.eql {
          added: [ "#{folder}/nested/deeper/still/ten.x" ]
        }

  it "sees a new matching file even if the folder exists but was empty", fixtures (folder) ->
    shell.mkdir "-p", "#{folder}/nested/deeper"
    summary = null
    withGlobwatcher "#{folder}/nested/deeper/*.x", (g) ->
      summary = capture(g)
      fs.writeFileSync "#{folder}/nested/deeper/ten.x", "wheeeeeee"
      g.check().then ->
        summary.should.eql {
          added: [ "#{folder}/nested/deeper/ten.x" ]
        }

  it "will watch a single, non-globbed file that doesn't exist", fixtures (folder) ->
    summary = null
    withGlobwatcher "#{folder}/nothing.x", (g) ->
      summary = capture(g)
      fs.writeFileSync "#{folder}/nothing.x", "hi!"
      Q.delay(g.interval).then ->
        summary.should.eql {
          added: [ "#{folder}/nothing.x" ]
        }

  it "returns a currentSet", fixtures (folder) ->
    withGlobwatcher "#{folder}/**/*.x", (g) ->
      g.currentSet().sort().should.eql [
        "#{folder}/nested/three.x"
        "#{folder}/one.x"
        "#{folder}/sub/one.x"
        "#{folder}/sub/two.x"
      ]
      shell.rm "#{folder}/sub/one.x"
      fs.writeFileSync "#{folder}/whatevs.x"
      g.check().then ->
        g.currentSet().sort().should.eql [
          "#{folder}/nested/three.x"
          "#{folder}/one.x"
          "#{folder}/sub/two.x"
          "#{folder}/whatevs.x"
        ]

  describe "takes a snapshot", ->
    it "of globs", fixtures (folder) ->
      withGlobwatcher "#{folder}/**/*.x", { snapshot: {} }, (g) ->
        ts = fs.statSync("#{folder}/one.x").mtime.getTime()
        fs.writeFileSync "#{folder}/wut.x", "hello"
        touch.sync "#{folder}/wut.x", mtime: ts
        g.check().then ->
          snapshot = g.snapshot()
          snapshot["#{folder}/one.x"].should.eql(mtime: ts, size: 0)
          snapshot["#{folder}/wut.x"].should.eql(mtime: ts, size: 5)
          snapshot["#{folder}/nested/three.x"].should.eql(mtime: ts, size: 0)
          snapshot["#{folder}/sub/one.x"].should.eql(mtime: ts, size: 0)
          snapshot["#{folder}/sub/two.x"].should.eql(mtime: ts, size: 0)

    it "of normal files", fixtures (folder) ->
      withGlobwatcher "#{folder}/sub/two.x", { snapshot: {} }, (g) ->
        ts = fs.statSync("#{folder}/sub/two.x").mtime.getTime()
        g.check().then ->
          snapshot = g.snapshot()
          snapshot["#{folder}/sub/two.x"].should.eql(mtime: ts, size: 0)
          fs.writeFileSync("#{folder}/sub/two.x", "new!")
          ts = fs.statSync("#{folder}/sub/two.x").mtime.getTime()
          withGlobwatcher "#{folder}/sub/two.x", { snapshot }, (g) ->
            g.check().then ->
              snapshot = g.snapshot()
              snapshot["#{folder}/sub/two.x"].should.eql(mtime: ts, size: 4)

  it "resumes from a snapshot", fixtures (folder) ->
    withGlobwatcher "#{folder}/**/*.x", (g) ->
      summary = null
      snapshot = g.snapshot()
      g.close()
      Q.delay(100).then ->
        fs.writeFileSync "#{folder}/one.x", "hello"
        shell.rm "#{folder}/sub/two.x"
        touch.sync "#{folder}/sub/nine.x"
        g = globwatcher.globwatcher("#{folder}/**/*.x", persistent: false, snapshot: snapshot)
        summary = capture(g)
        g.ready
      .then ->
        summary.should.eql {
          added: [ "#{folder}/sub/nine.x" ]
          changed: [ "#{folder}/one.x" ]
          deleted: [ "#{folder}/sub/two.x" ]
        }
