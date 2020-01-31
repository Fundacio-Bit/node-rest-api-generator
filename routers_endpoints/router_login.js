'use strict'

let jwt = require('jsonwebtoken')
const express = require('express')
// const keccak256 = require('js-sha3').keccak256

const create_router = (authProps, loginSchema) => {

  const router = express.Router()

  router.get('/', (req, res) => {
    res.json({
      hint: 'To log on, send a POST request with the body following the below schema.',
      schema: loginSchema
    })
  })

  router.post('/', (req, res) => {

    // Validate req.body with JSON Schema ...

    // Verify User (use getUsers) ...

    // if (currentUser.username !== req.body.username) {
    //   return res.json({ error: 'UNKNOWN_USER' })
    // }

    // Verify password ...

    // if (currentUser.hashed_pwd !== keccak256(req.body.pwd)) {
    //   return res.json({ error: 'INVALID_PASSWORD' })
    // }

    // Generate token
    // ---------------
    let payload = { username: req.body.username, grants: {} }
    let token = jwt.sign(payload, authProps.secret_key, { expiresIn: '24h' })
    res.json({ ok: 'OK', note: 'Your token expires in 24h', token: token })

  })

  return router
}

module.exports = create_router
