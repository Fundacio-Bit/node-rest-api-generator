module.exports = [

  {
    resource: 'suppliers',
    schema: 'suppliers.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'suppliers_col'
  }

]
