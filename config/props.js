module.exports = {
  // API REST server properties
  // ---------------------------
  server_port: 5000,
  server_ip: process.env.DEVELOPMENT_LOCAL_ENV ? '127.0.0.1' : '<IP production>',

  // MongoDB properties
  // -------------------
  mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
  mongodb_database: 'employees_db',
  mongodb_colname: 'employees',

  // Authentication properties
  //---------------------------
  // Note: use the script utils/generate_hashed_pwd.js to generate a hashed password
  adminuser: {
    username: '',
    hashed_pwd: ''
  },
  enable_auth: false,

  // Endpoint base path ('http://<server>/<endpoint_base_path>')
  // ------------------------------------------------------------
  endpoint_base_path: 'employees'
}
