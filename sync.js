const invariant = require('invariant')
const createActionCreator = require('redux-actions')
const createActionTypes = require('feathers-action-types')
const isArray = Array.isArray

const constants = require('./constants')

/* Given a resource name and a config,
 * returns synchronous flux action creators
 * corresponding to that feathers resource.
 *
 * @param string resourceName
 * @param object config
 * @return object syncActionCreators
 */
function createSyncActionCreators (resourceName, config) {
  if (resourceName == null) throw new Error('createSyncActionCreators: Expected resourceName')

  config = config || {}

  const actionTypes = createActionTypes(resourceName)
  const key = config.key || constants.DEFAULT_KEY

  return {
    findStart: createActionCreator(
      actionTypes.fetchStart,
      (params) => ({ params }),
      (params, meta) => meta
    ),

    findSuccess: createActionCreator(
      actionTypes.findSuccess,
      manyEntitiesHandler('findSuccess'),
      (data, meta) => meta
    ),

    findError: createActionCreator(
      actionTypes.findError,
      errorHandler('findError'),
      (err, meta) => meta
    ),

    getStart: createActionCreator(
      actionTypes.getStart,
      (id, params) => ({ id, params }),
      (id, params, meta) => meta
    ),

    getSuccess: createActionCreator(
      actionTypes.getSuccess,
      oneEntityHandler('getSuccess'),
      (data, meta) => meta
    ),

    getError: createActionCreator(
      actionTypes.getError,
      errorHandler('getError'),
      (err, meta) => meta
    ),

    createStart: createActionCreator(
      actionTypes.createStart,
      (data, params) => ({ data, params }),
      (data, params, meta) => meta
    ),

    createSuccess: createActionCreator(
      actionTypes.createSuccess,
      oneEntityHandler('createSuccess'),
      (data, meta) => meta
    ),

    createError: createActionCreator(
      actionTypes.createError,
      errorHandler('createError'),
      (err, meta) => meta
    ),

    updateStart: createActionCreator(
      actionTypes.updateStart,
      (id, data, params) => ({ id, data, params }),
      (id, data, params, meta) => meta
    ),

    updateSuccess: createActionCreator(
      actionTypes.updateSuccess,
      oneEntityHandler('updateSuccess'),
      (data, meta) => meta
    ),

    updateError: createActionCreator(
      actionTypes.updateError,
      errorHandler('updateError'),
      (err, meta) => meta
    ),

    patchStart: createActionCreator(
      actionTypes.patchStart,
      (id, data, params) => ({ id, data, params }),
      (id, data, params, meta) => meta
    ),

    patchSuccess: createActionCreator(
      actionTypes.patchSuccess,
      oneEntityHandler('patchSuccess'),
      (data, meta) => meta
    ),

    patchError: createActionCreator(
      actionTypes.patchError,
      errorHandler('patchError'),
      (err, meta) => meta
    ),

    removeStart: createActionCreator(
      actionTypes.removeStart,
      (id, params) => ({ id, params }),
      (id, params, meta) => meta
    ),

    removeSuccess: createActionCreator(
      actionTypes.removeSuccess,
      oneEntityHandler('removeSuccess'),
      (data, meta) => meta
    ),

    removeError: createActionCreator(
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
    assertError(actionCreatorName, error)
    return error
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
