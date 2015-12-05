const invariant = require('invariant')
const { createAction } = require('redux-actions')
const createActionTypes = require('feathers-action-types')
const isArray = Array.isArray

const constants = require('./constants')

/* Given a resource name and a config,
 * returns synchronous flux action creators
 * corresponding to that feathers resource.
 *
 * @param string serviceName
 * @param object config
 * @return object syncActionCreators
 */
function createSyncActionCreators (serviceName, config) {
  if (serviceName == null) throw new Error('createSyncActionCreators: Expected serviceName')

  config = config || {}

  const actionTypes = createActionTypes(serviceName)
  const key = config.key || constants.DEFAULT_KEY

  return {
    findStart: createAction(
      actionTypes.findStart,
      (params) => ({ params }),
      (params, meta) => meta
    ),

    findSuccess: createAction(
      actionTypes.findSuccess,
      manyEntitiesHandler('findSuccess'),
      (data, meta) => meta
    ),

    findError: createAction(
      actionTypes.findError,
      errorHandler('findError'),
      (err, meta) => meta
    ),

    getStart: createAction(
      actionTypes.getStart,
      (id, params) => ({ id, params }),
      (id, params, meta) => meta
    ),

    getSuccess: createAction(
      actionTypes.getSuccess,
      oneEntityHandler('getSuccess'),
      (data, meta) => meta
    ),

    getError: createAction(
      actionTypes.getError,
      errorHandler('getError'),
      (err, meta) => meta
    ),

    createStart: createAction(
      actionTypes.createStart,
      (data, params) => ({ data, params }),
      (data, params, meta) => meta
    ),

    createSuccess: createAction(
      actionTypes.createSuccess,
      oneEntityHandler('createSuccess'),
      (data, meta) => meta
    ),

    createError: createAction(
      actionTypes.createError,
      errorHandler('createError'),
      (err, meta) => meta
    ),

    updateStart: createAction(
      actionTypes.updateStart,
      (id, data, params) => ({ id, data, params }),
      (id, data, params, meta) => meta
    ),

    updateSuccess: createAction(
      actionTypes.updateSuccess,
      oneEntityHandler('updateSuccess'),
      (data, meta) => meta
    ),

    updateError: createAction(
      actionTypes.updateError,
      errorHandler('updateError'),
      (err, meta) => meta
    ),

    patchStart: createAction(
      actionTypes.patchStart,
      (id, data, params) => ({ id, data, params }),
      (id, data, params, meta) => meta
    ),

    patchSuccess: createAction(
      actionTypes.patchSuccess,
      oneEntityHandler('patchSuccess'),
      (data, meta) => meta
    ),

    patchError: createAction(
      actionTypes.patchError,
      errorHandler('patchError'),
      (err, meta) => meta
    ),

    removeStart: createAction(
      actionTypes.removeStart,
      (id, params) => ({ id, params }),
      (id, params, meta) => meta
    ),

    removeSuccess: createAction(
      actionTypes.removeSuccess,
      oneEntityHandler('removeSuccess'),
      (data, meta) => meta
    ),

    removeError: createAction(
      actionTypes.removeError,
      errorHandler('removeError'),
      (err, meta) => meta
    ),
  }

  function oneEntityHandler (actionCreatorName) {
    return function (data) {
      assertOneEntity(actionCreatorName, data)
      return data
    }
  }

  function manyEntitiesHandler (actionCreatorName) {
    return function (data) {
      assertManyEntities(actionCreatorName, data)
      return data
    }
  }

  function errorHandler (actionCreatorName) {
    return function (err) {
      assertError(actionCreatorName, error)
      return error
    }
  }

  function assertError(actionCreatorName, error) {
    invariant(error != null, `Expected error in ${actionCreatorName}`);
  }

  function assertData (actionCreatorName, data) {
    invariant(data != null, `Expected data in ${actionCreatorName}`)
  }

  function assertOneEntity(actionCreatorName, data) {
    assertData(actionCreatorName, data)
    invariant(typeof data === 'object', `Expected one entity in ${actionCreatorName})`)
    invariant(data[key] != null, `Expected entity.${key} in ${actionCreatorName}`)
  }

  function assertManyEntities (actionCreatorName, data) {
    assertData(actionCreatorName, data)
    invariant(isArray(data), `Expected many entities in ${actionCreatorName}`)
    data.forEach(function (entity) {
      assertOneEntity(actionCreatorName, entity)
    })
  }
}

module.exports = createSyncActionCreators
