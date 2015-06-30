(function() {
  var CompositeDisposable, Finder, RailsI18n, SelectListView, YamlKeyReader, child, findLocales, fs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  SelectListView = require('atom-space-pen-views').SelectListView;

  YamlKeyReader = require('./yaml-key-reader');

  child = require('child_process');

  fs = require('fs');

  findLocales = require('./find-locales');

  Finder = (function(_super) {
    __extends(Finder, _super);

    function Finder() {
      return Finder.__super__.constructor.apply(this, arguments);
    }

    Finder.prototype.initialize = function(items, key, addInfo) {
      var i, item, k;
      Finder.__super__.initialize.apply(this, arguments);
      this.filterKey = key;
      this.addInfo = addInfo;
      this.addClass('overlay from-top');
      i = (function() {
        var _results;
        _results = [];
        for (k in items) {
          item = items[k];
          _results.push(item);
        }
        return _results;
      })();
      this.setItems(i);
      atom.workspaceView.append(this);
      this.focusFilterEditor();
      return this.on('keypress', (function(_this) {
        return function(evt) {
          if (evt.ctrlKey) {
            return atom.clipboard.write(_this.getSelectedItem().key);
          }
        };
      })(this));
    };

    Finder.prototype.viewForItem = function(item) {
      if (this.addInfo) {
        return ("<li>" + item[this.filterKey] + " <div class='pull-right key-binding'>") + item[this.addInfo] + "</div></li>";
      } else {
        return "<li>" + item[this.filterKey] + "</li>";
      }
    };

    Finder.prototype.getFilterKey = function() {
      return this.filterKey;
    };

    Finder.prototype.cancel = function() {
      return this.hide();
    };

    Finder.prototype.confirmed = function(item) {
      atom.workspace.open(item.file, {
        initialLine: item.line
      });
      return this.hide();
    };

    return Finder;

  })(SelectListView);

  module.exports = RailsI18n = {
    activate: function(state) {
      atom.commands.add('atom-workspace', 'rails-i18n:search-key', (function(_this) {
        return function() {
          return new Finder(_this.findLocalesSync(), 'key');
        };
      })(this));
      return atom.commands.add('atom-workspace', 'rails-i18n:search-translation', (function(_this) {
        return function() {
          var finder;
          return finder = new Finder(_this.findLocalesSync(), 'value', 'key');
        };
      })(this));
    },
    findLocalesSync: function() {
      var contents, key, keys, line, projectPath, reader, value, yml, ymls, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      projectPath = atom.project.getPaths()[0];
      ymls = child.spawnSync('find', ['-L', projectPath, '-name', '*.yml']).stdout.toString().trim();
      if (ymls === '') {
        return Promisse.resolve([]);
      }
      keys = [];
      _ref = ymls.split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        yml = _ref[_i];
        contents = fs.readFileSync(yml).toString();
        reader = new YamlKeyReader(contents);
        _ref1 = reader.keysWithRow();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _ref2 = _ref1[_j], key = _ref2[0], value = _ref2[1], line = _ref2[2];
          keys.push({
            key: key,
            value: value,
            file: yml,
            line: line
          });
        }
      }
      return keys;
    },
    provide: function() {
      var items, loadAndResolve, loaded;
      loaded = false;
      items = [];
      loadAndResolve = (function(_this) {
        return function(resolve) {
          return findLocales().then(function(values) {
            items = values.map(function(item) {
              var fn;
              fn = function() {
                items = [];
                loaded = false;
                return atom.workspace.open(item.file, {
                  initialLine: item.line
                });
              };
              return {
                displayName: item.value,
                queryString: "" + item.key + " " + item.value,
                "function": fn,
                additionalInfo: item.key,
                commands: {
                  "Open File": fn,
                  "Copy Key to Clipboard": (function(_this) {
                    return function() {
                      return atom.clipboard.write(item.key);
                    };
                  })(this)
                }
              };
            });
            loaded = true;
            return resolve(items);
          });
        };
      })(this);
      return {
        name: 'rails-i18n',
        "function": function(query) {
          return new Promise(function(resolve) {
            if (loaded) {
              return resolve(items);
            } else {
              return loadAndResolve(resolve);
            }
          });
        },
        shouldRun: function(query) {
          return query.length > 5;
        }
      };
    }
  };

}).call(this);
