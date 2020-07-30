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
      TABLE = 'tbl_donations';

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
 */
const send_email = function (message) {
    console.log('Inside send_email helper function');

    transporter.sendMail(message, function(error, info) {
        if (error) {
            LOGGER.module().error('ERROR: [/living-library/model module (create/send_email)] Unable to send notification email: ' + error);
            // throw 'FATAL: [/living-library/model module (create/send_email)] Unable to send notification email: ' + error;
        } else {
            console.log('Notification email sent successfully:');
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
    let request_body = req.body;
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

    let tbl = typeof req.query.tbl === 'undefined'
              ? ""
              : req.query.tbl.toLowerCase();

    let table_name;

    switch(tbl) {
        case "":
            table_name = "";
            break;
        case "subject_areas":
            table_name = "tbl_subject_areas_lookup";
            break;
        case "titles":
            table_name = "tbl_titles_lookup";
            break;
        case "relationships":
            table_name = "tbl_relationships_lookup";
            break;
        default:
            table_name = null;
    }

    switch(table_name) {
        case "": {
            /**
             * Donation Form submission actions
             */

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
                console.log('Request body is valid JSON, but does not ' +
                            'exclusively contain these properties in this ' +
                            'order:\n' + donation_fields.join('\n'));
                callback({
                    status: 400,
                    message: 'Request body does not contain the expected ' +
                             'properties.'
                });

                return false;
            }

            // Check each field for valid JSON and expected keys
            for (let key of donation_keys) {
                let is_client_error = false;
                let json_field;

                try {
                    json_field = JSON.parse(request_body[key]);
                } catch (error) {
                    console.log('Error parsing ' + key +
                                ' field of request_body: ' + error);

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
                        console.log('Request body is valid JSON, but ' + key +
                                    ' does not exclusively contain these ' +
                                    'properties in this order:\n' +
                                    donation_field_keys[key].join('\n'));

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

                // Not being used as of now. Either use it or delete it.
                if (is_client_error) {
                    callback({
                        status: 400,
                        message: 'Invalid syntax in request body.'
                    });

                    return false;
                }
            }

            // 1.)
            function add_donation_to_db(callback) {
                let obj = {};

                /**
                 * This inserts all fields from the request_body, with newlines included,
                 * into the database. Is that okay? This could be problematic. Keep an
                 * eye on this.
                 *
                 * Would this be the spot to add JSON validation? Or should it be at
                 * the view or controller level? Yes, add it just above this function
                 * defintion (see above comment).
                 *
                 * Validation process:
                 * 1) Do validation at the HTML form-level to alert for invalid field
                 *    values and empty required fields.
                 * 2) Construct JSON based on form data.
                 * 3) Validate the JSON before sending to the controller/model.
                 * 4) The model can have its own JSON validation (since there can be
                 *    other endpoints using the model).
                 */
                DB(TABLE)
                    .insert(request_body)
                    .then(function (data) {
                        console.log("Added donation record with id " + data);
                        obj.id = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        LOGGER.module().error('FATAL [/living-library/model module (create/add_donation_to_db)] Unable to create record: ' + error);
                        // throw 'FATAL [/living-library/model module (create/add_donation_to_db)] Unable to create record: ' + error;
                    });
            }

            // 2.)
            function select_new_donation(obj, callback) {
                DB(TABLE)
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
                        LOGGER.module().error('FATAL: [/living-library/model module (create/select_new_donation)] Unable to retrieve new record: ' + error);
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
                        subject: 'Living Library: A donation has been made' + ' (donation id = ' + obj.id + ')',
                        text: do_not_respond_email_text + '\n\nView Donation Information: ' + CONFIG.queuedDonationBaseUrl + obj.id,
                        html: do_not_respond_html_email_text + `<a href="${CONFIG.queuedDonationBaseUrl}${obj.id}">View Donation Information</a>`
                    });

                    send_email({
                        to: CONFIG.emailExternalRelations,
                        bcc: CONFIG.emailDeveloper,
                        subject: 'Living Library: End processing has been notified of the Living Library donation' + ' (donation id = ' + obj.id + ')',
                        text: do_not_respond_email_text,
                        html: do_not_respond_html_email_text
                    });
                } catch (error) {
                    LOGGER.module().error('ERROR: [/living-library/model module (create/send_email_notification)]: ' + error);
                    // throw 'FATAL: [/living-library/model module (create/send_email_notification)] Unable to send email notification: ' + error;
                } finally {
                    console.log('Inside "finally" block');
                    callback(null, obj);
                    return false;
                }
            }

            /**
             * Is this waterfall approach needed here? I don't think select_new_donation
             * is necessary since I can populate the entire tbl_donations record with
             * one insert. <-- This is correct (no waterfall approach needed here).
             */
            ASYNC.waterfall([
               add_donation_to_db,
               select_new_donation,
               send_email_notification
            ], function (error, results) {
                console.log("Inside waterfall function");

                if (error) {
                    LOGGER.module().error('ERROR: [/living-library/model module (create/async.waterfall)] Error creating or retrieving new donation record: ' + error);
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

        case "tbl_subject_areas_lookup":
        case "tbl_titles_lookup":
        case "tbl_relationships_lookup": {
            // Validate request_body or trim new_menu_choice value?

            // Handle requests with properties other than new_menu_choice?

            let new_menu_choice = typeof request_body
                                         .new_menu_choice === 'undefined'
                                  ? null
                                  : request_body.new_menu_choice;

            if (new_menu_choice === null) {
                console.log('Request body is invalid: Must contain a ' +
                            'non-null property named new_menu_choice');
                callback({
                    status: 400,
                    message: 'Request body is invalid: Must contain a ' +
                             'non-null property named new_menu_choice'
                });
                return false;
            }

            console.log('new_menu_choice = ' + new_menu_choice);

            let id_field, display_field, sort_field;

            switch(table_name) {
                case "tbl_subject_areas_lookup": {
                    id_field = 'subject_id',
                    display_field = 'subject',
                    sort_field = id_field;
                    break;
                }
                case "tbl_titles_lookup": {
                    id_field = 'title_id',
                    display_field = 'title',
                    sort_field = id_field;
                    break;
                }
                case "tbl_relationships_lookup": {
                    id_field = 'relationship_id',
                    display_field = 'relationship',
                    sort_field = id_field;
                    break;
                }
            }

            // 1.)
            function search_db_for_menu_choice(callback) {
                let obj = {};

                DB(table_name)
                    .select(id_field + ' as id', display_field + ' as term',
                            'is_active')
                    .orderBy(sort_field)
                    .where(display_field, new_menu_choice)
                    .then(function (data) {
                        console.log("Searching " + table_name + " for " +
                                    display_field + " = " + new_menu_choice +
                                    "\n" + data.length + " choice(s) found.");

                        obj.data = data;
                        callback(null, obj);
                        return false;
                    })
                    .catch(function (error) {
                        console.log('Inside catch function of lookup table ' +
                                    'case');
                        LOGGER.module().error('FATAL [/living-library/model module (create/search_db_for_menu_choice)] Unable to read record: ' + error);
                        // throw 'FATAL [/living-library/model module (create/search_db_for_menu_choice)] Unable to read record: ' + error;
                    });
            }

            // 2.)
            function update_db(obj, callback) {
                if (!Array.isArray(obj.data)) {
                    LOGGER.module().error('FATAL [/living-library/model module (create/update_db)] search_db_for_menu_choice knex query did not return an array: ' + obj.data);
                    // throw 'FATAL [/living-library/model module (create/update_db)] search_db_for_menu_choice knex query did not return an array: ' + obj.data;
                } else if (obj.data.length === 0) {
                    console.log('No match found for ' + new_menu_choice);

                    let new_record = {};
                    new_record[display_field] = new_menu_choice;

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
                            LOGGER.module().error('FATAL [/living-library/model module (create/update_db)] Unable to create record in ' + table_name + ': ' + error);
                            // throw 'FATAL [/living-library/model module (create/update_db)] Unable to create record in ' + table_name + ': ' + error;
                        });
                } else if (obj.data.length === 1) {
                    console.log('Found 1 record matching ' + new_menu_choice +
                                ':');
                    console.log(obj.data[0]);
                    console.log('typeof record_payload = ' +
                                typeof obj.data[0]);
                    console.log('is_active = ' + obj.data[0].is_active);

                    obj.id = obj.data[0].id;
                    console.log('id = ' + obj.id);

                    try {
                        if (obj.data[0].is_active) {
                            console.log('Active record already exists with ' +
                                        display_field + ' = ' +
                                        obj.data[0].term +
                                        '\nSo database left unchanged.');

                            obj.status = 409,
                            obj.message = 'Record already exists.';

                            callback(null, obj);
                            return false;
                        } else {
                            console.log('Record exists with ' + display_field +
                                        ' = ' + obj.data[0].term +
                                        '\nBut is_active = ' +
                                        obj.data[0].is_active);

                            DB(table_name)
                                .where(id_field, obj.data[0].id)
                                .update({
                                    is_active: 1
                                })
                                .then(function (data) {
                                    if (data === 1) {
                                        console.log("Updated " + table_name +
                                                    " record with id " +
                                                    obj.data[0].id + ".");

                                        obj.status = 200,
                                        obj.message = 'Record updated.';
                                    } else {
                                        console.log("Update failed. Couldn't " +
                                                    "find " + table_name +
                                                    " record with id " +
                                                    obj.data[0].id + ".");

                                        obj.status = 404,
                                        obj.message = 'Record not found.';
                                    }

                                    callback(null, obj);
                                    return false;
                                })
                                .catch(function (error) {
                                    LOGGER.module().fatal('FATAL: Unable to update record: ' + error);
                                    // throw 'FATAL: Unable to update record: ' + error;
                                });
                        }
                    } catch (error) {
                        LOGGER.module().error('FATAL [/living-library/model module (create/update_db)] menu choice found, but is_active field is undefined: ' + error);
                        // throw 'FATAL [/living-library/model module (create/update_db)] menu choice found, but is_active field is undefined: ' + error;
                    }
                } else {
                    LOGGER.module().error('ERROR [/living-library/model module (create/update_db)] search_db_for_menu_choice returned more than one result.');
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
                        .select(id_field + ' as id', display_field + ' as term')
                        .where(id_field, obj.id)
                        .then(function (data) {
                            obj.data = data;
                            callback(null, obj);
                            return false;
                        })
                        .catch(function (error) {
                            LOGGER.module().error('FATAL: [/living-library/model module (create/select_new_donation)] Unable to create record ' + error);
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
                    LOGGER.module().error('ERROR [/living-library/model module (create/async.waterfall)] Error adding menu choice to ' + table_name + ': ' + error);
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
            LOGGER.module().fatal('FATAL: Request query contains invalid value '
                                  + 'for tbl parameter: ' + tbl);

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

    let tbl = typeof req.query.tbl === 'undefined'
              ? ""
              : req.query.tbl.toLowerCase();

    let id = req.query.id;

    let table_name;

    switch(tbl) {
        case "":
            table_name = "";
            break;
        case "titles":
            table_name = "tbl_titles_lookup";
            break;
        case "states":
            table_name = "tbl_states_lookup";
            break;
        case "relationships":
            table_name = "tbl_relationships_lookup";
            break;
        case "subject_areas":
            table_name = "tbl_subject_areas_lookup";
            break;
        default:
            table_name = null;
    }

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

            DB(TABLE)
                .select('id', 'donor', 'who_to_notify', 'recipient', 'book', 'is_completed')
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
                        console.log("id = " + id + ", so no adjustment to SQL query\n");
                    }
                })
                .then(function (data) {
                    /** The Knex query returns a JSON object containing the query results.
                     *  Why does Postman return the JSON object with escaped quotes \"
                     *  and newlines in the callback? Is this okay? This could be
                     *  problematic. Keep an eye on this.
                     */
                    console.log("Found " + data.length + " record(s).");
                    for (let i = 0; i < data.length; i++) {
                        /*

                        // Is is ok to make 'donor' a constant? Yes.
                        const donor = JSON.parse(data[i].donor);
                        const recipient = JSON.parse(data[i].recipient);
                        let is_completed_string = data[i].is_completed
                                                  ? "completed"
                                                  : "in the queue";

                        if (donor !== null) {
                            console.log("Tracking ID = " + data[i].id + " from " +
                                        donor.donor_title + " " +
                                        donor.donor_first_name + " " +
                                        donor.donor_last_name);
                        } else {
                            console.log("Donor field of " + data[i].id + " is "
                                        + donor);
                        }

                        if (recipient !== null) {
                            console.log(recipient.recipient_donation_type + " "
                                        + recipient.recipient_title + " "
                                        + recipient.recipient_first_name + " "
                                        + recipient.recipient_last_name);
                        } else {
                            console.log("Recipient field of " + data[i].id + " is "
                                          + recipient);
                        }

                        if (donor !== null) {
                            console.log("Donated on " + donor.donor_date_of_donation
                                        + ".\nStatus: " + is_completed_string);
                        }
                        console.log();
                        */
                    }
                    console.log("End of READ query from model\n=====================\n");

                    callback({
                        status: 200,
                        message: 'Records retrieved.',
                        data: data
                    });

                })
                .catch(function (error) {
                    console.log('Inside catch function of tbl_donations case');
                    LOGGER.module().fatal('FATAL: Unable to read record ' + error);
                    throw 'FATAL: Unable to read record ' + error;
                });
            break;
        } // end of "" case

        case "tbl_titles_lookup":
        case "tbl_states_lookup":
        case "tbl_relationships_lookup":
        case "tbl_subject_areas_lookup": {
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

            let id_field, display_field, sort_field;

            switch(table_name) {
                case "tbl_titles_lookup": {
                    id_field = 'title_id',
                    display_field = 'title',
                    sort_field = id_field;
                    break;
                }
                case "tbl_states_lookup": {
                    id_field = 'state_id',
                    display_field = 'state_full',
                    sort_field = id_field;
                    break;
                }
                case "tbl_relationships_lookup": {
                    id_field = 'relationship_id',
                    display_field = 'relationship',
                    sort_field = id_field;
                    break;
                }
                case "tbl_subject_areas_lookup": {
                    id_field = 'subject_id',
                    display_field = 'subject',
                    sort_field = id_field;
                    break;
                }
            }

            DB(table_name)
                .select(id_field + ' as id', display_field + ' as term')
                .orderBy(sort_field)
                .modify(function(queryBuilder) {
                    if (is_active === 'true' || is_active === 'false'
                        || is_active === '1' || is_active === '0') {
                        // convert from string to boolean
                        is_active = is_active === 'true' || is_active === '1';
                        console.log("is_active = " + is_active + "\n");

                        queryBuilder.where({
                            is_active: is_active
                        })
                    } else {
                        console.log("No where clause because is_active = "
                                    + is_active + "\n");
                    }
                })
                .modify(function(queryBuilder) {
                    if (typeof id !== 'undefined') {
                        console.log("id = " + id + ", so adding to SQL query\n");

                        queryBuilder.where(id_field, id)
                    } else {
                        console.log("id = " + id + ", so no adjustment to SQL query\n");
                    }
                })
                .then(function (data) {
                    console.log("Populating " + display_field + " choices. " +
                                data.length + " choice(s) found.");
                    /*
                    for (let i = 0; i < data.length; i++) {
                        console.log(display_field + "[" + i + "] = " + data[i][display_field]);
                    }
                    */
                    console.log("\nEnd of READ query from model\n=====================\n");

                    callback({
                        status: 200,
                        message: 'Records retrieved.',
                        data: data
                    });

                })
                .catch(function (error) {
                    console.log('Inside catch function of lookup table case');
                    LOGGER.module().fatal('FATAL: Unable to read record: ' + error);
                    throw 'FATAL: Unable to read record: ' + error;
                });
            break;
        } // end of lookup table cases

        default: {
            LOGGER.module().fatal('FATAL: Request query contains invalid value '
                                  + 'for tbl parameter: ' + tbl);

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
    let request_body = req.body;
    console.log("id = " + id);
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

    let tbl = typeof req.query.tbl === 'undefined'
              ? ""
              : req.query.tbl.toLowerCase();

    let table_name;

    switch(tbl) {
        case "":
            table_name = "";
            break;
        case "subject_areas":
            table_name = "tbl_subject_areas_lookup";
            break;
        case "titles":
            table_name = "tbl_titles_lookup";
            break;
        case "relationships":
            table_name = "tbl_relationships_lookup";
            break;
        default:
            table_name = null;
    }

    switch(table_name) {
        case "": {
            /**
             * This updates the book field (with newlines included) from the
             * request_body (and sets is_completed = 1). Any other field from the
             * request_body is ignored.
             */

            let book = typeof request_body.book === 'undefined'
                       ? ""
                       : request_body.book;

            console.log("\ntypeof book = " + typeof book);

            // Check for valid JSON string
            try {
                book = JSON.parse(book);
            } catch (error) {
                console.log("Error parsing JSON: " + error);

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
                console.log('Request body is valid JSON, but does not exclusively ' +
                            'contain these properties in this order:\n' +
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

            DB(TABLE)
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

                        send_email({
                            to: CONFIG.emailExternalRelations,
                            cc: CONFIG.emailLibrarian,
                            bcc: CONFIG.emailDeveloper,
                            subject: 'Living Library: Book plate information completed' + ' (donation id = ' + id + ')',
                            text: do_not_respond_email_text + '\n\nThe record for the donation listed below is complete:',
                            html: do_not_respond_html_email_text + 'The record for the donation listed below is complete:'
                        });

                        callback({
                            status: 200,
                            message: 'Record updated.'
                        });
                    } else {
                        console.log("Update failed. Couldn't find donation " +
                                    "record with id " + id);

                        callback({
                            status: 404,
                            message: 'Record not found.'
                        });
                    }

                    console.log("\nEnd of UPDATE query from model\n" +
                                "=====================\n");
                })
                .catch(function (error) {
                    LOGGER.module().fatal('FATAL: Unable to update record ' + error);
                    // throw 'FATAL: Unable to update record ' + error;
                });
            break;
        } // end of "" case

        case "tbl_subject_areas_lookup":
        case "tbl_titles_lookup":
        case "tbl_relationships_lookup": {
            // Validate request_body or trim updated_menu_choice value?

            let id_field, display_field, sort_field;

            switch(table_name) {
                case "tbl_subject_areas_lookup": {
                    id_field = 'subject_id',
                    display_field = 'subject',
                    sort_field = id_field;
                    break;
                }
                case "tbl_titles_lookup": {
                    id_field = 'title_id',
                    display_field = 'title',
                    sort_field = id_field;
                    break;
                }
                case "tbl_relationships_lookup": {
                    id_field = 'relationship_id',
                    display_field = 'relationship',
                    sort_field = id_field;
                    break;
                }
            }

            DB(table_name)
                .where(id_field, id)
                .modify(function(queryBuilder) {
                    let data_to_update = {};

                    // Check for updated_menu_choice property
                    if (typeof request_body.updated_menu_choice !==
                        'undefined') {
                        console.log('updated_menu_choice = ' +
                                    request_body.updated_menu_choice +
                                    ', so adding to SQL query\n');

                        data_to_update[display_field] = request_body
                                                        .updated_menu_choice;
                    } else {
                        console.log('updated_menu_choice = ' +
                                    request_body.updated_menu_choice +
                                    ', so no adjustment to SQL query\n');
                    }

                    // Check for is_active property
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

                        if (typeof request_body.updated_menu_choice ===
                            'undefined') {
                            let error_msg = "Request body is invalid: Must " +
                                            "contain (a) a property named " +
                                            "'updated_menu_choice' or (b) " +
                                            "a property named 'is_active' " +
                                            "with a boolean value (e.g. true " +
                                            "or false).";

                            callback({
                                status: 400,
                                message: error_msg
                            });

                            throw error_msg;
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
                        console.log("Update failed. Couldn't find " + tbl +
                                    " record with id " + id);

                        callback({
                            status: 404,
                            message: 'Record not found.'
                        });
                    }

                    console.log("\nEnd of UPDATE query from model\n" +
                                "=====================\n");
                })
                .catch(function (error) {
                    LOGGER.module().fatal('FATAL: Unable to update ' + tbl +
                                          ' record with id ' + id + ': ' +
                                          error);
                    /* throw 'FATAL: Unable to update ' + tbl +
                             ' record with id ' + id + ': ' + error;
                     */
                });
            break;
        } // end of lookup table cases

        default: {
            LOGGER.module().fatal('FATAL: Request query contains invalid value '
                                  + 'for tbl parameter: ' + tbl);

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

    DB(TABLE)
        .where({
            id: id
        })
        .del()
        .then(function (count) {
            switch(count) {
                /**
                 *  Would it be better to throw an error for case 0?
                 *  If not, 204 seems like an appropriate status code even if
                 *  nothing is deleted. But I need a more accurate callback
                 *  message that works for all cases here.
                 */
                case 0:
                    console.log(id + " doesn't exist. Nothing to delete.");
                    break;
                case 1:
                    console.log("Deleted " + id);
                    break;
                default:
                    console.log("Deleted " + count + " records.");
            }

            callback({
                status: 204,
                message: 'Record deleted.'
            });

        })
        .catch(function (error) {
            LOGGER.module().fatal('FATAL: Unable to delete record ' + error);
            throw 'FATAL: Unable to delete record ' + error;
        });
};

/**
 * Returns
 * @param req
 * @param callback
 */
const is_valid_json_string = function (json_string) {
    // TODO
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
