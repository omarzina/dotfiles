(function() {
  var findLocales;

  findLocales = require('../lib/find-locales');

  describe("findLocales", function() {
    var includes;
    it("finds locales using a promise", function() {
      return waitsForPromise(function() {
        return findLocales().then(function(values) {
          var match;
          match = includes(values, {
            key: 'en.view.title',
            value: 'List of things',
            line: 4
          });
          return expect(match).toBe(true);
        });
      });
    });
    return includes = function(array, elements) {
      return array.some(function(e) {
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
  });

}).call(this);
