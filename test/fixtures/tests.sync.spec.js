global._____wdio = {}

describe('sample test', () => {
    beforeAll(() => {
        const start = new Date().getTime()
        browser.pause()
        global._____wdio.beforeAll = new Date().getTime() - start
    })

    beforeEach(() => {
        const start = new Date().getTime()
        browser.pause()
        global._____wdio.beforeEach = new Date().getTime() - start
    })

    it('foo', () => {
        const start = new Date().getTime()
        browser.pause()
        global._____wdio.it = new Date().getTime() - start
    })

    describe('nested', () => {
        it('bar', () => {
            const start = new Date().getTime()
            browser.pause()
            global._____wdio.nestedit = new Date().getTime() - start
        })
    })

    afterEach(() => {
        const start = new Date().getTime()
        browser.pause()
        global._____wdio.afterEach = new Date().getTime() - start
    })

    afterAll(() => {
        const start = new Date().getTime()
        browser.pause()
        global._____wdio.afterAll = new Date().getTime() - start
    })
})
