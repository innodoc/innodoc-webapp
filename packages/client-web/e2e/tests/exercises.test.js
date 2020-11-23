beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('Exercises', () => {
  describe('Input questions', () => {
    describe('Parsed expression 2.10.8', () => {
      let exercise
      let checkInputBtn
      let resetBtn

      beforeEach(async () => {
        await helpers.goto('section/02-elements/10-interactive-exercises/01-text')
        exercise = await page.waitForSelector('*css=[class*=exercise___] >> text=Exercise 2.10.8')
        checkInputBtn = await exercise.waitForSelector('*css=button >> text=Check input')
        resetBtn = await exercise.waitForSelector('*css=button >> text=Reset')
      })

      it('should show footer buttons greyed out initially', async () => {
        await checkInputBtn.waitForElementState('disabled')
        await resetBtn.waitForElementState('disabled')
      })

      it('should be possible to reset exercise', async () => {
        const inputs = await exercise.$$('input')
        await inputs[0].fill('{2}')
        await resetBtn.click()
        expect(await page.evaluate((el) => el.value, inputs[0])).toBe('')
        await resetBtn.waitForElementState('disabled')
      })

      it('should be possible to verify exercise', async () => {
        const inputs = await exercise.$$('input')

        // Wrong answer
        await inputs[0].fill('{1}')
        await inputs[1].fill('{2}')
        await inputs[2].fill('{3}')
        await checkInputBtn.click()
        await checkInputBtn.waitForElementState('disabled')
        await exercise.waitForSelector('[title=Incorrect]')
        await exercise.waitForSelector('[title=Correct]')
        expect(await exercise.$$('[title=Incorrect]')).toHaveLength(2)
        expect(await exercise.$$('[title=Correct]')).toHaveLength(2)

        // Correct answer
        await inputs[2].fill('{}')
        await checkInputBtn.click()
        await exercise.waitForSelector('[title=Incorrect]', { state: 'detached' })
        await exercise.waitForSelector('[title=Correct]')
        expect(await exercise.$$('[title=Incorrect]')).toHaveLength(0)
        expect(await exercise.$$('[title=Correct]')).toHaveLength(4)
      })
    })
  })

  describe('Checkbox question 2.10.19', () => {
    let exercise
    let checkInputBtn
    let resetBtn

    beforeEach(async () => {
      await helpers.goto('section/02-elements/10-interactive-exercises/02-checkbox')
      exercise = await page.waitForSelector('*css=[class*=exercise___] >> text=Exercise 2.10.19')
      checkInputBtn = await exercise.waitForSelector('*css=button >> text=Check input')
      resetBtn = await exercise.waitForSelector('*css=button >> text=Reset')
    })

    it('should show footer buttons greyed out initially', async () => {
      await checkInputBtn.waitForElementState('disabled')
      await resetBtn.waitForElementState('disabled')
    })

    it('should be possible to reset exercise', async () => {
      expect(await exercise.$$('[class*=ant-checkbox-indeterminate]')).toHaveLength(3)
      const firstCheckbox = await exercise.$('input[type=checkbox]')
      await firstCheckbox.check()
      await resetBtn.waitForElementState('enabled')
      expect(await exercise.$$('[class*=ant-checkbox-indeterminate]')).toHaveLength(2)
      await resetBtn.click()
      await resetBtn.waitForElementState('disabled')
      expect(await exercise.$$('[class*=ant-checkbox-indeterminate]')).toHaveLength(3)
    })

    it('should be possible to verify exercise', async () => {
      const checkboxes = await exercise.$$('input[type=checkbox]')

      // Wrong answer
      await checkboxes[0].check()
      await checkboxes[1].check()
      await checkboxes[2].check()
      await checkInputBtn.click()
      await checkInputBtn.waitForElementState('disabled')
      await exercise.waitForSelector('[title=Incorrect]')
      await exercise.waitForSelector('[title=Correct]')
      expect(await exercise.$$('[title=Incorrect]')).toHaveLength(2)
      expect(await exercise.$$('[title=Correct]')).toHaveLength(2)

      // Correct answer (false, true, true)
      await checkboxes[0].uncheck()
      await checkInputBtn.click()
      await exercise.waitForSelector('[title=Incorrect]', { state: 'detached' })
      await exercise.waitForSelector('[title=Correct]')
      expect(await exercise.$$('[title=Incorrect]')).toHaveLength(0)
      expect(await exercise.$$('[title=Correct]')).toHaveLength(4)
    })
  })
})
