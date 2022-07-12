[![build status](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/build.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master) [![coverage report](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/coverage.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master)

# innoDoc web app

HTML viewer for interactive educational content.

## Running the application

### Docker

The easiest way to get started is to use the prebuilt image.

```sh
docker run \
  --rm \
  --publish 8000:8000 \
  --env CONTENT_ROOT="https://example.com/content/" \
  --env MONGO_URL=mongodb://mongodb/innodoc-test \
  --network innodocbridge
  innodoc/innodoc-webapp
```

**Note:** You still need a MongoDB instance and content for the app to do
anything useful.

**See also:** [Docker README](docker/README.md)

### Manually building the application

#### Requirements

Please make sure you have a current version of [Node.js](https://nodejs.org/)
and [Yarn](https://yarnpkg.com/) installed on your system. For Node.js use your
package manager of choice. [nvm](https://github.com/creationix/nvm) is also an
excellent option to install a current version of Node.js into your home
directory.

The software is built and tested on Linux systems. Using it on other operating
systems might work, but your mileage may vary.

#### 1. Install dependencies

Install node packages.

```sh
$ yarn install
```

#### 2. Configuration

Copy the example configuration `.env.example` to `.env` and edit to your
liking.

#### 3. Build the application

```sh
$ yarn build
```

An optimized production build can be found in the directory
`packages/client-web/src/.next`.

#### 4. Start the production server

This will start the web server that serves the web application.

```sh
$ yarn start
```

### Serving content to the application

For the application to do anything useful, you will need content to display.

Content is static data in the shape of JSON and image files. To produce such
content a separate program
[innoConv](https://gitlab.tu-berlin.de/innodoc/innoconv) can be used. The
content needs to be served via HTTP(S) (see [`CONTENT_ROOT`](#content_root)).
Don't forget to send [CORS
headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) if needed.

### Configuration options

Configuration options are set in the `.env` file. You can use `.env.example` as
a basis. For `docker run` you might want to use `--env` or `--env-file`.

## Deployment

Web applications usually run behind a reverse proxy to provide features such as
TLS termination, static asset serving or load balancing. Details on how to do
that is not in the scope of this document.

Static assets are stored in the directory `/innodoc-webapp/src/.next/static`
in the Docker container.

Currently the application should be served directly from the domain root (like
`myapp.example.com`) rather than from a sub-directory (like
`www.example.com/myapp`).

## Development

The codebase is split into separate sub-packages for organizational purposes
and to enable sharing of code. This is managed by
[Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

### Development server

The development server compiles code on-the-fly and therefore there's no need
to build in advance.
[Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/)
is activated by default.

```sh
$ yarn dev
```

### Unit tests

[Jest](https://jestjs.io/) and [Enzyme](http://airbnb.io/enzyme/) are used for
testing.

```sh
$ yarn test:unit
```

##### Coverage

Shows detailed coverage report and also produces `./coverage/lcov-report` that
can be viewed in a web browser.

```sh
$ yarn test:unit:coverage
```

### E2E tests

[Playwright](https://playwright.dev/) is used for E2E testing.

This will spawn the app and content servers automatically before running E2E
tests. Afterwards both servers are shut down. Don't forget to build the
application before as this runs directly on the production build.

```sh
$ yarn test:e2e
```

E2E tests can also be looked at while running.

```sh
$ yarn test:e2e:show
```

For failed tests a screenshot will be taken automatically and placed into the
directory `packages/client-web/e2e/screenshots`.

### Serve test content

Serve test content that can be used with [`CONTENT_ROOT`](#content_root). That
comes in handy for development and testing. For production you should set up a
proper web server to handle static content.

```sh
$ yarn test:e2e:content
```

### Linting

Based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
Most notable difference: No [semicolon](https://eslint.org/docs/rules/semi) at
the end of a statement.

```sh
$ yarn lint
```

### Bundle analyzer

Visualize bundle contents using
[Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer).

```sh
$ yarn workspace @innodoc/client-web build:analyze
```
