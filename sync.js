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
  
  const metaCreators = config.metaCreators || {}

  const actionTypes = createActionTypes(serviceName)
  const key = config.key || constants.DEFAULT_KEY

  return {
    findStart: createAction(
      actionTypes.findStart,
      (params) => ({ params }),
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
      (id, params) => ({ id, params }),
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
      (data, params) => ({ data, params }),
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
      (id, data, params) => ({ id, data, params }),
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
      (id, data, params) => ({ id, data, params }),
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
      (id, params) => ({ id, params }),
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
