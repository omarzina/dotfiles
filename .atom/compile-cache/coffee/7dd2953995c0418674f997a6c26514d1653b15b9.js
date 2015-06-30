(function() {
  var $, $$, Point, RailsTransporter, fs, path, temp, wrench, _ref;

  path = require('path');

  fs = require('fs');

  temp = require('temp');

  wrench = require('wrench');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  Point = require('atom').Point;

  RailsTransporter = require('../lib/rails-transporter');

  describe("RailsTransporter", function() {
    var activationPromise, editor, viewFinderView, workspaceElement, _ref1;
    activationPromise = null;
    _ref1 = [], workspaceElement = _ref1[0], viewFinderView = _ref1[1], editor = _ref1[2];
    beforeEach(function() {
      var fixturesPath, tempPath;
      tempPath = fs.realpathSync(temp.mkdirSync('atom'));
      fixturesPath = atom.project.getPaths()[0];
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('rails-transporter');
    });
    describe("open-migration-finder behavior", function() {
      return describe("when the rails-transporter:open-migration-finder event is triggered", function() {
        return it("shows all migration paths and selects the first", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-migration-finder');
          waitsForPromise(function() {
            return activationPromise;
          });
          return runs(function() {
            var migration, migrationDir, _i, _len, _ref2;
            migrationDir = path.join(atom.project.getPaths()[0], 'db', 'migrate');
            expect(workspaceElement.querySelectorAll('.select-list li').length).toBe(fs.readdirSync(migrationDir).length);
            _ref2 = fs.readdirSync(migrationDir);
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              migration = _ref2[_i];
              expect($(workspaceElement).find(".select-list .primary-line:contains(" + migration + ")")).toExist();
              expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(migrationDir, migration))) + ")")).toExist();
            }
            return expect(workspaceElement.querySelector(".select-list li")).toHaveClass('two-lines selected');
          });
        });
      });
    });
    describe("open-view-finder behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return describe("when the rails-transporter:open-view-finder event is triggered", function() {
          return it("shows all relative view paths for the current controller and selects the first", function() {
            atom.commands.dispatch(workspaceElement, 'rails-transporter:open-view-finder');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              var view, viewDir, _i, _len, _ref2;
              viewDir = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs');
              expect($(workspaceElement).find('.select-list li').length).toBe(fs.readdirSync(viewDir).length);
              _ref2 = fs.readdirSync(viewDir);
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                view = _ref2[_i];
                expect($(workspaceElement).find(".select-list .primary-line:contains(" + view + ")")).toExist();
                expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(viewDir, view))) + ")")).toExist();
              }
              expect($(workspaceElement).find(".select-list li:first")).toHaveClass('two-lines selected');
              return atom.commands.dispatch(workspaceElement, 'rails-transporter:open-view-finder');
            });
          });
        });
      });
      describe("when active editor opens mailer", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'mailers', 'notification_mailer.rb'));
          });
        });
        return describe("when the rails-transporter:open-view-finder event is triggered", function() {});
      });
      return describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return describe("when the rails-transporter:open-view-finder event is triggered", function() {});
      });
    });
    describe("open-model behavior", function() {
      describe("when active editor opens model and cursor is on include method", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens model concern", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(1, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var concernPath;
            concernPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'concerns', 'searchable.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(concernPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module Searchable$/);
          });
        });
      });
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens related model", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
          });
        });
      });
      describe("when active editor opens model spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb'));
          });
        });
        return it("opens related model", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
          });
        });
      });
      describe("when active editor opens factory", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb'));
          });
        });
        return it("opens related model", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
          });
        });
      });
      return describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'show.html.erb'));
          });
        });
        return it("opens related model", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-model');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class Blog < ActiveRecord::Base$/);
          });
        });
      });
    });
    describe("open-helper behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      describe("when active editor opens helper spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'helpers', 'blogs_helper_spec.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
      return describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'show.html.erb'));
          });
        });
        return it("opens related helper", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-helper');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var helperPath;
            helperPath = path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(helperPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module BlogsHelper$/);
          });
        });
      });
    });
    describe("open-patial-template behavior", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'edit.html.erb'));
        });
      });
      describe("when cursor's current buffer row contains render method", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(2, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form Partial$/);
          });
        });
      });
      describe("when cursor's current buffer row contains render method with ':partial =>'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(3, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form Partial$/);
          });
        });
      });
      describe("when cursor's current buffer row contains render method with 'partial:'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(4, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form Partial$/);
          });
        });
      });
      describe("when cursor's current buffer row contains render method taking shared partial", function() {
        return it("opens shared partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(5, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'shared', '_form.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Shared Form Partial$/);
          });
        });
      });
      describe("when current line is to call render method with integer", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(6, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
      describe("when current line is to call render method with integer and including ':partial =>'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(7, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
      describe("when current line is to call render method with integer and including '(:partial =>'", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(8, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
      return describe("when current line is to call render method with '(", function() {
        return it("opens partial template", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(9, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-partial-template');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', '_form02.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^Form02 Partial$/);
          });
        });
      });
    });
    describe("open-layout", function() {
      describe("when cursor's current buffer row contains layout method", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens specified layout", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(2, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-layout');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'special.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/Special Layout/);
          });
        });
      });
      describe("when same base name as the controller exists", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'top_controller.rb'));
          });
        });
        return it("opens layout that same base name as the controller", function() {
          editor = atom.workspace.getActiveTextEditor();
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-layout');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'top.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/Top Layout/);
          });
        });
      });
      return describe("when there is no such controller-specific layout", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'main_controller.rb'));
          });
        });
        return it("opens default layout named 'application'", function() {
          editor = atom.workspace.getActiveTextEditor();
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-layout');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var partialPath;
            partialPath = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'application.html.erb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(partialPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/Application Layout/);
          });
        });
      });
    });
    describe("open-spec behavior", function() {
      describe("when active editor opens controller", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens controller spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'blogs_controller_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(20, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe BlogsController/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens model spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe Blog /);
          });
        });
      });
      describe("when active editor opens factory", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb'));
          });
        });
        return it("opens model spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(2, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe Blog /);
          });
        });
      });
      return describe("when active editor opens helper", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'helpers', 'blogs_helper.rb'));
          });
        });
        return it("opens helper spec", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-spec');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var specPath;
            specPath = path.join(atom.project.getPaths()[0], 'spec', 'helpers', 'blogs_helper_spec.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(12, 0));
            expect(editor.getPath()).toBe(specPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^describe BlogsHelper/);
          });
        });
      });
    });
    describe("open-asset behavior", function() {
      describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts', 'application.html.erb'));
          });
        });
        describe("when cursor's current buffer row contains stylesheet_link_tag", function() {
          describe("enclosed in parentheses", function() {
            return it("opens stylesheet", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(10, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(10, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/require_self$/);
              });
            });
          });
          describe("unenclosed in parentheses", function() {
            return it("opens stylesheet", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(11, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(11, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/require_tree/);
              });
            });
          });
          describe("when source includes slash", function() {
            return it("opens stylesheet", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(12, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application02', 'common.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(1, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/require_self/);
              });
            });
          });
          describe("when source is located in vendor directory", function() {
            return it("opens stylesheet in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(13, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'stylesheets', 'jquery.popular_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/it's popular scss file$/);
              });
            });
          });
          describe("when source is located in lib directory", function() {
            return it("opens stylesheet in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(16, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'stylesheets', 'my_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/it's my scss file$/);
              });
            });
          });
          return describe("when source is located in public directory", function() {
            return it("opens stylesheet in public directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(14, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'public', 'no_asset_pipeline.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's css in public directory$/);
              });
            });
          });
        });
        return describe("when cursor's current buffer row contains javascript_include_tag", function() {
          describe("enclosed in parentheses", function() {
            return it("opens javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(5, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application01.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(12, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/= require jquery$/);
              });
            });
          });
          describe("unenclosed in parentheses", function() {
            return it("opens javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(6, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application01.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(12, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/= require jquery$/);
              });
            });
          });
          describe("when source includes slash", function() {
            return it("opens javascript in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(7, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application02', 'common.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/= require jquery$/);
              });
            });
          });
          describe("when source is located in vendor directory", function() {
            return it("opens javascript in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(8, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'javascripts', 'jquery.popular_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's popular library$/);
              });
            });
          });
          describe("when source is located in lib directory", function() {
            return it("opens javascript in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(15, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'javascripts', 'my_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my library$/);
              });
            });
          });
          describe("when source is located in public directory", function() {
            return it("opens javascript in public directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(9, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'public', 'no_asset_pipeline.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's in public directory$/);
              });
            });
          });
          return describe("when source's suffix is .erb", function() {
            return it("opens .erb javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(17, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'dynamic_script.js.coffee.erb');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# \.erb file$/);
              });
            });
          });
        });
      });
      describe("when active editor opens javascript manifest", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'application01.js'));
          });
        });
        describe("cursor's current buffer row contains require_tree", function() {
          beforeEach(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editor.setCursorBufferPosition(new Point(15, 0));
          });
          return it("shows file paths in required directory and its subdirectories and selects the first", function() {
            atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
            waitsForPromise(function() {
              return activationPromise;
            });
            return runs(function() {
              var requireDir;
              requireDir = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'shared');
              expect(workspaceElement.querySelectorAll('.select-list li').length).toBe(fs.readdirSync(requireDir).length);
              expect($(workspaceElement).find(".select-list .primary-line:contains(common.js.coffee)")).toExist();
              expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(requireDir, 'common.js.coffee'))) + ")")).toExist();
              expect($(workspaceElement).find(".select-list .primary-line:contains(subdir.js.coffee)")).toExist();
              expect($(workspaceElement).find(".select-list .secondary-line:contains(" + (atom.project.relativize(path.join(requireDir, 'subdir', 'subdir.js.coffee'))) + ")")).toExist();
              expect($(workspaceElement).find(".select-list li:first")).toHaveClass('two-lines selected');
              return atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
            });
          });
        });
        describe("cursor's current buffer row contains require_directory", function() {
          return beforeEach(function() {
            editor = atom.workspace.getActiveTextEditor();
            return editor.setCursorBufferPosition(new Point(24, 0));
          });
        });
        return describe("cursor's current buffer row contains require", function() {
          describe("when it requires coffeescript with .js suffix", function() {
            return it("opens coffeescript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(22, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'blogs.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# blogs js$/);
              });
            });
          });
          describe("when it requires coffeescript with .js.coffee suffix", function() {
            return it("opens coffeescript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(23, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'blogs.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# blogs js$/);
              });
            });
          });
          describe("when it requires coffeescript without suffix", function() {
            return it("opens coffeescript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(16, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'blogs.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# blogs js$/);
              });
            });
          });
          describe("when it requires javascript without suffix", function() {
            return it("opens javascript", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(17, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'pure-js-blogs.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# pure blogs js$/);
              });
            });
          });
          describe("when it requires coffeescript in another directory", function() {
            return it("opens coffeescript in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(18, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'shared', 'common.js.coffee');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# shared coffee$/);
              });
            });
          });
          describe("when it requires javascript in another directory", function() {
            return it("opens javascript in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(19, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'javascripts', 'shared', 'pure-js-common.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^# shared js$/);
              });
            });
          });
          describe("when it requires javascript in lib directory", function() {
            return it("opens javascript in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(20, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'javascripts', 'my_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my library$/);
              });
            });
          });
          return describe("when it requires javascript in vendor directory", function() {
            return it("opens javascript in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(21, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'javascripts', 'jquery.popular_library.js');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's popular library$/);
              });
            });
          });
        });
      });
      return describe("when active editor opens stylesheet manifest", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'application.css'));
          });
        });
        return describe("when cursor's current buffer row contains 'require'", function() {
          describe("when it requires scss with .css suffix", function() {
            return it("opens scss", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(12, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'blogs.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's blogs.css$/);
              });
            });
          });
          describe("when it requires scss with .css.scss suffix", function() {
            return it("opens scss", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(13, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'blogs.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's blogs.css$/);
              });
            });
          });
          describe("when it requires css without suffix", function() {
            return it("opens css", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(14, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'pure-css-blogs.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's pure css$/);
              });
            });
          });
          describe("when it requires scss without suffix", function() {
            return it("opens scss", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(15, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'blogs.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's blogs.css$/);
              });
            });
          });
          describe("when it requires scss in another directory", function() {
            return it("opens scss in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(16, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'shared', 'pure-css-common.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's pure css$/);
              });
            });
          });
          describe("when it requires css in another directory", function() {
            return it("opens css in another directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(17, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'app', 'assets', 'stylesheets', 'shared', 'common.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's scss$/);
              });
            });
          });
          describe("when it requires scss in lib directory", function() {
            return it("opens scss in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(18, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'stylesheets', 'my_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my scss file$/);
              });
            });
          });
          describe("when it requires css in lib directory", function() {
            return it("opens css in lib directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(19, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'lib', 'assets', 'stylesheets', 'pure_css_my_style.css');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's my css file$/);
              });
            });
          });
          return describe("when it requires scss in vendor directory", function() {
            return it("opens scss in vendor directory", function() {
              editor = atom.workspace.getActiveTextEditor();
              editor.setCursorBufferPosition(new Point(20, 0));
              atom.commands.dispatch(workspaceElement, 'rails-transporter:open-asset');
              waitsFor(function() {
                activationPromise;
                return atom.workspace.getActivePane().getItems().length === 2;
              });
              return runs(function() {
                var assetPath;
                assetPath = path.join(atom.project.getPaths()[0], 'vendor', 'assets', 'stylesheets', 'jquery.popular_style.css.scss');
                editor = atom.workspace.getActiveTextEditor();
                editor.setCursorBufferPosition(new Point(0, 0));
                expect(editor.getPath()).toBe(assetPath);
                return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^\/\/ it's popular scss file$/);
              });
            });
          });
        });
      });
    });
    describe("open-controller behavior", function() {
      describe("when active editor opens controller and cursor is on include method", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb'));
          });
        });
        return it("opens model concern", function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setCursorBufferPosition(new Point(3, 0));
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var concernPath;
            concernPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'concerns', 'blog', 'taggable.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(concernPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^module Blog::Taggable$/);
          });
        });
      });
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app/models/blog.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      describe("when active editor opens controller spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'controllers', 'blogs_controller_spec.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      describe("when active editor opens request spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'requests', 'blogs_spec.rb'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
      return describe("when active editor opens view", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'views', 'blogs', 'show.html.haml'));
          });
        });
        return it("opens related controller", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-controller');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var modelPath;
            modelPath = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'blogs_controller.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(0, 0));
            expect(editor.getPath()).toBe(modelPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^class BlogsController < ApplicationController$/);
          });
        });
      });
    });
    return describe("open-factory behavior", function() {
      describe("when active editor opens model", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'app', 'models', 'blog.rb'));
          });
        });
        return it("opens related factory", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-factory');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var factoryPath;
            factoryPath = path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(factoryPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^  factory :blog, :class => 'Blog' do$/);
          });
        });
      });
      return describe("when active editor opens model-spec", function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return atom.workspace.open(path.join(atom.project.getPaths()[0], 'spec', 'models', 'blog_spec.rb'));
          });
        });
        return it("opens related factory", function() {
          atom.commands.dispatch(workspaceElement, 'rails-transporter:open-factory');
          waitsFor(function() {
            activationPromise;
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var factoryPath;
            factoryPath = path.join(atom.project.getPaths()[0], 'spec', 'factories', 'blogs.rb');
            editor = atom.workspace.getActiveTextEditor();
            editor.setCursorBufferPosition(new Point(3, 0));
            expect(editor.getPath()).toBe(factoryPath);
            return expect(editor.getLastCursor().getCurrentBufferLine()).toMatch(/^  factory :blog, :class => 'Blog' do$/);
          });
        });
      });
    });
  });

}).call(this);
