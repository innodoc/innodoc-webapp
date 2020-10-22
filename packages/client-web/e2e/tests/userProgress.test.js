beforeEach(async () => {
  await jestPlaywright.resetContext()
})

describe('User progress', () => {
  const pwd = 'S00perSecur3!'

  const assertProgress = async (chapterIdx, chartIdx, strings) => {
    await page.waitForSelector('[class*=resultCard___] .ant-card-body > .ant-row > .ant-col')
    const cards = await page.$$('[class*=resultCard___]')
    const charts = await cards[chapterIdx].$$('.ant-card-body > .ant-row > .ant-col')
    await Promise.all(strings.map((s) => expect(charts[chartIdx]).toHaveText(s)))
  }

  const solveExercise = async (inputIdx, text) => {
    await helpers.goto('section/02-elements/10-interactive-exercises/01-text')
    await page.waitForSelector('[class*=inputQuestion___] input')
    const inputs = await page.$$('[class*=inputQuestion___] input')
    await inputs[inputIdx].fill(text)
    await page.waitForTimeout(2500) // Visited state is recorded after delay
  }

  test('Local storage', async () => {
    await helpers.goto('progress')
    await assertProgress(0, 0, ['0 %', 'Visited 0 out of 7.'])
    await assertProgress(1, 0, ['0 %', 'Visited 0 out of 17.'])
    await assertProgress(1, 1, ['0 %', 'Scored 0 out of 63 points.'])
    await solveExercise(0, 'solution')
    await helpers.goto('progress')
    await assertProgress(0, 0, ['0 %', 'Visited 0 out of 7.'])
    await assertProgress(1, 0, ['6 %', 'Visited 1 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])
  })

  test('Server storage', async () => {
    await helpers.goto('progress')
    await assertProgress(1, 0, ['0 %', 'Visited 0 out of 17.'])
    await assertProgress(1, 1, ['0 %', 'Scored 0 out of 63 points.'])
    await solveExercise(0, 'solution') // 3 points
    await helpers.goto('progress')
    await assertProgress(1, 0, ['6 %', 'Visited 1 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])

    const email = helpers.getRandEmail()
    await helpers.register(email, pwd)
    await helpers.activate(email)
    await helpers.login(email, pwd)

    await helpers.goto('section/02-elements/02-headings')
    await page.waitForTimeout(2500) // Visited state is recorded after delay
    await helpers.goto('progress')
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])
    await solveExercise(1, '5') // 4 points
    await helpers.goto('progress')
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['11 %', 'Scored 7 out of 63 points.'])
    await helpers.logout()

    // Empty progress after logout
    await helpers.goto('progress')
    await assertProgress(1, 0, ['0 %', 'Visited 0 out of 17.'])
    await assertProgress(1, 1, ['0 %', 'Scored 0 out of 63 points.'])

    await helpers.goto('section/02-elements/01-formatting')
    await page.waitForTimeout(2500) // Visited state is recorded after delay
    await solveExercise(0, 'wrong')
    await solveExercise(2, '{1}') // 4 points
    await helpers.goto('progress')
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['6 %', 'Scored 4 out of 63 points.'])

    // Check progress merge on login
    await helpers.login(email, pwd)
    await helpers.goto('progress')
    await assertProgress(1, 0, ['18 %', 'Visited 3 out of 17.'])
    await assertProgress(1, 1, ['13 %', 'Scored 8 out of 63 points.'])
  })
})
