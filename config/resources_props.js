module.exports = [

  {
    resource: 'companies',
    schema: 'companies.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'companies_col'
  },
  {
    resource: 'geo-locations',
    schema: 'geo_locations.json',
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'geo_locations_col'
  }

]
