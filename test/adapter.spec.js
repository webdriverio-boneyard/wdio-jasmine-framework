import sinon from 'sinon'
import { adapterFactory, JasmineAdapter } from '../lib/adapter'

/**
 * create mocks
 */
const NOOP = function () {}

describe('jasmine adapter unit tests', () => {
    before(() => {
        adapterFactory.__Rewire__('wrapCommands', NOOP)
        adapterFactory.__Rewire__('runInFiberContext', NOOP)
        adapterFactory.__Rewire__('executeHooksWithArgs', NOOP)
    })

    describe('factory', () => {
        let JasmineAdapterMock = sinon.spy()
        let run = JasmineAdapterMock.prototype.run = sinon.spy()

        before(() => {
            adapterFactory.__set__('_JasmineAdapter', JasmineAdapterMock)
            adapterFactory.run(1, 2, 3, 4)
        })

        it('should create an adapter instance', () => {
            JasmineAdapterMock.calledWith(1, 2, 3, 4).should.be.true()
        })

        it('should immediatelly start run sequence', () => {
            run.called.should.be.true()
        })

        after(() => {
            adapterFactory.__ResetDependency__('_JasmineAdapter')
        })
    })

    describe('adapter', () => {
        let config = { framework: 'jasmine' }
        let specs = ['fileA.js', 'fileB.js']
        let caps = { browserName: 'chrome' }
        let adapter = {}

        before(() => {
            adapterFactory.__Rewire__('DEFAULT_TIMEOUT_INTERVAL', 1234)
        })

        describe('getDefaultInterval', () => {
            it('selects default interval if nothing is set in the config', () => {
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getDefaultInterval().should.be.equal(1234)
            })

            it('selects specific interval if set', () => {
                config.jasmineNodeOpts = { defaultTimeoutInterval: 4321 }
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getDefaultInterval().should.be.equal(4321)
            })
        })

        describe('random', () => {
            it('disables random execution by default if nothing is set', () => {
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getRandomExecutionPolicy().should.be.equal(false)
            })

            it('enables random execution when set', () => {
                config.jasmineNodeOpts = {random: true}
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getRandomExecutionPolicy().should.be.equal(true)
            })
        })

        describe('getGrepMatch', () => {
            it('should return always true if nothing set', () => {
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getGrepMatch('foo').should.be.true()
            })

            it('should return true if grepMath is set and spec file matches file', () => {
                let spec = { getFullName: () => 'foo.js' }
                config.jasmineNodeOpts = { grep: 'foo' }
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getGrepMatch(spec).should.be.true()
            })

            it('should return false if grepMath is set and spec file doesn\'t match file', () => {
                let spec = { getFullName: () => 'bar.js' }
                config.jasmineNodeOpts = { grep: 'foo' }
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.getGrepMatch(spec).should.be.false()
            })
        })

        describe('getExpectationResultHandler', () => {
            it('should return default jasmine expectationResultHandler if nothing set', () => {
                adapter = new JasmineAdapter(1, config, specs, caps)
                let jasmine = { Spec: { prototype: { addExpectationResult: 1234 } } }
                adapter.getExpectationResultHandler(jasmine).should.be.equal(1234)
            })

            it('should return custom expectationResultHandler if set', () => {
                config.jasmineNodeOpts = { expectationResultHandler: NOOP }
                adapter = new JasmineAdapter(1, config, specs, caps)
                let jasmine = { Spec: { prototype: { addExpectationResult: 1234 } } }
                adapter.getExpectationResultHandler(jasmine).should.not.be.equal(1234)
            })
        })

        describe('expectationResultHandler', () => {
            let origHandler = sinon.spy()
            let customHandler = sinon.spy()
            let customFailHandler = sinon.stub().throws()

            it('should return a function', () => {
                adapter = new JasmineAdapter(1, config, specs, caps)
                adapter.expectationResultHandler().should.be.type('function')
            })

            it('calls the custom handler', () => {
                config.jasmineNodeOpts.expectationResultHandler = customHandler
                adapter = new JasmineAdapter(1, config, specs, caps)
                let handler = adapter.expectationResultHandler(origHandler)
                handler('foo', 'bar')
                customHandler.calledWithExactly('foo', 'bar').should.be.true()
                origHandler.calledWithExactly('foo', 'bar').should.be.true()
            })

            it('should fail test if custom handler throws', () => {
                config.jasmineNodeOpts.expectationResultHandler = customFailHandler
                adapter = new JasmineAdapter(1, config, specs, caps)
                let handler = adapter.expectationResultHandler(origHandler)
                handler('foo', 'bar')
                origHandler.calledWithExactly(false, {
                    passed: false,
                    message: 'expectationResultHandlerError: Error'
                }).should.be.true()
            })
        })

        after(() => {
            adapterFactory.__ResetDependency__('DEFAULT_TIMEOUT_INTERVAL')
        })
    })

    after(() => {
        adapterFactory.__ResetDependency__('wrapCommands')
        adapterFactory.__ResetDependency__('runInFiberContext')
        adapterFactory.__ResetDependency__('executeHooksWithArgs')
    })
})
