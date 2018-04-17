describe('dummy test', () => {
    let retryCnt

    describe('run flaky (failed expectation) beforeAll hooks', () => {
        beforeAll(() => {
            retryCnt = 2
        })

        beforeAll(() => {
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

        it('doesn\'t matter', () => {})
    })

    describe('run flaky (error thrown) beforeAll hooks', () => {
        beforeAll(() => {
            retryCnt = 2
        })

        beforeAll(() => {
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

    describe('run flaky (failed expectation) beforeEach hooks', () => {
        beforeAll(() => {
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
        it('doesn\'t matter', () => {})
    })

    describe('run flaky (error thrown) beforeEach hooks', () => {
        beforeAll(() => {
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
        beforeAll(() => {
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
        beforeAll(() => {
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
        beforeAll(() => {
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

    describe('run flaky (false expectation) afterAll hooks', () => {
        beforeAll(() => {
            retryCnt = 2
        })

        afterAll(() => {
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

        it('doesn\'t matter', () => {})
    })

    describe('run flaky (error thrown) afterAll hooks', () => {
        beforeAll(() => {
            retryCnt = 2
        })

        afterAll(() => {
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

    describe('run flaky (false expectation) afterEach hooks', () => {
        beforeAll(() => {
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

        it('doesn\'t matter', () => {})
    })

    describe('run flaky (error thrown) afterEach hooks', () => {
        beforeAll(() => {
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
