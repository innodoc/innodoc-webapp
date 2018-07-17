# innoDoc web app

HTML viewer for interactive educational content.

## Deployment

### Configuration

TODO

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

### Setup environment

Install node packages
```sh
$ npm install
```
Install Mathjax submodule
```sh
$ git submodule init
$ git submodule update --remote
```

### Development server

```sh
$ npm run dev
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
