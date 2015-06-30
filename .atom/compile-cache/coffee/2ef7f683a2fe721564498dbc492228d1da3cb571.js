(function() {
  var RailsUtil, path;

  path = require('path');

  module.exports = RailsUtil = (function() {
    function RailsUtil() {}

    RailsUtil.prototype.isController = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('app', 'controllers')) !== -1 && filePath.search(/_controller\.rb$/) !== -1;
    };

    RailsUtil.prototype.isView = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('app', 'views')) !== -1;
    };

    RailsUtil.prototype.isSpec = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('spec')) !== -1 && filePath.search(/_spec\.rb$/) !== -1;
    };

    RailsUtil.prototype.isHelper = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('app', 'helpers')) !== -1 && filePath.search(/_helper\.rb$/) !== -1;
    };

    RailsUtil.prototype.isModel = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('app', 'models')) !== -1 && filePath.search(/\.rb$/) !== -1;
    };

    RailsUtil.prototype.isAsset = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('app', 'assets')) !== -1;
    };

    RailsUtil.prototype.isMailer = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('app', 'mailers')) !== -1 && filePath.search(/_mailer\.rb$/) !== -1;
    };

    RailsUtil.prototype.isFactory = function(filePath) {
      return (filePath != null) && atom.project.relativize(filePath).indexOf(path.join('spec', 'factories')) !== -1 && filePath.search(/\.rb$/) !== -1;
    };

    return RailsUtil;

  })();

}).call(this);
