describe('sample test', () => {
    let retryCnt

    describe('run flaky beforeEach hooks', () => {
        beforeEach(() => {
            retryCnt = 2
        })

        beforeEach(() => {
            if (retryCnt-- !== 0) {
                throw new Error('flaky hook failed')
            }

            browser.command().should.be.equal('foo')
        }, 2)

        it('doesn\'t matter', () => {})
    })

    it('should pass without retry', () => {
        browser.command().should.be.equal('foo')
    })

    describe('run flaky tests', () => {
        beforeAll(() => {
            retryCnt = 1
        })

        it('should pass retry', () => {
            if (retryCnt-- !== 0) {
                throw new Error('flaky test failed')
            }

            browser.command().should.be.equal('foo')
        }, 1)
    })

    describe('run flaky tests again', () => {
        beforeAll(() => {
            retryCnt = 3
        })

        it('should pass multiple retries', function () {
            if (retryCnt-- !== 0) {
                throw new Error('flaky test failed')
            }

            browser.command().should.be.equal('foo')
        }, 3)
    })

    describe('run flaky afterEach hooks', () => {
        beforeAll(() => {
            retryCnt = 2
        })

        afterEach(() => {
            if (retryCnt-- !== 0) {
                throw new Error('flaky hook failed')
            }

            browser.command().should.be.equal('foo')
        }, 2)

        it('doesn\'t matter', () => {})
    })
})
