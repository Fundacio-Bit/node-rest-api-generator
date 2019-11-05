'use strict'

const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cors = require('cors')
const requestIp = require('request-ip')

const props = require('./config/props')
const schema = require('./config/schema')
const authenticate = require('./_auth')
const router_login = require('./router_login')
const router_schema = require('./router_schema')

const app = express()

app.use( bodyParser.json({ limit: '50mb' }) )
app.use( requestIp.mw() )
app.use( cors() )

// Authentication
// ---------------
app.use((req, res, next) => {
  authenticate(req, res, next)
})

// Listing root endpoints
// -----------------------
const url_base = `http://${props.server_ip}:${props.server_port}`
let resources = [ props.endpoint_base_path ]
if (props.enable_auth) resources.push('login')

app.get('/', (req, res) => {
  return res.json({ resources: resources.map(x => `${url_base}/${x}`) })
})

if (props.enable_auth) app.use('/login', router_login(props))

// Open MongoDB connection, instantiate router schema, and run server
// -------------------------------------------------------------------
MongoClient.connect(props.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (!err) {
    console.log(`\nConnected to ${props.mongodb_uri} ...\n`)

    const db = client.db(props.mongodb_database)
    console.log(`  ... opened database: ${props.mongodb_database}\n`)

    db.collection(props.mongodb_colname, (err, collection) => {
      if (!err) {
        console.log(`  ... opened collection: ${props.mongodb_colname}`)

        // instantiate router
        app.use(`/${props.endpoint_base_path}`, router_schema(props, collection, schema))

        // run server
        app.listen(props.server_port, () => {
          console.log(`\nYour REST API running on ${url_base}/${props.endpoint_base_path}\n`)
          if (props.enable_auth) console.log(`Login endpoint to get an access token: ${url_base}/login\n`)
        })
      }
      else {
        console.log(err)
        process.exit()
      }
    })

  }
  else {
    console.log(err)
    process.exit()
  }
})
