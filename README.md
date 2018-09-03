[![build status](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/build.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master) [![coverage report](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/badges/master/coverage.svg)](https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp/commits/master)

# innoDoc web app

HTML viewer for interactive educational content.

## Running

### Using Docker

You can use the provided `Dockerfile` to run the application.

    $ docker build \
      --tag innodoc-webapp \
      --build-arg CONTENT_ROOT=https://example.com/content/ \
      https://gitlab.tubit.tu-berlin.de/innodoc/innodoc-webapp.git
    $ docker run -d -p 8000:8000 innodoc-webapp

### Manually

#### Requirements

Please make sure you have a current version of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system. Use your package manager of choice or use [nvm](https://github.com/creationix/nvm) for an installation in your home directory.

#### Install dependencies

Install node packages
```sh
$ npm install
```
Install MathJax submodule
```sh
$ git submodule init
$ git submodule update --remote
```

#### Configuration

Copy example configuration `.env.example` to `.env` and edit to your liking.
The web app is loading course content from `CONTENT_ROOT`. You may want to
adjust this built-time variable.

#### Build bundles

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

### Tests

[Jest](https://jestjs.io/) and [Enzyme](http://airbnb.io/enzyme/) are used for testing.

```sh
$ npm run test
```

#### Watch tests

```sh
$ npm run test:watch
```

#### Show coverage

```sh
$ npm run test:coverage
```

### Linting

```sh
$ npm run lint
```

Based on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). Most notable difference: We're not using semicolons at the end of a statement.

### Bundle analyzer

Visualize bundles using `webpack-bundle-analyzer`.

```sh
$ BUNDLE_ANALYZE=both npm run build
```
