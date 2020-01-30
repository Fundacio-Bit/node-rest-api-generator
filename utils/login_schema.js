module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['username', 'pwd'],
  properties: {
    username: { type: 'string' },
    pwd: { type: 'string' }
  },
  additionalProperties: false
}
