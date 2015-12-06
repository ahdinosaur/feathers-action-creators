module.exports = createAsyncActionCreators

/* Given a resource name and a config,
 * returns asynchronous flux action creators
 * corresponding to that feathers resource.
 *
 * @param string service
 * @param object syncActionCreators
 * @param object config
 * @return object asyncActionCreators
 */
function createAsyncActionCreators (service, syncActionCreators, config) {
  if (service == null) throw new Error('createAsyncActionCreators: Expected service')
  if (syncActionCreators == null) throw new Error('createAyncActionCreators: Expected syncActionCreators')

  config = config || {}

  return {
    //find: (params) => {
    find: createAsyncActionCreator(service, 'find'),
    //get: (id, params) => {},
    get: createAsyncActionCreator(service, 'get'),
    //create: (data, params) => {},
    create: createAsyncActionCreator(service, 'create'),
    //update: (id, data, params) => {},
    update: createAsyncActionCreator(service, 'update'),
    //patch: (id, data, params) => {},
    patch: createAsyncActionCreator(service, 'patch'),
    //remove: (id, params) => {}
    remove: createAsyncActionCreator(service, 'remove')
  }

  function createAsyncActionCreator (service, methodName) {
      return function () {
        const args = slice(arguments)

        return (dispatch) => {
          const startCreator = syncActionCreators[`${methodName}Start`]
          // TODO don't use apply for performance reasons
          const startAction = startCreator.apply(syncActionCreators, args)

          dispatch(startAction)

          // TODO don't use apply for performance reasons
          return service[methodName].apply(service, args)
            .then(body => {
              const successCreator = syncActionCreators[`${methodName}Success`]
              const successAction = successCreator(body, startAction.payload)
              dispatch(successAction)
              return successAction
            })
            .catch(error => {
              const errorCreator = syncActionCreators[`${methodName}Error`]
              const errorAction = errorCreator(error, startAction.payload)
              dispatch(errorAction)
              return errorAction
            })
        }
      }
  }
}

function slice () {
  return Array.prototype.slice.call(arguments[0])
}
