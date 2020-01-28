module.exports = {

  enable_auth: false,  // Enable/Disable auth to the REST API

  secret_key: '<your secret key>',  // to sign JWT

  // users_datasource: {
  //   mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
  //   mongodb_database: 'mytest_db',
  //   mongodb_collection: 'users_col'
  // }

}