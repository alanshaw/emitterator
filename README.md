# emitterator

> Async iterator to event emitter

## Install

```sh
npm i emitterator
```

## Usage

```js
const Emitterator = require('emitterator')

const emitter = new Emitterator(asyncIterator(), {
  // custom emitted event name
  eventName: 'value',
  // optionally transform the value after the iterator yields it
  transformValue: async v => asyncOperation(v)
})

// emitted for every value in the iterator
emitter.on('value', v => console.log('got value', v))

// emitted only once if the iterator throws
emitter.on('error', err => console.error('error in iterator', err))

// always emitted on end, even after error or cancel
emitter.on('end', () => console.log('iterator finished'))

// cancel the iteration AFTER the next value is emitted
emitter.cancel() // returns a promise so can be awaited
```

## API

### `new Emitterator(iterator, [options])`

Create a new event emitter for the passed async iterator.

For example `iterator` might be something like:

```js
async function * count () {
  let n = 0

  while (true) {
    // Sleep for a bit
    await new Promise((resolve, reject) => setTimeout(resolve, 100)
    yield n
    n++
  }
}

// create a new emitter to emit values from the `count` iterator
const emitter = new Emitterator(count())

emitter.on('value', console.log) // logs 0, 1, 2, 3 ...
```

`options` is an optional object that may contain the following properties:

* `eventName` (string) A custom name for the event emitted when the iterator yields a value
* `transformValue` (function) A (async) function that can be used to transform the value yielded by the iterator before it is emitted

### `emitter.cancel(): Promise`

Cancel the iteration after the next value is yielded from the iterator. After calling cancel, the emitter _may_ emit one more `value` event followed by an `end` event.

Returns a `Promise` to allow you to `await` for cancel to complete.

### Events

#### `value`

Emitted when the iterator yields a value. If `eventName` is passed in options then this will be the name of this event instead.

#### `error`

Emitted if the iterator throws an error. This is not recoverable so iteration will stop. After the `error` event is emitted the `end` event will be emitted.

#### `end`

Emitted when there are no more values in the iterator (may never be called if the iterator is infinite). It is also emitted after an `error` event is emitted or if `emitter.cancel()` is called.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/emitterator/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
