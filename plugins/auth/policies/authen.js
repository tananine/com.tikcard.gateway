const axios = require('axios')
const jwt = require('jsonwebtoken')

module.exports = {
  name: 'authen',
  policy: (actionParams) => {
    return (req, res, next) => {
      const authHeader = req.get('Authorization')
      let token
      try {
        token = authHeader.split(' ')[1]
      } catch {
        return res.status(401).json({ message: 'ไม่สามารถแยก Token ได้' })
      }
      axios
        .get('http://docker.for.mac.localhost:3001/auth/authentication', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((account) => {
          if (!account) {
            return res.status(401).json({ message: 'ไม่พบ Account' })
          }
          const secretKey = 'secret'
          const jsonToken = jwt.sign(account.data, secretKey)
          req.headers.token = `Bearer ${jsonToken}`
          next()
        })
        .catch((error) => {
          return res
            .status(401)
            .json({ message: 'authen ไม่สำเร็จ', error: error })
        })
    }
  },
}
