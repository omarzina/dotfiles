(function() {
  var AutoIndentView;

  AutoIndentView = require('./auto-indent-view');

  module.exports = {
    activate: function() {
      return atom.workspaceView.command("auto-indent:apply", (function(_this) {
        return function() {
          return _this.apply();
        };
      })(this));
    },
    apply: function() {
      var cursor, editor, savedPosition;
      editor = atom.workspace.activePaneItem;
      cursor = editor.getCursor();
      savedPosition = cursor.getScreenPosition();
      editor.selectAll();
      editor.autoIndentSelectedRows();
      cursor = editor.getCursor();
      return cursor.setScreenPosition(savedPosition);
    }
  };

}).call(this);
