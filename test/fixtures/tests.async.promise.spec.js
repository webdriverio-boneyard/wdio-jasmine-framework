global.______wdio = {}

describe('sample test', () => {
    it('foo', () => {
        const start = new Date().getTime()
        return browser.command().then((result) => {
            expect(result).toBe('foo')
            global.______wdio.it = new Date().getTime() - start
        })
    })
})
