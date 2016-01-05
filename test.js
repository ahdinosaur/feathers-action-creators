const test = require('tape')
const feathers = require('feathers')
const memory = require('feathers-memory')
const redux = require('redux')
const thunk = require('redux-thunk')

const createActions = require('./')

test('integrates redux and feathers', function (t) {
  const service = createTestService()

  const store = createTestStore(function (state, action) {
    t.pass()
    return state
  })

  const actions = createActions(service)

  store.dispatch(actions.find())
  .then(function (action) {
    t.notOk(action.error)
    t.deepEqual(action.payload.body, [])
  })

  store.dispatch(actions.get(0))
  .then(function (action) {
    // t.ok(action.error)
    t.ok(action.payload instanceof Error)
  })

  store.dispatch(
    actions.create({ name: 'tree' })
  )
  .then(function (action) {
    t.notOk(action.error)
    t.deepEqual(action.payload.body, { name: 'tree', id: 0 })

    return store.dispatch(actions.get(0))
  })
  .then(function (action) {
    t.notOk(action.error)
    t.equal(action.payload.id, 0)
    t.deepEqual(action.payload.body, { name: 'tree', id: 0 })
    t.end()
  })
})

function createTestStore (reducer) {
  return redux.applyMiddleware(thunk)(redux.createStore)(reducer)
}

function createTestService () {
  const app = feathers()
    .use('/things', memory())

  const service = app.service('things')

  // TODO
  // in-memory service doesn't do this?
  // fix it
  service.name = 'things'

  return service
}
