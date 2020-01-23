'use strict'

const jwt = require('jsonwebtoken')
const authProps = require('../../config/auth_props')

const auth = (req, res, next) => {

  let token = req.query.token || req.headers['authorization'] || ''

  if (token.startsWith('Bearer ')) { token = token.slice(7, token.length) }
  if (token === 'null') token = null

  if (token) {

    jwt.verify(token, authProps.secret_key, (err, decoded) => {
      if (err) {
        return res.json({ error: 'INVALID_TOKEN' })
      }
      else {
        req.tokenPayload = decoded
        return next()
      }
    })

  } else {
    return res.json({ error: 'TOKEN_REQUIRED' })
  }

}

module.exports = auth
