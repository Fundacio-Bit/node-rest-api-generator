'use strict'

const express = require('express')
const path = require('path')

const create_router = (pathDir) => {

  const router = express.Router()

  router.use(express.static(path.join(pathDir, 'build')))

  router.get('/', (req, res) => {
    res.sendFile(path.join(pathDir, 'build', 'index.html'))
  })

  return router
}

module.exports = create_router
