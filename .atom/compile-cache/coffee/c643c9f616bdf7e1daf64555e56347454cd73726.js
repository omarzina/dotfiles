(function() {
  var BaseFinderView, ViewFinderView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  path = require('path');

  BaseFinderView = require('./base-finder-view');

  module.exports = ViewFinderView = (function(_super) {
    __extends(ViewFinderView, _super);

    function ViewFinderView() {
      return ViewFinderView.__super__.constructor.apply(this, arguments);
    }

    ViewFinderView.prototype.populate = function() {
      var filePath, migrationDir, migrationFile, _i, _len, _ref;
      this.displayFiles.length = 0;
      migrationDir = path.join(atom.project.getPaths()[0], "db", "migrate");
      if (!fs.existsSync(migrationDir)) {
        return;
      }
      _ref = fs.readdirSync(migrationDir);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        migrationFile = _ref[_i];
        filePath = path.join(migrationDir, migrationFile);
        if (fs.statSync(filePath).isFile()) {
          this.displayFiles.push(filePath);
        }
      }
      return this.setItems(this.displayFiles);
    };

    return ViewFinderView;

  })(BaseFinderView);

}).call(this);
