'use strict'

const generateRestApiDoc = (urlBase, resources) => {

  return resources.map(res => {
    if (res === 'login') {
      return {
        resource: res,
        endpoints: [
          { path: `${urlBase}/login`, methods: ['POST'] },
        ],
        schema: ''
      }
    } else {
      return {
        resource: res,
        endpoints: [
          { path: `${urlBase}/${res}`, methods: ['GET', 'POST'] },
          { path: `${urlBase}/${res}/:_id`, methods: ['GET', 'PUT', 'PATCH', 'DELETE'] }
        ],
        schema: ''
      }
    }
  })

}

module.exports = generateRestApiDoc
