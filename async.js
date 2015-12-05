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
    find: createAsyncActionCreator(service, 'find', 1),
    //get: (id, params) => {},
    get: createAsyncActionCreator(service, 'get', 2),
    //create: (data, params) => {},
    create: createAsyncActionCreator(service, 'create', 1),
    //update: (id, data, params) => {},
    update: createAsyncActionCreator(service, 'update', 1),
    //patch: (id, data, params) => {},
    patch: createAsyncActionCreator(service, 'patch', 1),
    //remove: (id, params) => {}
    remove: createAsyncActionCreator(service, 'remove', 1)
  }

  function createAsyncActionCreator (service, methodName, numArgs) {
      return function () {
        const args = slice(arguments, 0, numArgs)
        const meta = arguments[numArgs]

        return (dispatch, getState) => {
          dispatch(syncActionCreators[`${methodName}Start`].apply(this, args.concat(meta)))

          return service[methodName].apply(service, args)
            .then(data => {
              return dispatch(syncActionCreators[`${methodName}Success`](data, meta))
            })
            .catch(err => {
              return dispatch(syncActionCreators[`${methodName}Error`](err, meta))
            })
        }
      }
  }
}

function slice () {
  return Array.prototype.slice.call(
    arguments[0], arguments[1], arguments[2]
  )
}
