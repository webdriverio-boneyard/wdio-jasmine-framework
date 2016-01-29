describe('dummy test', () => {
    beforeAll(() => {
    })

    beforeEach(() => {
    })

    it('sample test', () => {
        return browser.command(1).then((result) => {
            expect(result).toBe(2)
        })
    })

    afterEach(() => {
    })

    afterAll(() => {
    })
})
