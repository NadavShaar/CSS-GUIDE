(function() {
  var BadRepositoryError, GitError,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GitError = (function(_super) {
    __extends(GitError, _super);

    function GitError(message) {
      this.message = message != null ? message : "";
      this.name = "GitError";
      GitError.__super__.constructor.call(this, this.message);
    }

    return GitError;

  })(Error);

  BadRepositoryError = (function(_super) {
    __extends(BadRepositoryError, _super);

    function BadRepositoryError(message) {
      this.message = message != null ? message : "";
      this.name = "BadRepositoryError";
      BadRepositoryError.__super__.constructor.call(this, this.message);
    }

    return BadRepositoryError;

  })(GitError);

  module.exports = {
    GitError: GitError,
    BadRepositoryError: BadRepositoryError
  };

}).call(this);
