'use strict'

const jwt = require('jsonwebtoken')
const props = require('./config/props')

const authenticate = (req, res, next) => {

  // Disable authentication if enable_auth = false
  // ----------------------------------------------
  if (!props.enable_auth) return next()

  // Skip authentication for the login endpoint
  // -------------------------------------------
  if (/^\/login/.test(req.path)) return next()

  let token = req.query.token || req.headers['authorization'] || ''

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }

  if (token === 'null') {
    token = null
  }

  if (token) {
    jwt.verify(token, props.adminuser.hashed_pwd, (err, decoded) => {
      if (err) {
        return res.json({ error: 'INVALID_TOKEN' })
      }
      else {
        req.tokenPayload = decoded
        return next()
      }
    })
  }
  else {
    return res.json({ error: 'TOKEN_REQUIRED' })
  }

}

module.exports = authenticate
