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
      MOMENT = require('moment');

let error_msg_color = '\x1b[31m%s\x1b[0m', // red
    warning_msg_color = '\x1b[35m%s\x1b[0m'; // magenta

if (typeof CONFIG.dbOrigDonorTable === 'undefined') {
    console.error(error_msg_color, 'ERROR: CONFIG.dbOrigDonorTable is ' +
                  'undefined. Make sure you are running this script from ' +
                  'within its own directory.');
}

// Reset isMigrated flags in source database table
DB(CONFIG.dbOrigDonorTable)
    .update('isMigrated', 0)
    .then(function (num_reset) {
        if (num_reset > 0) {
            console.log('Successfully reset isMigrated flag for ' +
                        num_reset + ' records.');
        } else {
            console.error(error_msg_color, 'ERROR: Unable to reset isMigrated '
                          + 'flags. Records updated = ' + num_reset);
        }
    })
    .catch(function (error) {
        console.error(error_msg_color, 'ERROR during or after Knex query to ' +
                      'reset isMigrated flags: ' + error);
    });

// 1.)
function query_donor_and_donation_amount(callback) {
    let obj = {},
        id;

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
        .where(CONFIG.dbOrigDonorTable + '.isMigrated', 0)
        .limit(1)
        .then(function (data) {
            if (data.length === 0) {
                clearInterval(timer);
                console.log('Migration completed. Press CTRL-C to exit.');
                return;
            }

            console.log('\n----Donor----');
            console.log(data);
            if (data.length === 0) {
                console.warn(warning_msg_color, 'WARNING [query_donor_and_' +
                             'donation_amount function]: Knex query returned ' +
                             '0 results.');
                return false;
            } else {
                id = data[0].id;
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
                                obj.donor[property] =
                                    get_valid_value(data[0][property]);
                            } else {
                                obj.donor[property] = amount;
                            }
                        } else if (property === 'donor_date_of_donation') {
                            let date = MOMENT(data[0][property]);
                            obj.donor[property] = date.format('YYYY-MM-DD');
                            console.log('obj.donor[' + property + '] = ' +
                                        obj.donor[property]);
                        } else {
                            obj.donor[property] =
                                get_valid_value(data[0][property]);
                        }
                    }
                }
            }
            callback(null, id, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_donor_and_donation_' +
                          'amount function]: ' + get_error_msg_text(id) +
                          ': ' + error);
        });
}

// 2.)
function query_subject_area(id, obj, callback) {
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
            callback(null, id, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_subject_area ' +
                          'function]: ' + get_error_msg_text(id) + ': ' +
                          error);
        });
}

// 3.)
function query_who_to_notify(id, obj, callback) {
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
                                 'notify function]: id ' + id +
                                 ' contains empty record in ' +
                                 CONFIG.dbOrigNotifyTable + ' table.');
                }
            }
            console.log('who_to_notify = ');
            console.log(who_to_notify);
            obj.who_to_notify = who_to_notify;
            callback(null, id, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_who_to_notify ' +
                          'function]: ' + get_error_msg_text(id) + ': ' +
                          error);
        });
}

// 4.)
function query_recipient(id, obj, callback) {
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
            callback(null, id, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_recipient function]: '
                          + get_error_msg_text(id) + ': ' + error);
        });
}

// 5.)
function query_book(id, obj, callback) {
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
            callback(null, id, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [query_book function]: ' +
                          get_error_msg_text(id) + ': ' + error);
        });
}

// 6.)
function add_donation_to_db(id, obj, callback) {
    console.log('Before stringifying JSON fields, obj = ');
    console.log(obj);

    // Stringify JSON fields
    obj.donor = JSON.stringify(obj.donor);
    obj.who_to_notify = JSON.stringify(obj.who_to_notify);
    obj.recipient = JSON.stringify(obj.recipient);
    if (obj.book !== null) {
        obj.book = JSON.stringify(obj.book);
    }

    console.log('After stringifying JSON fields, obj = ');
    console.log(obj);

    DB(CONFIG.dbDonationsTable)
        .insert(obj)
        .then(function (data) {
            console.log('Successfully added donation record to database. ' +
                        'New id = ' + data);
            callback(null, id, obj);
            return false;
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR [add_donation_to_db ' +
                          'function]: ' + get_error_msg_text(id) + ': ' +
                          error);
        });
}

// 7.)
function set_isMigrated_flag(id, obj, callback) {
    DB(CONFIG.dbOrigDonorTable)
        .where({
            donorID: id
        })
        .update('isMigrated', 1)
        .then(function (num_reset) {
            if (num_reset === 1) {
                console.log('Successfully set isMigrated flag for id ' + id);
                callback(null, id);
            } else {
                console.error(error_msg_color, 'ERROR: [set_isMigrated_flag ' +
                              'function]: isMigrated flag for record with id ' +
                              id + ' may not have been updated because ' +
                              'num_reset = ' + num_reset);
            }
        })
        .catch(function (error) {
            console.error(error_msg_color, 'ERROR: [set_isMigrated_flag ' +
                          'function]: ' + get_error_msg_text(id) + ': ' +
                          error);
        });
}

let timer = setInterval(function () {
    ASYNC.waterfall([
        query_donor_and_donation_amount,
        query_subject_area,
        query_who_to_notify,
        query_recipient,
        query_book,
        add_donation_to_db,
        set_isMigrated_flag
    ], function (error, id) {
        console.log('\nInside waterfall function');

        if (error) {
            console.error(error_msg_color, 'ERROR [async.waterfall]: ' +
                          get_error_msg_text(id) + ': ' + error);
        }
        console.log('\nEnd of migration attempt for record ' + id + '\n' +
                    '=====================\n');
    });
}, 500);

/**
 * Returns error message text for the given id.
 * @param    {(number|string)}    id    the id of the relevant record
 * @returns  {string}                   the error message text
 */
const get_error_msg_text = function (id) {
    return 'Error when migrating data for id ' + id;
};

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
