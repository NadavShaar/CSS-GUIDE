(function() {
  var GitUtil, _;

  _ = require('underscore');

  GitUtil = {
    parseStatus: function(statusStr) {
      var files, line, path, status, tracked, type, _i, _len, _ref, _ref1, _ref2, _ref3;
      files = [];
      _ref = statusStr.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.trim() === '') {
          continue;
        }
        _ref1 = [line.substring(0, 2), line.substring(3)], type = _ref1[0], path = _ref1[1];
        _ref2 = type[0] === ' ' ? [type[1], false] : [type[0], true], type = _ref2[0], tracked = _ref2[1];
        switch (type) {
          case '?':
            _ref3 = ['added', false], status = _ref3[0], tracked = _ref3[1];
            break;
          case 'M':
            status = 'modified';
            break;
          case 'A':
            status = 'added';
            break;
          case 'D':
            status = 'removed';
        }
        files.push({
          path: path,
          status: status,
          tracked: tracked
        });
      }
      return files;
    },
    parseShortDiff: function(diffStr) {
      var regexp, result, stats;
      diffStr = diffStr.trim();
      regexp = /(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/;
      result = regexp.exec(diffStr);
      if (result != null) {
        stats = _.map(result.slice(1), function(v) {
          if (v) {
            return parseInt(v, 10);
          } else {
            return 0;
          }
        });
      } else {
        stats = [0, 0, 0];
      }
      return {
        changedFilesNumber: stats[0],
        insertions: stats[1],
        deletions: stats[2]
      };
    },
    parseLog: function(logStr) {
      var logs;
      logStr = logStr.replace(/"},\n/g, '"},');
      logStr = logStr.replace(/\n/g, '\\n');
      logStr = '[' + logStr.slice(0, -1) + ']';
      logs = JSON.parse(logStr);
      _.each(logs, function(log) {
        return log.date = new Date(Date.parse(log.date));
      });
      return logs;
    },
    parseRemote: function(remoteStr) {
      var _ref, _ref1, _ref2;
      remoteStr = remoteStr.trim();
      return {
        fetchUrl: (_ref = /\s+Fetch URL: (.*?)\n/.exec(remoteStr)) != null ? _ref[1] : void 0,
        pushUrl: (_ref1 = /\s+Push  URL: (.*?)\n/.exec(remoteStr)) != null ? _ref1[1] : void 0,
        headBranch: (_ref2 = /\s+HEAD branch: (.*?)\n/.exec(remoteStr)) != null ? _ref2[1] : void 0
      };
    },
    parseCurrentBranch: function(branches) {
      var branch;
      branches = branches.trim().split('\n');
      branch = _.find(branches, function(b) {
        return b[0] === '*';
      });
      if (branch != null) {
        return branch.substring(2);
      } else {
        return void 0;
      }
    },
    parseBranches: function(branches) {
      branches = branches.trimRight().split('\n');
      return _.map(branches, function(b) {
        return b.substring(2);
      });
    }
  };

  module.exports = GitUtil;

}).call(this);
