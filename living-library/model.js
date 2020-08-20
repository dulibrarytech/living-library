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

const LOGGER = require('../libs/log4'),
      ASYNC = require('async'),
      DB = require('../config/db')(),
      MOMENT = require('moment'),
      NODEMAILER = require('nodemailer'),
      CONFIG = require('../config/config'),
      {JSDOM} = require('jsdom'),
      WINDOW = new JSDOM('').window;

// Configures email sending
let transporter = NODEMAILER.createTransport({
    host: CONFIG.emailHost,
    port: CONFIG.emailPort
    /*
    debug: true,
    logger: true
    */
},
{
    from: CONFIG.emailFromAddress
});

// Initial body text of all email notifications (whether plaintext or html)
const do_not_respond_email_text = '**Please do not respond to this email**',
      do_not_respond_html_email_text = '<h3>' + do_not_respond_email_text +
                                       '</h3>';

/**
 * Sends email
 * @param  {Object}  message   the nodemailer message configuration object
 * @param  {Object}  id        the id of the relevant donation record
 */
const send_email = function (message, id) {
    console.log('Inside send_email helper function');

    transporter.sendMail(message, function(error, info) {
        if (error) {
            LOGGER.module().error('ERROR: [/living-library/model module ' +
                                  '(send_email)] Unable to send notification ' +
                                  'email for record with donation id ' + id +
                                  ': ' + error);
        } else {
            console.log('Notification email sent successfully for record ' +
                        'with donation id ' + id + ":");
            console.log(info.envelope);
        }

        console.log('=====================\n');
    });
};

/**
 * Creates record
 * @param req
 * @param callback
 */
exports.create = function (req, callback) {
    console.log("Before req.body is decoded:");
    console.log("req.body = ");
    console.log(req.body);
    console.log("typeof req.body = " + typeof req.body);
    let request_body = decode_HTML(req.body);
    console.log("After req.body is decoded:");
    console.log("request_body = ");
    console.log(request_body);
    console.log("typeof request_body = " + typeof request_body);

    /**
     * Donations table query URL (if there's no tbl parameter, default to querying tbl_donations):
     * POST new record to donations table: SITE_URL/api/v1/living-library/donations?api_key=API_KEY
     *
     * Lookup table query URLs:
     * POST new record to subject areas table: SITE_URL/api/v1/living-library/donations?tbl=subject_areas&api_key=API_KEY
     * POST new record to titles table: SITE_URL/api/v1/living-library/donations?tbl=titles&api_key=API_KEY
     * POST new record to relationships table: SITE_URL/api/v1/living-library/donations?tbl=relationships&api_key=API_KEY
     */

    let tbl = get_empty_or_lowercase_string(req.query.tbl),
        table_name = get_table_name(tbl);

    switch(table_name) {
        case "": {
            /* Validate request_body */

            // Expected fields
            const donation_fields = ['donor', 'who_to_notify', 'recipient'];

            // Expected keys for each donation field
            const donation_field_keys = {
                donor: ['donor_title', 'donor_first_name',
                        'donor_last_name', 'donor_address',
                        'donor_city', 'donor_state', 'donor_zip',
                        'donor_amount_of_donation',
                        'donor_date_of_donation', 'donor_notes',
                        'donor_subject_areas'],
                who_to_notify: ['notify_title', 'notify_first_name',
                                'notify_last_name', 'notify_address',
                                'notify_city', 'notify_state', 'notify_zip',
                                'notify_relation_to_donor'],
                recipient: ['recipient_title', 'recipient_first_name',
                            'recipient_last_name', 'recipient_donation_type']
            };

            // Check for expected fields in request_body
            let donation_keys = Object.keys(request_body);
            console.log("donation_keys = ");
            console.log(donation_keys);
            console.log("donation_keys.length = " + donation_keys.length);

            if (!arrays_match(donation_keys, donation_fields)) {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(create)] Unable to create record: ' +
                                      'Request body is valid JSON, but does ' +
                                      'not exclusively contain these ' +
                                      'properties in this order:\n' +
                                      donation_fields.join('\n'));
                callback({
                    status: 400,
                    message: 'Request body does not contain the expected ' +
                             'properties.'
                });

                return false;
            }

            // Check each field for valid JSON and expected keys
            for (let key of donation_keys) {
                let json_field;

                try {
                    json_field = JSON.parse(request_body[key]);
                } catch (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (create)] Unable to create ' +
                                          'record: Error parsing ' + key +
                                          ' field of request body: ' + error);
                    callback({
                        status: 400,
                        message: 'Invalid syntax in request body.'
                    });

                    return false;
                }
                console.log(key + " = ");
                console.log(json_field);

                let json_field_keys;
                let has_more_elements_to_validate = true;

                if (Array.isArray(json_field)) {
                    if (json_field.length === 0) {
                        has_more_elements_to_validate = false;
                    } else {
                        json_field_keys = Object.keys(json_field[0]);
                    }
                } else {
                    json_field_keys = Object.keys(json_field);
                }

                let i = 0;
                while (has_more_elements_to_validate) {
                    console.log(key + " keys = ");
                    console.log(json_field_keys);
                    console.log(key + " keys length = " +
                                json_field_keys.length);

                    if (!arrays_match(json_field_keys,
                                      donation_field_keys[key])) {
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (create)] Unable to ' +
                                              'create record: Request body ' +
                                              'is valid JSON, but ' + key +
                                              ' does not exclusively contain ' +
                                              'these properties in this ' +
                                              'order:\n' +
                                              donation_field_keys[key]
                                              .join('\n'));
                        callback({
                            status: 400,
                            message: 'Request body does not contain the ' +
                                     'expected properties.'
                        });

                        return false;
                    }

                    if (Array.isArray(json_field) && ++i < json_field.length) {
                        json_field_keys = Object.keys(json_field[i]);
                    } else {
                        has_more_elements_to_validate = false;
                    }
                }
            }

            // 1.)
            function add_donation_to_db(callback) {
                let obj = {};

                DB(CONFIG.dbDonationsTable)
                    .insert(request_body)
                    .then(function (data) {
                        console.log("Added donation record with id " + data);
                        obj.id = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL [/living-library/model ' +
                                              'module (create/add_donation_' +
                                              'to_db)] Unable to create ' +
                                              'record: ' + error);
                        // throw 'FATAL [/living-library/model module (create/add_donation_to_db)] Unable to create record: ' + error;
                    });
            }

            // 2.)
            function select_new_donation(obj, callback) {
                DB(CONFIG.dbDonationsTable)
                    .select('*')
                    .where({
                        id: obj.id
                    })
                    .then(function (data) {
                        console.log("Inside select_new_donation");
                        obj.data = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (create/select_new_' +
                                              'donation)] Unable to retrieve ' +
                                              'new record: ' + error);
                        // throw 'FATAL: [/living-library/model module (create/select_new_donation)] Unable to create record: ' + error;
                    });
            }

            // 3.)
            function send_email_notification(obj, callback) {
                console.log("Inside send_email_notification");
                try {
                    send_email({
                        to: CONFIG.emailLibrarian,
                        bcc: CONFIG.emailDeveloper,
                        subject: 'Living Library: A donation has been made' +
                                 ' (Donation ID = ' + obj.id + ')',
                        text: do_not_respond_email_text +
                              '\n\nView Donation Information: ' +
                              CONFIG.queuedDonationBaseUrl + obj.id,
                        html: do_not_respond_html_email_text +
                              `<br><a href="${CONFIG.queuedDonationBaseUrl}` +
                              `${obj.id}">View Donation Information</a>`
                    }, obj.id);

                    send_email({
                        to: CONFIG.emailExternalRelations,
                        bcc: CONFIG.emailDeveloper,
                        subject: 'Living Library: End processing has been ' +
                                 'notified of the donation with ID ' + obj.id,
                        text: do_not_respond_email_text,
                        html: do_not_respond_html_email_text
                    }, obj.id);
                } catch (error) {
                    LOGGER.module().error('ERROR: [/living-library/model ' +
                                          'module (create/' +
                                          'send_email_notification)]: ' + error);
                    // throw 'FATAL: [/living-library/model module (create/send_email_notification)] Unable to send email notification: ' + error;
                } finally {
                    console.log('Inside "finally" block');
                    callback(null, obj);
                    return false;
                }
            }

            ASYNC.waterfall([
               add_donation_to_db,
               select_new_donation,
               send_email_notification
            ], function (error, results) {
                console.log("Inside waterfall function");

                if (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (create/async.waterfall)] ' +
                                          'Error creating or retrieving new ' +
                                          'donation record: ' + error);
                }

                console.log("\nEnd of CREATE query from model\n" +
                            "=====================\n");

                callback({
                    status: 201,
                    message: 'Record created.',
                    data: results.data
                });
            });

            break;
        } // end of "" case

        case CONFIG.dbSubjectAreasTable:
        case CONFIG.dbTitlesTable:
        case CONFIG.dbRelationshipsTable: {
            // Check for valid new_menu_choice property
            let new_menu_choice = typeof request_body.new_menu_choice ===
                                  'string'
                                  ? request_body.new_menu_choice.trim()
                                  : '';

            console.log('new_menu_choice = ' + new_menu_choice);

            if (new_menu_choice === '') {
                let error_msg = "Request body is invalid: Must contain a " +
                                "property named 'new_menu_choice' with a " +
                                "non-empty string value";
                callback({
                    status: 400,
                    message: error_msg
                });

                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(create)] ' + error_msg);

                return false;
            }

            let table_field_names = get_table_field_names(table_name);

            // 1.)
            function search_db_for_menu_choice(callback) {
                console.log("Inside search_db_for_menu_choice");

                let obj = {};

                DB(table_name)
                    .select(table_field_names.id + ' as id',
                            table_field_names.display + ' as term',
                            'is_active')
                    .orderBy(table_field_names.sort)
                    .where(table_field_names.display, new_menu_choice)
                    .then(function (data) {
                        console.log("Searching " + table_name + " for " +
                                    table_field_names.display + " = " +
                                    new_menu_choice + "\n" + data.length +
                                    " choice(s) found.");

                        obj.data = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        console.log('Inside catch function of lookup table ' +
                                    'case');
                        LOGGER.module().fatal('FATAL [/living-library/model ' +
                                              'module (create/' +
                                              'search_db_for_menu_choice)] ' +
                                              'Unable to read record: ' + error
                                              + '\nObject being built out of ' +
                                              'Knex query:\n' +
                                              JSON.stringify(obj));
                        // throw 'FATAL [/living-library/model module (create/search_db_for_menu_choice)] Unable to read record: ' + error;
                    });
            }

            // 2.)
            function update_db(obj, callback) {
                console.log("Inside update_db");

                if (!Array.isArray(obj.data)) {
                    LOGGER.module().fatal('FATAL [/living-library/model ' +
                                          'module (create/update_db)] ' +
                                          'search_db_for_menu_choice knex ' +
                                          'query did not return an array: ' +
                                          obj.data);
                    // throw 'FATAL [/living-library/model module (create/update_db)] search_db_for_menu_choice knex query did not return an array: ' + obj.data;
                } else if (obj.data.length === 0) {
                    console.log('No match found for ' + new_menu_choice);

                    let new_record = {};
                    new_record[table_field_names.display] = new_menu_choice;

                    DB(table_name)
                        .insert(new_record)
                        .then(function (data) {
                            console.log('Added record with id ' + data + ' to '
                                        + table_name);

                            obj.id = data,
                            obj.status = 201,
                            obj.message = 'Record created.';

                            callback(null, obj);
                            return false;
                        })
                        .catch(function (error) {
                            LOGGER.module().fatal('FATAL [/living-library/' +
                                                  'model module (create/' +
                                                  'update_db)] Unable to ' +
                                                  'create record in ' +
                                                  table_name + ': ' + error);
                            // throw 'FATAL [/living-library/model module (create/update_db)] Unable to create record in ' + table_name + ': ' + error;
                        });
                } else if (obj.data.length > 0) {
                    console.log('Found ' + obj.data.length + ' record(s) '+
                                'matching ' + new_menu_choice);

                    /*
                     * Check whether all records have is_active = 0. If so,
                     * update the first record to have is_active = 1.
                     */
                    let found_first_inactive_record = false,
                        index_to_update = 0;

                    obj.data = 4;

                    for (let i = 0; i < obj.data.length; i++) {
                        console.log('\nobj.data[' + i + '] = ');
                        console.log(obj.data[i]);

                        if (obj.data[i].is_active) {
                            LOGGER.module().error('ERROR: [/living-library/' +
                                                  'model module (create/' +
                                                  'update_db)] Active record ' +
                                                  'already exists (id = ' +
                                                  obj.data[i].id + ') with ' +
                                                  table_field_names.display +
                                                  ' = ' + obj.data[i].term +
                                                  '\nSo database left ' +
                                                  'unchanged. Record(s) ' +
                                                  'found:\n' +
                                                  JSON.stringify(obj.data));

                            obj.status = 409,
                            obj.message = 'Record(s) already exist.';

                            callback(null, obj);
                            return false;
                        } else {
                            /*
                             * Ensure that index_to_update contains the
                             * first index where is_active = false
                             */
                            if (!found_first_inactive_record) {
                                console.log('Found first inactive record ' +
                                            'at index ' + i);
                                index_to_update = i;
                                found_first_inactive_record = true;
                            } else {
                                console.log('Found another inactive ' +
                                            'record at index ' + i);
                            }
                        }
                        console.log('After iteration ' + i + ' of for loop, ' +
                                    'index_to_update = ' + index_to_update);
                    } // end of for loop

                    console.log('\nRecord with id ' +
                                obj.data[index_to_update].id + ' exists with ' +
                                table_field_names.display + ' = ' +
                                obj.data[index_to_update].term +
                                '\nBut is_active = ' +
                                obj.data[index_to_update].is_active);

                    obj.id = obj.data[index_to_update].id;

                    DB(table_name)
                        .where(table_field_names.id,
                               obj.data[index_to_update].id)
                        .update({
                            is_active: 1
                        })
                        .then(function (data) {
                            if (data === 1) {
                                console.log("Updated " + table_name +
                                            " record with id " +
                                            obj.data[index_to_update].id + ".");

                                obj.status = 200,
                                obj.message = 'Record updated.';
                            } else {
                                LOGGER
                                .module().fatal('FATAL: [/living-' +
                                                'library/model ' +
                                                'module (create/' +
                                                'update_db)] Update ' +
                                                "failed. Couldn't " +
                                                'find ' + table_name +
                                                ' record with id ' +
                                                obj.data[index_to_update].id);

                                obj.status = 404,
                                obj.message = 'Record not found.';
                            }

                            callback(null, obj);
                            return false;
                        })
                        .catch(function (error) {
                            LOGGER
                            .module().fatal('FATAL: [/living-library/model ' +
                                            'module (create/update_db)] ' +
                                            'Unable to update record: ' +
                                            error + '\nid = ' +
                                            obj.data[index_to_update].id +
                                            '\nRecord(s) found:\n' +
                                            JSON.stringify(obj.data));
                            // throw 'FATAL: Unable to update record: ' + error;
                        });
                } else {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (create/update_db)] Unable ' +
                                          'to create record: search_db_for_' +
                                          'menu_choice returned ' +
                                          obj.data.length + ' results for ' +
                                          table_field_names.display + ' = ' +
                                          new_menu_choice);

                    obj.status = 409,
                    obj.message = 'Records already exist.';

                    callback(null, obj);
                    return false;
                }
            }

            // 3.)
            function select_new_menu_choice(obj, callback) {
                console.log("Inside select_new_menu_choice");

                if (obj.status === 409) {
                    callback(null, obj);
                    return false;
                } else {
                    DB(table_name)
                        .select(table_field_names.id + ' as id',
                                table_field_names.display + ' as term')
                        .where(table_field_names.id, obj.id)
                        .then(function (data) {
                            obj.data = data;
                            callback(null, obj);
                            return false;
                        })
                        .catch(function (error) {
                            LOGGER.module().fatal('FATAL: [/living-library/' +
                                                  'model module (create/' +
                                                  'select_new_menu_choice)] ' +
                                                  'Unable retrieve new menu ' +
                                                  'choice: ' + error);
                            // throw 'FATAL: [/living-library/model module (create/select_new_donation)] Unable to create record ' + error;
                        });
                }
            }

            ASYNC.waterfall([
               search_db_for_menu_choice,
               update_db,
               select_new_menu_choice
            ], function (error, results) {
                console.log("Inside waterfall function");

                if (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (create/async.waterfall)] ' +
                                          'Error adding menu choice to ' +
                                          table_name + ': ' + error);
                }

                console.log("Results object = ");
                console.log(results);

                console.log("results.status = " + results.status);
                console.log("typeof results.status = " + typeof results.status);

                console.log("\nEnd of CREATE query from model\n" +
                            "=====================\n");

                callback({
                    status: results.status,
                    message: results.message,
                    data: results.data
                });
            });

            break;
        } // end of lookup table cases

        default: {
            LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                  '(create)] Request query contains invalid ' +
                                  'value for tbl parameter: ' + tbl);

            callback({
                status: 400,
                message: 'Request query contains invalid value for tbl ' +
                         'parameter.'
            });
        } // end of default case
    } // end of switch
};

/**
 * Reads records
 * @param req
 * @param callback
 */
exports.read = function (req, callback) {

    let tbl = get_empty_or_lowercase_string(req.query.tbl),
        table_name = get_table_name(tbl),
        id = req.query.id;

    switch(table_name) {
        case "": {
            /**
             * No tbl parameter, so default to querying tbl_donations.
             *
             * tbl_donations query URLs:
             * GET all donation records: SITE_URL/api/v1/living-library/donations?api_key=API_KEY
             * GET donations in queue: SITE_URL/api/v1/living-library/donations?is_completed=false&api_key=API_KEY
             * GET completed donations: SITE_URL/api/v1/living-library/donations?is_completed=true&api_key=API_KEY
             * GET a single donation record: SITE_URL/api/v1/living-library/donations?id=[id]&api_key=API_KEY
             */
            let is_completed = typeof req.query.is_completed === 'undefined'
                               ? ""
                               : req.query.is_completed.toLowerCase();

            DB(CONFIG.dbDonationsTable)
                .select('id', 'donor', 'who_to_notify', 'recipient', 'book',
                        'is_completed')
                .orderBy('created', 'desc')
                .modify(function(queryBuilder) {
                    if (is_completed === 'true' || is_completed === 'false'
                        || is_completed === '1' || is_completed === '0') {
                        // convert from string to boolean
                        is_completed = is_completed === 'true' ||
                                       is_completed === '1';
                        console.log("is_completed = " + is_completed + "\n");

                        queryBuilder.where({
                            is_completed: is_completed
                        })
                    } else {
                        console.log("No where clause because is_completed = "
                                    + is_completed + "\n");
                    }
                })
                .modify(function(queryBuilder) {
                    if (typeof id !== 'undefined') {
                        console.log("id = " + id + ", so adding to SQL query\n");

                        queryBuilder.where({
                            id: id
                        })
                    } else {
                        console.log("id = " + id + ", so no adjustment to " +
                                    "SQL query\n");
                    }
                })
                .then(function (data) {
                    // TODO: If data.length === 0, return 404 HTTP status code
                    console.log("Found " + data.length + " record(s).");
                    console.log("End of READ query from model" +
                                "\n=====================\n");

                    callback({
                        status: 200,
                        message: 'Record(s) retrieved.',
                        data: data
                    });

                })
                .catch(function (error) {
                    console.log('Inside catch function of donations table case');
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (read)] Unable to read ' +
                                          'donation record(s): ' + error +
                                          '\nis_completed = ' + is_completed +
                                          '\nid = ' + id);
                    // throw 'FATAL: Unable to read record ' + error;
                });
            break;
        } // end of "" case

        case CONFIG.dbTitlesTable:
        case CONFIG.dbStatesTable:
        case CONFIG.dbRelationshipsTable:
        case CONFIG.dbSubjectAreasTable: {
            /**
             * Lookup table query URLs:
             * GET all active title records: SITE_URL/api/v1/living-library/donations?tbl=titles&is_active=true&api_key=API_KEY
             * GET all active state records: SITE_URL/api/v1/living-library/donations?tbl=states&is_active=true&api_key=API_KEY
             * GET all active relationship records: SITE_URL/api/v1/living-library/donations?tbl=relationships&is_active=true&api_key=API_KEY
             * GET all active title records: SITE_URL/api/v1/living-library/donations?tbl=subject_areas&is_active=true&api_key=API_KEY
             */
            let is_active = typeof req.query.is_active === 'undefined'
                            ? ""
                            : req.query.is_active.toLowerCase();

            let table_field_names = get_table_field_names(table_name);

            DB(table_name)
                .select(table_field_names.id + ' as id',
                        table_field_names.display + ' as term')
                .orderBy(table_field_names.sort)
                .modify(function(queryBuilder) {
                    if (is_active === 'true' || is_active === 'false'
                        || is_active === '1' || is_active === '0') {
                        // convert from string to boolean
                        is_active = is_active === 'true' || is_active === '1';
                        console.log("is_active = " + is_active +
                                    ", so adding to SQL query\n");

                        queryBuilder.where({
                            is_active: is_active
                        })
                    } else {
                        console.log("is_active = " + is_active +
                                    "\n... so no adjustment to SQL query\n");
                    }
                })
                .modify(function(queryBuilder) {
                    if (typeof id !== 'undefined' && id !== '') {
                        console.log("id = " + id +
                                    ", so adding to SQL query\n");

                        queryBuilder.where(table_field_names.id, id)
                    } else {
                        console.log("id = " + id +
                                    "\n... so no adjustment to SQL query\n");
                    }
                })
                .then(function (data) {
                    // TODO: If data.length === 0, return 404 HTTP status code
                    console.log("Populating " + table_field_names.display +
                                " choices. " + data.length + " choice(s) found.");
                    console.log("\nEnd of READ query from model" +
                                "\n=====================\n");

                    callback({
                        status: 200,
                        message: 'Record(s) retrieved.',
                        data: data
                    });

                })
                .catch(function (error) {
                    console.log('Inside catch function of lookup table case');
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (read)] Unable to read ' +
                                          table_field_names.display +
                                          ' record(s): ' + error +
                                          '\nis_active = ' + is_active +
                                          '\nid = ' + id);
                    // throw 'FATAL: Unable to read record: ' + error;
                });
            break;
        } // end of lookup table cases

        default: {
            LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                  '(read)] Request query contains invalid ' +
                                  'value for tbl parameter: ' + tbl);

            callback({
                status: 400,
                message: 'Request query contains invalid value for tbl ' +
                         'parameter.'
            });
        } // end of default case
    } // end of switch
};

/**
 * Updates record
 * @param req
 * @param callback
 */
exports.update = function (req, callback) {
    let id = req.query.id;
    console.log("id = " + id);

    console.log("Before req.body is decoded:");
    console.log("req.body = ");
    console.log(req.body);
    console.log("typeof req.body = " + typeof req.body);
    let request_body = decode_HTML(req.body);
    console.log("After req.body is decoded:");
    console.log("request_body = ");
    console.log(request_body);
    console.log("typeof request_body = " + typeof request_body);

    /**
     * Donations table query URL (if there's no tbl parameter, default to querying tbl_donations):
     * PUT (i.e. update) record in donations table: SITE_URL/api/v1/living-library/donations?id=ID&api_key=API_KEY
     *
     * Lookup table query URLs:
     * PUT (i.e. update) record in subject areas table: SITE_URL/api/v1/living-library/donations?tbl=subject_area&id=ID&api_key=API_KEY
     * PUT (i.e. update) record in titles table: SITE_URL/api/v1/living-library/donations?tbl=titles&id=ID&api_key=API_KEY
     * PUT (i.e. update) record in relationships table: SITE_URL/api/v1/living-library/donations?tbl=relationships&id=ID&api_key=API_KEY
     */

    let tbl = get_empty_or_lowercase_string(req.query.tbl),
        table_name = get_table_name(tbl);

    switch(table_name) {
        case "": {
            /**
             * This updates the book field (and sets is_completed = 1). Any
             * other field from the request_body is ignored.
             */

            if (typeof id === 'undefined') {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(update)] Invalid request: id ' +
                                      'parameter of query is undefined.');

                callback({
                    status: 400,
                    message: 'Request query does not contain id parameter.'
                });

                return false;
            }

            let book = request_body.book;
            console.log("\ntypeof book = " + typeof book);

            // Check for book field
            if (typeof book === 'undefined') {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(update)] Invalid request: Request ' +
                                      'body does not contain book field.');

                callback({
                    status: 400,
                    message: 'Invalid syntax in request body.'
                });

                return false;
            }

            // Check for valid JSON string in book field
            try {
                book = JSON.parse(book);
            } catch (error) {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(update)] Invalid request: Error ' +
                                      'parsing JSON: ' + error);

                callback({
                    status: 400,
                    message: 'Invalid syntax in request body.'
                });

                return false;
            }

            // Check for expected fields
            const book_fields = ['book_author_name',
                                 'book_title',
                                 'book_bibliographic_number',
                                 'book_call_number'];

            let book_keys = Object.keys(book);
            console.log("book_keys = ");
            console.log(book_keys);
            console.log("book_keys.length = " + book_keys.length);
            if (!arrays_match(book_keys, book_fields)) {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(update)] Request body is valid JSON, ' +
                                      'but does not exclusively contain ' +
                                      'these properties in this order:\n' +
                                      book_fields.join('\n'));
                callback({
                    status: 400,
                    message: 'Request body does not contain the expected properties.'
                });

                return false;
            }

            // Add fields to book object
            console.log("\nbook before adding fields: ");
            console.log(book);

            console.log("typeof book = " + typeof book);

            /**
             * These are legacy fields from original living library implementation
             * and thus have empty values for new book plate records.
             */
            book.book_publisher = "";
            book.book_date_published = "";

            book.book_timestamp = MOMENT().format("YYYY-MM-DD HH:mm:ss");
            console.log("\nbook_timestamp = " + book.book_timestamp);

            book = JSON.stringify(book);
            console.log("\nbook after adding fields: ");
            console.log(book);
            console.log("=====================\n");

            // 1.)
            function confirm_donation_is_in_the_queue(callback) {
                console.log("Inside confirm_donation_is_in_the_queue");

                let obj = {};

                DB(CONFIG.dbDonationsTable)
                    .select('id', 'is_completed')
                    .where({
                        id: id
                    })
                    .then(function (data) {
                        if (data.length === 1) {
                            if (data[0].is_completed === 1) {
                                LOGGER.module()
                                      .fatal("FATAL: [/living-library/" +
                                             "model module (update/" +
                                             "confirm_donation_is_in_" +
                                             "the_queue)] Update failed. " +
                                             "Donation record with id " +
                                             id + " is already completed.");

                                obj.status = 409,
                                obj.message = 'Record already completed.';
                            }
                        } else {
                            LOGGER.module()
                                  .fatal("FATAL: [/living-library/" +
                                         "model module (update/confirm_" +
                                         "donation_is_in_the_queue)] " +
                                         "Update failed. Couldn't " +
                                         "find donation record with " +
                                         "id = " + id);

                            obj.status = 404,
                            obj.message = 'Record not found.';
                        }

                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (update/confirm_' +
                                              'donation_is_in_the_queue)] ' +
                                              'Unable to retrieve record ' +
                                              'with id ' + id + ': ' + error);
                        // throw 'FATAL: [/living-library/model module (update/confirm_donation_is_in_the_queue)] Unable to retrieve record with id ' + id + ': ' + error;
                    });
            }

            // 2.)
            function update_donation_in_db(obj, callback) {
                console.log("Inside update_donation_in_db");

                if (obj.status === 409 || obj.status === 404) {
                    callback(null, obj);
                    return false;
                }

                DB(CONFIG.dbDonationsTable)
                    .where({
                        id: id
                    })
                    .update({
                        book: book,
                        is_completed: 1
                    })
                    .then(function (data) {
                        if (data === 1) {
                            console.log('Updated donation record with id ' + id);

                            obj.status = 200,
                            obj.message = 'Record updated.';

                            callback(null, obj);
                            return false;
                        } else {
                            LOGGER.module().fatal("FATAL: [/living-library/" +
                                                  "model module (update/" +
                                                  "update_donation_in_db)] " +
                                                  "Update failed. Couldn't " +
                                                  "find donation record with " +
                                                  "id " + id);

                            obj.status = 404,
                            obj.message = 'Record not found.';

                            callback(null, obj);
                            return false;
                        }
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (update/update_' +
                                              'donation_in_db)] Unable to ' +
                                              'update record with id ' + id +
                                              ': ' + error);
                        // throw 'FATAL: [/living-library/model module (update/update_donation_in_db)] Unable to update record with id ' + id + ': ' + error;
                    });
            }

            // 3.)
            function select_updated_donation(obj, callback) {
                console.log("Inside select_updated_donation");

                if (obj.status !== 200) {
                    callback(null, obj);
                    return false;
                }

                DB(CONFIG.dbDonationsTable)
                    .select('*')
                    .where({
                        id: id
                    })
                    .then(function (data) {
                        obj.data = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (update/select_updated_' +
                                              'donation)] Unable to retrieve ' +
                                              'updated record with id ' + id +
                                              ': ' + error);
                        // throw 'FATAL: [/living-library/model module (update/select_updated_donation)] Unable to retrieve updated record with id ' + id + ': ' + error;
                    });
            }

            // 4.)
            function send_email_notification_about_completed_donation(obj,
                                                                      callback) {
                console.log("Inside " +
                            "send_email_notification_about_completed_donation");

                if (obj.status !== 200) {
                    callback(null, obj);
                    return false;
                }

                let donor_info = '',
                    book_info = '';

                if (obj.data.length === 1) {
                    let donor, book;

                    obj.data[0].donor = '[10';
                    obj.data[0].book = '11}';

                    if (typeof obj.data[0].donor !== 'undefined') {
                        try {
                            donor = JSON.parse(obj.data[0].donor);

                            donor_info += donor.donor_title + " " +
                                          donor.donor_first_name + " " +
                                          donor.donor_last_name;
                        } catch (error) {
                            LOGGER
                            .module().error('ERROR: [/living-library/model ' +
                                            'module (update/send_email_' +
                                            'notification_about_completed_' +
                                            'donation)] Could not parse ' +
                                            'donor field of retrieved ' +
                                            'donation record: ' + error +
                                            '\nid = ' + id +
                                            '\ndata[0].donor = ' +
                                            obj.data[0].donor);
                        }
                    }
                    console.log('donor = ');
                    console.log(donor);

                    if (typeof obj.data[0].book !== 'undefined') {
                        try {
                            book = JSON.parse(obj.data[0].book);

                            book_info += book.book_title;
                        } catch (error) {
                            LOGGER
                            .module().error('ERROR: [/living-library/model ' +
                                            'module (update/send_email_' +
                                            'notification_about_completed_' +
                                            'donation)] Could not parse ' +
                                            'book field of retrieved ' +
                                            'donation record: ' + error +
                                            '\nid = ' + id +
                                            '\ndata[0].book = ' +
                                            obj.data[0].book);
                        }
                    }
                    console.log('book = ');
                    console.log(book);
                }

                const donation_is_complete_msg = 'The record for the donation '
                                                 + 'listed below is complete:';

                try {
                    send_email({
                        to: CONFIG.emailExternalRelations,
                        cc: CONFIG.emailLibrarian,
                        bcc: CONFIG.emailDeveloper,
                        subject: 'Living Library: Book plate information ' +
                                 'completed for donation with ID ' + id,
                        text: do_not_respond_email_text + '\n\n' +
                              donation_is_complete_msg + '\n\n' +
                              'Donor: ' + donor_info + '\n' +
                              'Book Title: ' + book_info,
                        html: do_not_respond_html_email_text + '<br>' +
                              donation_is_complete_msg + '<br><br>' +
                              '<strong>Donor:</strong> ' + donor_info + '<br>' +
                              '<strong>Book Title:</strong> ' + book_info
                    }, id);
                } catch (error) {
                    LOGGER.module().error('ERROR: [/living-library/model ' +
                                          'module (update/send_email_' +
                                          'notification_about_completed_' +
                                          'donation)]: Unable to send ' +
                                          'notification email for record ' +
                                          'with donation id ' + id + ': ' +
                                          error);
                    // throw 'ERROR: [/living-library/model module (update/send_email_notification_about_completed_donation)]: Unable to send notification email for record with donation id ' + id + ': ' + error;
                } finally {
                    console.log('Inside "finally" block');
                    callback(null, obj);
                    return false;
                }
            }

            ASYNC.waterfall([
                confirm_donation_is_in_the_queue,
                update_donation_in_db,
                select_updated_donation,
                send_email_notification_about_completed_donation
            ], function (error, results) {
                console.log("Inside waterfall function");

                if (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (update/async.waterfall)] ' +
                                          'Error updating or retrieving ' +
                                          'donation record: ' + error);
                }

                console.log("\nEnd of UPDATE query from model\n" +
                            "=====================\n");

                callback({
                    status: results.status,
                    message: results.message,
                    data: results.data
                });
            });

            break;
        } // end of "" case

        case CONFIG.dbSubjectAreasTable:
        case CONFIG.dbTitlesTable:
        case CONFIG.dbRelationshipsTable: {
            let table_field_names = get_table_field_names(table_name);

            DB(table_name)
                .where(table_field_names.id, id)
                .modify(function(queryBuilder) {
                    let data_to_update = {};

                    // Check for valid updated_menu_choice property
                    let updated_menu_choice = typeof request_body
                                                     .updated_menu_choice ===
                                                     'string'
                                              ? request_body
                                                .updated_menu_choice.trim()
                                              : '';

                    if (updated_menu_choice !== '') {
                        console.log('updated_menu_choice = ' +
                                    updated_menu_choice +
                                    ', so adding to SQL query\n');

                        data_to_update[table_field_names.display] =
                            updated_menu_choice;
                    } else {
                        console.log('updated_menu_choice = ' +
                                    updated_menu_choice +
                                    ', so no adjustment to SQL query\n');
                    }

                    // Check for valid is_active property
                    let is_active = request_body.is_active;

                    if (typeof is_active === 'string') {
                        is_active = is_active.toLowerCase();
                    }

                    console.log('After typeof check, is_active = ' + is_active);

                    if (typeof is_active === 'boolean' ||
                        is_active === 'true' || is_active === 'false' ||
                        is_active === '1' || is_active === '0' ||
                        is_active === 1 || is_active === 0) {
                        // convert to boolean if needed
                        if (typeof is_active !== 'boolean') {
                            is_active = is_active === 'true' ||
                                        is_active === '1' ||
                                        is_active === 1;
                        }
                        console.log('is_active = ' + is_active +
                                    ', so adding to SQL query\n');

                        data_to_update.is_active = is_active;
                    } else {
                        console.log('is_active = ' + is_active +
                                    ', so no adjustment to SQL query\n');

                        if (updated_menu_choice === '') {
                            let error_msg = "Request body is invalid: Must " +
                                            "contain (a) a property named " +
                                            "'updated_menu_choice' with a " +
                                            "non-empty string value or (b) " +
                                            "a property named 'is_active' " +
                                            "with a boolean value (e.g. true " +
                                            "or false).";

                            callback({
                                status: 400,
                                message: error_msg
                            });

                            LOGGER.module().fatal('FATAL: [/living-library/' +
                                                  'model module (update)] ' +
                                                  error_msg +
                                                  '\nupdated_menu_choice = ' +
                                                  updated_menu_choice +
                                                  '\nis_active = ' + is_active);
                            throw 'FATAL: ' + error_msg;
                        }
                    }

                    console.log('data_to_update = ');
                    console.log(data_to_update);
                    queryBuilder.update(data_to_update);
                })
                .then(function (data) {
                    if (data === 1) {
                        console.log('Updated ' + tbl + ' record with id ' + id);

                        callback({
                            status: 200,
                            message: 'Record updated.'
                        });
                    } else {
                        LOGGER.module().fatal('FATAL: [/living-library/' +
                                              'model module (update)] ' +
                                              "Update failed. Couldn't find " +
                                              tbl + ' record with id ' + id);

                        callback({
                            status: 404,
                            message: 'Record not found.'
                        });
                    }

                    console.log("\nEnd of UPDATE query from model\n" +
                                "=====================\n");
                })
                .catch(function (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (update)] Unable to update ' +
                                          tbl + ' record with id ' + id + ': ' +
                                          error);
                    /* throw 'FATAL: Unable to update ' + tbl +
                             ' record with id ' + id + ': ' + error;
                     */
                });
            break;
        } // end of lookup table cases

        default: {
            LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                  '(update)] Request query contains invalid ' +
                                  'value for tbl parameter: ' + tbl);

            callback({
                status: 400,
                message: 'Request query contains invalid value for tbl ' +
                         'parameter.'
            });
        } // end of default case
    } // end of switch
};

/**
 * Deletes records
 * @param req
 * @param callback
 */
exports.delete = function (req, callback) {
    let id = req.query.id;
    console.log('id = ' + id);
    console.log('typeof id = ' + typeof id);

    if ((typeof id !== 'string' && typeof id !== 'number') || isNaN(id) ||
        isNaN(parseInt(id, 10))) {
        LOGGER.module().fatal('FATAL: [/living-library/model module (delete)] '
                              + 'Request query contains invalid value for '
                              + 'id parameter: ' + id);

        callback({
            status: 400,
            message: 'Request query does not contain a valid id parameter.'
        });

        console.log("\nEnd of DELETE query from model\n" +
                    "=====================\n");

        return false;
    }

    // 1.)
    function confirm_donation_is_in_the_queue(callback) {
        console.log("Inside confirm_donation_is_in_the_queue");

        let obj = {};

        DB(CONFIG.dbDonationsTable)
            .select('id', 'is_completed')
            .where({
                id: id
            })
            .then(function (data) {
                if (data.length === 1) {
                    if (data[0].is_completed === 1) {
                        LOGGER.module()
                              .fatal("FATAL: [/living-library/model module " +
                                     "(delete/confirm_donation_is_in_the" +
                                     "_queue)] Cannot delete because " +
                                     "donation record with id " +
                                     parseInt(id, 10) + " is already completed.");

                        obj.status = 409,
                        obj.message = 'Record already completed. Cannot delete.';
                    }

                    obj.id = data[0].id;
                } else {
                    LOGGER.module()
                          .fatal("FATAL: [/living-library/model module " +
                                 "(delete/confirm_donation_is_in_the_queue)] " +
                                 "Delete failed. Couldn't find donation " +
                                 "record with id = " + parseInt(id, 10));

                    obj.status = 404,
                    obj.message = 'Record not found.';
                }

                callback(null, obj);
                return false;
            })
            .catch(function (error) {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(delete/confirm_donation_is_in_the_' +
                                      'queue)] Unable to retrieve record ' +
                                      'with id ' + id + ': ' + error);
                // throw 'FATAL: [/living-library/model module (delete/confirm_donation_is_in_the_queue)] Unable to retrieve record with id ' + id + ': ' + error;
            });
    }

    // 2.)
    function delete_donation_in_db(obj, callback) {
        console.log("Inside delete_donation_in_db");

        if (obj.status === 409 || obj.status === 404) {
            callback(null, obj);
            return false;
        }

        DB(CONFIG.dbDonationsTable)
            .where({
                id: obj.id
            })
            .del()
            .then(function (count) {
                switch(count) {
                    case 0:
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (delete/delete_' +
                                              'donation_in_db)] Nothing to ' +
                                              'delete: No donation record ' +
                                              'found with id ' + obj.id);

                        obj.status = 404,
                        obj.message = 'Record not found.';

                        break;
                    case 1:
                        console.log('Deleted record with id ' + obj.id);

                        obj.status = 204,
                        obj.message = 'Record deleted.';

                        break;
                    default:
                        console.log('Deleted ' + count + ' records.');

                        obj.status = 204,
                        obj.message = 'Records deleted.';
                }

                callback(null, obj);
                return false;
            })
            .catch(function (error) {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(delete/delete_donation_in_db)] ' +
                                      'Unable to delete record with id ' +
                                      obj.id + ': ' + error);
                // throw 'FATAL: Unable to delete record with id ' + obj.id + ': ' + error;
            });
    }

    ASYNC.waterfall([
       confirm_donation_is_in_the_queue,
       delete_donation_in_db
    ], function (error, results) {
        console.log("Inside waterfall function");

        if (error) {
            LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                  '(delete)] Error deleting donation record ' +
                                  'with id ' + results.id + ': ' + error);
        }

        console.log("\nEnd of DELETE query from model\n" +
                    "=====================\n");

        callback({
            status: results.status,
            message: results.message
        });
    });
};

/**
 * Returns true if array1 and array2 contain the same elements
 * @param   {Array}         array1  the first array
 * @param   {Array}         array2  the second array
 * @return  {boolean value}         true if the arrays match; false otherwise
 */
const arrays_match = function (array1, array2) {
    if (array1.length !== array2.length)
        return false;

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i])
            return false;
    }

    return true;
};

/**
 * Loops through object's own properties and, if the value is a string, decodes
 * any HTML-encoded entities into real HTML
 * @param   {Object}  obj  the object whose properties need to be decoded
 * @return  {Object}       the modified object with decoded HTML
 *
 * Adapted from Rob W's approach to decoding HTML characters:
 * https://stackoverflow.com/a/7394787/1293256
 * See also:
 * https://gomakethings.com/decoding-html-entities-with-vanilla-javascript/
 */
const decode_HTML = function (obj) {
    console.log("Inside decode_HTML function");

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            let txt = WINDOW.document.createElement('textarea');
            txt.innerHTML = value;
            obj[key] = txt.value;
        }
    }

    return obj;
};

/**
 * Returns empty string if str is undefined; otherwise, returns lowercase string
 * @param   {string}    str    the string to check
 * @return  {string}           empty or lowercase string
 */
const get_empty_or_lowercase_string = function (str) {
    return typeof str === "undefined" ? "" : str.toLowerCase();
};

/**
 * Returns the database table corresponding to the given string
 * @param   {string}    tbl    the string to check
 * @return  {string}           the name of the corresponding database table
 */
const get_table_name = function (tbl) {
    switch(tbl) {
        case "":
            return "";
        case "titles":
            return CONFIG.dbTitlesTable;
        case "states":
            return CONFIG.dbStatesTable;
        case "relationships":
            return CONFIG.dbRelationshipsTable;
        case "subject_areas":
            return CONFIG.dbSubjectAreasTable;
        default:
            return null;
    }
};

/**
 * Returns an object containing the relevant field names for the specified table
 * @param   {string}    table_name    the name of the specified table
 * @return  {Object}                  an object whose properties (id, display,
 *                                    and sort) contain the corresponding field
 *                                    names for the specified table
 */
const get_table_field_names = function (table_name) {
    let table_field_names = {};

    switch(table_name) {
        case CONFIG.dbTitlesTable:
            table_field_names.id = 'title_id',
            table_field_names.display = 'title',
            table_field_names.sort = table_field_names.id;
            break;
        case CONFIG.dbStatesTable:
            table_field_names.id = 'state_id',
            table_field_names.display = 'state_full',
            table_field_names.sort = table_field_names.id;
            break;
        case CONFIG.dbRelationshipsTable:
            table_field_names.id = 'relationship_id',
            table_field_names.display = 'relationship',
            table_field_names.sort = table_field_names.id;
            break;
        case CONFIG.dbSubjectAreasTable:
            table_field_names.id = 'subject_id',
            table_field_names.display = 'subject',
            table_field_names.sort = table_field_names.id;
            break;
        default:
            table_field_names = null;
    }

    return table_field_names;
};
