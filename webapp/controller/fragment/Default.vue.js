"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: "Default",
    data: function data() {
        return {};
    }
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div>\n    <slot></slot>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-0825df41", module.exports)
  } else {
    hotAPI.update("_v-0825df41", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}