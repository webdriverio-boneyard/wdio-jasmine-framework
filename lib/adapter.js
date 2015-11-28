import JasmineReporter from './reporter'
import Jasmine from 'jasmine'
import { runInFiberContext, wrapCommands, executeHooksWithArgs } from 'wdio-sync'

const INTERFACES = {
    bdd: ['beforeAll', 'beforeEach', 'it', 'afterEach', 'afterAll']
}

const DEFAULT_TIMEOUT_INTERVAL = 60000

/**
 * Jasmine 2.x runner
 */
class JasmineAdapter {
    constructor (cid, config, specs = [], capabilities = {}) {
        this.cid = cid
        this.capabilities = capabilities
        this.specs = specs
        this.config = Object.assign({
            jasmineNodeOpts: {}
        }, config)
        this.jrunner = {}
        this.reporter = new JasmineReporter(this.cid, this.capabilities)
    }

    async run () {
        this.jrunner = new Jasmine()
        let jasmine = this.jrunner.jasmine

        this.jrunner.projectBaseDir = ''
        this.jrunner.specDir = ''
        this.jrunner.addSpecFiles(this.specs)

        jasmine.DEFAULT_TIMEOUT_INTERVAL = this.getDefaultInterval()
        this.jrunner.addReporter(this.reporter)

        /**
         * Filter specs to run based on jasmineNodeOpts.grep and jasmineNodeOpts.invert
         */
        jasmine.getEnv().specFilter = (spec) => {
            let grepMatch = this.getGrepMatch(spec)
            let invertGrep = !!(this.jasmineNodeOpts && this.jasmineNodeOpts.invertGrep)
            if (grepMatch === invertGrep) {
                spec.pend()
            }
            return true
        }

        /**
         * enable expectHandler
         */
        jasmine.Spec.prototype.addExpectationResult = this.getExpectationResultHandler(jasmine)

        /**
         * wrap commands with wdio-sync
         */
        wrapCommands(global.browser, this.config.beforeCommand, this.config.afterCommand)
        INTERFACES['bdd'].forEach((fnName) => {
            runInFiberContext(
                INTERFACES[this.config.mochaOpts.ui][2],
                this.config.beforeHook,
                this.config.afterHook,
                fnName
            )
        })

        await executeHooksWithArgs(this.config.before, [this.capabilities, this.specs])
        let result = await new Promise((resolve) => {
            this.jrunner.execute()
            this.jrunner.onComplete(() => resolve(this.reporter.getFailedCount()))
        })
        await executeHooksWithArgs(this.config.after, [result, this.capabilities, this.specs])
        return result
    }

    getDefaultInterval () {
        if (this.jasmineNodeOpts && this.jasmineNodeOpts.defaultTimeoutInterval) {
            return this.jasmineNodeOpts.defaultTimeoutInterval
        }

        return DEFAULT_TIMEOUT_INTERVAL
    }

    getGrepMatch (spec) {
        return !this.jasmineNodeOpts || !this.jasmineNodeOpts.grep ||
               spec.getFullName().match(new RegExp(this.jasmineNodeOpts.grep)) !== null
    }

    getExpectationResultHandler (jasmine) {
        const origHandler = jasmine.Spec.prototype.addExpectationResult

        if (typeof this.jasmineNodeOpts.expectationResultHandler !== 'function') {
            return origHandler
        }

        return this.expectationResultHandler(origHandler)
    }

    expectationResultHandler (origHandler) {
        return (passed, data) => {
            try {
                this.jasmineNodeOpts.expectationResultHandler.call(passed, data)
            } catch (e) {
                /**
                 * propagate expectationResultHandler error if actual assertion passed
                 */
                if (passed) {
                    passed = false
                    data = {
                        passed: false,
                        message: 'expectationResultHandlerError: ' + e.message
                    }
                }
            }

            return origHandler.call(this, passed, data)
        }
    }
}

const _JasmineAdapter = JasmineAdapter
const adapterFactory = {}

adapterFactory.run = async function (cid, config, specs, capabilities) {
    const adapter = new _JasmineAdapter(cid, config, specs, capabilities)
    return await adapter.run()
}

export default adapterFactory
export { JasmineAdapter, adapterFactory }
