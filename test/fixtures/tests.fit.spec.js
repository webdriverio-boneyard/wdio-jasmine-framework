global.fitwdio = {}

describe('sample test', () => {
    it('foo', () => {
        const start = new Date().getTime()
        browser.pause()
        global.fitwdio.it = new Date().getTime() - start
    })

    fit('bar', () => {
        const start = new Date().getTime()
        browser.pause()
        global.fitwdio.fit = new Date().getTime() - start
    })
})
