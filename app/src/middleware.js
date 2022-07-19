import { NextResponse } from 'next/server'

/* eslint-disable-next-line import/prefer-default-export */
export const middleware = (request) => {
  // console.log(`Custom middleware: ${request.nextUrl.pathname}`)

  // if (request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL(`${request.nextUrl.locale}/page/about`, request.url))
  // }

  return NextResponse.next()
}
