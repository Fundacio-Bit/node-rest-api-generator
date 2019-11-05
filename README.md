# node-rest-api-generator #

A generator of RESTful API's with schema validation.

## Installation

~~~
npm install
~~~

## Configuration

### 1. Set the properties on *config/props.js*
~~~
{
  // API REST server properties
  server_port: 5000,
  server_ip: '127.0.0.1',

  // MongoDB properties
  mongodb_uri: 'mongodb://127.0.0.1:27017',
  mongodb_database: 'employees_db',
  mongodb_colname: 'employees',

  // Authentication properties
  // Note: use the script utils/generate_hashed_pwd.js to generate a hash from a password
  adminuser: {
    username: '',
    hashed_pwd: ''
  },
  enable_auth: false,

  // Endpoint base path ('http://<server>/<endpoint_base_path>')
  endpoint_base_path: 'employees'
}
~~~

## Usage

~~~
npm start
~~~

Once the server is running, you can access the REST API endpoints on http://<server_ip>:<server_port>/endpoint_base_path.
If you set *enable_auth: true* in the *props.js* file, then first you have to authenticate to the REST
through the login endpoint http://<server_ip>:<server_port>/login.
