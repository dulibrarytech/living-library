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

let id = 10;

DB(CONFIG.dbOrigDonorTable)
    .join(CONFIG.dbOrigDonationAmountTable,
          CONFIG.dbOrigDonorTable + '.donorID', '=',
          CONFIG.dbOrigDonationAmountTable + '.donorID')
    .select('*')
    .where(CONFIG.dbOrigDonorTable + '.donorID', id)
    .then(function (data) {
        console.log('----Donor----');
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });

DB(CONFIG.dbOrigDonationSubjectAreaTable)
    .select('donorID', 'subject')
    .where('donorID', id)
    .then(function (data) {
        console.log('\n----Subject Areas----');
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });

DB(CONFIG.dbOrigNotifyTable)
    .select('*')
    .where('donorID', id)
    .then(function (data) {
        console.log('\n----Person to Notify----');
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });

DB(CONFIG.dbOrigRecipientTable)
    .select('*')
    .where('donorID', id)
    .then(function (data) {
        console.log('\n----Recipient----');
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });

DB(CONFIG.dbOrigBookTable)
    .select('*')
    .where('donorID', id)
    .then(function (data) {
        console.log('\n----Book----');
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });
