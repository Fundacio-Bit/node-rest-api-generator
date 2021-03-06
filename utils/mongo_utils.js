'use strict'

const MongoClient = require('mongodb').MongoClient

const openMongoCollection = (resource, mongodb_uri, db_name, col_name, poolSize) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: poolSize }, (err, client) => {
      if (!err) {
        const db = client.db(db_name)
        db.collection(col_name, (err, collection) => {
          if (!err) {
            resolve({
              resource: resource,
              mongodb_uri: mongodb_uri,
              db_name: db_name,
              col_name: col_name,
              collection: collection
            })
          }
          else {
            reject(err)
          }
        })
      } else {
        reject(err)
      }
    })
  })
}

const queryMongoCollection = (query, mongo_col) => {
  return new Promise((resolve, reject) => {
    mongo_col.find(query).limit(0).toArray((err, items) => {
      if (!err) {
        resolve(items)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  openMongoCollection: openMongoCollection,
  queryMongoCollection: queryMongoCollection
}
