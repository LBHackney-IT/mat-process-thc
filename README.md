# Manage a Tenancy - Tenancy and Household Check

## Technical overview

This project is built with [TypeScript](https://www.typescriptlang.org/) and
[Next.js](https://nextjs.org/).

We use:

- [`styled-jsx`](https://github.com/zeit/styled-jsx) for styling components
- [Normalize.css](http://necolas.github.io/normalize.css/) to normalize styles
  across browsers
- [Docker](https://www.docker.com/) to deploy and run the service
- [Jest](https://jestjs.io/), [Cucumber](https://cucumber.io/), and
  [Selenium WebDriver](https://seleniumhq.github.io/selenium/docs/api/javascript/)
  for building and running tests
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for code formatting

## Dependencies

- [Node.js](https://nodejs.org/)

  We assume you are using the version of Node.js documented in
  [`.node-version`](.node-version). We recommend using
  [`nodenv`](https://github.com/nodenv/nodenv) with
  [`node-build-update-defs`](https://github.com/nodenv/node-build-update-defs)
  to manage Node.js versions.

- Google Chrome and
  [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home) or
  Firefox and [geckodriver](https://github.com/mozilla/geckodriver)

  We use these for running feature tests locally. Make sure your installed
  versions match each other.

## Getting started

1. Install the required packages:

   ```bash
   npm install
   ```

1. Run the development server:

   ```bash
   npm run dev
   ```

1. Navigate to [`http://localhost:3000`](http://localhost:3000).

## Running the tests

We use [Jest](https://jestjs.io/) for testing. Feature tests are driven by
[Selenium Webdriver](https://seleniumhq.github.io/selenium/docs/api/javascript/)
to test in browser.

To run the unit tests:

```bash
npm run test:unit
```

To run the unit tests, updating changed snapshots:

```bash
npm run test:unit:update
```

To run the unit tests in watch mode:

```bash
npm run test:unit:watch
```

To run the feature tests:

```bash
npm run test:feature
```

To run the feature tests, updating changed snapshots:

```bash
npm run test:feature:update
```

To run the feature tests in watch mode (running against a development server for
code change watching):

```bash
npm run test:feature:watch
```

To run the full test suite:

```bash
npm run test:all
```

To run the full test suite, updating changed snapshots:

```bash
npm run test:all:update
```

To run the full test suite, including format checking and linting:

```bash
npm test
```

To run the full test suite, including format checking and linting, fixing any
issues and updating snapshots:

```bash
npm run test:update
```

### Browser support

We support running the feature tests in Google Chrome and Firefox, headless or
not.

The following environment variables customize the browser options for testing:

- `TEST_BROWSER` determines the browser to use.

  Accepted values:

  - `chrome` **(default)**
  - `firefox`

- `TEST_HEADLESS` determines if we run the browser in headless mode or not.

  Accepted values:

  - `0` for off
  - `1` for on **(default)**

## Formatting the code

We use [Prettier](https://prettier.io/) to format our code. There are lots of
[editor integrations](https://prettier.io/docs/en/editors.html) available, and
the style is enforced by a Git pre-commit hook.

To run the formatter:

```bash
npm run format
```

## Linting the code

We use [ESLint](https://eslint.org/), in addition to TypeScript's compiler, for
verifying correctness and maintainability of code.

To run the linter:

```bash
npm run lint
```

To run the linter in fix mode:

```bash
npm run lint:fix
```

We can also check that all files (except `package.json` and `package-lock.json`
because Dependabot can get very noisy) have code owners:

```sh
npm run lint:codeowners
```

## Architecture decision records

We use ADRs to document architecture decisions that we make. They can be found
in `docs/adr` and contributed to with
[adr-tools](https://github.com/npryce/adr-tools).

## Access

TODO: Document how people can find the service and its different environments.

## Source

This repository was bootstrapped from dxw's
[`react-template`](https://github.com/dxw/react-template).
