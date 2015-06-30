(function() {
  var RailsI18n;

  RailsI18n = require('../lib/rails-i18n');

  describe("RailsI18n", function() {
    var findMatch;
    describe("when providing Everything services", function() {
      it("returns all itens for every query, after 5 chars", function() {
        var p;
        p = RailsI18n.provide();
        expect(p.name).toEqual('rails-i18n');
        expect(p.shouldRun('asd')).toBe(false);
        expect(p.shouldRun('asdfgh')).toBe(true);
        return waitsForPromise(function() {
          return p["function"]('asdfg').then(function(entries) {
            var matches;
            matches = findMatch(entries, {
              displayName: "List of things",
              queryString: "en.view.title List of things",
              additionalInfo: "en.view.title"
            });
            return expect(matches).not.toBe([]);
          });
        });
      });
      return it("copies to clipboard, or opens the file in the correct line", function() {
        var callstack, p;
        callstack = [];
        atom.workspace.open = function(file, opts) {
          return callstack = [file, opts.initialLine];
        };
        p = RailsI18n.provide();
        return waitsForPromise(function() {
          return p["function"]('asdfg').then(function(entries) {
            var line, match, opened;
            match = findMatch(entries, {
              displayName: "List of things"
            })[0];
            match["function"]();
            opened = callstack[0], line = callstack[1];
            expect(opened).toContain('fixtures/en.yml');
            expect(line).toEqual(4);
            atom.clipboard.write("foo");
            match.commands["Copy Key to Clipboard"]();
            return expect(atom.clipboard.read()).toEqual("en.view.title");
          });
        });
      });
    });
    findMatch = function(array, elements) {
      return array.filter(function(e) {
        var key, matches, value;
        matches = (function() {
          var _results;
          _results = [];
          for (key in elements) {
            value = elements[key];
            _results.push(e[key] === value);
          }
          return _results;
        })();
        return matches.every(function(e) {
          return e === true;
        });
      });
    };
    return describe("when the rails-i18n:toggle event is triggered", function() {});
  });

}).call(this);
