globwatcher
===========

[![Build Status](https://travis-ci.org/robey/globwatcher.png?branch=master)](https://travis-ci.org/robey/globwatcher)

Globwatcher is a node library that monitors a filesystem for changes to files
specified by glob patterns, and triggers events when a file is added, changed,
or deleted. It's built on top of node's `fs.watch` mechanism, and uses the
glob pattern syntax of the `glob` module.

Sample usage:

```javascript
var globwatcher = require("globwatcher").globwatcher;
var watcher = globwatcher("/albums/**/*.mp3");
watcher.on("added", function (filename) {
  console.log("New MP3 detected: " + filename);
});
watcher.ready.then(function () {
  console.log("Globwatcher is now actively scanning!");
});
```

API
---

### `globwatcher(patterns, options)`

Create a new `GlobWatcher` object, which will monitor for files that match
the given patterns (or a single pattern), and trigger events. The `options`
object can contain:

- `cwd` - folder to use for relative patterns. If not given, the process's
  current working directory is used. Absolute patterns (patterns that start
  with "/") don't use this option.

- `interval` - frequency (in milliseconds) to monitor existing files for
  changes. Default is 250, or 1/4 second.

- `debounceInterval` - delay (in milliseconds) to wait after receiving a
  "folder has changed" notification before scanning the folder. This helps
  alleviate thundering-herd problems where many files may be created or
  deleted in a short period. Default is 10 milliseconds.

- `snapshot` - previous state to resume from, as captured with `snapshot()`
  (see "Snapshots" below).

- `persistent` - if false, unref the watches so they don't keep node running.
  Default is false.

- `debug` - a function to call to log debug info while running. This function
  will be called with a string to log whenever certain changes or events
  occur, so it can be noisy, but may be useful for general debugging.

Useful fields:

- `ready` - a promise that will be fulfilled once all the watches have been
  created and the initial scan is complete. This can be used to run code that
  depends on globwatcher being active.

- `originalPatterns` - the original (non-normalized) patterns used to create
  this globwatcher, including any added with `add()`.

Useful methods:

- `add(patterns...)` - Add new glob patterns to be scanned. This will reset
  the `ready` promise (described above) so that it's fulfilled only when this
  new set of patterns are active.

- `close()` - Stop monitoring and free all resources. No new events will be
  sent after this call returns, and all "watch" resources will be freed.

- `stopWatches()` - Stop monitoring temporarily. Pending events may still
  arrive after this call returns, but no new events will be triggered, and
  all "watch" resources will be freed. The watched patterns will be
  remembered, so you can call `startWatches()` again to resume monitoring.

- `startWatches()` - Resume monitoring after a `stopWatches()` call. You
  don't need to call this function when first monitoring -- it's called by
  the constructor automatically.

- `check()` - Immediately scan interesting folders and files and trigger
  events on changes. You don't need to call this function normally, but if
  you believe files have changed, and want to bypass the normal scan
  interval, this call may speed up the latency between a filesystem event and
  the event signalled by globwatcher. Returns a promise that is fulfilled
  when the check is finished.

- `currentSet()` - Return the set of filenames that currently exist and match
  the glob pattern being scanned. The filenames are all absolute.

- `snapshot()` - Return an object representing the current state of watched
  folders and files. (See "Snapshots" below.)

Events signalled:

- `added(filename)` - a new file that matches one of the watched patterns was
  created

- `deleted(filename)` - a file that matches one of the watched patterns was
  deleted

- `changed(filename)` - a file that matches one of the watched patterns was
  changed, either by modification time or size

The filename argument to events is always an absolute filename.

### `new FileWatcher(options)`

The `FileWatcher` class is a pure-js replacement for the `fs.watchFile`
interface, with an extra `check` method. It's primarily an implementation
detail of globwatcher, but feel free to use it directly.

A FileWatcher calls `fs.stat` on a set of files, on a recurring timer. If
any of the files has a changed modification time or size, a "changed" event
is signalled. File creation/deletion is ignored.

The `options` object can contain:

- `period` - the period of the timer. Default is 250, or 1/4 second.

- `persistent` - if false, unref the timer so that it doesn't keep node
  running. Default is true.

Useful methods:

- `close()` - Stop the timer and clear the list of filenames being watched.

- `watch(filename)` - Add this filename to the list being watched, if it
  isn't already there. Returns the watch object for this filename.

- `unwatch(filename)` - Remove this filename from the list being watched, if
  it's there.

- `watchFor(filename)` - Return the watch object for a filename, if it's
  in the list of filenames benig watched. If not, return undefined.

- `check()` - Immediately scan every filename currently being watched, and
  trigger events on changes. This has the same purpose as the "check"
  function on globwatcher.

The "watch" object returned by `watch` and `watchFor` has one function and
one event:

- `check()` - Immediately scan this filename for changes.

- `changed` - the event signalled when a file has changed

How it works
------------

node (as of v0.10) provides two ways to "watch" files/folders for changes:

- `fs.watchFile`, which calls `fs.stat` on the file at regular intervals
- `fs.watch`, which tries to take advantage of OS-level file watching system
  calls

Of the two, `watch` seems most obviously the best, but is the least portable.
Linux has the best support with inotify, but OS X still uses kqueue, and can
only notify when the contents of a folder have changed. Nested sub-folders
aren't monitored either.

So globwatch uses the minimatch library to parse the globs, and sets OS-level
folder watches on any interesting folders that exist. If a named folder
doesn't exist, it walks up the tree until it finds one that does exist,
and watches that, looking for the subtree to be created.

OS-level watches are only placed on folders, since they're the only ones
guaranteed to work, and they only trigger a re-scan of the folder contents.
Any matching filenames are watched with file-level watches, which are
implemented in `FileWatcher`.

Snapshots
---------

The current state of a globwatcher can be captured with `snapshot()`, which
returns an object containing metadata about files that currently match. This
lets you "resume" a session later, potentially in a new process or at a much
later date.

To resume watching, pass the snapshot object as a `snapshot` option into a
new globwatcher:

```javascript
var watcher = globwatcher("/albums/**/*.mp3");
var snapshot = watcher.snapshot();
// ... time passes ...
val newWatcher = globwatcher("/albums/**/*.mp3", { "snapshot": snapshot });
```

When restoring from a snapshot, globwatcher will wait for the debounce
interval to pass, then scan the filesystem and trigger events for any files
that have changed since the snapshot. (Naturally, this may have odd results
if your match patterns have changed.)

Caveats
-------

On OS X, the modification time ("mtime") of files is only stored to the
nearest second, so if a file is modified twice in one second, and stays the
same size, globwatch won't notice the second change. I can't think of a way to
work around this -- it's a limitation of the filesystem -- but I'm open to
suggestions.

The timer for file-level scanning determines how rapidly the "change" event
will trigger. At the default timer interval of 1/4 second, at the worst case,
it may be 1/4 second between a file modification and the "change" event
triggering. If you've performed operations that might have caused files to
change, you can alleviate this somewhat by calling `check()` to cause an
immediate rescan.

License
-------

Apache 2 (open-source) license, included in 'LICENSE.txt'.

Authors
-------

@robey - Robey Pointer <robeypointer@gmail.com>
