'use strict'

const EventEmitter = require('events')

class Emitterator extends EventEmitter {
  constructor (values, options) {
    super()

    const ctx = { canceled: false }
    const iterator = iterate(values, ctx, this.emit.bind(this), options)
    iterator.ctx = ctx

    this._iterator = iterator
  }

  // This is the best we can do - there's no async iterator cancel
  cancel () {
    this._iterator.ctx.canceled = true
    return this._iterator
  }
}

async function iterate (values, ctx, emit, options) {
  options = options || {}
  options.eventName = options.eventName || 'value'
  options.transformValue = options.transformValue || null

  try {
    for await (let value of values) {
      value = options.transformValue
        ? await options.transformValue(value)
        : value

      emit(options.eventName, value)
      if (ctx.canceled) break
    }
  } catch (err) {
    emit('error', err)
  }

  emit('end')
}

module.exports = Emitterator
