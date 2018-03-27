describe('dummy test', () => {
    describe('run flaky beforeEach hooks', () => {
        let retryCnt = 0
        beforeEach(() => {
            retryCnt = 2
        })

        beforeEach(() => {
            if (retryCnt !== 0) {
                return browser.command().then((result) => {
                    retryCnt--
                    result.should.be.not.equal('foo')
                })
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 2)

        beforeEach(() => {
            retryCnt = 2
        })

        beforeEach(() => {
            if (retryCnt !== 0) {
                retryCnt--
                throw new Error('FLAKE!')
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 2)

        it('doesn\'t matter', () => {})
    })

    it('should pass without retry', () => {
        return browser.command().then((result) => {
            result.should.be.equal('foo')
        })
    })

    describe('run flaky test', () => {
        let retryCnt = 0
        before(() => {
            retryCnt = 1
        })

        it('should pass with retry', () => {
            if (retryCnt !== 0) {
                return browser.command().then((result) => {
                    retryCnt--
                    result.should.be.not.equal('foo')
                })
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 1)
    })

    describe('run flaky test', () => {
        let retryCnt = 0
        before(() => {
            retryCnt = 3
        })

        it('should pass with multiple retries', () => {
            if (retryCnt !== 0) {
                return browser.command().then((result) => {
                    retryCnt--
                    result.should.be.not.equal('foo')
                })
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 3)
    })

    describe('run flaky test', () => {
        let retryCnt = 0
        before(() => {
            retryCnt = 2
        })

        it('should also be able if deal with errors that get thrown directly', () => {
            if (retryCnt !== 0) {
                retryCnt--
                throw new Error('FLAKE!')
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 2)
    })

    describe('run flaky afterEach hooks', () => {
        let retryCnt = 0
        afterEach(() => {
            retryCnt = 2
        })

        afterEach(() => {
            if (retryCnt !== 0) {
                return browser.command().then((result) => {
                    retryCnt--
                    result.should.be.not.equal('foo')
                })
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 2)

        afterEach(() => {
            retryCnt = 2
        })

        afterEach(() => {
            if (retryCnt !== 0) {
                retryCnt--
                throw new Error('FLAKE!')
            }

            return browser.command().then((result) => {
                result.should.be.equal('foo')
            })
        }, 2)

        it('doesn\'t matter', () => {})
    })
})
