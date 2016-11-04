xdescribe('sample test - w/beforeAll Error', () => {
    beforeAll(() => {
        throw new Error('ignore beforeAll Error')
    })
})

xdescribe('sample test - w/beforeEach Error', () => {
    beforeEach(() => {
        throw new Error('ignore beforeAll Error')
    })
})

xdescribe('sample test - w/it Error', () => {
    it('should ignore this error', () => {
        throw new Error('ignore it Error')
    })
})

xdescribe('sample test - w/afterAll Error', () => {
    afterAll(() => {
        throw new Error('ignore afterAll Error')
    })
})

xdescribe('sample test - w/afterEach Error', () => {
    afterEach(() => {
        throw new Error('ignore afterEach Error')
    })
})
