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
  // Note: use the script 'utils/generate_hashed_pwd.js' from the command line to generate a hashed password and then set the 'hashed_pwd' property
  adminuser: {
    username: '',
    hashed_pwd: ''
  },
  enable_auth: false,

  // Endpoint base path ('http://<server>/<endpoint_base_path>')
  endpoint_base_path: 'employees'
}
~~~

### 2. Define a data schema for the MongoDB collection on *config/schema.js*
~~~
const types = require('../_types')

const _Schema_Project = [
  {fieldName: 'acronym', type: types._String, isMandatory: true},
  {fieldName: 'name', type: types._String, isMandatory: true}
]

const _Schema_Department = [
  {fieldName: 'es_name', type: types._String, isMandatory: true},
  {fieldName: 'ca_name', type: types._String, isMandatory: true},
  {fieldName: 'en_name', type: types._String, isMandatory: true}
]

module.exports = [
  {fieldName: 'name', type: types._String, isMandatory: true},
  {fieldName: 'user_number', type: types._Number, isMandatory: true, isUnique: true},
  {fieldName: 'email', type: types._Email, isMandatory: true, isUnique: true},
  {fieldName: 'role', type: types._String, allowedValues: ['manager', 'developer', 'tester'], index: true},
  {fieldName: 'age', type: types._Number, index: true, isMandatory: true},
  {fieldName: 'permanent_employee', type: types._Boolean, index: true},
  {fieldName: 'skills', type: types._Array_Of_String, allowedValues: ['node.js', 'java', 'python', 'javascript', 'c', 'c++']},
  {fieldName: 'hiring_date', type: types._Date, isMandatory: true},
  {fieldName: 'salary_range', type: types._IntegerRestricted, range: [30000, 40000]},
  {fieldName: 'ip_addresses', type: types._Array_Of_IP_Address, isMandatory: true},
  {fieldName: 'projects', arrayOfComplexType: _Schema_Project, isMandatory: true},
  {fieldName: 'department', complexType: _Schema_Department, isMandatory: true}
]
~~~

The *isUnique* attribute will generate a unique index on the corresponding field in the MongoDB collection.
The *index* attribute will generate a common index on the corresponding field in the MongoDB collection.

As an example, the previous schema would validate the following body sent to the REST API through HTTP POST or PUT requests:
~~~
let body = {
    name: 'Juan Pérez',
    user_number: 123,
    email: 'jperez@jperez.com',
    role: 'developer',
    age: 43,
    permanent_employee: true,
    skills: ['node.js', 'python', 'javascript'],
    hiring_date: '1998/08/23',
    salary_range: 40000,
    ip_addresses: ['127.0.0.1'],
    projects: [
      { acronym: 'TIE', name: 'Aparador Turístic Intel.ligent' },
      { acronym: 'ESCACT', name: 'Escolta Activa de Marques Turístiques' }
    ],
    department: {
      'es_name': 'Área de TIC Turismo',
      'ca_name': 'Àrea de TIC Turisme',
      'en_name': 'ICT Tourism Area'
    }
}
~~~

## Usage

~~~
npm start
~~~

Once the server is running, you can access the REST API endpoints on *http://<server_ip>:<server_port>/endpoint_base_path*.
If you set the property *enable_auth: true* in the *props.js* file, then first you have to authenticate to the REST
through the login endpoint *http://<server_ip>:<server_port>/login* in order to get an access token (JWT). The token should be
sent to the REST either through an authentication header as a bearer token, or as a query parameter
in HTTP GET requests as follow: *http://...?token=<jwt_token>*. Taking the properties and schema set in
the previous section, this would be the available list of endpoints:

~~~
{
  endpoints: [
    {
      path: "http://127.0.0.1:5000/employees/",
      method: "POST"
    },
    {
      path: "http://127.0.0.1:5000/employees/id/:id",
      method: "GET"
    },
    {
      path: "http://127.0.0.1:5000/employees/id/:id",
      method: "PUT"
    },
    {
      path: "http://127.0.0.1:5000/employees/id/:id",
      method: "DELETE"
    }
  ]
}
~~~