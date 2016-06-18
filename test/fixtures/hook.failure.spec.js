describe('sample test', () => {
    beforeAll('will cause all tests to fail', () => {
        throw new Error('causes all tests to fail')
    })

    it('fails due to exception in beforeAll', () => {
        expect(true).toBe(true)
    })
})
