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
and [npm](https://www.npmjs.com/) installed on your system. Use your package
manager of choice. [nvm](https://github.com/creationix/nvm) is a great
alternative to install a current version of Node.js in your home directory.

The software is built and tested on Linux systems. Using it on other operating
systems might work, but your mileage may vary.

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

Copy the example configuration `.env.example` to `.env` and edit it to your
liking. It's possible to override the configuration in `.env` using environment
variables (e.g. when using Docker).

#### `CONTENT_ROOT`

The application will look for `manifest.json` in this location. It will also
serve as the base URL for content files.

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

### Deployment

As a web application server the software should be run behind a reverse proxy
that adds features such as TLS termination, static asset serving or load
balancing. The web has tons of helpful guides on how to do this.

Static assets are stored in the directory `/innodoc-webapp/src/.next/static`
in the Docker container.

Currently the application should be served directly from a domain (like
`myapp.example.com`) rather than from a sub-directory (like
`www.example.com/myapp`).

## Development

### Development server

```sh
$ npm run dev
```

### Unit tests

[Jest](https://jestjs.io/) and [Enzyme](http://airbnb.io/enzyme/) are used for
testing.

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

Run E2E tests. (This will spawn the app and content servers automatically
before running E2E tests. Afterwards both servers are shut down.)

```sh
$ npm run test:e2e
```

E2E tests can also be looked at while running.

```sh
$ npm run test:e2e:show
```

#### Serve test content

Serves content for use as `CONTENT_ROOT`. That comes in handy for development
and testing (port 8001 or configure using `CONTENT_PORT`). For production
you should set up a proper webserver to handle serving static content.

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
