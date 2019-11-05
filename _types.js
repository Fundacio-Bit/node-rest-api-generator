'use strict'

const moment = require('moment')

const isInArray = (array, value) => array.indexOf(value) !== -1

// -----------------
// Tipos Primitivos
// -----------------
const _Array = (field, value) => {
  if (value === null) return { error: `ERROR: El campo '${field}' no puede tener valor null` }
  if (value.constructor !== Array) return { error: `ERROR: El campo '${field}' debe ser de tipo Array` }
  return {}
}

const _Object = (field, value) => {
  if (value === null) return { error: `ERROR: El campo '${field}' no puede tener valor null` }
  if (value.constructor !== Object) return { error: `ERROR: El campo '${field}' debe ser de tipo Object` }
  return {}
}

// const _String = (field, value, allowedValues = false) => {
const _String = (field, value, allowedValues) => {
  if (typeof(allowedValues) === 'undefined') allowedValues = false  // for Node v4

  if (value === null) return { error: `ERROR: El campo '${field}' no puede tener valor null` }
  if (value.constructor !== String) return { error: `ERROR: El campo '${field}' debe ser de tipo String` }
  if (allowedValues) {
    if (!isInArray(allowedValues, value)) {
      return { error: `Error: El campo '${field}' tiene un valor no permitido. Valores permitidos: ${allowedValues.join(', ')}.` }
    }
  }
  return {}
}

const _Boolean = (field, value) => {
  if (value === null) return { error: `ERROR: El campo '${field}' no puede tener valor null` }
  if (value.constructor !== Boolean) return { error: `ERROR: El campo '${field}' debe ser de tipo Boolean` }
  return {}
}

const _Number = (field, value) => {
  if (value === null) return { error: `ERROR: El campo '${field}' no puede tener valor null` }
  if (value.constructor !== Number) return { error: `ERROR: El campo '${field}' debe ser de tipo Number` }
  return {}
}

// --------------
// Tipos Básicos
// --------------

const _Date = (field, value) => {
  let validation = _String(field, value)
  if (validation.error) return validation

  if (!/^\d\d\d\d\/\d\d\/\d\d$/.test(value)) {
    return { error: `ERROR: El campo '${field}' no es de formato fecha: 'YYYY/MM/DD'` }
  }

  if (!moment(value, 'YYYY/MM/DD').isValid()) {
    return { error: `ERROR: El campo '${field}' no es una fecha válida` }
  }

  return {}
}

// Valida que todos los elementos de un Array sean del tipo indicado
// ------------------------------------------------------------------
const _Array_Check_Elements_Type = (field, value, _typeFunc) => {  // aquí value se espera de tipo Array
  let result = {}
  value.forEach((elem, index) => {
    let validation = _typeFunc(`${field}[${index}]`, elem)
    if (validation.error) result = validation
  })
  return result
}

// const _Array_Of_String = (field, value, allowedValues = false) => {  // aquí value se espera de tipo Array
const _Array_Of_String = (field, value, allowedValues) => {  // aquí value se espera de tipo Array
  if (typeof(allowedValues) === 'undefined') allowedValues = false  // for Node v4

  let validation = _Array(field, value)
  if (validation.error) return validation

  validation = _Array_Check_Elements_Type(field, value, _String)
  if (validation.error) return validation

  if (allowedValues) {
    let result = {}
    value.forEach((elem, index) => {
      validation = _String(`${field}[${index}]`, elem, allowedValues)
      if (validation.error) result = validation
    })
    return result
  }

  return {}
}

const _IntegerRestricted = (field, value, range) => {
  let validation = _Number(field, value)
  if (validation.error) return validation

  if (value.toString().includes('.')) {
    return { error: `ERROR: El campo '${field}' debe ser de tipo entero` }
  }

  if (value < range[0] || value > range[1]) {
    return { error: `ERROR: El campo '${field}' no tiene un valor en el rango permitido: [${range}]` }
  }

  return {}
}


const _Email = (field, value) => {
  let validation = _String(field, value)
  if (validation.error) return validation

  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!re.test(value)) {
    return {error: `ERROR: El campo '${field}' debe ser de tipo Email`}
  }

  return {}
}

const _IP_Address = (field, value) => {
  let validation = _String(field, value)
  if (validation.error) return validation

  let re = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/

  if (!re.test(value)) {
    return {error: `ERROR: El campo '${field}' debe ser una dirección IP válida.`}
  }

  return {}
}

const _Array_Of_IP_Address = (field, value) => {
  let validation = _Array(field, value)
  if (validation.error) return validation

  validation = _Array_Check_Elements_Type(field, value, _IP_Address)
  if (validation.error) return validation

  return {}
}

module.exports = {
  _Array: _Array,
  _Object: _Object,
  _String: _String,
  _Boolean: _Boolean,
  _Number: _Number,
  _Date: _Date,
  _Array_Of_String: _Array_Of_String,
  _IntegerRestricted: _IntegerRestricted,
  _Email: _Email,
  _IP_Address: _IP_Address,
  _Array_Of_IP_Address: _Array_Of_IP_Address
}
