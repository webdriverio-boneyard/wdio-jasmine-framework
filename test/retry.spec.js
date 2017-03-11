import path from 'path'
import { JasmineAdapter } from '../lib/adapter'

const syncSpecs = [path.join(__dirname, '/fixtures/tests.retry.sync.spec.js')]
const asyncSpecs = [path.join(__dirname, '/fixtures/tests.retry.async.spec.js')]
const NOOP = () => {}

const WebdriverIO = class {}
WebdriverIO.prototype = {
    pause: (ms = 500) => new Promise((resolve) => setTimeout(() => resolve(), ms)),
    command: (ms = 500) => new Promise((resolve) => setTimeout(() => resolve('foo'), ms)),
    getPrototype: () => WebdriverIO.prototype
}

const JASMINE_NODE_OPTS = {
    jasmineNodeOpts: {
        timeout: 10000
    }
}

process.send = NOOP

describe('JasmineAdapter', () => {
    it('should be able to retry flaky sync tests', async () => {
        global.browser = new WebdriverIO()
        global.browser.options = {}
        const adapter = new JasmineAdapter(0, JASMINE_NODE_OPTS, syncSpecs, {});
        (await adapter.run()).should.be.equal(0, 'actual test failed')
    })

    it('should be able to retry flaky async tests', async () => {
        global.browser = new WebdriverIO()
        global.browser.options = { sync: false }
        const adapter = new JasmineAdapter(0, JASMINE_NODE_OPTS, asyncSpecs, {});
        (await adapter.run()).should.be.equal(0, 'actual test failed')
    })
})
