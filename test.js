const test = require('tape')
const feathers = require('feathers')
const memory = require('feathers-memory')
const { createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk')

const createActions = require('./')

test('integrates redux and feathers', function (t) {
  const service = createTestService()

  const store = createTestStore(function (state, action) {
    console.log("state", state)
    console.log("action", action)
    t.pass()
  })

  const actions = createActions(service)

  store.dispatch(actions.find())
})

function createTestStore (reducer) {
  return applyMiddleware(thunk)(createStore)(reducer)
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
