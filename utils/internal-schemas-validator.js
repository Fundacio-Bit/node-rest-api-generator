'use strict'

const Ajv = require('ajv')

const ajv = new Ajv({ allErrors: true })

const validatePropsWithInternalSchemas = (authProps, resourcesProps, serverProps) => {

  const getErrorMessage = (propsString, validateErrors) => {
    return `\nError detected validating ${propsString}:\n${JSON.stringify(validateErrors, null, 2)}`
  }

  // Validating auth props
  // ----------------------
  const authPropsSchema = {
    type: 'object',
    required: ['enable_auth', 'secret_key', 'users_data_source'],
    properties: {
      enable_auth: { type: 'boolean' },
      secret_key: { type: 'string' },
      users_data_source: {
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

}

module.exports = validatePropsWithInternalSchemas
