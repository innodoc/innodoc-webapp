import { rest } from 'msw'

const getUrl = (pathname) => new URL(pathname, process.env.NEXT_PUBLIC_APP_ROOT).toString()

const handlers = [
  rest.post(getUrl('/user/login'), (req, res, ctx) => res(ctx.json({ result: 'ok' }))),
]

export { getUrl }
export default handlers
