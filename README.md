# innoDoc web app

HTML viewer for interactive educational content.

## Setup environment

### Requirements

Please make sure you have a current version of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system. Use your package manager of choice or use [nvm](https://github.com/creationix/nvm) for an installation in your home directory.

### Install dependencies

Install node packages
```sh
$ npm install
```
Install Mathjax submodule
```sh
$ git submodule init
$ git submodule update --remote
```

## Deployment

### Configuration

Copy example configuration `.env.example` to `.env` and edit to your liking.

```sh
$ cp .env.example .env
```

### Build

```sh
$ npm run build
```

### Production server

```sh
$ npm run start
```

Find the resulting build in `.next/dist`.

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
