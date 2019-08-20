(function() {
  var CliOption, Util, _;

  _ = require('underscore');

  Util = require('./util');

  CliOption = (function() {
    function CliOption(option, args) {
      Util.checkArgs(option, [Array, String, Object]);
      if (_.isUndefined(args) && _.isString(option)) {
        this.option = option;
        this.hasArgs = false;
      } else {
        this._initWithArguments(option, args);
      }
    }

    CliOption.prototype._initWithArguments = function(option, args) {
      var _ref, _ref1;
      if (_.isUndefined(args)) {
        Util.checkArgs(option, [Array, Object]);
        option = _.isArray(option) ? [option] : _.pairs(option);
        if (option.length !== 1) {
          throw new TypeError("options object should be a single key/value pair");
        }
        _ref = option[0], this.option = _ref[0], this.args = _ref[1];
      } else {
        _ref1 = [option, args], this.option = _ref1[0], this.args = _ref1[1];
      }
      Util.checkArgs(this.args, [Array, String, Number, Boolean]);
      if (!_.isArray(this.args)) {
        this.args = [this.args];
      }
      this.args = _.map(this.args, function(a) {
        if (a === _.isBoolean(a)) {
          return '';
        } else {
          return a.toString();
        }
      });
      return this.hasArgs = _.any(this.args, function(a) {
        return a.length > 0;
      });
    };

    CliOption.prototype.toString = function() {
      if (this.hasArgs) {
        return this._formatOptionWithArgs();
      } else {
        return this._formatSimpleOption();
      }
    };

    CliOption.prototype._formatSimpleOption = function() {
      var prefix;
      prefix = this.option.length === 1 ? '-' : '--';
      return prefix + this.option;
    };

    CliOption.prototype._formatOptionWithArgs = function() {
      var argsString;
      argsString = Util.quoteAll(this.args, true).join(' ');
      if (this.option.length === 1) {
        return "-" + this.option + " " + argsString;
      } else {
        return "--" + this.option + "=" + argsString;
      }
    };

    return CliOption;

  })();

  module.exports = CliOption;

}).call(this);
