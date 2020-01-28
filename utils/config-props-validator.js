'use strict'

const Ajv = require('ajv')

const ajv = new Ajv({ allErrors: true })

const validateConfigProps = (authProps, resourcesProps, serverProps) => {

  const getErrorMessage = (propsString, validateErrors) => {
    return `\nError detected validating ${propsString}:\n${JSON.stringify(validateErrors, null, 2)}`
  }

  // ----------------------
  // Validating auth props
  // ----------------------
  const authPropsSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['enable_auth', 'secret_key'],
    properties: {
      enable_auth: { type: 'boolean' },
      secret_key: { type: 'string' },
      users_datasource: {
        type: 'object',
        required: ['mongodb_uri', 'mongodb_database', 'mongodb_collection'],
        properties: {
          mongodb_uri: { type: 'string' },
          mongodb_database: { type: 'string' },
          mongodb_collection: { type: 'string' }
        },
        additionalProperties: false
      }
    },
    additionalProperties: false
  }

  let validate = ajv.compile(authPropsSchema)
  if (!validate(authProps)) throw new Error(getErrorMessage('config/authProps', validate.errors))

  // ---------------------------
  // Validating resources props
  // ---------------------------
  const resourcesPropsSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      resource_item: {
        type: 'object',
        required: ['resource', 'schema', 'mongodb_uri', 'mongodb_database', 'mongodb_collection'],
        properties: {
          resource: { type: 'string' },
          schema: { type: 'string' },
          mongodb_uri: { type: 'string' },
          mongodb_database: { type: 'string' },
          mongodb_collection: { type: 'string' }
        },
        additionalProperties: false
      }
    },
    type: 'array',
    items: { $ref: '#/definitions/resource_item' },
  }

  validate = ajv.compile(resourcesPropsSchema)
  if (!validate(resourcesProps)) throw new Error(getErrorMessage('config/resourcesProps', validate.errors))

  // ------------------------
  // Validating server props
  // ------------------------
  const serverPropsSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    required: ['server_port', 'server_ip'],
    properties: {
      server_port: { type: 'integer' },
      server_ip: { type: 'string' },
    },
    additionalProperties: false
  }

  validate = ajv.compile(serverPropsSchema)
  if (!validate(serverProps)) throw new Error(getErrorMessage('config/serverProps', validate.errors))

}

module.exports = validateConfigProps
