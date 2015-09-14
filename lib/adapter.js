import { JasmineReporter } from './reporter'
import { Jasmine } from 'jasmine'
import { runInFiberContext, runBefore } from 'wdio-sync'

const INTERFACES = {
    bdd: ['beforeAll', 'beforeEach', 'it', 'afterEach', 'afterAll']
}

const DEFAULT_TIMEOUT_INTERVAL = 60000

let adapter

/**
 * Jasmine 2.x runner
 */
adapter.run = async function (cid, config, specs, capabilities) {
    let jrunner = new Jasmine()
    let jasmineNodeOpts = config.jasmineNodeOpts

    jrunner.projectBaseDir = ''
    jrunner.specDir = ''
    jrunner.addSpecFiles(specs)

    if (jasmineNodeOpts && jasmineNodeOpts.defaultTimeoutInterval) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineNodeOpts.defaultTimeoutInterval
    } else {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL
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
        let addExpectationResult = jasmine.Spec.prototype.addExpectationResult
        jasmine.Spec.prototype.addExpectationResult = function (passed, data) {
            try {
                jasmineNodeOpts.expectationResultHandler.call(browser, passed, data)
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

    /**
     * ToDo wrap commands with wdio-sync
     */
    INTERFACES.bdd.forEach(runInFiberContext)

    /**
     * run before hook in fiber context
     */
    await runBefore(config.before)

    return new Promise((resolve, reject) => {
        try {
            jrunner.execute()

            jrunner.onComplete(() => {
                resolve(reporter.getFailedCount())
            })
        } catch (e) {
            reject({
                message: e.message,
                stack: e.stack
            })
        }
    })
}

export { adapter }
