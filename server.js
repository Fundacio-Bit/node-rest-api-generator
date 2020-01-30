// -------------------------------------------------------------------------
// Pending Tasks:
// Create mongo indexes ...
// Finish router login: validate users schema, verify via getUsers ...
// Middleware to validate resources schemas ...
// Update Readme
// -------------------------------------------------------------------------
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const Ajv = require('ajv')

const resourcesProps = require('./config/resources_props')
const serverProps = require('./config/server_props')
const authProps = require('./config/auth_props')
const validateConfigProps = require('./utils/config-props-validator')
const openMongoCollection = require('./utils/mongo_utils').openMongoCollection
const generateRestApiDoc = require('./utils/generate_rest_api_doc')
const auth = require('./middleware/authentication/auth')
const router_login = require('./routers_endpoints/router_login')
const router_resource = require('./routers_endpoints/router_resource')
const router_schemas_doc = require('./routers_endpoints/router_schemas_doc')
const loginSchema = require('./utils/login_schema')

// ----------------------------------------------
// Validating config props with internal schemas
// ----------------------------------------------
try {
  validateConfigProps(authProps, resourcesProps, serverProps)
} catch(error) {
  console.log(error.message)
  process.exit()
}

// -------------------------------
// Opening connections to MongoDB
// -------------------------------
let promises = resourcesProps.map(resource => openMongoCollection(resource.resource, resource.mongodb_uri, resource.mongodb_database, resource.mongodb_collection))

Promise.all(promises)
.then(mongo_cols => {
  console.log('\n- MongoDB connections:')
  mongo_cols.forEach(col => {
    console.log(`  ... opened collection: '${col.col_name}' (${col.mongodb_uri}/${col.db_name}) (resource: ${col.resource})`)
  })
  createApp(mongo_cols)
})
.catch(error => {
  console.log('ERROR:', error.message)
  process.exit()
})

// -------------------
// Create express App
// -------------------
const createApp = (mongo_cols) => {

  const app = express()

  app.use( bodyParser.json({ limit: '50mb' }) )
  app.use( cors() )

  const url_base = `http://${serverProps.server_ip}:${serverProps.server_port}`

  // --------------
  // Root endpoint
  // --------------
  if (!process.env.DEVELOPMENT_LOCAL_ENV) {  // PRODUCTION (serving React App)
    app.use(express.static(path.join(__dirname, 'build')))
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })
  } else {  // DEVELOPMENT (serving REST API documentation)

    // Reading and compiling JSON schema files
    // ----------------------------------------
    const ajv = new Ajv({ allErrors: true })

    resourcesProps.forEach(resource => {
      const content = fs.readFileSync(path.join(__dirname, 'config', 'resources-schemas', resource.schema), 'utf8')
      try {
        resource.parsedSchema = JSON.parse(content)
        let validate = ajv.compile(resource.parsedSchema)
        resource.validate = validate
      } catch(error) {
        console.log(`\nERROR detected compiling JSON schema '${resource.schema}':\n`, error.message, '\n')
        process.exit()
      }
    })

    // Instantiating the router to document schemas
    // ---------------------------------------------
    app.use('/schemas', router_schemas_doc(resourcesProps))

    if (authProps.enable_auth) {
      app.get(`/schemas/login`, (req, res) => {
        res.status(200).json(loginSchema)
      })
    }

    // Generating documentation of endpoints
    // --------------------------------------
    let resources = resourcesProps.map(resource => resource.resource)
    if (authProps.enable_auth) resources.push('login')

    resources = generateRestApiDoc(url_base, resources)

    app.get('/', (req, res) => {
      res.json({ resources: resources })
    })
  }

  // ---------------------------------
  // Router Login and Middleware Auth
  // ---------------------------------
  if (authProps.enable_auth) {
    app.use('/login', router_login(authProps, loginSchema))
    app.use((req, res, next) => { auth(req, res, next) })
  }

  // ------------------
  // Routers Resources
  // ------------------
  mongo_cols.forEach(resource => {
    app.use(`/${resource.resource}`, router_resource(resource.collection))
  })

  // -----------------
  // Launching server
  // -----------------
  app.listen(serverProps.server_port, () => {
    if (process.env.DEVELOPMENT_LOCAL_ENV) {
      console.log(`\n- REST API documentation: ${url_base}/`)
    } else {
      console.log(`\n- React App: ${url_base}/`)
    }
    if (authProps.enable_auth) console.log(`\n- Login endpoint to get auth token: ${url_base}/login`)
    console.log(`\nServer running ...`)
  })

}
