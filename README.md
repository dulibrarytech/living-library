# Living Library

## Table of Contents

* [README](#readme)
* [Releases](#releases)
* [Contact](#contact)

## README

### Background

This API allows users to view, create, update and delete library donations.

In the context of this API, a donation is a monetary donation to the library.
The donation results in the library adding a book plate to a book in its
collection.

Each donation record includes information about:
* donor
* who should be notified of the donation
* recipient
* amount of donation
* date of donation
* subject areas (to help choose the book)
* book (which contains the book plate dedicated to the recipient)

### Contributing

Check out our [contributing guidelines](/CONTRIBUTING.md) for ways to offer feedback and contribute.

### Licenses

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

All other content is released under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/).

### Local Environment Setup

* Go into `living-library` folder (i.e. root folder of app)
* Run `npm install`
* If it doesn't work the first time, delete the `node_modules` folder and rerun `npm install`
* Have mysql 5.4 - 5.7
* Add `.env` file to root folder of app (you can copy `.env-example`)
* Define the `API_ROUTE` and `API_KEY` variables in your `.env` file
* Create a mysql database named `livinglibrary` (or whatever value you give to
  the `DB_NAME` variable in your `.env` file)
* Define the variables from the `# Database` section of your `.env` file (see `.env-example`)
* Import `livinglibrary.sql` (for schema only, no content) or
  `livinglibrary_with_example_content.sql` (for schema & example content)
* Make sure the variables from the `# Tables from new database schema` section of
  your `.env` file (see `.env-example`) match your mysql database

#### To run app over HTTPS:
* Define the `SSL_KEY` and `SSL_CERTIFICATE` variables in your `.env` file
* Run `node living-library.js`
* Go to `https://localhost:8000/API_ROUTE?api_key=API_KEY`
  (i.e. `HOST + API_ROUTE + "?api_key=" + API_KEY`), where `HOST`, `API_ROUTE`,
  and `API_KEY` are defined in your `.env` file

#### To run app over HTTP:
* In your `.env` file, make sure the `HOST`, `API_URL`, and `CORS_ALLOWED_ORIGIN`
  variables have values that begin with `http` rather than `https`
* In `config/express.js`, change `const HTTPS = require('https')` to
  `const HTTP = require('http')`.
  Also, change
  ```
  SERVER = HTTPS.createServer({
      key: FS.readFileSync(CONFIG.sslKey),
      cert: FS.readFileSync(CONFIG.sslCertificate)
  }, APP);
  ```
  to `SERVER = HTTP.createServer(APP);`
* Run `node living-library.js`
* Go to `http://localhost:8000/API_ROUTE?api_key=API_KEY`
  (i.e. `HOST + API_ROUTE + "?api_key=" + API_KEY`), where `HOST`, `API_ROUTE`,
  and `API_KEY` are defined in your `.env` file

### Maintainers

@scottsalvaggio

### Acknowledgements

@freyesdulib, @jrynhart, @kimpham54

## Releases
* [v1.0.0](https://github.com/dulibrarytech/living-library/releases/tag/v1.0.0)

## Contact

Ways to get in touch:

* Kim Pham (IT Librarian at University of Denver) - kim.pham60@du.edu
* Create an issue in this repository
