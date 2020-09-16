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

require('dotenv').config({ path: '../.env' });

const ASYNC = require('async'),
      DB = require('../config/db')(),
      CONFIG = require('../config/config');

if (typeof CONFIG.dbOrigDonorTable === 'undefined') {
    console.log('ERROR: CONFIG.dbOrigDonorTable is undefined. Make sure you ' +
                'are running this script from within its own directory.');
}

/*
  SELECT person_id, GROUP_CONCAT(hobbies SEPARATOR ', ')
  FROM peoples_hobbies
  GROUP BY person_id;
*/

DB(CONFIG.dbOrigDonorTable)
    .join(CONFIG.dbOrigDonationAmountTable,
          CONFIG.dbOrigDonorTable + '.donorID', '=',
          CONFIG.dbOrigDonationAmountTable + '.donorID')
    .join(CONFIG.dbOrigDonationSubjectAreaTable,
          CONFIG.dbOrigDonorTable + '.donorID', '=',
          CONFIG.dbOrigDonationSubjectAreaTable + '.donorID')
    .select(CONFIG.dbOrigDonorTable + '.donorID as id',
            CONFIG.dbOrigDonorTable + '.donorTitle as donor_title',
            CONFIG.dbOrigDonorTable + '.donorFirstName as donor_first_name',
            CONFIG.dbOrigDonorTable + '.donorLastName as donor_last_name',
            DB.raw('GROUP_CONCAT(`subject`) as `donor_subject_areas`'))
    .where(CONFIG.dbOrigDonorTable + '.donorID', 1)
    .groupBy(CONFIG.dbOrigDonorTable + '.donorID')
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });
