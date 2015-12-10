import sinon from 'sinon'
import JasmineReporter from '../lib/reporter'

/**
 * create mocks
 */
let send
let reporter

describe('jasmine reporter', () => {
    before(() => {
        reporter = new JasmineReporter()
        send = reporter.send = sinon.spy()
    })

    describe('emits messages for certain jasmine events', () => {
        it('should emit suite:start', () => {
            reporter.suiteStarted({
                description: 'my suite'
            })
            send.calledWithMatch({
                event: 'suite:start',
                type: 'suite'
            }).should.be.true()
        })

        it('should emit spec:start', () => {
            reporter.specStarted()
            send.calledWithMatch({
                event: 'test:start',
                type: 'test',
                parent: 'my suite'
            }).should.be.true()
        })

        it('should emit spec:done with failed test', () => {
            reporter.specDone({
                status: 'failed'
            })
            send.calledWithMatch({
                event: 'test:fail',
                type: 'test',
                parent: 'my suite'
            }).should.be.true()
        })

        it('should emit spec:done with passed test', () => {
            reporter.specStarted()
            reporter.specDone({
                status: 'passed'
            })
            send.calledWithMatch({
                event: 'test:pass',
                type: 'test',
                parent: 'my suite'
            }).should.be.true()
        })

        it('should nest tests in suites', () => {
            reporter.suiteStarted({
                description: 'does something'
            })
            reporter.specStarted()
            reporter.specDone({
                status: 'failed'
            })
            send.calledWithMatch({
                parent: 'does something'
            }).should.be.true()
        })

        it('should emit suite:end', () => {
            reporter.suiteDone()
            send.calledWithMatch({
                event: 'suite:end',
                type: 'suite',
                parent: 'my suite'
            }).should.be.true()

            reporter.suiteDone()
            send.calledWithMatch({
                parent: null
            }).should.be.true()
        })
    })

    describe('provides a fail counter', () => {
        it('should have right fail count at the end', () => {
            reporter.getFailedCount().should.be.exactly(2)
        })
    })
})
