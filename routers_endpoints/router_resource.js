'use strict'

const express = require('express')
const ObjectID = require('mongodb').ObjectID

const create_router = (mongo_col, schema) => {

  const router = express.Router()

  // // ------------------------------------------------------
  // // Create unique indexes for unique fields of the schema
  // // ------------------------------------------------------
  // const unique_fields = schema.filter(x => x.isUnique).map(x => x.fieldName)
  // unique_fields.forEach(fieldName => {
  //   mongo_col.createIndex({ [fieldName]: 1 }, { sparse: true, unique: true })
  // })

  // // ------------------------------------------------
  // // Create indexes for indexed fields of the schema
  // // ------------------------------------------------
  // const index_fields = schema.filter(x => x.index && !x.isUnique).map(x => x.fieldName)
  // index_fields.forEach(fieldName => {
  //   mongo_col.createIndex({ [fieldName]: 1 })
  // })

  // ---------
  // Read all
  // ---------
  router.get('/', (req, res) => {

    mongo_col.find({}).limit(0).sort({_id: -1}).toArray((err, items) => {
      if (!err) {
        return res.json({ ok: 'OK', items_count: items.length, items: items })
      }
      else {
        return res.json({ error: err })
      }
    })

  })

  // -----------
  // Read by ID
  // -----------
  router.get('/_id/:_id', (req, res) => {

    const query = {}

    if (req.params._id !== '--all--') {
      if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
        return res.json({ error: 'Error: Field \'_id\' must be a string of 24 hexadecimals characters.' })
      }
      query['_id'] = new ObjectID(req.params._id)
    }

    mongo_col.findOne(query, (err, item) => {
      if (!err) {
        if (item) {
          return res.json({ ok: 'OK', item: item })
        } else {
          return res.json({ error: `Error: Item with _id = '${req.params._id}' doesn't exist.` })
        }
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

  // ---------------
  // Update (PATCH)
  // ---------------
  router.patch('/_id/:_id', (req, res) => {

    // Check _id format
    // -----------------
    if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
      return res.json({ error: 'Error: Field \'_id\' must be a string of 24 hexadecimals characters.' })
    }

    // Check req.body empty
    // ---------------------
    if (Object.keys(req.body).length === 0) {
      return res.json({ error: 'Error: Specify at least one field to update.' })
    }

    // Validate Schema (without mandatory fields)
    // -------------------------------------------

    // Prepare update
    // ---------------
    const query = { _id: new ObjectID(req.params._id) }
    const setContent = { $set: req.body }

    // Updating ...
    // -------------
    mongo_col.updateOne(query, setContent, (err, result) => {
      if (!err) {
        if (result.result.n === 1) {
          return res.json({ ok: 'OK' })
        }
        else {
          return res.json({ error: `Error: Item with _id = '${req.params._id}' doesn't exist.` })
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
  router.delete('/_id/:_id', (req, res) => {

    if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
      return res.json({ error: 'Error: Field \'_id\' must be a string of 24 hexadecimals characters.' })
    }

    const query = { _id: new ObjectID(req.params._id) }

    mongo_col.deleteOne(query, (err, result) => {
      if (!err) {
        if (result.result.n === 1) {
          return res.json({ ok: 'OK' })
        }
        else {
          return res.json({ error: `Error: Item with _id = '${req.params._id}' doesn't exist.` })
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
