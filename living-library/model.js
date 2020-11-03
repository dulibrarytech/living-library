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
const transporter = NODEMAILER.createTransport({
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
    transporter.sendMail(message, function(error, info) {
        if (error) {
            LOGGER.module().error('ERROR: [/living-library/model module ' +
                                  '(send_email)] Unable to send notification ' +
                                  'email for record with donation id ' + id +
                                  ': ' + error);
        }
    });
};

/**
 * Creates record
 * @param  {Object}    req       the request object
 * @param  {Function}  callback  the callback function
 */
exports.create = function (req, callback) {
    let request_body = decode_HTML(req.body);

    let tbl = get_empty_or_lowercase_string(req.query.tbl),
        table_name = get_table_name(tbl);

    switch(table_name) {
        // If there's no tbl parameter, default to querying donations table
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
                        obj.id = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL [/living-library/model ' +
                                              'module (create/add_donation_' +
                                              'to_db)] Unable to create ' +
                                              'record: ' + error);
                    });
            }

            // 2.)
            function select_new_donation(obj, callback) {
                DB(CONFIG.dbDonationsTable)
                    .select('id')
                    .where({
                        id: obj.id
                    })
                    .then(function (data) {
                        obj.data = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (create/select_new_' +
                                              'donation)] Unable to retrieve ' +
                                              'new record: ' + error);
                    });
            }

            // 3.)
            function send_email_notification(obj, callback) {
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
                                          'send_email_notification)]: ' +
                                          error);
                } finally {
                    callback(null, obj);
                    return false;
                }
            }

            ASYNC.waterfall([
               add_donation_to_db,
               select_new_donation,
               send_email_notification
            ], function (error, results) {
                if (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (create/async.waterfall)] ' +
                                          'Error creating or retrieving new ' +
                                          'donation record: ' + error);
                }

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
            let table_field_names = get_table_field_names(table_name),
                new_menu_choice = typeof request_body.new_menu_choice ===
                                  'string'
                                  ? request_body.new_menu_choice.trim()
                                  : '';

            if (new_menu_choice === '' || new_menu_choice.length >
                table_field_names.display_field_char_limit) {
                let error_msg = "Request body is invalid: " +
                                (new_menu_choice === ''
                                ? "Must contain a " +
                                  "property named 'new_menu_choice' with a " +
                                  "non-empty string value"
                                : "The property 'new_menu_choice' contains " +
                                  new_menu_choice.length + " characters, " +
                                  "whereas the " + table_field_names.display +
                                  " field's character limit is " +
                                  table_field_names.display_field_char_limit);
                callback({
                    status: 400,
                    message: error_msg
                });

                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(create)] ' + error_msg);

                return false;
            }

            // 1.)
            function search_db_for_menu_choice(callback) {
                let obj = {};

                DB(table_name)
                    .select(table_field_names.id + ' as id',
                            table_field_names.display + ' as term',
                            'is_active')
                    .orderBy(table_field_names.sort)
                    .where(table_field_names.display, new_menu_choice)
                    .then(function (data) {
                        obj.data = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().fatal('FATAL [/living-library/model ' +
                                              'module (create/' +
                                              'search_db_for_menu_choice)] ' +
                                              'Unable to read record: ' + error
                                              + '\nObject being built out of ' +
                                              'Knex query:\n' +
                                              JSON.stringify(obj));
                    });
            }

            // 2.)
            function update_db(obj, callback) {
                if (!Array.isArray(obj.data)) {
                    LOGGER.module().fatal('FATAL [/living-library/model ' +
                                          'module (create/update_db)] ' +
                                          'search_db_for_menu_choice knex ' +
                                          'query did not return an array: ' +
                                          obj.data);
                } else if (obj.data.length === 0) {
                    let new_record = {};
                    new_record[table_field_names.display] = new_menu_choice;

                    DB(table_name)
                        .insert(new_record)
                        .then(function (data) {
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
                        });
                } else if (obj.data.length > 0) {
                    /*
                     * Check whether all records have is_active = 0. If so,
                     * update the first record to have is_active = 1.
                     */
                    let found_first_inactive_record = false,
                        index_to_update = 0;

                    for (let i = 0; i < obj.data.length; i++) {
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
                             * first index where is_active = 0
                             */
                            if (!found_first_inactive_record) {
                                index_to_update = i;
                                found_first_inactive_record = true;
                            }
                        }
                    } // end of for loop

                    obj.id = obj.data[index_to_update].id;

                    DB(table_name)
                        .where(table_field_names.id,
                               obj.data[index_to_update].id)
                        .update({
                            is_active: 1
                        })
                        .then(function (data) {
                            if (data === 1) {
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
                        });
                }
            }

            ASYNC.waterfall([
               search_db_for_menu_choice,
               update_db,
               select_new_menu_choice
            ], function (error, results) {
                if (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (create/async.waterfall)] ' +
                                          'Error adding menu choice to ' +
                                          table_name + ': ' + error);
                }

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
 * @param  {Object}    req       the request object
 * @param  {Function}  callback  the callback function
 */
exports.read = function (req, callback) {

    let tbl = get_empty_or_lowercase_string(req.query.tbl),
        table_name = get_table_name(tbl),
        id = req.query.id;

    switch(table_name) {
        case "": {
            // No tbl parameter, so default to querying donations table
            let is_completed =
                get_empty_or_lowercase_string(req.query.is_completed);

            DB(CONFIG.dbDonationsTable)
                .select('id', 'donor', 'who_to_notify', 'recipient', 'book',
                        'is_completed')
                .orderBy('created', 'desc')
                .modify(function(query_builder) {
                    is_completed = convert_to_boolean(is_completed);

                    modify_query_if_needed(is_completed !== null,
                                           'is_completed', is_completed,
                                           query_builder);
                })
                .modify(function(query_builder) {
                    modify_query_if_needed(typeof id !== 'undefined', 'id', id,
                                           query_builder);
                })
                .then(function (data) {
                    if (data.length > 0) {
                        callback({
                            status: 200,
                            message: 'Record(s) retrieved.',
                            data: data
                        });
                    } else {
                        callback({
                            status: 404,
                            message: 'No records found.',
                            data: data
                        });
                    }
                })
                .catch(function (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (read)] Unable to read ' +
                                          'donation record(s): ' + error +
                                          '\nis_completed = ' + is_completed +
                                          '\nid = ' + id);
                });
            break;
        } // end of "" case

        case CONFIG.dbTitlesTable:
        case CONFIG.dbStatesTable:
        case CONFIG.dbRelationshipsTable:
        case CONFIG.dbSubjectAreasTable: {
            let is_active = get_empty_or_lowercase_string(req.query.is_active),
                table_field_names = get_table_field_names(table_name);

            DB(table_name)
                .select(table_field_names.id + ' as id',
                        table_field_names.display + ' as term')
                .orderBy(table_field_names.sort)
                .modify(function(query_builder) {
                    if (typeof table_field_names.display2 !== 'undefined') {
                        query_builder.select(table_field_names.display2 +
                                             ' as term_to_append');
                    }
                })
                .modify(function(query_builder) {
                    is_active = convert_to_boolean(is_active);

                    modify_query_if_needed(is_active !== null, 'is_active',
                                           is_active, query_builder);
                })
                .modify(function(query_builder) {
                    modify_query_if_needed(typeof id !== 'undefined',
                                           table_field_names.id, id,
                                           query_builder);
                })
                .then(function (data) {
                    if (data.length > 0) {
                        callback({
                            status: 200,
                            message: 'Record(s) retrieved.',
                            data: data
                        });
                    } else {
                        callback({
                            status: 404,
                            message: 'No records found.',
                            data: data
                        });
                    }
                })
                .catch(function (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (read)] Unable to read ' +
                                          table_field_names.display +
                                          ' record(s): ' + error +
                                          '\nis_active = ' + is_active +
                                          '\nid = ' + id);
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
 * @param  {Object}    req       the request object
 * @param  {Function}  callback  the callback function
 */
exports.update = function (req, callback) {
    let id = req.query.id;

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

    let request_body = decode_HTML(req.body);

    let tbl = get_empty_or_lowercase_string(req.query.tbl),
        table_name = get_table_name(tbl);

    switch(table_name) {
        case "": {
            /**
             * This updates the book field (and sets is_completed = 1). Any
             * other field from the request_body is ignored.
             */

            let book = request_body.book;

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

            if (!arrays_match(book_keys, book_fields)) {
                LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                      '(update)] Request body is valid JSON, ' +
                                      'but does not exclusively contain ' +
                                      'these properties in this order:\n' +
                                      book_fields.join('\n'));
                callback({
                    status: 400,
                    message: 'Request body does not contain the expected ' +
                             'properties.'
                });

                return false;
            }

            // Add fields to book object

            /**
             * These are legacy fields from original living library implementa-
             * tion and thus have empty values for new book plate records.
             */
            book.book_publisher = "";
            book.book_date_published = "";

            // Create ISO 8601-compliant timestamp in UTC time
            book.book_timestamp = MOMENT().toISOString();

            book = JSON.stringify(book);

            // 1.)
            function confirm_donation_is_in_the_queue(callback) {
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
                    });
            }

            // 2.)
            function update_donation_in_db(obj, callback) {
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
                    });
            }

            // 3.)
            function select_updated_donation(obj, callback) {
                if (obj.status !== 200) {
                    callback(null, obj);
                    return false;
                }

                DB(CONFIG.dbDonationsTable)
                    .select('id', 'donor', 'book')
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
                    });
            }

            // 4.)
            function send_email_notification_about_completed_donation(obj,
                callback) {
                if (obj.status !== 200) {
                    callback(null, obj);
                    return false;
                }

                let donor_info = '',
                    book_info = '';

                if (obj.data.length === 1) {
                    let donor, book;

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
                } finally {
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
                if (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (update/async.waterfall)] ' +
                                          'Error updating or retrieving ' +
                                          'donation record: ' + error);
                }

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
            let table_field_names = get_table_field_names(table_name),
                is_active_from_query =
                    get_empty_or_lowercase_string(req.query.is_active);

            DB(table_name)
                .where(table_field_names.id, id)
                .modify(function(query_builder) {
                    is_active_from_query =
                        convert_to_boolean(is_active_from_query);

                    modify_query_if_needed(is_active_from_query !== null,
                                           'is_active', is_active_from_query,
                                           query_builder);
                })
                .modify(function(query_builder) {
                    let data_to_update = {};

                    // Check for valid updated_menu_choice property
                    let updated_menu_choice = typeof request_body
                                                     .updated_menu_choice ===
                                                     'string'
                                              ? request_body
                                                .updated_menu_choice.trim()
                                              : '';

                    if (updated_menu_choice.length >
                        table_field_names.display_field_char_limit) {
                        let error_msg = "Request body is invalid: The " +
                                        "property 'updated_menu_choice' " +
                                        "contains " +
                                        updated_menu_choice.length +
                                        " characters, whereas the " +
                                        table_field_names.display +
                                        " field's character limit is " +
                                        table_field_names
                                        .display_field_char_limit;
                        callback({
                            status: 400,
                            message: error_msg
                        });

                        LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                              'module (update)] ' + error_msg);

                        throw 'FATAL: ' + error_msg;
                    }

                    if (updated_menu_choice !== '') {
                        data_to_update[table_field_names.display] =
                            updated_menu_choice;
                    }

                    // Check request body for valid is_active property
                    let is_active = request_body.is_active;

                    if (typeof is_active === 'string') {
                        is_active = is_active.toLowerCase();
                    }

                    is_active = convert_to_boolean(is_active);

                    if (is_active !== null) {
                        data_to_update.is_active = is_active;
                    } else {
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

                    query_builder.update(data_to_update);
                })
                .then(function (data) {
                    if (data === 1) {
                        callback({
                            status: 200,
                            message: 'Record updated.'
                        });
                    } else {
                        LOGGER.module().fatal('FATAL: [/living-library/' +
                                              'model module (update)] ' +
                                              "Update failed. Couldn't find " +
                                              tbl + ' record with:\n' +
                                              'id = ' + id +
                                              (is_active_from_query === ''
                                               ? ''
                                               : '\nis_active = ' +
                                                 is_active_from_query));

                        callback({
                            status: 404,
                            message: 'Record not found.'
                        });
                    }
                })
                .catch(function (error) {
                    LOGGER.module().fatal('FATAL: [/living-library/model ' +
                                          'module (update)] Unable to update ' +
                                          tbl + ' record with:\n' +
                                          'id = ' + id +
                                          (is_active_from_query === ''
                                           ? ''
                                           : '\nis_active = ' +
                                             is_active_from_query) +
                                          '\nError: ' + error);
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
 * Deletes record
 * @param  {Object}    req       the request object
 * @param  {Function}  callback  the callback function
 */
exports.delete = function (req, callback) {
    let id = req.query.id;

    if ((typeof id !== 'string' && typeof id !== 'number') || isNaN(id) ||
        isNaN(parseInt(id, 10))) {
        LOGGER.module().fatal('FATAL: [/living-library/model module (delete)] '
                              + 'Request query contains invalid value for '
                              + 'id parameter: ' + id);

        callback({
            status: 400,
            message: 'Request query does not contain a valid id parameter.'
        });

        return false;
    }

    // 1.)
    function confirm_donation_is_in_the_queue(callback) {
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
                                     parseInt(id, 10) + " is already " +
                                     "completed.");

                        obj.status = 409,
                        obj.message = 'Record already completed. ' +
                                      'Cannot delete.';
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
            });
    }

    // 2.)
    function delete_donation_in_db(obj, callback) {
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
                        obj.status = 204,
                        obj.message = 'Record deleted.';

                        break;
                    default:
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
            });
    }

    ASYNC.waterfall([
       confirm_donation_is_in_the_queue,
       delete_donation_in_db
    ], function (error, results) {
        if (error) {
            LOGGER.module().fatal('FATAL: [/living-library/model module ' +
                                  '(delete)] Error deleting donation record ' +
                                  'with id ' + results.id + ': ' + error);
        }

        callback({
            status: results.status,
            message: results.message
        });
    });
};

/**
 * Returns true if array1 and array2 contain the same elements
 * @param    {Array}    array1   the first array
 * @param    {Array}    array2   the second array
 * @returns  {boolean}           true if the arrays match; false otherwise
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
 * Converts the given value to the corresponding boolean value.
 * Returns null if value does not specifically refer to a boolean value.
 * @param    {(boolean|number|string)}  value  the value to convert
 * @returns  {(boolean|null)}                  the corresponding boolean value;
 *                                             otherwise, null
 */
const convert_to_boolean = function (value) {
    if (typeof value === 'boolean') {
        return value;
    } else if (value === 'true' || value === 'false' || value === '1' ||
               value === '0' || value === 1 || value === 0) {
        return value === 'true' || value === '1' || value === 1;
    } else {
        return null;
    }
};

/**
 * Loops through object's own properties and, if the value is a string, decodes
 * any HTML-encoded entities into real HTML
 * @param    {Object}  obj  the object whose properties need to be decoded
 * @returns  {Object}       the modified object with decoded HTML
 *
 * Adapted from Rob W's approach to decoding HTML characters:
 * https://stackoverflow.com/a/7394787/1293256
 * See also:
 * https://gomakethings.com/decoding-html-entities-with-vanilla-javascript/
 */
const decode_HTML = function (obj) {
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
 * @param    {string}    str    the string to check
 * @returns  {string}           empty or lowercase string
 */
const get_empty_or_lowercase_string = function (str) {
    return typeof str === "undefined" ? "" : str.toLowerCase();
};

/**
 * Returns the database table name corresponding to the given string; if no
 * match, returns null. An empty string corresponds to the donations table (the
 * default table).
 * @param   {string}         tbl   the string to check
 * @returns {(string|null)}        the name of the corresponding database table;
 *                                 null if there is no match
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
 * Returns an object containing the relevant field names for the specified
 * table as well as the display field's character limit. If no match, returns
 * null.
 * @param    {string}    table_name    the name of the specified table
 * @returns  {(Object|null)}           an object whose properties contain the
 *                                     relevant field names for the specified
 *                                     table and the display field's character
 *                                     limit; null if there is no match
 */
const get_table_field_names = function (table_name) {
    let table_field_names = {};

    switch(table_name) {
        case CONFIG.dbTitlesTable:
            table_field_names.id = 'title_id',
            table_field_names.display = 'title',
            table_field_names.sort = table_field_names.id,
            table_field_names.display_field_char_limit = 20;
            break;
        case CONFIG.dbStatesTable:
            table_field_names.id = 'state_id',
            table_field_names.display = 'state',
            table_field_names.display2 = 'state_full',
            table_field_names.sort = table_field_names.id,
            table_field_names.display_field_char_limit = 255;
            break;
        case CONFIG.dbRelationshipsTable:
            table_field_names.id = 'relationship_id',
            table_field_names.display = 'relationship',
            table_field_names.sort = table_field_names.id,
            table_field_names.display_field_char_limit = 255;
            break;
        case CONFIG.dbSubjectAreasTable:
            table_field_names.id = 'subject_id',
            table_field_names.display = 'subject',
            table_field_names.sort = table_field_names.id,
            table_field_names.display_field_char_limit = 255;
            break;
        default:
            table_field_names = null;
    }

    return table_field_names;
};

/**
 * Modifies the given query builder object if needed.
 * @param   {boolean}   requires_modification   whether the query should be
 *                                              modified
 * @param   {string}    field                   the field name
 * @param   {string}    value                   the field value
 * @param   {Object}    query_builder           the knex query builder object to
 *                                              modify
 */
const modify_query_if_needed = function (requires_modification, field, value,
                                         query_builder) {
    if (requires_modification) {
        query_builder.where(field, value);
    }
};
