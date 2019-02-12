require('expect-puppeteer')

jest.setTimeout(15000)
global.getUrl = rest => `http://localhost:${process.env.PROD_PORT}${rest}`
