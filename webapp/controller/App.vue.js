var __vueify_insert__ = require("vueify/lib/insert-css")
var __vueify_style__ = __vueify_insert__.insert("/* line 3, stdin */\n.alert[_v-e8d1171c] {\n  width: 400px;\n  position: fixed;\n  top: 30px;\n  margin: 0 auto;\n  left: 0;\n  right: 0;\n  z-index: 1050; }\n")
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    name: "App",
    data: function data() {
        return {
            showAlert: false,
            alertType: "danger",
            alertMessage: ""
        };
    },

    computed: {
        bsAlertType: function bsAlertType() {
            return "alert-" + this.alertType;
        }
    },
    created: function created() {
        // AppBus.$on("alert", (type, message, duration) => {
        //     this.alertType = type;
        //     this.alertMessage = message;
        //     this.showAlert = true;

        //     setTimeout(() => {
        //         this.showAlert = false;
        //     }, duration);
        // });
    }
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n<div _v-e8d1171c=\"\">\n    <div v-show=\"showAlert\" transition=\"fade\" role=\"alert\" :class=\"['alert', bsAlertType]\" _v-e8d1171c=\"\">\n\n        <button type=\"button\" class=\"close\" @click=\"showAlert = false\" _v-e8d1171c=\"\">\n            <span _v-e8d1171c=\"\">×</span>\n        </button> \n        <p _v-e8d1171c=\"\">{{ alertMessage }}</p>\n\n    </div>\n\n    <router-view _v-e8d1171c=\"\"></router-view>\n</div>\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.dispose(function () {
    __vueify_insert__.cache["/* line 3, stdin */\n.alert[_v-e8d1171c] {\n  width: 400px;\n  position: fixed;\n  top: 30px;\n  margin: 0 auto;\n  left: 0;\n  right: 0;\n  z-index: 1050; }\n"] = false
    document.head.removeChild(__vueify_style__)
  })
  if (!module.hot.data) {
    hotAPI.createRecord("_v-e8d1171c", module.exports)
  } else {
    hotAPI.update("_v-e8d1171c", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}