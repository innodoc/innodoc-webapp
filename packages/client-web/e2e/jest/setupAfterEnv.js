const headless = process.env.PUPPETEER_HEADLESS !== 'false'

jest.setTimeout(headless ? 60000 : 1000 * 60 * 10)
