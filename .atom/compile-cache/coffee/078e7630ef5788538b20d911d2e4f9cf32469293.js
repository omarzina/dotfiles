(function() {
  var AssetFinderView, BaseFinderView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  path = require('path');

  BaseFinderView = require('./base-finder-view');

  module.exports = AssetFinderView = (function(_super) {
    __extends(AssetFinderView, _super);

    function AssetFinderView() {
      return AssetFinderView.__super__.constructor.apply(this, arguments);
    }

    AssetFinderView.prototype.populate = function() {
      var dir, editor, line, result;
      this.displayFiles.length = 0;
      editor = atom.workspace.getActiveTextEditor();
      dir = path.dirname(editor.getPath());
      line = editor.getLastCursor().getCurrentBufferLine();
      if (line.indexOf("require_tree") !== -1) {
        result = line.match(/require_tree\s*([a-zA-Z0-9_\-\./]+)\s*$/);
        this.loadFolder(path.join(dir, result[1]), true);
      } else if (line.indexOf("require_directory") !== -1) {
        result = line.match(/require_directory\s*([a-zA-Z0-9_\-\./]+)\s*$/);
        this.loadFolder(path.join(dir, result[1]));
      }
      return this.setItems(this.displayFiles);
    };

    AssetFinderView.prototype.loadFolder = function(folderPath, recursive) {
      var asset, fullPath, stats, _i, _len, _ref, _results;
      if (recursive == null) {
        recursive = false;
      }
      _ref = fs.readdirSync(folderPath);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        asset = _ref[_i];
        fullPath = path.join(folderPath, asset);
        stats = fs.statSync(fullPath);
        if (stats.isDirectory() && recursive === true) {
          _results.push(this.loadFolder(fullPath));
        } else if (stats.isFile()) {
          _results.push(this.displayFiles.push(fullPath));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return AssetFinderView;

  })(BaseFinderView);

}).call(this);
