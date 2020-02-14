module.exports = {

  // If isProduction = true, the root endpoint will serve a React App (from 'build' folder).
  // If isProduction = false, the root endpoint will serve a REST API documentation.
  isProduction: !process.env.DEVELOPMENT_LOCAL_ENV ? true : false,
  server_port: 5000,
  server_ip: process.env.DEVELOPMENT_LOCAL_ENV ? '127.0.0.1' : '<IP production>'

}
