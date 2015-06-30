(function() {
  var YamlKeyReader;

  module.exports = YamlKeyReader = (function() {
    function YamlKeyReader(string) {
      this.string = string;
    }

    YamlKeyReader.prototype.keys = function() {
      var key, _i, _len, _ref, _results;
      _ref = this.keysWithRow();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push([key[0], key[1]]);
      }
      return _results;
    };

    YamlKeyReader.prototype.keysWithRow = function() {
      var indentationRules, key, keys, line, row, spaces, split, values, _i, _len, _ref, _results;
      indentationRules = [-1];
      keys = [];
      _ref = this.string.split("\n");
      _results = [];
      for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
        row = _ref[line];
        if (!(row.indexOf(':') > -1 && !row.match(/^\s*#/))) {
          continue;
        }
        spaces = row.split(/[^\s]/)[0].length;
        split = row.split(":");
        key = split.shift();
        values = split.join(":").trim();
        while (spaces <= indentationRules[0]) {
          indentationRules.shift();
          keys.pop();
        }
        indentationRules.unshift(spaces);
        keys.push(key.trim());
        _results.push([keys.join("."), values, line]);
      }
      return _results;
    };

    return YamlKeyReader;

  })();

}).call(this);
