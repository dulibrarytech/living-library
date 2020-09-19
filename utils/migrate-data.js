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
      DB = require('../config/db')();

let id = 102;
let error_msg_color = '\x1b[31m%s\x1b[0m', // red
    warning_msg_color = '\x1b[35m%s\x1b[0m', // magenta
    error_msg_text = 'Error when migrating data for id ' + id;

if (typeof CONFIG.dbOrigDonorTable === 'undefined') {
    console.error(error_msg_color, 'ERROR: CONFIG.dbOrigDonorTable is ' +
                  'undefined. Make sure you are running this script from ' +
                  'within its own directory.');
}

// 1.)
function query_donor_and_donation_amount(callback) {
    let obj = {};

    DB(CONFIG.dbOrigDonorTable)
        .join(CONFIG.dbOrigDonationAmountTable,
              CONFIG.dbOrigDonorTable + '.donorID', '=',
              CONFIG.dbOrigDonationAmountTable + '.donorID')
        .select(CONFIG.dbOrigDonorTable + '.donorID as id',
                'donorTitle as donor_title',
                'donorFirstName as donor_first_name',
                'donorLastName as donor_last_name',
                'donorAddress as donor_address',
                'donorCity as donor_city',
                'donorState as donor_state',
                'donorZip as donor_zip',
                'amountOfDonation as donor_amount_of_donation',
                'dateOfDonation as donor_date_of_donation',
                'donorNotes as donor_notes',
                CONFIG.dbOrigDonorTable + '.timestamp as created')
        .where(CONFIG.dbOrigDonorTable + '.donorID', id)
        .then(function (data) {
            console.log('----Donor----');
            console.log(data);
            if (data.length === 0) {
                console.warn(warning_msg_color, 'WARNING [query_donor_and_' +
                             'donation_amount function]: Knex query returned ' +
                             '0 results.');
                return false;
            } else {
                obj.id = data[0].id;
                obj.created = data[0].created;
                obj.donor = {};
                console.log('Data for donor ' + data[0].id + ':');
                for (let property in data[0]) {
                    console.log(property + ' = ' + data[0][property]);
                    if (property !== 'id' && property !== 'created') {
                        if (property === 'donor_amount_of_donation') {
                            // try to convert string to number
                            let amount = Number(data[0][property]);
                            if (isNaN(amount)) {
                                console.warn(warning_msg_color, 'WARNING ' +
                                             '[query_donor_and_donation_' +
                                             'amount function]: donor_amount_' +
                                             'of_donation = ' +
                                             data[0][property] + ', which is ' +
                                             'not a valid number.');
                                obj.donor[property] = data[0][property];
                            } else {
                                obj.donor[property] = amount;
                            }
                        } else {
                            obj.donor[property] =
                                get_valid_value(data[0][property]);
                        }
                    }
                }
            }
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_donor_and_donation_' +
                          'amount function]: ' + error_msg_text + ': ' + error);
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
            if (data.length === 0) {
                console.warn(warning_msg_color, 'WARNING [query_subject_area ' +
                             'function]: Knex query returned 0 results.');
            }
            let subject_areas = [];
            for (let subject of data) {
                subject_areas.push(get_valid_value(subject.subject));
            }
            console.log('subject_areas = ');
            console.log(subject_areas);
            obj.donor.donor_subject_areas = subject_areas;
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_subject_area ' +
                          'function]: ' + error_msg_text + ': ' + error);
        });
}

// 3.)
function query_who_to_notify(obj, callback) {
    DB(CONFIG.dbOrigNotifyTable)
        .select('notifyTitle as notify_title',
                'notifyFirstName as notify_first_name',
                'notifyLastName as notify_last_name',
                'notifyAddress as notify_address',
                'notifyCity as notify_city',
                'notifyState as notify_state',
                'notifyZip as notify_zip',
                'notifyRelationToDonor as notify_relation_to_donor')
        .where('donorID', id)
        .then(function (data) {
            console.log('\n----Person to Notify----');
            console.log(data);
            if (data.length === 0) {
                console.warn(warning_msg_color, 'WARNING [query_who_to_notify '
                             + 'function]: Knex query returned 0 results.');
            }
            let who_to_notify = [];
            for (let person_to_notify of data) {
                let containsNonEmptyElementValue = false,
                    person_obj = {};
                for (let property in person_to_notify) {
                    console.log(property + ' = ' + person_to_notify[property]);
                    person_obj[property] =
                        get_valid_value(person_to_notify[property]);
                    if (person_obj[property] !== '') {
                        containsNonEmptyElementValue = true;
                    }
                }
                if (containsNonEmptyElementValue) {
                    who_to_notify.push(person_obj);
                } else {
                    console.warn(warning_msg_color, 'WARNING [query_who_to_' +
                                 'notify function]: id ' + id + ' contains ' +
                                 'empty record in ' + CONFIG.dbOrigNotifyTable +
                                 ' table.');
                }
            }
            console.log('who_to_notify = ');
            console.log(who_to_notify);
            obj.who_to_notify = who_to_notify;
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_who_to_notify ' +
                          'function]: ' + error_msg_text + ': ' + error);
        });
}

// 4.)
function query_recipient(obj, callback) {
    DB(CONFIG.dbOrigRecipientTable)
        .select('recipientTitle as recipient_title',
                'recipientFirstName as recipient_first_name',
                'recipientLastName as recipient_last_name',
                'recipientDonationType as recipient_donation_type')
        .where('donorID', id)
        .then(function (data) {
            console.log('\n----Recipient----');
            console.log(data);
            if (data.length === 0 || data.length > 1) {
                console.warn(warning_msg_color, 'WARNING [query_recipient ' +
                             'function]: Knex query returned ' + data.length +
                             ' results.');
            }
            if (data.length === 0) {
                obj.recipient = null;
            } else {
                obj.recipient = {};
                for (let property in data[0]) {
                    console.log(property + ' = ' + data[0][property]);
                    obj.recipient[property] =
                        get_valid_value(data[0][property]);
                }
            }
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_recipient function]: '
                          + error_msg_text + ': ' + error);
        });
}

// 5.)
function query_book(obj, callback) {
    DB(CONFIG.dbOrigBookTable)
        .select('authorName as book_author_name',
                'bookTitle as book_title',
                'bibliographicNumber as book_bibliographic_number',
                'callNumber as book_call_number',
                'publisher as book_publisher',
                'datePublished as book_date_published',
                'timestamp as book_timestamp')
        .where('donorID', id)
        .then(function (data) {
            console.log('\n----Book----');
            console.log(data);
            if (data.length === 0 || data.length > 1) {
                console.warn(warning_msg_color, 'WARNING [query_book ' +
                             'function]: Knex query returned ' + data.length +
                             ' results.');
            }
            if (data.length === 0) {
                obj.book = null;
                obj.is_completed = 0;
            } else {
                obj.book = {};
                for (let property in data[0]) {
                    console.log(property + ' = ' + data[0][property]);
                    obj.book[property] = get_valid_value(data[0][property]);
                }
                obj.is_completed = 1;
            }
            callback(null, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_book function]: ' +
                          error_msg_text + ': ' + error);
        });
}

ASYNC.waterfall([
   query_donor_and_donation_amount,
   query_subject_area,
   query_who_to_notify,
   query_recipient,
   query_book
], function (error, results) {
    console.log('\nInside waterfall function');
    console.log('results (as object) = ');
    console.log(results);
    console.log('results (as stringified JSON) = ' + JSON.stringify(results));

    if (error) {
        console.error(error_msg_color, 'ERROR [async.waterfall]: ' +
                      error_msg_text + ': ' + error);
    }

    console.log('\nEnd of migration attempt for record ' + id + '\n' +
                '=====================\n');
});

/**
 * If string, returns trimmed value (and removes the '.' character if that's the
 * only character in the string after trimming); if not a string, returns value
 * as is.
 * @param    {(number|string)}    value    the value to check
 * @returns  {(number|string)}             the trimmed string (if value is a
 *                                         string); otherwise, the value as is
 */
const get_valid_value = function (value) {
    if (typeof value === 'string') {
        value = value.trim();
        return value === '.' ? '' : value;
    }
    return value;
};
