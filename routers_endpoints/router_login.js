'use strict'

let jwt = require('jsonwebtoken')
const express = require('express')
const queryMongoCollection = require('../utils/mongo_utils').queryMongoCollection
const keccak256 = require('js-sha3').keccak256
const Ajv = require('ajv')

const ajv = new Ajv({ allErrors: true })

const create_router = (authProps, loginSchema, loginCollection) => {

  const router = express.Router()

  router.get('/', (req, res) => {
    res.status(200).json({
      hint: 'To log on, send a POST request with the following schema.',
      schema: loginSchema
    })
  })

  router.post('/', (req, res) => {

    // Validate req.body
    // ------------------
    let validate = ajv.compile(loginSchema)
    if (!validate(req.body)) {
      return res.status(400).json({ error: `ERROR: Invalid body format:\n${JSON.stringify(validate.errors, null, 2)}` })
    }

    // Query to mongo collection to verify user credentials
    // -----------------------------------------------------
    queryMongoCollection({username: req.body.username}, loginCollection)
    .then(users => {

      if (users.length === 0) {

        return res.status(401).json({ error: 'UNKNOWN_USER' })

      } else {
        let currentUser = users[0]

        // Validate user object structure
        // -------------------------------
        const getErrorMsg = (field) => `Entries of the provided users datasource doesn't contain a '${field}' field.`
        if (!currentUser.hashed_pwd) return res.status(500).json({ error: getErrorMsg('hashed_pwd')})
        if (!currentUser.grants) return res.status(500).json({ error: getErrorMsg('grants')})

        // Verify password
        // ----------------
        if (currentUser.hashed_pwd !== keccak256(req.body.pwd)) {
          return res.status(401).json({ error: 'INVALID_PASSWORD' })
        } else {

          // OK: user verified!
          // -------------------
          generateToken(currentUser)
        }
      }

    })
    .catch(error => {
      return res.status(500).json({ error: error.message })
    })

    const generateToken = (user) => {
      let payload = {
        username: user.username,
        grants: user.grants
      }

      let token = jwt.sign(payload, authProps.secret_key, { expiresIn: '24h' })

      return res.status(200).json({ ok: 'OK', expires: 'Your token expires in 24h', token: token })
    }

  })

  return router
}

module.exports = create_router
