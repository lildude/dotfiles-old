(function() {
  var Note, NoteDirectory, fs, path, pathWatcher, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  pathWatcher = require('pathwatcher');

  NoteDirectory = require('../lib/note-directory');

  Note = require('../lib/note');

  describe('NoteDirectory.getNotes', function() {
    var defaultDirectory, isCallbackCalled, noteDirectory, tempDirectory, wait;
    defaultDirectory = atom.config.get('notational-velocity.directory');
    tempDirectory = temp.mkdirSync('node-pathwatcher-directory');
    noteDirectory = null;
    isCallbackCalled = false;
    wait = function() {
      var filePath, mtimeNew, mtimeOld, timestampDirectory, _results;
      timestampDirectory = temp.mkdirSync('node-pathwatcher-timestamp');
      filePath = path.join(timestampDirectory, 'temp');
      fs.writeFileSync(filePath, '.');
      mtimeOld = fs.statSync(filePath).mtime;
      mtimeNew = mtimeOld;
      _results = [];
      while (mtimeOld >= mtimeNew) {
        fs.writeFileSync(filePath, '.');
        _results.push(mtimeNew = fs.statSync(filePath).mtime);
      }
      return _results;
    };
    beforeEach(function() {
      var callback;
      isCallbackCalled = false;
      callback = (function(_this) {
        return function() {
          return isCallbackCalled = true;
        };
      })(this);
      atom.config.set('notational-velocity.directory', tempDirectory);
      fs.writeFileSync(path.join(tempDirectory, 'Readme.md'), 'read me');
      wait();
      fs.mkdirSync(path.join(tempDirectory, 'Car'));
      fs.writeFileSync(path.join(tempDirectory, 'Car', 'Mini.md'), 'mini');
      wait();
      return noteDirectory = new NoteDirectory(tempDirectory, null, callback);
    });
    afterEach(function() {
      noteDirectory.destroy();
      fs.unlinkSync(path.join(tempDirectory, 'Car', 'Mini.md'));
      fs.rmdirSync(path.join(tempDirectory, 'Car'));
      fs.unlinkSync(path.join(tempDirectory, 'Readme.md'));
      return atom.config.set('notational-velocity.directory', defaultDirectory);
    });
    it('gives a list of notes in the order so that the newest one comes first', function() {
      var notes;
      notes = noteDirectory.getNotes();
      expect(notes.length).toEqual(2);
      expect(notes[0].getText()).toBe('mini');
      expect(notes[1].getText()).toBe('read me');
      return expect(notes[0].getModified().getTime()).toBeGreaterThan(notes[1].getModified().getTime());
    });
    it('changes its order when a note is changed', function() {
      fs.writeFileSync(path.join(tempDirectory, 'Readme.md'), 'read me new');
      wait();
      waitsFor(function() {
        return isCallbackCalled;
      });
      return runs(function() {
        var notes;
        notes = noteDirectory.getNotes();
        expect(notes[0].getText()).toBe('read me new');
        return expect(notes[1].getText()).toBe('mini');
      });
    });
    it('changes its order when a note is created', function() {
      fs.writeFileSync(path.join(tempDirectory, 'Car', 'Prius.md'), 'prius');
      wait();
      waitsFor(function() {
        return isCallbackCalled;
      });
      return runs(function() {
        var notes;
        notes = noteDirectory.getNotes();
        expect(notes.length).toEqual(3);
        expect(notes[0].getText()).toBe('prius');
        expect(notes[1].getText()).toBe('mini');
        expect(notes[2].getText()).toBe('read me');
        return fs.unlinkSync(path.join(tempDirectory, 'Car', 'Prius.md'));
      });
    });
    it('changes its order when a note is deleted', function() {
      fs.unlinkSync(path.join(tempDirectory, 'Car', 'Mini.md'));
      wait();
      waitsFor(function() {
        return isCallbackCalled;
      });
      return runs(function() {
        var notes;
        notes = noteDirectory.getNotes();
        expect(notes.length).toEqual(1);
        expect(notes[0].getText()).toBe('read me');
        return fs.writeFileSync(path.join(tempDirectory, 'Car', 'Mini.md'), 'mini');
      });
    });
    it('changes its order when a note is renamed', function() {
      var newPath, oldPath;
      oldPath = path.join(tempDirectory, 'Car', 'Mini.md');
      newPath = path.join(tempDirectory, 'Mini.md');
      fs.renameSync(oldPath, newPath);
      wait();
      waitsFor(function() {
        return isCallbackCalled;
      });
      return runs(function() {
        var notes;
        notes = noteDirectory.getNotes();
        expect(notes.length).toEqual(2);
        expect(notes[0].getTitle()).toBe('Mini');
        expect(notes[1].getTitle()).toBe('Readme');
        return fs.renameSync(newPath, oldPath);
      });
    });
    return it('updates properly when a directory is created and a note is created inside it', function() {
      fs.mkdirSync(path.join(tempDirectory, 'Food'));
      fs.writeFileSync(path.join(tempDirectory, 'Food', 'Milk.md'), 'milk');
      wait();
      waitsFor(function() {
        return isCallbackCalled;
      });
      return runs(function() {
        var notes;
        notes = noteDirectory.getNotes();
        expect(notes.length).toEqual(3);
        expect(notes[0].getText()).toBe('milk');
        fs.unlinkSync(path.join(tempDirectory, 'Food', 'Milk.md'));
        return fs.rmdirSync(path.join(tempDirectory, 'Food'));
      });
    });
  });

}).call(this);
