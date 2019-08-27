[![build status](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/build.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master) [![coverage report](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/coverage.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master)

# innoDoc web app

HTML viewer for interactive educational content.

## Running the application

### Serving content to the application

For the application to do anything useful, you need to tell it where to load
content from. Content is static data served from ordinary HTTPS. To do so,
point `CONTENT_ROOT` to a content server that provides a `manifest.json` file.

For trying things out you could use demo content from
`https://veundmint.innocampus.tu-berlin.de/_content/`.

Check the [innoConv project](innodoc/innoconv) for details.

### Docker

The easiest way to get started is to use the prebuilt image.

```sh
$ docker run \
  --detach \
  --publish 8000:8000 \
  --env CONTENT_ROOT="https://example.com/content/" \
  innodoc/innodoc-webapp
```

#### Building the Docker image

You can also use the provided `Dockerfile` to build and run the application.
First checkout this repository locally. Inside the repository run the following
commands.

```sh
$ docker build --tag innodoc-webapp .
$ docker run \
  --detach \
  --publish 8000:8000 \
  --env CONTENT_ROOT="https://example.com/content/" \
  innodoc-webapp
```

### Manually building the application

Another way is to install and run the application locally on your machine.

#### Requirements

Please make sure you have a current version of [Node.js](https://nodejs.org/)
and [Yarn](https://yarnpkg.com/) installed on your system.

For Node.js use your package manager of choice.
[nvm](https://github.com/creationix/nvm) is an excellent option to install a
current version of Node.js into your home directory.

The software is built and tested on Linux systems. Using it on other operating
systems might work, but your mileage may vary.

#### Install dependencies

Install node packages.

```sh
$ yarn install
```

Install MathJax submodule.

```sh
$ git submodule init
$ git submodule update --remote
```

### Configuration

Copy the example configuration `.env.example` to `.env` and edit it to your
liking. It's possible to override the configuration in `.env` using environment
variables (e.g. when using Docker).

#### `CONTENT_ROOT`

The application will look for `manifest.json` in this location. It will also
serve as the base URL for content files unless `STATIC_ROOT` is specified.

**Example:** `https://example.com/content/`

#### `STATIC_ROOT`

Static files location. Can be used to deploy static data to a CDN or similar.

**Example:** `https://cdn.example.com/`

**Default:** `${CONTENT_ROOT}_static/`

#### `PROD_PORT`

The port the web app is listening on in production.

**Example:** `8000`

#### `DEV_PORT`

The port the web app is listening on in development.

**Example:** `3000`

#### `SECTION_PATH_PREFIX`

The first URL component for sections. Having a section `foo/bar` the default
results in the URL `example.com/section/foo/bar` while
`SECTION_PATH_PREFIX=s` would result in `example.com/s/foo/bar`.

**Example:** `s`

**Default:** `section`

#### `PAGE_PATH_PREFIX`

Similar to `SECTION_PATH_PREFIX` this can be used to customize the first URL
component for pages.

**Example:** `p`

**Default:** `page`

#### Build application

```sh
$ yarn build
```

The optimized production can be found in the directory
`packages/client-web/src/.next`.

#### Start production server

```sh
$ yarn start
```

Before starting the server you need to build the application.

### Deployment

Web applications usually run behind a reverse proxy to provide features such as
TLS termination, static asset serving or load balancing. The web has tons of
helpful guides on how to do this.

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

##### Watch tests

Run tests while editing files.

```sh
$ yarn test:watch
```

### E2E tests

[Puppeteer](https://pptr.dev/) is used for E2E testing.

Run E2E tests.

This will spawn the app and content servers automatically before running E2E
tests. Afterwards both servers are shut down. You will need to build the app
before this.

```sh
$ yarn test:e2e
```

E2E tests can also be looked at while running.

```sh
$ yarn test:e2e:show
```

For failed tests a screenshot will be taken automatically and placed into the
directory `packages/client-web/e2e/screenshots`.

#### Serve test content

Serve content for use as `CONTENT_ROOT`. That comes in handy for development
and testing (port 8001 or configure using `CONTENT_PORT`). For production
you should set up a proper web server to handle static content.

```sh
$ yarn test:e2e:content
```

### Linting

Based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
Most notable difference: We're not using semicolons at the end of a statement.

```sh
$ yarn lint
```

### Bundle analyzer

Visualize bundle contents using
[Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer).

```sh
$ cd packages/client-web && yarn build:bundle-analyze
```
