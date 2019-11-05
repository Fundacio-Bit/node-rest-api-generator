# node-rest-api-generator #

A generator of RESTful API's with schema validation.

## Installation

~~~
npm install
~~~

## Usage

~~~
npm start
~~~

Once the server is running, you can access the REST API endpoints on http://<server_ip>:<server_port>/endpoint_base_path .
If you set *enable_auth: true* in the *props.js* file, then first you have to authenticate to the REST
through the login endpoint http://<server_ip>:<server_port>/login .
