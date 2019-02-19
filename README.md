[![build status](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/build.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master) [![coverage report](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/coverage.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master)

# innoDoc web app

HTML viewer for interactive educational content.

## Running

The easiest way to get up and running is to use Docker.

**Note:** For the application to do anything useful, you need to tell it where
to load content from. Content is static data served from ordinary HTTPS. To do
so, point `CONTENT_ROOT` to a content server that provides a `manifest.json`
file. Check the [innoConv project](innodoc/innoconv) for details.

### Using Docker

```sh
$ docker run \
  --detach \
  --pull \
  --publish 8000:8000 \
  --env CONTENT_ROOT="https://example.com/content/" \
  innodoc/innodoc-webapp
```

#### Building the image yourself

You can also use the provided `Dockerfile` to build and run the application.
First checkout this repository locally.

```sh
$ docker build --tag innodoc-webapp .
$ docker run \
  --detach \
  --publish 8000:8000 \
  --env CONTENT_ROOT="https://example.com/content/" \
  innodoc-webapp
```

### Manually

#### Requirements

Please make sure you have a current version of [Node.js](https://nodejs.org/)
and [npm](https://www.npmjs.com/) installed on your system. Use the package
manager of choice. [nvm](https://github.com/creationix/nvm) is a great
alternative to install a current version of Node.js in your home directory.

#### Install dependencies

Install node packages.

```sh
$ npm install
```

Install MathJax submodule.

```sh
$ git submodule init
$ git submodule update --remote
```

### Configuration

Copy the example configuration `.env.example` to `.env` and edit to your
liking. It's also possible to override the configuration in `.env` using
environment variables (e.g. when using Docker).

#### `CONTENT_ROOT`

The web app will look for a `manifest.json` file in this location and also
take it as a base URL for all content files.

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

#### Build application

```sh
$ npm run build
```

#### Start production server

```sh
$ npm run start
```

## Development

### Development server

```sh
$ npm run dev
```

### Unit tests

[Jest](https://jestjs.io/) and [Enzyme](http://airbnb.io/enzyme/) are used for testing.

```sh
$ npm run test
```

##### Coverage

Shows detailed coverage report and also produces `./coverage/lcov-report` that
can be viewed in a web browser.

```sh
$ npm run test:coverage
```

##### Watch tests

Run tests while editing files.

```sh
$ npm run test:watch
```

### E2E tests

[Puppeteer](https://pptr.dev/) is used for E2E testing.

Run E2E tests. (This will spawn app and content servers automatically before
running E2E tests. After running the tests both servers are shut down.)

```sh
$ npm run test:e2e
```

E2E tests can also be looked at while running.

```sh
$ npm run test:e2e:show
```

#### Serve test content

Serves content for use as `CONTENT_ROOT`. That comes in handy also for
development (port 8001 or configure using `CONTENT_PORT`).

```sh
$ npm run test:e2e:content
```

### Linting

Based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
Most notable difference: We're not using semicolons at the end of a statement.

```sh
$ npm run lint
```

### Bundle analyzer

Visualize bundles using `webpack-bundle-analyzer`.

```sh
$ BUNDLE_ANALYZE=both npm run build
```
