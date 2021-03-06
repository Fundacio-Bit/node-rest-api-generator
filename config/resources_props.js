module.exports = [

  {
    resource: 'suppliers',
    schema: 'suppliers.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'suppliers_col',
    mongodb_poolSize: 15
  },
  {
    resource: 'products',
    schema: 'products.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'products_col',
    mongodb_poolSize: 25
  },
  {
    resource: 'customers',
    schema: 'customers.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'customers_col',
    mongodb_poolSize: 15
  },
  {
    resource: 'orders',
    schema: 'orders.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'orders_col',
    mongodb_poolSize: 25
  }

]
