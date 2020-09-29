/* eslint-disable no-console */
const fetch = require('node-fetch')

fetch(`${process.argv[2]}manifest.json`)
  .then((response) => {
    if (response.ok) {
      response.text().then(console.log)
    }
  })
  .catch((err) => {
    console.error('Could not retrieve manifest.json! Is the content server running?')
    console.error(err)
  })
