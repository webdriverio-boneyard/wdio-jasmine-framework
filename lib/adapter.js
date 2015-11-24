import JasmineReporter from './reporter'
import Jasmine from 'jasmine'
import { runInFiberContext, wrapCommand, runHook } from 'wdio-sync'

const INTERFACES = {
    bdd: ['beforeAll', 'beforeEach', 'it', 'afterEach', 'afterAll']
}

const DEFAULT_TIMEOUT_INTERVAL = 60000

let adapter = {}

/**
 * Jasmine 2.x runner
 */
adapter.run = async function (cid, config, specs = [], capabilities = {}) {
    let jrunner = new Jasmine()
    let jasmine = global.jasmine
    let jasmineNodeOpts = config.jasmineNodeOpts

    jrunner.projectBaseDir = ''
    jrunner.specDir = ''
    jrunner.addSpecFiles(specs)

    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL
    if (jasmineNodeOpts && jasmineNodeOpts.defaultTimeoutInterval) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineNodeOpts.defaultTimeoutInterval
    }

    let reporter = new JasmineReporter(cid, capabilities)
    jrunner.addReporter(reporter)

    // Filter specs to run based on jasmineNodeOpts.grep and jasmineNodeOpts.invert.
    jasmine.getEnv().specFilter = function (spec) {
        let grepMatch = !jasmineNodeOpts || !jasmineNodeOpts.grep || spec.getFullName().match(new RegExp(jasmineNodeOpts.grep)) !== null
        let invertGrep = !!(jasmineNodeOpts && jasmineNodeOpts.invertGrep)
        if (grepMatch === invertGrep) {
            spec.pend()
        }
        return true
    }

    /**
     * enable expectHandler
     */
    if (typeof jasmineNodeOpts.expectationResultHandler === 'function') {
        jasmine.Spec.prototype.addExpectationResult = adapter.expectationResultHandler(
            jasmineNodeOpts,
            jasmine.Spec.prototype.addExpectationResult
        )
    }

    /**
     * wrap commands with wdio-sync
     */
    INTERFACES.bdd.forEach(runInFiberContext.bind(null, INTERFACES, 'bdd'))
    wrapCommand(global.browser)

    await runHook(config.before)
    let result = await new Promise((resolve) => {
        jrunner.execute()
        jrunner.onComplete(() => resolve(reporter.getFailedCount()))
    })
    await runHook(config.after)

    return result
}

adapter.expectationResultHandler = function (jasmineNodeOpts, addExpectationResult) {
    return (passed, data) => {
        try {
            jasmineNodeOpts.expectationResultHandler.call(global.browser, passed, data)
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

        return addExpectationResult.call(this, passed, data)
    }
}

export default adapter
