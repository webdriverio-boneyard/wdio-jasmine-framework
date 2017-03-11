import sinon from 'sinon'
import JasmineReporter from '../lib/reporter'

/**
 * create mocks
 */
let send
let reporter

const ERROR_STACK = "Error: Expected 'WebdriverIO Testpage' to be 'foobar'.\n    at stack (/some/path/wdio-jasmine-framework/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1640:17)\n    at buildExpectationResult (/some/path/wdio-jasmine-framework/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1610:14)\n    at Spec.Env.expectationResultFactory (/some/path/wdio-jasmine-framework/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:655:18)\n    at Spec.addExpectationResult (/some/path/wdio-jasmine-framework/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:342:34)\n    at Expectation.addExpectationResult (/some/path/wdio-jasmine-framework/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:599:21)\n    at Expectation.toBe (/some/path/wdio-jasmine-framework/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1564:12)\n    at Object.<anonymous> (/some/path/DEV/b.js:7:36)\n    at /some/path/wdio-sync/build/index.js:578:26\n    at new Promise (/some/path/wdio-sync/node_modules/core-js/library/modules/es6.promise.js:191:7)\n    at Object.executeSync (/some/path/wdio-sync/build/index.js:576:12)"

describe('jasmine reporter', () => {
    describe('emits messages for certain jasmine events', () => {
        before(() => {
            reporter = new JasmineReporter({})
            send = reporter.send = sinon.stub()
            send.returns(true)
        })

        it('should emit suite:start', () => {
            reporter.suiteStarted({
                description: 'my suite',
                id: 1
            })
            send.calledWithMatch({
                event: 'suite:start',
                type: 'suite',
                uid: 'my suite1'
            }).should.be.true()
        })

        it('should emit spec:start', () => {
            reporter.specStarted({
                description: 'my test',
                id: 2
            })
            send.calledWithMatch({
                event: 'test:start',
                type: 'test',
                parent: 'my suite1',
                uid: 'my test2'
            }).should.be.true()
        })

        it('should emit spec:done with failed test', () => {
            reporter.specDone({
                status: 'failed',
                description: 'my test',
                id: 3
            })
            send.calledWithMatch({
                event: 'test:fail',
                type: 'test',
                parent: 'my suite1',
                uid: 'my test3'
            }).should.be.true()
        })

        it('should emit spec:done with passed test', () => {
            reporter.specStarted()
            reporter.specDone({
                status: 'passed',
                description: 'my test',
                id: 4
            })
            send.calledWithMatch({
                event: 'test:pass',
                type: 'test',
                parent: 'my suite1',
                uid: 'my test4'
            }).should.be.true()
        })

        it('should nest tests in suites', () => {
            reporter.suiteStarted({
                description: 'does something',
                id: 1
            })
            reporter.specStarted()
            reporter.specDone({
                status: 'failed'
            })
            send.calledWithMatch({
                parent: 'does something1'
            }).should.be.true()
        })

        it('should emit suite:end', () => {
            reporter.suiteDone()
            send.calledWithMatch({
                event: 'suite:end',
                type: 'suite',
                parent: 'my suite1'
            }).should.be.true()

            reporter.suiteDone()
            send.calledWithMatch({
                parent: null
            }).should.be.true()
        })

        it('should have right fail count at the end', () => {
            reporter.getFailedCount().should.be.exactly(2)
        })
    })

    describe('defers messaging until all events arrived', () => {
        before(() => {
            reporter = new JasmineReporter({})
            send = reporter.send = sinon.stub()
            send.returns(true)
        })

        it('should wait until all events were sent', () => {
            const start = (new Date()).getTime()

            reporter.specStarted()
            reporter.specDone({
                status: 'passed',
                description: 'my test',
                id: 4
            })

            setTimeout(() => {
                send.args[0][3]()
                send.args[1][3]()
                send.args[2][3]()
            }, 500)

            return reporter.waitUntilSettled().then(() => {
                const end = (new Date()).getTime();
                (end - start).should.be.greaterThan(500)
            })
        })
    })

    describe('cleans stack trace', () => {
        it('should clean trace', () => {
            reporter = new JasmineReporter({
                cleanStack: true
            })
            send = reporter.send = sinon.stub()
            send.returns(true)

            reporter.specStarted()
            reporter.specDone({
                status: 'failed',
                description: 'my test',
                failedExpectations: [{
                    matcherName: 'toBe',
                    message: 'Expected \'WebdriverIO Testpage\' to be \'foobar\'.',
                    stack: ERROR_STACK,
                    passed: false,
                    expected: 'foobar',
                    actual: 'WebdriverIO Testpage'
                }],
                passedExpectations: [],
                pendingReason: '',
                start: 1489229979996,
                type: 'test'
            })

            send.args[1][0].err.stack.should.be.equal("Error: Expected 'WebdriverIO Testpage' to be 'foobar'.\n    at Object.<anonymous> (/some/path/DEV/b.js:7:36)")
        })

        it('should not clean stack if disabled', () => {
            reporter = new JasmineReporter({
                cleanStack: false
            })
            send = reporter.send = sinon.stub()
            send.returns(true)

            reporter.specStarted()
            reporter.specDone({
                status: 'failed',
                description: 'my test',
                failedExpectations: [{
                    matcherName: 'toBe',
                    message: 'Expected \'WebdriverIO Testpage\' to be \'foobar\'.',
                    stack: ERROR_STACK,
                    passed: false,
                    expected: 'foobar',
                    actual: 'WebdriverIO Testpage'
                }],
                passedExpectations: [],
                pendingReason: '',
                start: 1489229979996,
                type: 'test'
            })

            send.args[1][0].err.stack.should.be.equal(ERROR_STACK)
        })
    })
})
