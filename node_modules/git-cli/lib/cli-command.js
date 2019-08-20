(function() {
  var CliCommand, CliOption, Util, _;

  _ = require('underscore');

  Util = require('./util');

  CliOption = require('./cli-option');

  CliCommand = (function() {
    function CliCommand(command, args, options) {
      this.command = command;
      this.args = args;
      if (!((options != null) || _.isString(this.args) || _.isArray(this.args))) {
        options = this.args;
        this.args = void 0;
      }
      Util.checkArgs(this.command, [String, Array]);
      if (this.args != null) {
        Util.checkArgs(this.args, [String, Array]);
      }
      if (options != null) {
        Util.checkArgs(options, [Array, Object]);
      }
      if (!_.isArray(this.command)) {
        this.command = [this.command];
      }
      if (_.isString(this.args)) {
        this.args = [this.args];
      }
      if (options != null) {
        if (!_.isArray(options)) {
          options = _.pairs(options);
        }
        this.options = _.map(options, ((function(_this) {
          return function(opt) {
            return _this._initOption(opt);
          };
        })(this)));
      }
    }

    CliCommand.prototype._initOption = function(option) {
      Util.checkArgs(option, [Array, CliOption]);
      if (Util.hasType(option, CliOption)) {
        return option;
      }
      if (option.length !== 2) {
        throw new TypeError("options object should be a single key/value pair");
      }
      if (_.isUndefined(option[1]) || option[1] === '') {
        return new CliOption(option[0]);
      } else {
        return new CliOption(option[0], option[1]);
      }
    };

    CliCommand.prototype.toString = function() {
      var s;
      s = this.command.join(' ');
      if (this.options != null) {
        s += ' ' + _.map(this.options, function(opt) {
          return opt.toString();
        }).join(' ');
      }
      if (this.args != null) {
        s += ' ' + this.args.join(' ');
      }
      return s.trim();
    };

    return CliCommand;

  })();

  module.exports = CliCommand;

}).call(this);
