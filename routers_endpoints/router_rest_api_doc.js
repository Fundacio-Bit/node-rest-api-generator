'use strict'

const express = require('express')

const generateRestApiDoc = (urlBase, resources) => {
  return resources.map(res => {
    if (res === 'login') {
      return {
        resource: res,
        endpoints: [
          { path: `${urlBase}/login`, methods: ['POST'] },
        ],
        jsonSchema: `${urlBase}/schemas/login`
      }
    } else {
      return {
        resource: res,
        endpoints: [
          { path: `${urlBase}/${res}`, methods: ['GET', 'POST'] },
          { path: `${urlBase}/${res}/:_id`, methods: ['GET', 'PUT', 'PATCH', 'DELETE'] }
        ],
        jsonSchema: `${urlBase}/schemas/${res}`
      }
    }
  })
}

const create_router = (urlBase, resourcesProps, authProps, loginSchema) => {

  const router = express.Router()

  let resources = resourcesProps.map(resource => resource.resource)
  if (authProps.enable_auth) resources.push('login')

  resources = generateRestApiDoc(urlBase, resources)

  router.get('/', (req, res) => {
    res.status(200).json({ resources: resources })
  })

  resourcesProps.forEach(resource => {
    router.get(`/schemas/${resource.resource}`, (req, res) => {
      res.status(200).json(resource.parsedSchema)
    })
  })

  if (authProps.enable_auth) {
    router.get(`/schemas/login`, (req, res) => {
      res.status(200).json(loginSchema)
    })
  }

  return router
}

module.exports = create_router
