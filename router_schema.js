'use strict'

const express = require('express')
const ObjectID = require('mongodb').ObjectID
const validateSchema = require('./_validator')

const create_router = (mongo_col, schema) => {

  const router = express.Router()

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

  // ---------
  // Read all
  // ---------
  router.get('/', (req, res) => {

    mongo_col.find({}).limit(0).sort({_id: -1}).toArray((err, items) => {
      if (!err) {
        return res.json({ ok: 'OK', items: items })
      }
      else {
        return res.json({ error: err })
      }
    })

  })

  // -----------
  // Read by ID
  // -----------
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
