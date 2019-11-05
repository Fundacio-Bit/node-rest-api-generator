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
