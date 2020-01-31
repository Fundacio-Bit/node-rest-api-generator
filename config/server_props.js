module.exports = {

  isProduction: !process.env.DEVELOPMENT_LOCAL_ENV ? true : false,
  server_port: 5000,
  server_ip: process.env.DEVELOPMENT_LOCAL_ENV ? '127.0.0.1' : '<IP production>'

}
