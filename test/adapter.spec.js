import sinon from 'sinon'
import adapter from '../lib/adapter'

/**
 * create mocks
 */
let wrapCommand = sinon.spy()
let runHook = sinon.spy()
let runInFiberContextMock = sinon.spy()
let browser = sinon.spy()
let expectationResultHandlerMock = sinon.spy()
let addExpectationResult = sinon.spy()

/**
 * Jasmine mocks
 */
let ReporterMock = sinon.spy()
let getFailedCount = ReporterMock.prototype.getFailedCount = sinon.stub().returns(1234)
let JasmineMock = sinon.spy()

let addSpecFiles = JasmineMock.prototype.addSpecFiles = sinon.stub()
let addReporter = JasmineMock.prototype.addReporter = sinon.stub()
let execute = JasmineMock.prototype.execute = sinon.stub()
let onComplete = JasmineMock.prototype.onComplete = (cb) => { cb() }
let jasmine = JasmineMock.prototype.jasmine = {
    getEnv: () => {
        return { specFilter: sinon.stub() }
    }
}

describe('jasmine adapter', () => {
    before(() => {
        adapter.__Rewire__('Jasmine', JasmineMock)
        adapter.__Rewire__('JasmineReporter', ReporterMock)
        adapter.__Rewire__('runHook', runHook)
        adapter.__Rewire__('wrapCommand', wrapCommand)
        adapter.__Rewire__('runInFiberContext', runInFiberContextMock)
    })

    describe('overwrites expectationResultHandler', () => {
        it('should execute expectationResultHandler of jasmineOpts', () => {
            let handler = adapter.expectationResultHandler({
                expectationResultHandler: expectationResultHandlerMock
            }, addExpectationResult)
            handler(true, { foo: 'bar' })
            expectationResultHandlerMock.calledWithMatch(true, { foo: 'bar' }).should.be.true()
            addExpectationResult.calledWithMatch(true, { foo: 'bar' }).should.be.true()
        })

        it('should propagate expectationResultHandler error if actual assertion passed', () => {
            let expectationResultHandlerMock = sinon.stub().throws(new Error('uups'))
            let handler = adapter.expectationResultHandler({
                expectationResultHandler: expectationResultHandlerMock
            }, addExpectationResult)
            handler(true, { foo: 'bar' })
            addExpectationResult.calledWithMatch(false, { message: 'expectationResultHandlerError: uups' }).should.be.true()
        })
    })

    describe('runs jasmine tests', () => {
        it('should return right amount of errors', () => {
            let promise = adapter.run(0, {
                jasmineNodeOpts: {
                    defaultTimeoutInterval: 434343
                }
            }).then((failures) => {
                failures.should.be.exactly(1234)
            })
            process.nextTick(() => onComplete())
            return promise
        })

        it('should set default timeout from jasmineOpts', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL.should.be.exactly(434343)
        })

        it('should run hooks and wrap commands', () => {
            wrapCommand.called.should.be.true()
            runHook.called.should.be.true()
        })
    })

})
