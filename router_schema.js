'use strict'

const express = require('express')
const ObjectID = require('mongodb').ObjectID
const validateSchema = require('./_validator')

const isInArray = (array, value) => array.indexOf(value) !== -1

const create_router = (props, mongo_col, schema) => {

  const router = express.Router()

  // ------------------------------
  // List endpoints of this router
  // ------------------------------
  const url_base = `http://${props.server_ip}:${props.server_port}/${props.endpoint_base_path}`
  const endpoints = [
    { path: `${url_base}/`, method: 'POST' },
    { path: `${url_base}/id/:id`, method: 'GET' },
    { path: `${url_base}/id/:id`, method: 'PUT' },
    { path: `${url_base}/id/:id`, method: 'DELETE' }
  ]
  router.get('/', (req, res) => {
    res.json({ endpoints: endpoints })
  })

  // ------------------------------------------------------
  // Create unique indexes for unique fields of the schema
  // ------------------------------------------------------
  const unique_fields = schema.filter(x => x.isUnique).map(x => x.fieldName)
  unique_fields.forEach(fieldName => {
    mongo_col.createIndex({ [fieldName]: 1 }, { sparse: true, unique: true })
  })

  // ------------------------------------------------
  // Create indexes for indexed fields of the schema
  // ------------------------------------------------
  const index_fields = schema.filter(x => x.index && !x.isUnique).map(x => x.fieldName)
  index_fields.forEach(fieldName => {
    mongo_col.createIndex({ [fieldName]: 1 })
  })

  // -------
  // Create
  // -------
  router.post('/', (req, res) => {

    // Validate Schema
    // ----------------
    let result = validateSchema(schema, req.body, true)
    if (result.error) return res.json(result)

    // Inserting ...
    // --------------
    mongo_col.insertOne(req.body, (err, docInserted) => {
      if (!err) {
        return res.json({ ok: 'OK', id: req.body._id })
      }
      else {
        return res.json({ error: err })
      }
    })

  })

  // -----
  // Read
  // -----
  router.get('/id/:id', (req, res) => {

    const query = {}

    if (req.params.id !== '--all--') {
      if (!/^[0-9A-Fa-f]{24}$/.test(req.params.id)) {
        return res.json({ error: 'Error: Campo \'id\' debe ser un string de 24 caracteres hexadecimales.' })
      }
      query['_id'] = new ObjectID(req.params.id)
    }

    mongo_col.find(query).limit(0).sort({_id: -1}).toArray((err, items) => {
      if (!err) {
        return res.json({ ok: 'OK', items: items })
      }
      else {
        return res.json({ error: err })
      }
    })

  })

  // -------
  // Update
  // -------
  router.put('/id/:id', (req, res) => {

    // Check id type
    // --------------
    if (!/^[0-9A-Fa-f]{24}$/.test(req.params.id)) {
      return res.json({ error: 'Error: Campo \'id\' debe ser un string de 24 caracteres hexadecimales.' })
    }

    // Check req.body empty
    // ---------------------
    if (Object.keys(req.body).length === 0) {
      return res.json({ error: 'Error: Debe especificar al menos un campo a modificar.' })
    }

    // Unique fields can not be modified
    // ----------------------------------
    // let error_unique = {}
    // unique_fields.forEach(unique_field => {
    //   if (isInArray(Object.keys(req.body), unique_field)) {
    //     error_unique = { error: `Error: El campo '${unique_field}' no puede ser modificado por ser de tipo unique.` }
    //   }
    // })
    // if (error_unique.error) return res.json(error_unique)

    // Validate Schema (but not mandatory fields)
    // -------------------------------------------
    let result = validateSchema(schema, req.body, false)
    if (result.error) return res.json(result)

    // Prepare update
    // ---------------
    const query = { _id: new ObjectID(req.params.id) }
    const setContent = { $set: req.body }

    // Updating ...
    // -------------
    mongo_col.updateOne(query, setContent, (err, result) => {
      if (!err) {
        if (result.result.n === 1) {
          return res.json({ ok: 'OK' })
        }
        else {
          return res.json({ error: `Error: El registro con _id = '${req.params.id}' no existe.` })
        }
      }
      else {
        return res.json({ error: err })
      }
    })

  })

  // -------
  // Delete
  // -------
  router.delete('/id/:id', (req, res) => {

    if (!/^[0-9A-Fa-f]{24}$/.test(req.params.id)) {
      return res.json({ error: 'Error: Campo \'id\' debe ser un string de 24 caracteres hexadecimales.' })
    }

    const query = { _id: new ObjectID(req.params.id) }

    mongo_col.deleteOne(query, (err, result) => {
      if (!err) {
        if (result.result.n === 1) {
          return res.json({ ok: 'OK' })
        }
        else {
          return res.json({ error: `Error: El registro con _id = '${req.params.id}' no existe.` })
        }
      }
      else {
        return res.json({ error: err })
      }
    })

  })

  return router
}

module.exports = create_router
