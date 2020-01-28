'use strict'

const express = require('express')
const ObjectID = require('mongodb').ObjectID

const create_router = (mongo_col) => {

  const router = express.Router()

  // ---------
  // Read all
  // ---------
  router.get('/', (req, res) => {
    mongo_col.find({}).limit(0).sort({_id: -1}).toArray((err, items) => {
      if (!err) {
        return res.status(200).json({ ok: 'OK', items_count: items.length, items: items })
      }
      else {
        return res.status(504).json({ error: err })
      }
    })
  })

  // -----------
  // Read by ID
  // -----------
  router.get('/:_id', (req, res) => {
    const query = {}

    if (req.params._id !== '--all--') {
      if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
        return res.status(400).json({ error: 'Error: _id parameter must be a string of 24 hexadecimals characters.' })
      }
      query['_id'] = new ObjectID(req.params._id)
    }

    mongo_col.findOne(query, (err, item) => {
      if (!err) {
        if (item) {
          return res.status(200).json({ ok: 'OK', item: item })
        } else {
          return res.status(404).json({ error: `Error: Item with _id = '${req.params._id}' doesn't exist.` })
        }
      }
      else {
        return res.status(504).json({ error: err })
      }
    })
  })

  // -------
  // Create
  // -------
  router.post('/', (req, res) => {
    mongo_col.insertOne(req.body, (err, docInserted) => {
      if (!err) {
        return res.status(200).json({ ok: 'OK', id: docInserted.insertedId })
      }
      else {
        return res.status(504).json({ error: err })
      }
    })
  })

  // ---------------
  // Update (PATCH)
  // ---------------
  router.patch('/:_id', (req, res) => {

    // Check _id format
    if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
      return res.status(400).json({ error: 'Error: _id parameter must be a string of 24 hexadecimals characters.' })
    }

    // Check req.body empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Error: Specify at least one field to update.' })
    }

    const query = { _id: new ObjectID(req.params._id) }
    const setContent = { $set: req.body }

    mongo_col.updateOne(query, setContent, (err, result) => {
      if (!err) {
        if (result.result.n === 1) {
          return res.status(200).json({ ok: 'OK' })
        }
        else {
          return res.status(404).json({ error: `Error: Item with _id = '${req.params._id}' doesn't exist.` })
        }
      }
      else {
        return res.status(504).json({ error: err })
      }
    })

  })

  // -------------
  // Update (PUT)
  // -------------
  router.put('/:_id', (req, res) => {

    // Check _id format
    if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
      return res.status(400).json({ error: 'Error: _id parameter must be a string of 24 hexadecimals characters.' })
    }

    // Check req.body empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Error: Specify at least one field to update.' })
    }

    const query = { _id: new ObjectID(req.params._id) }

    mongo_col.replaceOne(query, req.body, { upsert: true },  (err, result) => {
      if (!err) {
        if (result.result.ok) {
          if (result.upsertedId) {
            return res.status(200).json({ ok: 'OK', upsertedId: result.upsertedId })
          } else {
            return res.status(200).json({ ok: 'OK' })
          }
        } else {
          return res.status(500).json({ error: result })
        }
      } else {
        return res.status(504).json({ error: err })
      }
    })

  })

  // -------
  // Delete
  // -------
  router.delete('/:_id', (req, res) => {
    if (!/^[0-9A-Fa-f]{24}$/.test(req.params._id)) {
      return res.status(400).json({ error: 'Error: _id parameter must be a string of 24 hexadecimals characters.' })
    }

    const query = { _id: new ObjectID(req.params._id) }

    mongo_col.deleteOne(query, (err, result) => {
      if (!err) {
        if (result.result.n === 1) {
          return res.status(200).json({ ok: 'OK' })
        }
        else {
          return res.status(404).json({ error: `Error: Item with _id = '${req.params._id}' doesn't exist.` })
        }
      }
      else {
        return res.status(504).json({ error: err })
      }
    })
  })

  return router
}

module.exports = create_router
