module.exports = {

  // Enable/Disable auth for the REST API
  enable_auth: true,

  // to sign JWT
  secret_key: '<your secret key>',

  // data source for users login
  users_datasource: {
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'users_col'
  }

}