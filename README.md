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
and [pnpm](https://pnpm.io/) installed on your system. For Node.js use your
distro package manager. [nvm](https://github.com/creationix/nvm) is also an
excellent option to install a current version of Node.js into your home
directory.

The software is built and tested on Linux systems. Using it on other operating
systems might work, but your mileage may vary.

#### 1. Install dependencies

Install node packages.

```sh
$ pnpm install
```

#### 2. Configuration

Copy the example configuration `.env` to `.env.local` and edit to your liking.

#### 3. Build the application

```sh
$ pnpm build
```

An optimized production build can be found in the directory `app/src/.next`.

#### 4. Start the production server

This will start the web server that serves the web application.

```sh
$ pnpm start
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

Configuration options are set in the `.env.local` file or through environment
variables. You can use `.env` as a basis. For `docker run` you might want to use
`--env` or `--env-file`.

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
[workspaces](https://pnpm.io/pnpm-workspace_yaml).

### Development server

The development server compiles code on-the-fly and therefore there's no need
to build in advance.
[Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/)
is activated by default.

```sh
$ pnpm dev
```

### Automated Tests

This software package makes use of automated software testing. It follow this
principle:

> The more your tests resemble the way your software is used, the more
> confidence they can give you.
>
> -- <cite>@kentcdodds</cite>

In practice, this means our test suite consists mainly of integration and E2E
tests while unit tests are used sparingly where appropriate.

[Vitest](https://vitest.dev/) runs the unit and integration tests of every
workspace package.

```sh
$ pnpm test
```

We use [React Testing
Library](https://testing-library.com/docs/react-testing-library/intro) for
writing maintainable tests, avoiding testing implentation details of our
components. `createTestHarness()` from `packages/ui-test-utils` wires a store,
the mock API and a route manager together; pass it a `courseSlugMode` to render
components under a given URL scheme.

#### E2E tests

[Playwright](https://playwright.dev/) is used for E2E testing.

This spawns the app automatically, serves it with the mock API so no database is
needed, and shuts it down afterwards. As the dev server listens on HTTPS, it
expects a certificate in `apps/backend/cert`:

```sh
$ pnpm --filter @innodoc/backend run dev:mkcert
```

```sh
$ pnpm test:e2e
```

The course slug mode changes where a course sits in the URL, so the suite is run
against each mode:

```sh
$ INNODOC_COURSE_SLUG_MODE=URL pnpm test:e2e
```

For failed tests a screenshot will be taken automatically and placed into the
directory `e2e/screenshots`. The HTML report lists every run:

```sh
$ pnpm test:e2e:show-report
```

### Linting

```sh
$ pnpm lint
```

### Bundle analyzer

Visualize bundle contents using
[Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer).

```sh
$ pnpm @innodoc/app build:analyze
```
