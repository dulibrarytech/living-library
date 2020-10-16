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

```
go into living-library
npm install
if it doesn't work the first time delete the node_modules folder and npm install
have mysql 5.4 - 5.7
add .env file in root folder (see .env-example)
define the API route in your .env file (see API_ROUTE variable)
create a mysql database named "livinglibrary" (or whatever value you give to the DB_NAME variable in your .env file)
import livinglibrary.sql (schema only, no content; for schema & example content, see livinglibrary_with_example_content.sql)
run "node living-library.js"
http://localhost:8000/[API_ROUTE]?api_key=[API_KEY]
(where API_ROUTE and API_KEY are defined in your .env file)
```

### Maintainers

@scottsalvaggio

### Acknowledgements

@freyesdulib, @jrynhart, @kimpham54

## Releases
* v0.1.0-beta [release]() [notes]()


## Contact

Ways to get in touch:

* Kim Pham (IT Librarian at University of Denver) - kim.pham60@du.edu
* Create an issue in this repository
