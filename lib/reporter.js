class JasmineReporter {
    constructor: function(capabilities) {
        this._capabilities = capabilities;
        this._parent = [];
        this._failedCount = 0;
    }

    suiteStarted: function(suite) {
        this._suiteStart = new Date();
        suite.type = 'suite';
        this.emit('suite:start', suite);
        this._parent.push(suite.description);
    }

    specStarted: function(test) {
        this._testStart = new Date();
        test.type = 'test';
        this.emit('test:start', test);
    }

    specDone: function(test) {
        var e = 'test:' + test.status.replace(/ed/, '');
        test.type = 'test';
        test.duration = new Date() - this._testStart;
        this.emit(e, test);
        this._failedCount += test.status === 'failed' ? 1 : 0;
    }

    suiteDone: function(suite) {
        this._parent.pop();
        suite.type = 'suite';
        suite.duration = new Date() - this._suiteStart;
        this.emit('suite:end', suite);
    }

    emit: function(event, payload) {
        let message = {
            event: event,
            pid: process.pid,
            title: payload.description,
            pending: payload.status === 'pending',
            parent: this._parent.length ? this._parent[this._parent.length - 1] : null,
            type: payload.type,
            file: '',
            err: payload.failedExpectations.length ? payload.failedExpectations[0] : null,
            duration: payload.duration,
            runner: {}
        };

        message.runner[process.pid] = this._capabilities;
        process.send(message);
    }

    getFailedCount: function() {
        return this._failedCount;
    }
}

export JasmineReporter
