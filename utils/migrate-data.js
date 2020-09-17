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
      CONFIG = require('../config/config'),
      DB = require('../config/db')(),
      LOGGER = require('../libs/log4');

if (typeof CONFIG.dbOrigDonorTable === 'undefined') {
    console.log('ERROR: CONFIG.dbOrigDonorTable is undefined. Make sure you ' +
                'are running this script from within its own directory.');
}

let id = 10;

// 1.)
function query_donor_and_donation_amount(callback) {
    let obj = {};

    DB(CONFIG.dbOrigDonorTable)
        .join(CONFIG.dbOrigDonationAmountTable,
              CONFIG.dbOrigDonorTable + '.donorID', '=',
              CONFIG.dbOrigDonationAmountTable + '.donorID')
        .select('*')
        .where(CONFIG.dbOrigDonorTable + '.donorID', id)
        .then(function (data) {
            console.log('----Donor----');
            console.log(data);
            obj.donor = data;
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            LOGGER.module().error('ERROR [/utils/migrate-data module ' +
                                  '(query_donor_and_donation_amount)] Error ' +
                                  'when migrating data for id ' + id + ': ' +
                                  error);
        });
}

// 2.)
function query_subject_area(obj, callback) {
    DB(CONFIG.dbOrigDonationSubjectAreaTable)
        .select('donorID', 'subject')
        .where('donorID', id)
        .then(function (data) {
            console.log('\n----Subject Areas----');
            console.log(data);
            obj.subject_areas = data;
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            LOGGER.module().error('ERROR [/utils/migrate-data module ' +
                                  '(query_subject_area)] Error when migrating ' +
                                  'data for id ' + id + ': ' + error);
        });
}

/*
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
*/

ASYNC.waterfall([
   query_donor_and_donation_amount,
   query_subject_area
], function (error, results) {
    console.log("\nInside waterfall function");
    console.log("result = ");
    console.log(results);

    if (error) {
        LOGGER.module().error('ERROR: [/utils/migrate-data module ' +
                              '(async.waterfall)] Error when migrating data ' +
                              'for id ' + id + ': ' + error);
    }

    console.log('\nEnd of migration attempt for record ' + id + '\n' +
                '=====================\n');
});
