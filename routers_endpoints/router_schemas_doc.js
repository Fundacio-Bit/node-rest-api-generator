'use strict'

const express = require('express')

const create_router = (resourcesProps) => {

  const router = express.Router()

  resourcesProps.forEach(resource => {
    router.get(`/${resource.resource}`, (req, res) => {
      res.status(200).json(resource.parsedSchema)
    })
  })

  return router
}

module.exports = create_router
