(function() {
  var Reader;

  Reader = require('../lib/yaml-key-reader');

  describe('YamlKeyReader', function() {
    it('reads simple keys', function() {
      var reader;
      reader = new Reader("en: foo");
      return expect(reader.keys()).toEqual([["en", 'foo']]);
    });
    it('reads composite keys', function() {
      var reader;
      reader = new Reader("en:\n  foo: Bar");
      return expect(reader.keys()).toEqual([["en", ''], ["en.foo", 'Bar']]);
    });
    it('reads multiple levels of indentation', function() {
      var reader;
      reader = new Reader("en:\n  foo: Bar\npt:\n  bar: Foo\n  baz: Nada");
      return expect(reader.keys()).toEqual([["en", ''], ["en.foo", 'Bar'], ['pt', ''], ['pt.bar', 'Foo'], ['pt.baz', 'Nada']]);
    });
    it('checks when identation have "jumps"', function() {
      var reader;
      reader = new Reader("en:\n  foo:\n    bar: baz\npt:\n  baz: Nada");
      return expect(reader.keys()).toEqual([["en", ''], ["en.foo", ''], ['en.foo.bar', 'baz'], ['pt', ''], ['pt.baz', 'Nada']]);
    });
    it('ignores lines without :', function() {
      var reader;
      reader = new Reader("pt:\n  foo: ! 'Foo bar\n  baz'");
      return expect(reader.keys()).toEqual([["pt", ''], ["pt.foo", "! 'Foo bar"]]);
    });
    it('ignores comments', function() {
      var reader;
      reader = new Reader("# nothing: at all\npt: #BR\n#  foo:bar");
      return expect(reader.keys()).toEqual([["pt", '#BR']]);
    });
    return it('shows line numbers with keys', function() {
      var reader;
      reader = new Reader("# nothing: at all\npt: #BR\n#  foo:bar\n  bar: baz");
      return expect(reader.keysWithRow()).toEqual([["pt", '#BR', 1], ['pt.bar', 'baz', 3]]);
    });
  });

}).call(this);
