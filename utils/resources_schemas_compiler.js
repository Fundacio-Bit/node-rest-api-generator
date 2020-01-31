'use strict'

const fs = require('fs')
const Ajv = require('ajv')
const path = require('path')

// -----------------------------------------------------------------------------
// Function to read and compile the JSON schema files of resources.
//
// Result:
//  Adds two new fields to each resource object: 'parsedSchema' and 'validate'.
// -----------------------------------------------------------------------------
const compileResourcesSchemas = (schemasFilesDir, resourcesProps) => {
  const ajv = new Ajv({ allErrors: true })

  resourcesProps.forEach(resource => {
    if (resource.resource === 'login') {
      throw Error(`'login' is a reserved word and can't be used in 'resource_props.js'.`)
    }

    let content
    let schemaPath

    try {
      schemaPath = path.join(schemasFilesDir, 'config', 'resources-schemas', resource.schema)
      content = fs.readFileSync(schemaPath, 'utf8')
    } catch(error) {
      throw Error(`Schema file not found: ${schemaPath}`)
    }

    try {
      resource.parsedSchema = JSON.parse(content)
    } catch(error) {
      throw Error(`Invalid format of JSON schema: ${resource.schema}`)
    }

    try {
      const validate = ajv.compile(resource.parsedSchema)
      resource.validate = validate
    } catch(error) {
      throw Error(`Problem detected compiling the schema: ${resource.schema}`)
    }
  })
}

module.exports = compileResourcesSchemas
