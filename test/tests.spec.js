import path from 'path'
import { JasmineAdapter } from '../lib/adapter'

const syncSpecs = [path.join(__dirname, '/fixtures/tests.sync.spec.js')]
const asyncSpecs = [path.join(__dirname, '/fixtures/tests.async.spec.js')]
const asyncPromiseSpecs = [path.join(__dirname, '/fixtures/tests.async.promise.spec.js')]
const asyncFailureSpecs = [path.join(__dirname, '/fixtures/tests.async.failures.spec.js')]
const syncAsyncSpecs = [path.join(__dirname, '/fixtures/tests.sync.async.spec.js')]
const fdescribeSpecs = [path.join(__dirname, '/fixtures/tests.fdescribe.spec.js')]
const fitSpecs = [path.join(__dirname, '/fixtures/tests.fit.spec.js')]
const xitSpecs = [path.join(__dirname, '/fixtures/tests.xit.spec.js')]
const xdescribeSpecs = [path.join(__dirname, '/fixtures/tests.xdescribe.spec.js')]
const NOOP = () => {}

const WebdriverIO = class {}
WebdriverIO.prototype = {
    pause: (ms = 500) => new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    }),
    command: (ms = 500) => new Promise((resolve) => {
        setTimeout(() => resolve('foo'), ms)
    }),
    getPrototype: () => WebdriverIO.prototype
}

process.send = NOOP

describe('JasmineAdapter', () => {
    describe('executes specs syncronous', () => {
        before(async () => {
            global.browser = new WebdriverIO()
            global.browser.options = {}
            const adapter = new JasmineAdapter(0, {}, syncSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })

        it('should run async commands in beforeEach blocks', () => {
            global._____wdio.beforeEach.should.be.greaterThan(499)
        })

        it('should run async commands in beforeAll blocks', () => {
            global._____wdio.beforeAll.should.be.greaterThan(499)
        })

        it('should run async commands in it blocks', () => {
            global._____wdio.it.should.be.greaterThan(499)
        })

        it('should run async commands in nested it blocks', () => {
            global._____wdio.nestedit.should.be.greaterThan(499)
        })

        it('should run async commands in afterAll blocks', () => {
            global._____wdio.afterAll.should.be.greaterThan(499)
        })

        it('should run async commands in afterEach blocks', () => {
            global._____wdio.afterEach.should.be.greaterThan(499)
        })

        it('should respect promises in tests', () => {
            global._____wdio.promise.should.be.greaterThan(499)
        })

        it('should respect promises in hook', () => {
            global._____wdio.promisehook.should.be.greaterThan(499)
        })
    })

    describe('executes specs asynchronous', () => {
        before(async () => {
            global.browser = new WebdriverIO()
            global.browser.options = { sync: false }
            const adapter = new JasmineAdapter(0, {}, asyncSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })

        it('should run async commands in beforeEach blocks', () => {
            global.______wdio.beforeEach.should.be.greaterThan(499)
        })

        it('should run async commands in beforeAll blocks', () => {
            global.______wdio.beforeAll.should.be.greaterThan(499)
        })

        it('should run async commands in it blocks', () => {
            global.______wdio.it.should.be.greaterThan(499)
        })

        it('should run async commands in nested it blocks', () => {
            global.______wdio.nestedit.should.be.greaterThan(499)
        })

        it('should run async commands in afterAll blocks', () => {
            global.______wdio.afterAll.should.be.greaterThan(499)
        })

        it('should run async commands in afterEach blocks', () => {
            global.______wdio.afterEach.should.be.greaterThan(499)
        })
    })

    describe('executes specs asynchronous promise resolution', () => {
        before(async () => {
            global.browser = new WebdriverIO()
            global.browser.options = { sync: false }
            const adapter = new JasmineAdapter(0, {}, asyncPromiseSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })

        it('should run async commands in it blocks', () => {
            global.______wdio.it.should.be.greaterThan(499)
        })
    })

    describe('executes specs asynchronous with failures', () => {
        it('should capture failures', async () => {
            global.browser = new WebdriverIO()
            global.browser.options = { sync: false }
            const adapter = new JasmineAdapter(0, {}, asyncFailureSpecs, {})
            const result = await adapter.run()
            result.should.be.equal(2, 'both tests should fail')
            adapter.reporter.getFailedCount().should.be.equal(2, 'both tests should fail')
        })
    })

    describe('should support fit blocks', () => {
        before(async () => {
            global.browser = new WebdriverIO()
            global.browser.options = {}
            const adapter = new JasmineAdapter(0, {}, fitSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })

        it('should not run it block', () => {
            (typeof global.fitwdio.it).should.be.equal('undefined')
        })

        it('should run forced it block', () => {
            global.fitwdio.fit.should.be.greaterThan(499)
        })
    })

    describe('should support xit blocks', () => {
        it('should not fail as all test blocks are marked as pending', async () => {
            global.browser = new WebdriverIO()
            global.browser.options = { }
            const adapter = new JasmineAdapter(0, {}, xitSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })
    })

    describe('should support xdescribe blocks', () => {
        it('should not fail as all suite blocks are marked as pending', async () => {
            global.browser = new WebdriverIO()
            global.browser.options = { }
            const adapter = new JasmineAdapter(0, {}, xdescribeSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })
    })

    describe('should support fdescribe blocks', () => {
        before(async () => {
            global.browser = new WebdriverIO()
            global.browser.options = {}
            const adapter = new JasmineAdapter(0, {}, fdescribeSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })

        it('should not run describe block', () => {
            (typeof global.fdescribewdio.it).should.be.equal('undefined')
        })

        it('should run forced describe block', () => {
            global.fdescribewdio.fit.should.be.greaterThan(499)
        })
    })

    describe('executes specs synchronous and asynchronous', () => {
        before(async () => {
            global.browser = new WebdriverIO()
            global.browser.options = {}
            const adapter = new JasmineAdapter(0, {}, syncAsyncSpecs, {});
            (await adapter.run()).should.be.equal(0, 'actual test failed')
        })

        it('should run sync commands in beforeEach blocks', () => {
            global._______wdio.beforeEachSync.should.be.greaterThan(499)
            global._______wdio.beforeEachAsync.should.be.greaterThan(499)
        })

        it('should run sync commands in before blocks', () => {
            global._______wdio.beforeSync.should.be.greaterThan(499)
            global._______wdio.beforeAsync.should.be.greaterThan(499)
        })

        it('should run sync commands in it blocks', () => {
            global._______wdio.itSync.should.be.greaterThan(499)
            global._______wdio.itAsync.should.be.greaterThan(499)
        })

        it('should run sync commands in after blocks', () => {
            global._______wdio.afterSync.should.be.greaterThan(499)
            global._______wdio.afterAsync.should.be.greaterThan(499)
        })

        it('should run sync commands in afterEach blocks', () => {
            global._______wdio.afterEachSync.should.be.greaterThan(499)
            global._______wdio.afterEachAsync.should.be.greaterThan(499)
        })
    })
})
