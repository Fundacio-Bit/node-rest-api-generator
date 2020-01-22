const generateRestApiDoc = (urlBase, resources) => {

  return resources.map(res => {
    if (res === 'login') {
      return {
        resource: res,
        endpoints: [
          { path: `${urlBase}/login`, method: 'POST' },
        ],
        schema: ''
      }
    } else {
      return {
        resource: res,
        endpoints: [
          { path: `${urlBase}/${res}`, method: 'GET' },
          { path: `${urlBase}/${res}/_id/:_id`, method: 'GET' },
          { path: `${urlBase}/${res}`, method: 'POST' },
          { path: `${urlBase}/${res}/_id/:_id`, method: 'PATCH' },
          { path: `${urlBase}/${res}/_id/:_id`, method: 'DELETE' }
        ],
        schema: ''
      }
    }
  })

}

module.exports = generateRestApiDoc
