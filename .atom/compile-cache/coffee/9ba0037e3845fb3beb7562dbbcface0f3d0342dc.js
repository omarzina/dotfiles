(function() {
  var $$, BaseFinderView, SelectListView, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs');

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  module.exports = BaseFinderView = (function(_super) {
    __extends(BaseFinderView, _super);

    function BaseFinderView() {
      return BaseFinderView.__super__.constructor.apply(this, arguments);
    }

    BaseFinderView.prototype.displayFiles = [];

    BaseFinderView.prototype.initialize = function() {
      BaseFinderView.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      return atom.commands.add(this.element, {
        'pane:split-left': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitLeft({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-right': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitRight({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-down': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitDown({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-up': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitUp({
                items: [item]
              });
            });
          };
        })(this)
      });
    };

    BaseFinderView.prototype.destroy = function() {
      var _ref1;
      this.cancel();
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    BaseFinderView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div(path.basename(item), {
              "class": "primary-line file icon icon-file-text"
            });
            return _this.div(atom.project.relativize(item), {
              "class": 'secondary-line path no-icon'
            });
          };
        })(this));
      });
    };

    BaseFinderView.prototype.confirmed = function(item) {
      return atom.workspace.open(item);
    };

    BaseFinderView.prototype.toggle = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        this.populate();
        if (((_ref2 = this.displayFiles) != null ? _ref2.length : void 0) > 0) {
          return this.show();
        }
      }
    };

    BaseFinderView.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    BaseFinderView.prototype.splitOpenPath = function(fn) {
      var filePath, pane, _ref1;
      filePath = (_ref1 = this.getSelectedItem()) != null ? _ref1 : {};
      if (!filePath) {
        return;
      }
      if (pane = atom.workspace.getActivePane()) {
        return atom.project.open(filePath).done((function(_this) {
          return function(editor) {
            return fn(pane, editor);
          };
        })(this));
      } else {
        return atom.workspace.open(filePath);
      }
    };

    BaseFinderView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    BaseFinderView.prototype.cancelled = function() {
      return this.hide();
    };

    return BaseFinderView;

  })(SelectListView);

}).call(this);
