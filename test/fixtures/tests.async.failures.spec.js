global.______wdio = {}

describe('sample test', () => {
    it('promise is resolved', () => {
        return new Promise(() => {
            throw new Error('fail test')
        })
    })
    it('fails on exception', () => {
        throw new Error('fail test')
    })
})
