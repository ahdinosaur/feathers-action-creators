const createSyncActionCreators = require('./sync')
const createAsyncActionCreators = require('./async')

/* Given a resource name and a config,
 * returns flux action creators
 * corresponding to that feathers resource.
 *
 * @param string service
 * @param object config
 * @return object actionCreators
 */
function createActionCreators (service, config) {
  if (service == null) {
    throw new Error('createActionCreators: Expected service')
  }

  const syncActionCreators = createSyncActionCreators(
    service.name, config
  )
  const asyncActionCreators = createAsyncActionCreators(
    service, syncActionCreators, config
  )

  return Object.assign({}, syncActionCreators, asyncActionCreators)
}

module.exports = createActionCreators
