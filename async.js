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

        return (dispatch, getState) => {
          // TODO don't use apply for performance reasons
          dispatch(
            syncActionCreators[`${methodName}Start`].apply(syncActionCreators, args)
          )

          return service[methodName].apply(service, args)
            .then(data => {
              return dispatch(syncActionCreators[`${methodName}Success`](data))
            })
            .catch(err => {
              return dispatch(syncActionCreators[`${methodName}Error`](err))
            })
        }
      }
  }
}

function slice () {
  return Array.prototype.slice.call(arguments[0])
}
