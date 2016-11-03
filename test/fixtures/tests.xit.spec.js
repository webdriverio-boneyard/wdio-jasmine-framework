describe('sample test', () => {
    it('can be declared with "it" but without a function')

    it('can be declared with "it" but without a function and pend').pend('ignore me')

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
