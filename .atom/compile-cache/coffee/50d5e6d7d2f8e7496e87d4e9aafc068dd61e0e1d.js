(function() {
  var AssetFinderView, FileOpener, RailsUtil, changeCase, fs, path, pluralize, _;

  fs = require('fs');

  path = require('path');

  pluralize = require('pluralize');

  changeCase = require('change-case');

  _ = require('underscore');

  AssetFinderView = require('./asset-finder-view');

  RailsUtil = require('./rails-util');

  module.exports = FileOpener = (function() {
    function FileOpener() {}

    _.extend(FileOpener.prototype, RailsUtil.prototype);

    FileOpener.prototype.openView = function() {
      var configExtension, currentLine, result, rowNumber, targetFile, _i, _ref;
      configExtension = atom.config.get('rails-transporter.viewFileExtension');
      this.reloadCurrentEditor();
      for (rowNumber = _i = _ref = this.cusorPos.row; _ref <= 0 ? _i <= 0 : _i >= 0; rowNumber = _ref <= 0 ? ++_i : --_i) {
        currentLine = this.editor.lineTextForBufferRow(rowNumber);
        result = currentLine.match(/^\s*def\s+(\w+)/);
        if ((result != null ? result[1] : void 0) != null) {
          if (this.isController(this.currentFile)) {
            targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'views')).replace(/_controller\.rb$/, "" + path.sep + result[1] + "." + configExtension);
          } else if (this.isMailer(this.currentFile)) {
            targetFile = this.currentFile.replace(path.join('app', 'mailers'), path.join('app', 'views')).replace(/\.rb$/, "" + path.sep + result[1] + "." + configExtension);
          } else {
            targetFile = null;
          }
          if (fs.existsSync(targetFile)) {
            this.open(targetFile);
          } else {
            this.openDialog(targetFile);
          }
          return;
        }
      }
      return atom.beep();
    };

    FileOpener.prototype.openController = function() {
      var concernsDir, resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isModel(this.currentFile)) {
        resource = path.basename(this.currentFile, '.rb');
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('app', 'controllers')).replace(resource, "" + (pluralize(resource)) + "_controller");
      } else if (this.isView(this.currentFile)) {
        targetFile = path.dirname(this.currentFile).replace(path.join('app', 'views'), path.join('app', 'controllers')) + '_controller.rb';
      } else if (this.isSpec(this.currentFile)) {
        if (this.currentFile.indexOf('spec/requests') !== -1) {
          targetFile = this.currentFile.replace(path.join('spec', 'requests'), path.join('app', 'controllers')).replace(/_spec\.rb$/, '_controller.rb');
        } else {
          targetFile = this.currentFile.replace(path.join('spec', 'controllers'), path.join('app', 'controllers')).replace(/_spec\.rb$/, '.rb');
        }
      } else if (this.isController(this.currentFile) && this.currentBufferLine.indexOf("include") !== -1) {
        concernsDir = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'concerns');
        targetFile = this.concernPath(concernsDir, this.currentBufferLine);
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openModel = function() {
      var concernsDir, dir, resource, resourceName, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        resourceName = pluralize.singular(this.currentFile.match(/([\w]+)_controller\.rb$/)[1]);
        targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'models')).replace(/([\w]+)_controller\.rb$/, "" + resourceName + ".rb");
      } else if (this.isView(this.currentFile)) {
        dir = path.dirname(this.currentFile);
        resource = path.basename(dir);
        targetFile = dir.replace(path.join('app', 'views'), path.join('app', 'models')).replace(resource, "" + (pluralize.singular(resource)) + ".rb");
      } else if (this.isSpec(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('spec', 'models'), path.join('app', 'models')).replace(/_spec\.rb$/, '.rb');
      } else if (this.isFactory(this.currentFile)) {
        dir = path.basename(this.currentFile, '.rb');
        resource = path.basename(dir);
        targetFile = this.currentFile.replace(path.join('spec', 'factories'), path.join('app', 'models')).replace(resource, pluralize.singular(resource));
      } else if (this.isModel(this.currentFile) && this.currentBufferLine.indexOf("include") !== -1) {
        concernsDir = path.join(atom.project.getPaths()[0], 'app', 'models', 'concerns');
        targetFile = this.concernPath(concernsDir, this.currentBufferLine);
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openHelper = function() {
      var resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'helpers')).replace(/controller\.rb/, 'helper.rb');
      } else if (this.isSpec(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('spec', 'helpers'), path.join('app', 'helpers')).replace(/_spec\.rb/, '.rb');
      } else if (this.isModel(this.currentFile)) {
        resource = path.basename(this.currentFile, '.rb');
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('app', 'helpers')).replace(resource, "" + (pluralize(resource)) + "_helper");
      } else if (this.isView(this.currentFile)) {
        targetFile = path.dirname(this.currentFile).replace(path.join('app', 'views'), path.join('app', 'helpers')) + "_helper.rb";
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openSpec = function() {
      var resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('spec', 'controllers')).replace(/controller\.rb$/, 'controller_spec.rb');
      } else if (this.isHelper(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'helpers'), path.join('spec', 'helpers')).replace(/\.rb$/, '_spec.rb');
      } else if (this.isModel(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('spec', 'models')).replace(/\.rb$/, '_spec.rb');
      } else if (this.isFactory(this.currentFile)) {
        resource = path.basename(this.currentFile.replace(/_spec\.rb/, '.rb'), '.rb');
        targetFile = this.currentFile.replace(path.join('spec', 'factories'), path.join('spec', 'models')).replace("" + resource + ".rb", "" + (pluralize.singular(resource)) + "_spec.rb");
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openPartial = function() {
      var result, targetFile;
      this.reloadCurrentEditor();
      if (this.isView(this.currentFile)) {
        if (this.currentBufferLine.indexOf("render") !== -1) {
          if (this.currentBufferLine.indexOf("partial") === -1) {
            result = this.currentBufferLine.match(/render\s*\(?\s*["'](.+?)["']/);
            if ((result != null ? result[1] : void 0) != null) {
              targetFile = this.partialFullPath(this.currentFile, result[1]);
            }
          } else {
            result = this.currentBufferLine.match(/render\s*\(?\s*\:?partial(\s*=>|:*)\s*["'](.+?)["']/);
            if ((result != null ? result[2] : void 0) != null) {
              targetFile = this.partialFullPath(this.currentFile, result[2]);
            }
          }
        }
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openAsset = function() {
      var result, targetFile;
      this.reloadCurrentEditor();
      if (this.isView(this.currentFile)) {
        if (this.currentBufferLine.indexOf("javascript_include_tag") !== -1) {
          result = this.currentBufferLine.match(/javascript_include_tag\s*\(?\s*["'](.+?)["']/);
          if ((result != null ? result[1] : void 0) != null) {
            targetFile = this.assetFullPath(result[1], 'javascripts');
          }
        } else if (this.currentBufferLine.indexOf("stylesheet_link_tag") !== -1) {
          result = this.currentBufferLine.match(/stylesheet_link_tag\s*\(?\s*["'](.+?)["']/);
          if ((result != null ? result[1] : void 0) != null) {
            targetFile = this.assetFullPath(result[1], 'stylesheets');
          }
        }
      } else if (this.isAsset(this.currentFile)) {
        if (this.currentBufferLine.indexOf("require ") !== -1) {
          result = this.currentBufferLine.match(/require\s*(.+?)\s*$/);
          if (this.currentFile.indexOf(path.join('app', 'assets', 'javascripts')) !== -1) {
            if ((result != null ? result[1] : void 0) != null) {
              targetFile = this.assetFullPath(result[1], 'javascripts');
            }
          } else if (this.currentFile.indexOf(path.join('app', 'assets', 'stylesheets')) !== -1) {
            if ((result != null ? result[1] : void 0) != null) {
              targetFile = this.assetFullPath(result[1], 'stylesheets');
            }
          }
        } else if (this.currentBufferLine.indexOf("require_tree ") !== -1) {
          return this.createAssetFinderView().toggle();
        } else if (this.currentBufferLine.indexOf("require_directory ") !== -1) {
          return this.createAssetFinderView().toggle();
        }
      }
      return this.open(targetFile);
    };

    FileOpener.prototype.openLayout = function() {
      var configExtension, layoutDir, result, targetFile;
      configExtension = atom.config.get('rails-transporter.viewFileExtension');
      this.reloadCurrentEditor();
      layoutDir = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts');
      if (this.isController(this.currentFile)) {
        if (this.currentBufferLine.indexOf("layout") !== -1) {
          result = this.currentBufferLine.match(/layout\s*\(?\s*["'](.+?)["']/);
          if ((result != null ? result[1] : void 0) != null) {
            targetFile = path.join(layoutDir, "" + result[1] + "." + configExtension);
          }
        } else {
          targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'views', 'layouts')).replace('_controller.rb', "." + configExtension);
          if (!fs.existsSync(targetFile)) {
            targetFile = path.join(path.dirname(targetFile), "application." + configExtension);
          }
        }
      }
      return this.open(targetFile);
    };

    FileOpener.prototype.openFactory = function() {
      var resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isModel(this.currentFile)) {
        resource = path.basename(this.currentFile, '.rb');
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('spec', 'factories')).replace(resource, pluralize(resource));
      } else if (this.isSpec(this.currentFile)) {
        resource = path.basename(this.currentFile.replace(/_spec\.rb/, '.rb'), '.rb');
        targetFile = this.currentFile.replace(path.join('spec', 'models'), path.join('spec', 'factories')).replace(resource, pluralize(resource)).replace(/_spec\.rb/, '.rb');
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.createAssetFinderView = function() {
      if (this.assetFinderView == null) {
        this.assetFinderView = new AssetFinderView();
      }
      return this.assetFinderView;
    };

    FileOpener.prototype.reloadCurrentEditor = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.currentFile = this.editor.getPath();
      this.cusorPos = this.editor.getLastCursor().getBufferPosition();
      return this.currentBufferLine = this.editor.getLastCursor().getCurrentBufferLine();
    };

    FileOpener.prototype.open = function(targetFile) {
      var file, files, _i, _len, _results;
      if (targetFile == null) {
        return;
      }
      files = typeof targetFile === 'string' ? [targetFile] : targetFile;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (fs.existsSync(file)) {
          _results.push(atom.workspace.open(file));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    FileOpener.prototype.openDialog = function(targetFile) {
      if (targetFile != null) {
        return atom.confirm({
          message: "No " + targetFile + " found",
          detailedMessage: "Shall we create " + targetFile + " for you?",
          buttons: {
            Yes: function() {
              atom.workspace.open(targetFile);
            },
            No: function() {
              atom.beep();
            }
          }
        });
      } else {
        return atom.beep();
      }
    };

    FileOpener.prototype.partialFullPath = function(currentFile, partialName) {
      var configExtension;
      configExtension = atom.config.get('rails-transporter.viewFileExtension');
      if (partialName.indexOf("/") === -1) {
        return path.join(path.dirname(currentFile), "_" + partialName + "." + configExtension);
      } else {
        return path.join(atom.project.getPaths()[0], 'app', 'views', path.dirname(partialName), "_" + (path.basename(partialName)) + "." + configExtension);
      }
    };

    FileOpener.prototype.assetFullPath = function(assetName, type) {
      var baseName, ext, fileName, fullExt, fullPath, location, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      fileName = path.basename(assetName);
      switch (path.extname(assetName)) {
        case ".coffee":
        case ".js":
        case ".scss":
        case ".css":
          ext = '';
          break;
        default:
          ext = type === 'javascripts' ? '.js' : 'stylesheets' ? '.css' : void 0;
      }
      if (assetName.match(/^\//)) {
        return path.join(atom.project.getPaths()[0], 'public', path.dirname(assetName), "" + fileName + ext);
      } else {
        _ref = ['app', 'lib', 'vendor'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          location = _ref[_i];
          baseName = path.join(atom.project.getPaths()[0], location, 'assets', type, path.dirname(assetName), fileName);
          if (type === 'javascripts') {
            _ref1 = ["" + ext + ".erb", "" + ext + ".coffee", "" + ext + ".coffee.erb", ext];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              fullExt = _ref1[_j];
              fullPath = baseName + fullExt;
              if (fs.existsSync(fullPath)) {
                return fullPath;
              }
            }
          } else if (type === 'stylesheets') {
            _ref2 = ["" + ext + ".erb", "" + ext + ".scss", "" + ext + ".scss.erb", ext];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              fullExt = _ref2[_k];
              fullPath = baseName + fullExt;
              if (fs.existsSync(fullPath)) {
                return fullPath;
              }
            }
          }
        }
      }
    };

    FileOpener.prototype.concernPath = function(concernsDir, currentBufferLine) {
      var concernName, concernPaths, result;
      result = currentBufferLine.match(/include\s+(.+)/);
      if ((result != null ? result[1] : void 0) != null) {
        if (result[1].indexOf('::') === -1) {
          return path.join(concernsDir, changeCase.snakeCase(result[1])) + '.rb';
        } else {
          concernPaths = (function() {
            var _i, _len, _ref, _results;
            _ref = result[1].split('::');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              concernName = _ref[_i];
              _results.push(changeCase.snakeCase(concernName));
            }
            return _results;
          })();
          return path.join(concernsDir, concernPaths.join(path.sep)) + '.rb';
        }
      }
    };

    return FileOpener;

  })();

}).call(this);
