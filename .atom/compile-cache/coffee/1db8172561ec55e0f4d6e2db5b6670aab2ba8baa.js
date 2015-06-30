(function() {
  var CompositeDisposable, ERB_BLOCKS, ERB_CLOSER_REGEX, ERB_OPENER_REGEX, ERB_REGEX, Range;

  Range = require('atom').Range;

  CompositeDisposable = require('atom').CompositeDisposable;

  ERB_BLOCKS = [['<%=', '%>'], ['<%', '%>'], ['<%#', '%>']];

  ERB_REGEX = '<%(=?|-?|#?)\s{2}(-?)%>';

  ERB_OPENER_REGEX = '<%[\\=\\#]?';

  ERB_CLOSER_REGEX = "%>";

  module.exports = {
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', 'rails-snippets:toggleErb', (function(_this) {
        return function() {
          return _this.toggleErb();
        };
      })(this)));
    },
    toggleErb: function() {
      var delegate, editor, hasTextSelected, selectedText, selection, _i, _len, _ref, _results;
      editor = atom.workspace.getActiveTextEditor();
      _ref = editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i += 1) {
        selection = _ref[_i];
        hasTextSelected = !selection.isEmpty();
        selectedText = selection.getText();
        delegate = this;
        _results.push(editor.transact(function() {
          var closer, currentCursor, opener, textToRestoreRange, _ref1;
          selection.deleteSelectedText();
          currentCursor = selection.cursor;
          _ref1 = delegate.findSorroundingBlocks(editor, currentCursor), opener = _ref1[0], closer = _ref1[1];
          if ((opener != null) && (closer != null)) {
            delegate.replaceErbBlock(editor, opener, closer, currentCursor);
          } else {
            delegate.insertErbBlock(editor, currentCursor);
          }
          if (hasTextSelected) {
            textToRestoreRange = editor.getBuffer().insert(currentCursor.getBufferPosition(), selectedText);
            return selection.setBufferRange(textToRestoreRange);
          }
        }));
      }
      return _results;
    },
    findSorroundingBlocks: function(editor, currentCursor) {
      var closer, containingLine, foundClosers, foundOpeners, leftRange, opener, rightRange;
      opener = closer = null;
      containingLine = currentCursor.getCurrentLineBufferRange();
      leftRange = new Range(containingLine.start, currentCursor.getBufferPosition());
      rightRange = new Range(currentCursor.getBufferPosition(), containingLine.end);
      foundOpeners = [];
      editor.getBuffer().scanInRange(new RegExp(ERB_OPENER_REGEX, 'g'), leftRange, function(result) {
        return foundOpeners.push(result.range);
      });
      if (foundOpeners) {
        opener = foundOpeners[foundOpeners.length - 1];
      }
      foundClosers = [];
      editor.getBuffer().scanInRange(new RegExp(ERB_CLOSER_REGEX, 'g'), rightRange, function(result) {
        return foundClosers.push(result.range);
      });
      if (foundClosers) {
        closer = foundClosers[0];
      }
      return [opener, closer];
    },
    insertErbBlock: function(editor, currentCursor) {
      var closingBlock, defaultBlock, desiredPosition, openingTag;
      defaultBlock = ERB_BLOCKS[0];
      desiredPosition = null;
      openingTag = editor.getBuffer().insert(currentCursor.getBufferPosition(), defaultBlock[0] + ' ');
      desiredPosition = currentCursor.getBufferPosition();
      closingBlock = editor.getBuffer().insert(currentCursor.getBufferPosition(), ' ' + defaultBlock[1]);
      return currentCursor.setBufferPosition(desiredPosition);
    },
    replaceErbBlock: function(editor, opener, closer, currentCursor) {
      var closingBracket, nextBlock, openingBracket;
      openingBracket = editor.getBuffer().getTextInRange(opener);
      closingBracket = editor.getBuffer().getTextInRange(closer);
      nextBlock = this.getNextErbBlock(editor, openingBracket, closingBracket);
      editor.getBuffer().setTextInRange(closer, nextBlock[1]);
      return editor.getBuffer().setTextInRange(opener, nextBlock[0]);
    },
    getNextErbBlock: function(editor, openingBracket, closingBracket) {
      var block, i, _i, _len;
      for (i = _i = 0, _len = ERB_BLOCKS.length; _i < _len; i = ++_i) {
        block = ERB_BLOCKS[i];
        if (JSON.stringify([openingBracket, closingBracket]) === JSON.stringify(block)) {
          if ((i + 1) >= ERB_BLOCKS.length) {
            return ERB_BLOCKS[0];
          } else {
            return ERB_BLOCKS[i + 1];
          }
        }
      }
      return ERB_BLOCKS[0];
    }
  };

}).call(this);
