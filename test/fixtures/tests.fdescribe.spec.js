global.fdescribewdio = {}

describe('focused specs', () => {
    describe('sample test', () => {
        it('foo', () => {
            const start = new Date().getTime()
            browser.pause()
            global.fdescribewdio.joo = new Date().getTime() - start
        })
    })

    fdescribe('sample test 2', () => {
        it('bar', () => {
            const start = new Date().getTime()
            browser.pause()
            global.fdescribewdio.fit = new Date().getTime() - start
        })
    })
})
