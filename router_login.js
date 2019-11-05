'use strict'

let jwt = require('jsonwebtoken')
const express = require('express')
const keccak256 = require('js-sha3').keccak256
const types = require('./_types')
const validateSchema = require('./_validator')

const login_schema = [
  {fieldName: 'username', type: types._String, isMandatory: true},
  {fieldName: 'pwd', type: types._String, isMandatory: true}
]

const create_router = (props) => {

  const router = express.Router()

  router.get('/', (req, res) => {
    res.json({ note: `To log on the REST API and get an access token, send a POST request to this endpoint with the following body: {"username": "...", "pwd": "..."}` })
  })

  router.post('/', (req, res) => {

    // Validate Schema
    // ----------------
    let result = validateSchema(login_schema, req.body, true)
    if (result.error) return res.json(result)

    // Verify username
    // ----------------
    if (props.adminuser.username !== req.body.username) {
      return res.json({ error: 'UNKNOWN_USER' })
    }

    // Verify password
    // ----------------
    if (props.adminuser.hashed_pwd !== keccak256(req.body.pwd)) {
      return res.json({ error: 'INVALID_PASSWORD' })
    }

    // Generate token
    // ---------------
    let payload = { username: req.body.username }
    let secret_key = props.adminuser.hashed_pwd
    let token = jwt.sign(payload, secret_key, { expiresIn: '24h' })
    res.json({ ok: 'OK', note: 'Your token expires in 24h', token: token })

  })

  return router
}

module.exports = create_router
