// -------------------------------------------------------------------------
// Pending Tasks:
// Create mongo indexes
// Add permissions in middleware auth
// -------------------------------------------------------------------------
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Config properties
const resourcesProps = require('./config/resources_props')
const serverProps = require('./config/server_props')
const authProps = require('./config/auth_props')

// Utils
const validateConfigProps = require('./utils/config_props_validator')
const compileResourcesSchemas = require('./utils/resources_schemas_compiler')
const openMongoCollection = require('./utils/mongo_utils').openMongoCollection
const loginSchema = require('./utils/login_schema')

// Middlewares
const auth = require('./middleware/authentication/auth')
const validateResources = require('./middleware/resources-schemas-validator/resources_validator.js')

// Routers
const router_login = require('./routers_endpoints/router_login')
const router_resource = require('./routers_endpoints/router_resource')
const router_rest_api_doc = require('./routers_endpoints/router_rest_api_doc')
const router_react_app = require('./routers_endpoints/router_react_app')

// ----------------------------------------------
// Validating config props with internal schemas
// ----------------------------------------------
try {
  validateConfigProps(authProps, resourcesProps, serverProps)
} catch(error) {
  console.log(error.message)
  process.exit()
}

// ----------------------------
// Compiling resources schemas
// ----------------------------
try {
  compileResourcesSchemas(__dirname, resourcesProps)
} catch(error) {
  console.log('ERROR:', error.message)
  process.exit()
}

// -------------------------------
// Opening connections to MongoDB
// -------------------------------
let promises = resourcesProps.map(resource =>
  openMongoCollection(resource.resource, resource.mongodb_uri, resource.mongodb_database, resource.mongodb_collection, resource.mongodb_poolSize)
)

if (authProps.enable_auth) {
  let login_col = authProps.users_datasource
  promises.push(openMongoCollection('login', login_col.mongodb_uri, login_col.mongodb_database, login_col.mongodb_collection, 5))
}

Promise.all(promises)
.then(mongo_cols => {
  console.log('\n- MongoDB connections:')

  mongo_cols.forEach(col => {
    let resourceSchema
    if (col.resource === 'login') {
      resourceSchema = './utils/login_schema.js'
    } else {
      resourceSchema = resourcesProps.filter(x => x.resource === col.resource)[0].schema
    }
    console.log(`  ... opened: '${col.col_name}' (${col.mongodb_uri}/${col.db_name}) (resource: ${col.resource}) (schema: ${resourceSchema})`)
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
  if (serverProps.isProduction) {
    app.use('/', router_react_app(__dirname))
    console.log(`\n- React App: ${url_base}/`)
  } else {
    app.use('/', router_rest_api_doc(url_base, resourcesProps, authProps, loginSchema))
    console.log(`\n- REST API documentation: ${url_base}/`)
  }

  // ------------------------------------------------------
  // Login: instantiate router first, then middleware auth
  // ------------------------------------------------------
  if (authProps.enable_auth) {
    let loginCollection = mongo_cols.filter(x => x.resource === 'login')[0].collection

    app.use('/login', router_login(authProps, loginSchema, loginCollection))
    app.use((req, res, next) => { auth(req, res, next) })
    console.log(`\n- Login endpoint to get auth token: ${url_base}/login`)
  }

  // ------------------------------------------------------------------------------
  // Resources: middleware to validate JSON schemas first, then instantiate router
  // ------------------------------------------------------------------------------
  let resource_cols = mongo_cols.filter(x => x.resource !== 'login')

  resource_cols.forEach(resource => {
    app.use((req, res, next) => { validateResources(req, res, next, resourcesProps) })
    app.use(`/${resource.resource}`, router_resource(resource.collection))
  })

  // -----------------
  // Launching server
  // -----------------
  app.listen(serverProps.server_port, () => { console.log(`\nServer running ...`) })
}
