'use strict'

const isInArray = (array, value) => array.indexOf(value) !== -1

// Check allowed fields of a schema (Note: fields_to_check = Array)
// -----------------------------------------------------------------
const checkAllowedFields = (schema, fields_to_check) => {
  const allowed_fields = schema.map((x) => { return x.fieldName })

  let result = {}

  fields_to_check.forEach((field) => {
    if (!isInArray(allowed_fields, field)) {
      result = { error: `Error: Campo '${field}' no permitido.` }
    }
  })

  return result
}

// Check mandatory fields of a schema (Note: fields_to_check = Array)
// -------------------------------------------------------------------
const checkMandatoryFields = (schema, fields_to_check) => {
  const mandatory_fields = schema.filter((x) => { return x.isMandatory }).map((x) => { return x.fieldName })

  let result = {}
  mandatory_fields.forEach((man_field) => {
    if (!isInArray(fields_to_check, man_field)) {
      result = { error: `Error: El campo '${man_field}' es obligatorio.` }
    }
  })

  return result
}

// Check field types (Note: body = { field1: value1, field2: value2, ...})
// ------------------------------------------------------------------------
const checkTypes = (schema, body) => {
  const body_fields = Object.keys(body)

  let result = {}

  body_fields.forEach((body_field) => {
    let field_in_schema = schema.filter((x) => { return (x.fieldName === body_field && (x.type || x.complexType || x.arrayOfComplexType)) })

    if (field_in_schema.length > 0) {
      field_in_schema = field_in_schema[0]

      // BASIC TYPE
      // -----------
      if (field_in_schema.type) {

        let validation = {}

        if (field_in_schema.allowedValues) {
          validation = field_in_schema.type(body_field, body[body_field], field_in_schema.allowedValues)
        } else if (field_in_schema.range) {
          validation = field_in_schema.type(body_field, body[body_field], field_in_schema.range)
        } else {
          validation = field_in_schema.type(body_field, body[body_field])
        }

        if (validation.error) result = validation

      // COMPLEX TYPE
      // -------------
      } else if (field_in_schema.complexType) {  // complex types are allways objects

        if (body[body_field].constructor !== Object) {
          result = { error: `Error: El tipo complejo '${body_field}' debe ser un objeto.` }
        } else {
          let validation = validateSchema(field_in_schema.complexType, body[body_field], true) // Recursive call
          if (validation.error) result = validation
        }

      // ARRAY OF COMPLEX TYPE
      // ----------------------
      } else if (field_in_schema.arrayOfComplexType) {
        if (body[body_field].constructor !== Array) {
          result = { error: `Error: El tipo complejo '${body_field}' debe ser un array.` }
        } else {
          body[body_field].forEach((elem, index) => {
            if (elem.constructor !== Object) {
              result = { error: `Error: El tipo complejo '${body_field}[${index}]' debe ser un objeto.` }
            } else {
              let validation = validateSchema(field_in_schema.arrayOfComplexType, elem, true) // Recursive call
              if (validation.error) result = validation
            }
          })
        }
      }

    } else {
      result = { error: `Error: El campo '${body_field}' no está definido o no tiene tipo en el esquema.` }
    }
  })

  return result
}

// ======================================================================
// Validate Schema (Note: body = { field1: value1, field2: value2, ...})
// ======================================================================
const validateSchema = (schema, body, checkMandatory) => {
  let result = {}

  // // Verify schema format (doesn't work for Node 4)
  // // ---------------------
  // let error_schema_format = {}
  // schema.forEach(field => {
  //   if (field.type.name !== '_IntegerRestricted' && field.range) {
  //      error_schema_format = { error: `Error: Esquema mal formado. El campo '${field.fieldName}' no puede incluir un atributo 'range' al ser de tipo '${field.type.name}'.` }
  //   }
  //   if (field.type.name !== '_String' && field.type.name !== '_Array_Of_String' && field.allowedValues) {
  //      error_schema_format = { error: `Error: Esquema mal formado. El campo '${field.fieldName}' no puede incluir un atributo 'allowedValues' al ser de tipo '${field.type.name}'.` }
  //   }
  // })
  // if (error_schema_format.error) return error_schema_format

  result = checkAllowedFields(schema, Object.keys(body))
  if (result.error) return result

  if (checkMandatory) {
    result = checkMandatoryFields(schema, Object.keys(body))
    if (result.error) return result
  }

  result = checkTypes(schema, body)
  if (result.error) return result

  return result
}


module.exports = validateSchema
