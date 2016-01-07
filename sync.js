const invariant = require('invariant')
const createAction = require('redux-actions').createAction
const createActionTypes = require('feathers-action-types')
const isArray = Array.isArray

const constants = require('./constants')

module.exports = createSyncActionCreators

/* Given a resource name and a config,
 * returns synchronous flux action creators
 * corresponding to that feathers resource.
 *
 * @param string serviceName
 * @param object config
 * @param string config.key
 * @param object config.metaCreators
 * @return object syncActionCreators
 */
function createSyncActionCreators (serviceName, config) {
  if (serviceName == null) {
    throw new Error('feathers-action-creators/sync: Expected serviceName as first argument.')
  }

  config = config || {}
  const metaCreators = config.metaCreators || {}
  const key = config.key || constants.DEFAULT_KEY

  const actionTypes = createActionTypes(serviceName)

  return {
    findStart: createAction(
      actionTypes.findStart,
      (cid, params) => ({ cid, params }),
      metaCreators.findStart
    ),

    findSuccess: createAction(
      actionTypes.findSuccess,
      manyEntitiesHandler('findSuccess'),
      metaCreators.findSuccess
    ),

    findError: createAction(
      actionTypes.findError,
      errorHandler('findError'),
      metaCreators.findError
    ),

    getStart: createAction(
      actionTypes.getStart,
      (cid, id, params) => ({ cid, id, params }),
      metaCreators.getStart
    ),

    getSuccess: createAction(
      actionTypes.getSuccess,
      oneEntityHandler('getSuccess'),
      metaCreators.getSuccess
    ),

    getError: createAction(
      actionTypes.getError,
      errorHandler('getError'),
      metaCreators.getError
    ),

    createStart: createAction(
      actionTypes.createStart,
      (cid, data, params) => ({ cid, data, params }),
      metaCreators.createStart
    ),

    createSuccess: createAction(
      actionTypes.createSuccess,
      oneEntityHandler('createSuccess'),
      metaCreators.createSuccess
    ),

    createError: createAction(
      actionTypes.createError,
      errorHandler('createError'),
      metaCreators.createError
    ),

    updateStart: createAction(
      actionTypes.updateStart,
      (cid, id, data, params) => ({ cid, id, data, params }),
      metaCreators.updateStart
    ),

    updateSuccess: createAction(
      actionTypes.updateSuccess,
      oneEntityHandler('updateSuccess'),
      actionTypes.updateSuccess
    ),

    updateError: createAction(
      actionTypes.updateError,
      errorHandler('updateError'),
      metaCreators.updateError
    ),

    patchStart: createAction(
      actionTypes.patchStart,
      (cid, id, data, params) => ({ cid, id, data, params }),
      metaCreators.patchStart
    ),

    patchSuccess: createAction(
      actionTypes.patchSuccess,
      oneEntityHandler('patchSuccess'),
      metaCreators.patchSuccess
    ),

    patchError: createAction(
      actionTypes.patchError,
      errorHandler('patchError'),
      metaCreators.patchError
    ),

    removeStart: createAction(
      actionTypes.removeStart,
      (cid, id, params) => ({ cid, id, params }),
      metaCreators.removeStart
    ),

    removeSuccess: createAction(
      actionTypes.removeSuccess,
      oneEntityHandler('removeSuccess'),
      metaCreators.removeSuccess
    ),

    removeError: createAction(
      actionTypes.removeError,
      errorHandler('removeError'),
      metaCreators.removeError
    )
  }

  function oneEntityHandler (actionCreatorName) {
    return function (body, startPayload) {
      assertOneEntity(actionCreatorName, body)
      return Object.assign({ body }, startPayload)
    }
  }

  function manyEntitiesHandler (actionCreatorName) {
    return function (body, startPayload) {
      assertManyEntities(actionCreatorName, body)
      return Object.assign({ body }, startPayload)
    }
  }

  function errorHandler (actionCreatorName) {
    return function (error, startPayload) {
      assertError(actionCreatorName, error)
      return Object.assign(error, startPayload)
    }
  }

  function assertError (actionCreatorName, error) {
    invariant(error != null, `Expected error in ${actionCreatorName}`)
  }

  function assertBody (actionCreatorName, body) {
    invariant(body != null, `Expected body in ${actionCreatorName}`)
  }

  function assertOneEntity (actionCreatorName, body) {
    assertBody(actionCreatorName, body)
    invariant(typeof body === 'object', `Expected one entity in ${actionCreatorName})`)
    invariant(body[key] != null, `Expected entity.${key} in ${actionCreatorName}`)
  }

  function assertManyEntities (actionCreatorName, body) {
    assertBody(actionCreatorName, body)
    invariant(isArray(body), `Expected many entities in ${actionCreatorName}`)
    body.forEach(function (entity) {
      assertOneEntity(actionCreatorName, entity)
    })
  }
}
