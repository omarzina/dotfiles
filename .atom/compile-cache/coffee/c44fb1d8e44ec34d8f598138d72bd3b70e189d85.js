(function() {
  var YamlKeyReader, child, fs;

  child = require('child_process');

  fs = require('fs');

  YamlKeyReader = require('./yaml-key-reader');

  module.exports = function() {
    var keys, ymls;
    ymls = [];
    atom.project.getPaths().forEach(function(pp) {
      var temp;
      temp = child.spawnSync('find', ['-L', pp, '-name', '*.yml']).stdout.toString().trim().split("\n").filter(function(e) {
        return e.match(/\/\w{2}(-\w{2})?\./);
      });
      return ymls = ymls.concat(temp);
    });
    keys = [];
    ymls.forEach(function(yml) {
      return keys.push(new Promise(function(resolve) {
        return fs.readFile(yml, function(_, contents) {
          var reader, result;
          reader = new YamlKeyReader(contents.toString());
          result = reader.keysWithRow().map(function(_arg) {
            var key, line, value;
            key = _arg[0], value = _arg[1], line = _arg[2];
            return {
              key: key,
              value: value,
              file: yml,
              line: line
            };
          });
          return resolve(result);
        });
      }));
    });
    return Promise.all(keys).then(function(arrays) {
      return arrays.reduce((function(r, a) {
        return r.concat(a);
      }), []);
    });
  };

}).call(this);
