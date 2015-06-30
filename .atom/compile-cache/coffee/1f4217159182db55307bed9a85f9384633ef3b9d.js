(function() {
  var BaseFinderView, RailsUtil, ViewFinderView, fs, path, pluralize, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  path = require('path');

  pluralize = require('pluralize');

  _ = require('underscore');

  BaseFinderView = require('./base-finder-view');

  RailsUtil = require('./rails-util');

  module.exports = ViewFinderView = (function(_super) {
    __extends(ViewFinderView, _super);

    function ViewFinderView() {
      return ViewFinderView.__super__.constructor.apply(this, arguments);
    }

    _.extend(ViewFinderView.prototype, RailsUtil.prototype);

    ViewFinderView.prototype.populate = function() {
      var basename, currentFile, viewDir, viewFile, viewPath, _i, _len, _ref;
      this.displayFiles.length = 0;
      currentFile = atom.workspace.getActiveTextEditor().getPath();
      if (this.isController(currentFile)) {
        viewDir = currentFile.replace('controllers', 'views').replace(/_controller\.rb$/, '');
      } else if (this.isModel(currentFile)) {
        basename = path.basename(currentFile, '.rb');
        viewDir = currentFile.replace('models', 'views').replace(basename, pluralize(basename)).replace(".rb", "");
      } else if (this.isMailer(currentFile)) {
        viewDir = currentFile.replace('mailers', 'views').replace(/\.rb$/, '');
      } else {
        return;
      }
      if (!fs.existsSync(viewDir)) {
        return;
      }
      _ref = fs.readdirSync(viewDir);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        viewFile = _ref[_i];
        viewPath = path.join(viewDir, viewFile);
        if (fs.statSync(viewPath).isFile()) {
          this.displayFiles.push(viewPath);
        }
      }
      return this.setItems(this.displayFiles);
    };

    return ViewFinderView;

  })(BaseFinderView);

}).call(this);
