module.exports = {
  version: "1.2.0",
  init: function (pluginContext) {
    let policy = require("./policies/authen");
    pluginContext.registerPolicy(policy);
  },
  policies: ["authen"],
  schema: {
    $id: "http://express-gateway.io/schemas/plugin/auth.json",
  },
};
