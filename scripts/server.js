import express from 'express'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev
})
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.get('/page/:id', (req, res) => {
      const actualPage = '/page'
      const queryParams = { title: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, (err) => {
      if (err)
        throw err
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
