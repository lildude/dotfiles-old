(function() {
  var Note, fs, path, pathWatcher, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  pathWatcher = require('pathwatcher');

  Note = require('../lib/note');

  describe('Note', function() {
    var defaultDirectory, tempDirectory, tempFilePath;
    defaultDirectory = atom.config.get('notational-velocity.directory');
    tempDirectory = temp.mkdirSync('node-pathwatcher-directory');
    tempFilePath = path.join(tempDirectory, 'Temp.md');
    beforeEach(function() {
      atom.config.set('notational-velocity.directory', tempDirectory);
      return fs.writeFileSync(tempFilePath, 'old');
    });
    afterEach(function() {
      fs.unlinkSync(tempFilePath);
      return atom.config.set('notational-velocity.directory', defaultDirectory);
    });
    it('creates a note', function() {
      var note;
      note = new Note(tempFilePath, null, null);
      expect(note.getTitle()).toBe('Temp');
      expect(note.getText()).toBe('old');
      expect(note.getFilePath()).toBe(tempFilePath);
      return note.destroy();
    });
    return it('modifies a note', function() {
      var note, oldModified;
      note = new Note(tempFilePath, null, null);
      expect(note.getText()).toBe('old');
      fs.writeFileSync(tempFilePath, 'new');
      oldModified = note.getModified();
      waitsFor(function() {
        return oldModified !== note.getModified();
      });
      return runs(function() {
        expect(note.getText()).toBe('new');
        return note.destroy();
      });
    });
  });

}).call(this);
