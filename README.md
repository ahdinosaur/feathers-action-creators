# feathers-action-creators

create [redux action creators](http://redux.js.org/docs/basics/Actions.html#action-creators) to be reduced by [feathers reducer](https://github.com/ahdinosaur/feathers-action-reducer)

## install

with [npm](https://npmjs.com):

```shell
npm install --save feathers-action-creators
```

## api

### `createActionCreators(serviceName, config)`

given the following arguments:

- `service`: a **required** [feathers service](http://feathersjs.com/docs/#toc10), probably with [`feathers-client`](https://github.com/feathersjs/feathers-client)
- `config`: an **required** `Object`
  - `config.cid`: a **required** `Function` that returns a unique client id, such `cuid`
  - `config.key`: an *optional* `String` that describes the default key (e.g. 'id')

returns an `Object` of [redux action creators](http://redux.js.org/docs/basics/Actions.html#action-creators)
