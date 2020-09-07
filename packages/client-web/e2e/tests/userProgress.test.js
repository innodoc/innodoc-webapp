beforeEach(resetBrowser)
beforeAll(connectDb)
afterAll(disconnectDb)

describe('User progress', () => {
  const pwd = 'S00perSecur3!'

  const assertProgress = async (chapterIdx, chartIdx, strings) => {
    // await browser.waitFor((s) => document.querySelectorAll(s).length === 6, 10000, '.ant-progress')
    const cards = await browser.queryAll('[class*=resultCard___]')
    const charts = await browser.queryAll(cards[chapterIdx], '.ant-card-body > .ant-row > .ant-col')
    await browser.assert.textContains(charts[chartIdx], strings)
  }

  const solveExercise = async (inputIdx, text) => {
    await openUrl('section/02-elements/10-interactive-exercises/01-text')
    const inputs = await browser.queryAll('[class*=inputQuestion___] input')
    await browser.type(inputs[inputIdx], text)
    await browser.wait(2500)
  }

  test('Local storage', async () => {
    await openUrl('progress')
    await assertProgress(0, 0, ['0 %', 'Visited 0 out of 7.'])
    await assertProgress(1, 0, ['0 %', 'Visited 0 out of 17.'])
    await assertProgress(1, 1, ['0 %', 'Scored 0 out of 63 points.'])
    await solveExercise(0, 'solution')
    await openUrl('progress')
    await assertProgress(0, 0, ['0 %', 'Visited 0 out of 7.'])
    await assertProgress(1, 0, ['6 %', 'Visited 1 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])
    await openUrl('section/02-elements/02-headings')
    await browser.wait(2500)
    await openUrl('progress')
    await assertProgress(0, 0, ['0 %', 'Visited 0 out of 7.'])
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])
  })

  test('Server storage', async () => {
    await openUrl('progress')
    await assertProgress(1, 0, ['0 %', 'Visited 0 out of 17.'])
    await assertProgress(1, 1, ['0 %', 'Scored 0 out of 63 points.'])
    await solveExercise(0, 'solution') // 3 points
    await openUrl('progress')
    await assertProgress(1, 0, ['6 %', 'Visited 1 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])

    const email = getRandEmail()
    await register(email, pwd)
    await activate(email)
    await login(email, pwd)

    await openUrl('section/02-elements/02-headings')
    await browser.wait(2500)
    await openUrl('progress')
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['5 %', 'Scored 3 out of 63 points.'])
    await solveExercise(1, '5') // 4 points
    await openUrl('progress')
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['11 %', 'Scored 7 out of 63 points.'])
    await logout(email)

    // Empty progress after logout
    await openUrl('progress')
    await assertProgress(1, 0, ['0 %', 'Visited 0 out of 17.'])
    await assertProgress(1, 1, ['0 %', 'Scored 0 out of 63 points.'])

    await openUrl('section/02-elements/01-formatting')
    await browser.wait(2500)
    await solveExercise(0, 'wrong')
    await solveExercise(2, '{1}') // 4 points
    await openUrl('progress')
    await assertProgress(1, 0, ['12 %', 'Visited 2 out of 17.'])
    await assertProgress(1, 1, ['6 %', 'Scored 4 out of 63 points.'])

    // Check progress merge on login
    await login(email, pwd)
    await openUrl('progress')
    await assertProgress(1, 0, ['18 %', 'Visited 3 out of 17.'])
    await assertProgress(1, 1, ['13 %', 'Scored 8 out of 63 points.'])
  })
})
