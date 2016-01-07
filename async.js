module.exports = createAsyncActionCreators

/* Given a resource name and a config,
 * returns asynchronous flux action creators
 * corresponding to that feathers resource.
 *
 * @param string service
 * @param object config
 * @param function config.cid
 * @param object syncActionCreators
 * @return object asyncActionCreators
 */
function createAsyncActionCreators (service, config, syncActionCreators) {
  if (service == null) {
    throw new Error('feathers-action-creators-async: Expected service as first argument.')
  }
  if (config == null) {
    throw new Error('feathers-action-creators/async: Expected config as second argument.')
  }
  if (syncActionCreators == null) {
    throw new Error('feathers-action-creators/async: Expected syncActionCreators as third argument.')
  }

  config = config || {}
  const cid = config.cid
  if (cid == null) {
    throw new Error('feathers-action-creators/async: Expected config.cid. Try passing in `cuid` or a compatible interface here.')
  }

  return {
    // find: (params) => {
    find: createAsyncActionCreator(service, 'find'),
    // get: (id, params) => {},
    get: createAsyncActionCreator(service, 'get'),
    // create: (data, params) => {},
    create: createAsyncActionCreator(service, 'create'),
    // update: (id, data, params) => {},
    update: createAsyncActionCreator(service, 'update'),
    // patch: (id, data, params) => {},
    patch: createAsyncActionCreator(service, 'patch'),
    // remove: (id, params) => {}
    remove: createAsyncActionCreator(service, 'remove')
  }

  function createAsyncActionCreator (service, methodName) {
    return function () {
      const args = slice(arguments)
      const cid = config.cid()

      return (dispatch) => {
        const startCreator = syncActionCreators[`${methodName}Start`]
        const startAction = startCreator.apply(syncActionCreators, [cid].concat(args))
        dispatch(startAction)

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
