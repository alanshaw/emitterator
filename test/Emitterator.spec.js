/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const Emitterator = require('./../src/Emitterator')
const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms || 0))

async function * generator (values, sleepMs) {
  for (let i = 0; i < values.length; i++) {
    await sleep(sleepMs)
    yield typeof values[i] === 'function' ? values[i]() : values[i]
  }
}

describe('Emitterator', () => {
  it('should emit for each value in the iterator', done => {
    const values = Array(25).fill(0).map(() => Math.random())
    const emitter = new Emitterator(generator(values))
    const emittedValues = []

    emitter.on('value', v => emittedValues.push(v))
    emitter.on('error', err => expect(err).to.not.exist())

    emitter.on('end', () => {
      expect(emittedValues).to.deep.equal(values)
      done()
    })
  })

  it('should emit an error on error', done => {
    const values = [1, 2, () => { throw new Error('BOOM!') }]
    const emitter = new Emitterator(generator(values))

    const emittedValues = []
    const emittedErrors = []

    emitter.on('value', v => emittedValues.push(v))
    emitter.on('error', err => emittedErrors.push(err))

    emitter.on('end', () => {
      expect(emittedValues).to.deep.equal([1, 2])
      expect(emittedErrors).to.have.length(1)
      expect(emittedErrors[0].message).to.equal('BOOM!')
      done()
    })
  })

  it('should emit custom event name', done => {
    const values = Array(25).fill(0).map(() => Math.random())
    const emitter = new Emitterator(generator(values), { eventName: 'test' })
    const emittedValues = []

    emitter.on('test', v => emittedValues.push(v))
    emitter.on('error', err => expect(err).to.not.exist())

    emitter.on('end', () => {
      expect(emittedValues).to.deep.equal(values)
      done()
    })
  })

  it('should transform emitted value', done => {
    const values = Array(25).fill(0).map(() => Math.random())

    const transformValue = async v => {
      await sleep()
      return v + 1
    }

    const emitter = new Emitterator(generator(values), { transformValue })
    const emittedValues = []

    emitter.on('value', v => emittedValues.push(v))
    emitter.on('error', err => expect(err).to.not.exist())

    emitter.on('end', () => {
      expect(emittedValues).to.deep.equal(values.map(v => v + 1))
      done()
    })
  })

  it('should cancel after next value', async () => {
    const values = Array(25).fill(0).map(() => Math.random())
    const emitter = new Emitterator(generator(values))

    const emittedValues = []

    emitter.on('value', v => emittedValues.push(v))
    emitter.on('error', err => expect(err).to.not.exist())

    await emitter.cancel()

    expect(emittedValues).to.deep.equal([values[0]])
  })
})
