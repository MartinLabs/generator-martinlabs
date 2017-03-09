;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n\n<div class=\"modal\" role=\"dialog\" style=\"display: block\">\n    <div class=\"modal-dialog\" role=\"document\">\n        <div class=\"modal-content\">\n            <slot></slot>\n        </div>\n    </div>\n</div>\n\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-d23ef0a6", module.exports)
  } else {
    hotAPI.update("_v-d23ef0a6", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}