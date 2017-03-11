import path from 'path'

import { adapterFactory, JasmineAdapter } from '../lib/adapter'
import JasmineReporter from '../lib/reporter'

const errorHandlingSpecs = [path.join(__dirname, '/fixtures/error.handling.spec.js')]
const errorHandlingPromiseSpecs = [path.join(__dirname, '/fixtures/error.handling.promise.spec.js')]
const errorHandlingAsyncSpecs = [path.join(__dirname, '/fixtures/error.handling.async.spec.js')]
const errorHandlingPromiseAsyncSpecs = [path.join(__dirname, '/fixtures/error.handling.promise.async.spec.js')]
const NOOP = () => {}

const WebdriverIO = class {}
WebdriverIO.prototype = {
    pause: (ms = 500) => new Promise((resolve) => setTimeout(() => resolve(), ms)),
    command: (ms = 500) => new Promise((resolve) => setTimeout(() => resolve('foo'), ms)),
    getPrototype: () => WebdriverIO.prototype
}

JasmineReporter.prototype.send = NOOP

describe('ignores service hook errors', () => {
    before(() => {
        adapterFactory.__Rewire__('JasmineReporter', JasmineReporter)
    })

    it('should ignore directly thrown errors (sync mode)', async () => {
        global.browser = new WebdriverIO()
        global.browser.options = {}
        const adapter = new JasmineAdapter('0a', {
            beforeSuite: () => { throw new Error('beforeSuite failed') },
            beforeHook: () => { throw new Error('beforeHook failed') },
            beforeTest: () => { throw new Error('beforeTest failed') },
            beforeCommand: () => { throw new Error('beforeCommand failed') },
            afterCommand: () => { throw new Error('beforeCommand failed') },
            afterTest: () => { throw new Error('afterTest failed') },
            afterHook: () => { throw new Error('afterHook failed') },
            afterSuite: () => { throw new Error('afterSuite failed') }
        }, errorHandlingSpecs, {});
        (await adapter.run()).should.be.equal(0, 'actual test failed')
    })

    it('should ignore rejected promises (sync mode)', async () => {
        global.browser = new WebdriverIO()
        global.browser.options = {}
        const adapter = new JasmineAdapter('0a', {
            beforeSuite: () => Promise.reject(new Error('beforeSuite failed')),
            beforeHook: () => Promise.reject(new Error('beforeHook failed')),
            beforeTest: () => Promise.reject(new Error('beforeTest failed')),
            beforeCommand: () => Promise.reject(new Error('beforeCommand failed')),
            afterCommand: () => Promise.reject(new Error('beforeCommand failed')),
            afterTest: () => Promise.reject(new Error('afterTest failed')),
            afterHook: () => Promise.reject(new Error('afterHook failed')),
            afterSuite: () => Promise.reject(new Error('afterSuite failed'))
        }, errorHandlingPromiseSpecs, {});
        (await adapter.run()).should.be.equal(0, 'actual test failed')
    })

    it('should ignore directly thrown errors (async mode)', async () => {
        global.browser = new WebdriverIO()
        global.browser.options = { sync: false }
        const adapter = new JasmineAdapter('0a', {
            beforeSuite: () => { throw new Error('beforeSuite failed') },
            beforeHook: () => { throw new Error('beforeHook failed') },
            beforeTest: () => { throw new Error('beforeTest failed') },
            beforeCommand: () => { throw new Error('beforeCommand failed') },
            afterCommand: () => { throw new Error('beforeCommand failed') },
            afterTest: () => { throw new Error('afterTest failed') },
            afterHook: () => { throw new Error('afterHook failed') },
            afterSuite: () => { throw new Error('afterSuite failed') }
        }, errorHandlingAsyncSpecs, {});
        (await adapter.run()).should.be.equal(0, 'actual test failed')
    })

    it('should ignore rejected promises (sync mode)', async () => {
        global.browser = new WebdriverIO()
        global.browser.options = { sync: false }
        const adapter = new JasmineAdapter('0a', {
            beforeSuite: () => Promise.reject(new Error('beforeSuite failed')),
            beforeHook: () => Promise.reject(new Error('beforeHook failed')),
            beforeTest: () => Promise.reject(new Error('beforeTest failed')),
            beforeCommand: () => Promise.reject(new Error('beforeCommand failed')),
            afterCommand: () => Promise.reject(new Error('beforeCommand failed')),
            afterTest: () => Promise.reject(new Error('afterTest failed')),
            afterHook: () => Promise.reject(new Error('afterHook failed')),
            afterSuite: () => Promise.reject(new Error('afterSuite failed'))
        }, errorHandlingPromiseAsyncSpecs, {});
        (await adapter.run()).should.be.equal(0, 'actual test failed')
    })
})
