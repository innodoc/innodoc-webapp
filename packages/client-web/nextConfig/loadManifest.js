/* eslint-disable no-console */
const fetch = require('node-fetch')

const url = new URL(process.argv[2])
url.pathname = '/manifest.json'

fetch(url.toString())
  .then((response) => {
    if (response.ok) {
      response.text().then(console.log)
    }
  })
  .catch((err) => {
    console.error('Could not retrieve manifest.json! Is the content server running?')
    console.error(err)
  })
