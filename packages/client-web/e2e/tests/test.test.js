beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Tests', () => {
  let exercise
  let input
  let resetBtn
  let resultMsgEl
  let submitBtn

  beforeEach(async () => {
    await helpers.goto('section/03-test')
    await page.waitForSelector('h1 >> "3 Example test"')
    exercise = await page.waitForSelector('*css=[class*=exercise___] >> text=Exercise 3.0.1')
    input = await exercise.$('input')
    resetBtn = await page.waitForSelector('*css=button >> text=Reset and restart')
    resultMsgEl = await page.waitForSelector('[class*=content___] >> .ant-result-title')
    submitBtn = await page.waitForSelector('*css=button >> text=Submit test')
  })

  it('should only evaluate test after submission', async () => {
    expect(await resultMsgEl.innerText()).toBe('The test has not been submitted yet.')
    await submitBtn.waitForElementState('disabled')
    await resetBtn.waitForElementState('disabled')

    await input.fill('solution')
    await submitBtn.waitForElementState('enabled')
    await resetBtn.waitForElementState('enabled')
    await page.waitForSelector('.ant-result-title >> text="The test has not been submitted yet."')
    expect(await exercise.$$('span[title=Correct]')).toHaveLength(0)

    await submitBtn.click()
    await page.waitForSelector('span[title=Correct]')
    expect(await resultMsgEl.innerText()).toBe('A score of 10 out of 10 was achieved in the test.')
  })

  it('should evaluate correct/incorrect answer', async () => {
    await input.fill('wrongsolution')
    await submitBtn.click()
    await page.waitForSelector('span[title=Incorrect]')
    expect(await resultMsgEl.innerText()).toBe('A score of 0 out of 10 was achieved in the test.')

    await input.fill('solution')
    await page.waitForSelector('.ant-result-title >> text="The test has not been submitted yet."')
    await submitBtn.click()
    await page.waitForSelector('span[title=Correct]')
    expect(await resultMsgEl.innerText()).toBe('A score of 10 out of 10 was achieved in the test.')
  })

  it('should reset submitted test', async () => {
    await input.fill('solution')
    await submitBtn.click()
    await page.waitForSelector('span[title=Correct]')
    expect(await resultMsgEl.innerText()).toBe('A score of 10 out of 10 was achieved in the test.')

    await resetBtn.click()
    await page.waitForSelector('.ant-result-title >> text="The test has not been submitted yet."')
    await submitBtn.waitForElementState('disabled')
    await resetBtn.waitForElementState('disabled')
    expect(await input.innerText()).toBe('')
  })

  it('should reset non-submitted test', async () => {
    await input.fill('solution')
    await resetBtn.click()
    await page.waitForSelector('.ant-result-title >> text="The test has not been submitted yet."')
    await submitBtn.waitForElementState('disabled')
    await resetBtn.waitForElementState('disabled')
    expect(await input.innerText()).toBe('')
  })

  it('should show test results on progress page', async () => {
    await input.fill('solution')
    await submitBtn.click()
    await page.waitForSelector('span[title=Correct]')
    expect(await resultMsgEl.innerText()).toBe('A score of 10 out of 10 was achieved in the test.')
    await page.click('"Progress"')
    await page.waitForSelector('h1 >> "Progress"')
    const resultCard = (await page.$$('[class*=resultCard___]'))[2]
    expect(await resultCard.innerText()).toContain('Completed')
    expect(await resultCard.innerText()).toContain('100 %')
    expect(await resultCard.innerText()).toContain('Scored 10 out of 10 points.')
  })
})
