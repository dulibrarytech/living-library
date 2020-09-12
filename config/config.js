/**

 Copyright 2020 University of Denver

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

'use strict';

module.exports = {
    host: process.env.HOST,
    ldap: process.env.LDAP_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenAlgo: process.env.TOKEN_ALGO,
    tokenExpires: process.env.TOKEN_EXPIRES,
    tokenIssuer: process.env.TOKEN_ISSUER,
    apiKey: process.env.API_KEY,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbDonationsTable: process.env.DB_DONATIONS_TABLE,
    dbRelationshipsTable: process.env.DB_RELATIONSHIPS_TABLE,
    dbStatesTable: process.env.DB_STATES_TABLE,
    dbSubjectAreasTable: process.env.DB_SUBJECT_AREAS_TABLE,
    dbTitlesTable: process.env.DB_TITLES_TABLE,
    dbOrigDonorTable: process.env.DB_ORIG_DONOR_TABLE,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailFromAddress: process.env.EMAIL_FROM_ADDRESS,
    emailLibrarian: process.env.EMAIL_LIBRARIAN,
    emailExternalRelations: process.env.EMAIL_EXTERNAL_RELATIONS,
    emailDeveloper: process.env.EMAIL_DEVELOPER,
    queuedDonationBaseUrl: process.env.QUEUED_DONATION_BASE_URL
};
