# node-rest-api-generator #

A generator of RESTful API's based on JSON schema validation, MongoDB and JWT auth.

## Installation

~~~
npm install
~~~

## Configuration

### 1. Configure the file *config/resource_props.js*
~~~javascript
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
~~~

### 2. Configure the file *config/auth_props.js*
~~~javascript
module.exports = {

  enable_auth: true,  // Enable/Disable auth for the REST API

  secret_key: '<your secret key>',  // to sign JWT

  users_datasource: {
    mongodb_uri: process.env.DEVELOPMENT_LOCAL_ENV ? 'mongodb://127.0.0.1:27017' : 'mongodb://<IP production>:27017',
    mongodb_database: 'mytest_db',
    mongodb_collection: 'users_col'
  }

}
~~~

### 3. Configure the file *config/server_props.js*
~~~javascript
module.exports = {

  isProduction: !process.env.DEVELOPMENT_LOCAL_ENV ? true : false,
  server_port: 5000,
  server_ip: process.env.DEVELOPMENT_LOCAL_ENV ? '127.0.0.1' : '<IP production>'

}
~~~

### 4. Store JSON Schemas of resources in the folder *config/resources-schemas/* in JSON format
~~~json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["supplier_id", "name", "location_info", "contact_info"],
  "properties": {
    "supplier_id": { "type": "string" },
    "name": { "type": "string" },
    "location_info": {
      "type": "object",
      "required": ["address", "postal_code", "city", "country"],
      "properties": {
        "address": { "type": "string" },
        "postal_code": { "type": "string" },
        "city": { "type": "string" },
        "country": { "type": "string" }
      },
      "additionalProperties": false
    },
    "contact_info": {
      "type": "object",
      "required": ["email", "phone_number", "website"],
      "properties": {
        "email": { "type": "string", "format": "email" },
        "phone_number": { "type": "string" },
        "website": { "type": "string", "format": "uri" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
~~~

## Usage

~~~
npm start
~~~
