class JasmineReporter {
    constructor (cid, capabilities, specs) {
        this._cid = cid
        this._capabilities = capabilities
        this._specs = specs
        this._parent = []
        this._failedCount = 0
    }

    suiteStarted (suite = {}) {
        this._suiteStart = new Date()
        suite.type = 'suite'
        this.emit('suite:start', suite)
        this._parent.push(suite.description)
    }

    specStarted (test = {}) {
        this._testStart = new Date()
        test.type = 'test'
        this.emit('test:start', test)
    }

    specDone (test) {
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
        this.emit('suite:end', suite)
    }

    emit (event, payload) {
        let message = {
            cid: this._cid,
            event: event,
            title: payload.description,
            pending: payload.status === 'pending',
            parent: this._parent.length ? this._parent[this._parent.length - 1] : null,
            type: payload.type,
            file: '',
            err: payload.failedExpectations && payload.failedExpectations.length ? payload.failedExpectations[0] : null,
            duration: payload.duration,
            runner: {},
            specs: this._specs
        }

        message.runner[this._cid] = this._capabilities
        this.send(message)
    }

    send (...args) {
        process.send.apply(process, args)
    }

    getFailedCount () {
        return this._failedCount
    }
}

export default JasmineReporter
