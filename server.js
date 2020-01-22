// ---------------------------------------------------------------
// Pending Tasks:
// Validate props with internal schemas ...
// Create mongo indexes (general and unique) ...
// Finish router login: validate schema, verify via getUsers ...
// Generate endpoints to expose JSON schemas in root doc ...
// Add PUT method in router resource ...
// ---------------------------------------------------------------
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const resourcesProps = require('./config/resources_props')
const serverProps = require('./config/server_props')
const authProps = require('./config/auth_props')
const openMongoCollection = require('./utils/mongo_utils').openMongoCollection
const generateRestApiDoc = require('./utils/generate_rest_api_doc')
const auth = require('./middlewares/authentication/auth')
const router_login = require('./routers_endpoints/router_login')
const router_resource = require('./routers_endpoints/router_resource')

// -------------------------------
// Opening connections to MongoDB
// -------------------------------
let promises = resourcesProps.map(res => openMongoCollection(res.resource, res.mongodb_uri, res.mongodb_database, res.mongodb_collection))

Promise.all(promises)
.then(mongo_cols => {
  console.log('\n- MongoDB connections:')
  mongo_cols.forEach(col => {
    console.log(`  ... opened collection: '${col.col_name}' (${col.mongodb_uri}/${col.db_name}) (resource: ${col.resource})`)
  })
  createApp(mongo_cols)
})
.catch((error) => {
  console.log({ error: error.message })
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
    let resources = mongo_cols.map(col => col.resource)
    if (authProps.enable_auth) resources.push('login')
    resources = generateRestApiDoc(url_base, resources)
    app.get('/', (req, res) => {
      res.json({ resources: resources })
    })
  }

  // ------------
  // Middlewares
  // ------------

  // Auth
  // -----
  app.use((req, res, next) => {
    auth(req, res, next)
  })

  // --------
  // Routers
  // --------

  // Router Login
  // -------------
  if (authProps.enable_auth) app.use('/login', router_login(authProps))

  // Routers Resources
  // ------------------
  mongo_cols.forEach(res => {
    app.use(`/${res.resource}`, router_resource(res.collection, {}))
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
