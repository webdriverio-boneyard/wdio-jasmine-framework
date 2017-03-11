describe('sample test', () => {
    it('can be declared with "it" but without a function') // eslint-disable-line mocha/no-pending-tests

    it('can be declared with "it" but without a function and pend').pend('ignore me') // eslint-disable-line mocha/no-pending-tests

    it('should pend with a reason', () => {
        pending('ignore reason')
        throw new Error('ignore me')
    })

    xit('xit', () => {
        throw new Error('ignore me')
    }, 'ignore me')

    it('should pend async', function async () {
        return browser.command(1).then((res) => {
            expect(true).toBe(false)
            pending()
        })
    })
})
