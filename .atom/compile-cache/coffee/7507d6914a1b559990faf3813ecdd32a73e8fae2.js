(function() {
  var FileOpener, MigrationFinderView, ViewFinderView;

  ViewFinderView = require('./view-finder-view');

  MigrationFinderView = require('./migration-finder-view');

  FileOpener = require('./file-opener');

  module.exports = {
    config: {
      viewFileExtension: {
        type: 'string',
        description: 'This is the extension of the view files.',
        "default": 'html.erb'
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'rails-transporter:open-view-finder': (function(_this) {
          return function() {
            return _this.createViewFinderView().toggle();
          };
        })(this),
        'rails-transporter:open-migration-finder': (function(_this) {
          return function() {
            return _this.createMigrationFinderView().toggle();
          };
        })(this),
        'rails-transporter:open-model': (function(_this) {
          return function() {
            return _this.createFileOpener().openModel();
          };
        })(this),
        'rails-transporter:open-helper': (function(_this) {
          return function() {
            return _this.createFileOpener().openHelper();
          };
        })(this),
        'rails-transporter:open-partial-template': (function(_this) {
          return function() {
            return _this.createFileOpener().openPartial();
          };
        })(this),
        'rails-transporter:open-spec': (function(_this) {
          return function() {
            return _this.createFileOpener().openSpec();
          };
        })(this),
        'rails-transporter:open-asset': (function(_this) {
          return function() {
            return _this.createFileOpener().openAsset();
          };
        })(this),
        'rails-transporter:open-controller': (function(_this) {
          return function() {
            return _this.createFileOpener().openController();
          };
        })(this),
        'rails-transporter:open-layout': (function(_this) {
          return function() {
            return _this.createFileOpener().openLayout();
          };
        })(this),
        'rails-transporter:open-view': (function(_this) {
          return function() {
            return _this.createFileOpener().openView();
          };
        })(this),
        'rails-transporter:open-factory': (function(_this) {
          return function() {
            return _this.createFileOpener().openFactory();
          };
        })(this)
      });
    },
    deactivate: function() {
      if (this.viewFinderView != null) {
        this.viewFinderView.destroy();
      }
      if (this.migrationFinderView != null) {
        return this.migrationFinderView.destroy();
      }
    },
    createFileOpener: function() {
      if (this.fileOpener == null) {
        this.fileOpener = new FileOpener();
      }
      return this.fileOpener;
    },
    createViewFinderView: function() {
      if (this.viewFinderView == null) {
        this.viewFinderView = new ViewFinderView();
      }
      return this.viewFinderView;
    },
    createMigrationFinderView: function() {
      if (this.migrationFinderView == null) {
        this.migrationFinderView = new MigrationFinderView();
      }
      return this.migrationFinderView;
    }
  };

}).call(this);
