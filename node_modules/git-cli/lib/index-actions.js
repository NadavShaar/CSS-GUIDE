(function() {
  var CliCommand, execute, util, _;

  util = require('./util');

  _ = require('underscore');

  CliCommand = require('./cli-command');

  execute = require('./runner').execute;

  exports.add = function(files, options, callback) {
    var args, command, _ref, _ref1;
    if (_.isArray(files)) {
      _ref = util.setOptions(options, callback), options = _ref[0], callback = _ref[1];
    } else {
      _ref1 = util.setOptions(files, options), options = _ref1[0], callback = _ref1[1];
      files = ['.'];
    }
    args = [];
    Array.prototype.push.apply(args, files);
    command = new CliCommand(['git', 'add'], args, options);
    return execute(command, this._getOptions(), callback);
  };

  exports.commit = function(message, options, callback) {
    var cliOpts, command, _ref;
    _ref = util.setOptions(options, callback), options = _ref[0], callback = _ref[1];
    cliOpts = _.extend({
      m: message
    }, options);
    command = new CliCommand(['git', 'commit'], cliOpts);
    return execute(command, this._getOptions(), callback);
  };

  exports.checkout = function(branch, options, callback) {
    var command, _ref;
    _ref = util.setOptions(options, callback), options = _ref[0], callback = _ref[1];
    command = new CliCommand(['git', 'checkout'], branch, options);
    return execute(command, this._getOptions(), callback);
  };

  exports.merge = function(args, options, callback) {
    var command, _ref;
    _ref = util.setOptions(options, callback), options = _ref[0], callback = _ref[1];
    command = new CliCommand(['git', 'merge'], args, options);
    return execute(command, this._getOptions(), callback);
  };

}).call(this);
