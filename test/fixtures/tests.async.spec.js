global.______wdio = {}

describe('sample test', () => {
    beforeAll(() => {
        const start = new Date().getTime()
        return browser.command().then((result) => {
            expect(result).toBe('foo')
            global.______wdio.beforeAll = new Date().getTime() - start
        })
    })

    beforeEach(() => {
        const start = new Date().getTime()
        return browser.command().then((result) => {
            expect(result).toBe('foo')
            global.______wdio.beforeEach = new Date().getTime() - start
        })
    })

    it('foo', () => {
        const start = new Date().getTime()
        return browser.command().then((result) => {
            expect(result).toBe('foo')
            global.______wdio.it = new Date().getTime() - start
        })
    })

    describe('nested', () => {
        it('bar', () => {
            const start = new Date().getTime()
            return browser.command().then((result) => {
                expect(result).toBe('foo')
                global.______wdio.nestedit = new Date().getTime() - start
            })
        })
    })

    afterEach(() => {
        const start = new Date().getTime()
        return browser.command().then((result) => {
            expect(result).toBe('foo')
            global.______wdio.afterEach = new Date().getTime() - start
        })
    })

    afterAll(() => {
        const start = new Date().getTime()
        return browser.command().then((result) => {
            expect(result).toBe('foo')
            global.______wdio.afterAll = new Date().getTime() - start
        })
    })
})
