const axios = require("axios");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "authen",
  schema: {
    $id: "http://express-gateway.io/schemas/policies/authen.json",
    type: "object",
    properties: {
      secretKey: {
        type: "string",
      },
    },
  },
  policy: (actionParams) => {
    return (req, res, next) => {
      const authHeader = req.get("Authorization");
      let token;
      try {
        token = authHeader.split(" ")[1];
      } catch {
        return res.status(401).json({ message: "ไม่สามารถแยก Token ได้" });
      }
      axios
        .get(`${process.env.SERVICE_AUTH_HOST}/auth/authentication`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((account) => {
          if (!account) {
            return res.status(401).json({ message: "ไม่พบ Account" });
          }
          const secretKey = actionParams.secretKey;
          const jsonToken = jwt.sign(account.data, secretKey);
          req.headers.token = `Bearer ${jsonToken}`;
          next();
        })
        .catch((error) => {
          return res
            .status(401)
            .json({ message: "authen ไม่สำเร็จ", error: error });
        });
    };
  },
};
