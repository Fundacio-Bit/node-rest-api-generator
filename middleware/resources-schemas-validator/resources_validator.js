'use strict'

const validateResources = (req, res, next, resourcesProps) => {

  const isInArray = (array, value) => array.indexOf(value) !== -1

  // Check HTTP method
  // ------------------
  if (!isInArray(['POST', 'PUT', 'PATCH'], req.method)) {
    return next()
  }

  // Check path format
  // ------------------
  let re_path = /^\/([^/]*)/.exec(req.path)
  if (!re_path) {
    return res.status(400).json({ error: `Invalid path format: '${req.path}'` })
  }

  let resource = re_path[1]

  // Check resource
  // ---------------
  let resources = resourcesProps.map(x => x.resource)
  if (!isInArray(resources, resource)) {
    return res.status(400).json({ error: `Unknown resource: '${resource}'. Available resources: ${resources.join(', ')}` })
  }

  // Validate req.body
  // ------------------
  let validate = resourcesProps.filter(x => x.resource === resource)[0].validate
  if (!validate(req.body)) {
    return res.status(400).json({ error: `ERROR: Invalid body format:\n${JSON.stringify(validate.errors, null, 2)}` })
  } else {
    return next()
  }

}

module.exports = validateResources
