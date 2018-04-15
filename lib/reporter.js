const SETTLE_TIMEOUT = 5000
const STACKTRACE_FILTER = /(node_modules(\/|\\)(\w+)*|wdio-sync\/build|- - - - -)/g

class JasmineReporter {
    constructor (params) {
        this._cid = params.cid
        this._capabilities = params.capabilities
        this._specs = params.specs
        this._cleanStack = params.cleanStack
        this._parent = []
        this._failedCount = 0

        this.sentMessages = 0 // number of messages sent to the parent
        this.receivedMessages = 0 // number of messages received by the parent
    }

    suiteStarted (suite = {}) {
        this._suiteStart = new Date()
        suite.type = 'suite'

        this.emit('suite:start', suite)
        this._parent.push({
            description: suite.description,
            id: suite.id
        })
    }

    specStarted (test = {}) {
        this._testStart = new Date()
        test.type = 'test'
        this.emit('test:start', test)
    }

    specDone (test) {
        /**
         * jasmine can't set test pending if async (`pending()` got called)
         * this is a workaround until https://github.com/jasmine/jasmine/issues/937 is resolved
         */
        if (Array.isArray(test.failedExpectations)) {
            test.failedExpectations.forEach((e) => {
                if (e.message.includes('Failed: => marked Pending')) {
                    test.status = 'pending'
                    test.failedExpectations = []
                }
            })
        }

        if (test.failedExpectations && this._cleanStack) {
            test.failedExpectations = test.failedExpectations.map(::this.cleanStack)
        }

        var e = 'test:' + test.status.replace(/ed/, '')
        test.type = 'test'
        test.duration = new Date() - this._testStart
        this.emit(e, test)
        this._failedCount += test.status === 'failed' ? 1 : 0
        this.emit('test:end', test)
    }

    suiteDone (suite = {}) {
        this._parent.pop()
        suite.type = 'suite'
        suite.duration = new Date() - this._suiteStart
        this._failedCount += suite.status === 'failed' ? 1 : 0
        this.emit('suite:end', suite)
    }

    emit (event, payload) {
        let message = {
            cid: this._cid,
            uid: this.getUniqueIdentifier(payload),
            event: event,
            title: payload.description,
            pending: payload.status === 'pending',
            parent: this._parent.length ? this.getUniqueIdentifier(this._parent[this._parent.length - 1]) : null,
            type: payload.type,
            file: '',
            err: payload.failedExpectations && payload.failedExpectations.length ? payload.failedExpectations[0] : null,
            duration: payload.duration,
            runner: {},
            specs: this._specs
        }

        message.runner[this._cid] = this._capabilities
        this.send(message, null, {}, () => ++this.receivedMessages)
        this.sentMessages++
    }

    send (...args) {
        return process.send.apply(process, args)
    }

    /**
     * wait until all messages were sent to parent
     */
    waitUntilSettled () {
        return new Promise((resolve) => {
            const start = (new Date()).getTime()
            const interval = setInterval(() => {
                const now = (new Date()).getTime()

                if (this.sentMessages !== this.receivedMessages && now - start < SETTLE_TIMEOUT) return
                clearInterval(interval)
                resolve()
            }, 100)
        })
    }

    getFailedCount () {
        return this._failedCount
    }

    getUniqueIdentifier (target) {
        return target.description + target.id
    }

    cleanStack (error) {
        let stack = error.stack.split('\n')
        stack = stack.filter((line) => !line.match(STACKTRACE_FILTER))
        error.stack = stack.join('\n')
        return error
    }
}

export default JasmineReporter
