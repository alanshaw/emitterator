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

// always emitted, even after error or cancel
emitter.on('end', () => console.log('iterator finished'))

// cancel the iteration AFTER the next value is emitted
emitter.cancel() // returns a promise so can be awaited
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/emitterator/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
