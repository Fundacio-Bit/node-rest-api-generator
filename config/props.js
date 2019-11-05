module.exports = {
  // API REST server properties
  // ---------------------------
  server_port: 5000,
  server_ip: '127.0.0.1',

  // MongoDB properties
  // -------------------
  mongodb_uri: 'mongodb://127.0.0.1:27017',
  mongodb_database: 'employees_db',
  mongodb_colname: 'employees',

  // Authentication properties
  //---------------------------
  adminuser: {
    username: '',
    hashed_pwd: ''  // Note: use the script utils/generate_hashed_pwd.js to generate a hash from a password
  },
  enable_auth: false,

  // Endpoint base path ('http://<server>/<endpoint_base_path>')
  // ------------------------------------------------------------
  endpoint_base_path: 'employees'
}
