"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReturnData = function ReturnData() {
  var success = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var err = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  _classCallCheck(this, ReturnData);

  this.success = success;
  this.data = data;
  this.err = err;
};

exports.default = ReturnData;
//# sourceMappingURL=returnData.js.map