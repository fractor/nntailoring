fs = require 'fs'
mocha_sprinkles = require 'mocha-sprinkles'
path = require 'path'
Q = require 'q'
shell = require 'shelljs'
should = require 'should'
touch = require 'touch'
util = require 'util'

future = mocha_sprinkles.future
withTempFolder = mocha_sprinkles.withTempFolder

FileWatcher = require("../lib/globwatcher/filewatcher").FileWatcher

makeFixtures = (folder) ->
  past = Date.now() - 1000
  [
    "#{folder}/one.x"
    "#{folder}/sub/one.x"
    "#{folder}/sub/two.x"
    "#{folder}/nested/three.x"
    "#{folder}/nested/weird.jpg"
  ].map (file) ->
    shell.mkdir "-p", path.dirname(file)
    touch.sync file, mtime: past

fixtures = (f) ->
  future withTempFolder (folder) ->
    makeFixtures(folder)
    f(folder)

withFileWatcher = (f) ->
  (x...) ->
    watcher = new FileWatcher()
    f(watcher, x...).fin ->
      watcher.close()


describe "FileWatcher", ->
  it "creates a watch", fixtures withFileWatcher (watcher, folder) ->
    (watcher.timer?).should.eql(false)
    watch = watcher.watch("#{folder}/one.x")
    (watch?).should.eql(true)
    (watcher.timer?).should.eql(true)
    Q(true)
  
  it "reuses the same watch for the same filename", fixtures withFileWatcher (watcher, folder) ->    
    watch1 = watcher.watch("#{folder}/one.x")
    watch2 = watcher.watch("#{folder}/one.x")
    watch1.should.equal(watch2)
    Q(true)
 
  it "notices a change", fixtures withFileWatcher (watcher, folder) ->
    watch = watcher.watch("#{folder}/one.x")
    count = 0
    watch.on 'changed', -> count += 1
    touch.sync "#{folder}/one.x"
    count.should.eql(0)
    watch.check().then ->
      count.should.eql(1)

  it "notices several changes at once", fixtures withFileWatcher (watcher, folder) ->
    countOne = 0
    countTwo = 0
    watcher.watch("#{folder}/sub/one.x").on 'changed', -> countOne += 1
    watcher.watch("#{folder}/sub/two.x").on 'changed', -> countTwo += 1
    touch.sync "#{folder}/sub/one.x"
    touch.sync "#{folder}/sub/two.x"
    countOne.should.eql(0)
    countTwo.should.eql(0)
    watcher.check().then ->
      countOne.should.eql(1)
      countTwo.should.eql(1)

  it "notices changes on a timer", fixtures withFileWatcher (watcher, folder) ->
    countOne = 0
    countTwo = 0
    watcher.watch("#{folder}/sub/one.x").on 'changed', -> countOne += 1
    watcher.watch("#{folder}/sub/two.x").on 'changed', -> countTwo += 1
    touch.sync "#{folder}/sub/one.x"
    touch.sync "#{folder}/sub/two.x"
    countOne.should.eql(0)
    countTwo.should.eql(0)
    Q.delay(watcher.period + 10).then ->
      countOne.should.eql(1)
      countTwo.should.eql(1)

  it "queues stacked check() calls", fixtures withFileWatcher (watcher, folder) ->
    count = 0
    watcher.watch("#{folder}/one.x").on 'changed', -> count += 1
    touch.sync "#{folder}/one.x", mtime: Date.now() + 1000
    visited = [ false, false ]
    x1 = watcher.check().then ->
      count.should.eql(1)
      touch.sync "#{folder}/one.x", mtime: Date.now() + 2000
      visited[1].should.eql(false)
      visited[0] = true
    x2 = watcher.check().then ->
      visited[0].should.eql(true)
      visited[1] = true
      count.should.eql(2)
    visited[0].should.eql(false)
    visited[1].should.eql(false)
    Q.all([ x1, x2 ])

  it "detects size changes", future withTempFolder withFileWatcher (watcher, folder) ->
    now = Date.now() - 15000
    write = (data) ->
      fs.writeFileSync("#{folder}/shifty.x", data)
      touch.sync "#{folder}/shifty.x", mtime: now
    write "abcdefghij"
    count = 0
    watcher.watch("#{folder}/shifty.x").on 'changed', -> count += 1
    write "klmnopqrst"
    watcher.check()
    .then ->
      count.should.eql(0)
      write "abcdef"
      watcher.check()
    .then ->
      count.should.eql(1)

  it "can unwatch", future withTempFolder withFileWatcher (watcher, folder) ->
    touch.sync "#{folder}/changes.x", mtime: Date.now() - 15000
    watch = watcher.watch "#{folder}/changes.x"
    count = 0
    watch.on 'changed', -> count += 1
    touch.sync "#{folder}/changes.x", mtime: Date.now() - 11000
    watcher.check()
    .then ->
      count.should.eql(1)
      watcher.unwatch "#{folder}/changes.x"
      touch.sync "#{folder}/changes.x", mtime: Date.now() - 6000
      watcher.check()
    .then ->
      count.should.eql(1)

