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
    TABLE = 'tbl_donations';

/**
 * Creates record
 * @param req
 * @param callback
 */
exports.create = function (req, callback) {
    let request_body = req.body;
    console.log(request_body);

    /**
     * Donation Form submission actions
     */

    // Add validation here

    // 1.)
    function createDonor(callback) {
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
                console.log("Added " + data);
                obj.id = data;
                callback(null, obj);
                return false;
            })
            .catch(function (error) {
                LOGGER.module().error('FATAL [/living-library/model module (create/createDonor)] Unable to create record ' + error);
                throw 'FATAL [/living-library/model module (create/createDonor)] Unable to create record ' + error;
            });
    }

    // 2.)
    function secondFunction(obj, callback) {
        DB(TABLE)
            .select('*')
            .where({
                id: obj.id
            })
            .then(function (data) {
                console.log("Inside secondFunction");
                obj.data = data;
                callback(null, obj);
                return false;
            })
            .catch(function (error) {
                LOGGER.module().error('FATAL: [/living-library/model module (create/secondFunction)] Unable to create record ' + error);
                throw 'FATAL: [/living-library/model module (create/secondFunction)] Unable to create record ' + error;
            });
    }

    /**
     * Is this waterfall approach needed here? I don't think secondFunction
     * is necessary since I can populate the entire tbl_donations record with
     * one insert. <-- This is correct (no waterfall approach needed here).
     */
    ASYNC.waterfall([
       createDonor,
       secondFunction
    ], function (error, results) {
        console.log("Inside waterfall function");

        if (error) {
            LOGGER.module().error('ERROR: [/living-library/model module (create/async.waterfall)] ' + error);
        }

        callback({
            status: 201,
            message: 'Record created.',
            data: results.data
        });
    });
};

/**
 * Reads records
 * @param req
 * @param callback
 */
exports.read = function (req, callback) {

    /**
     * Query for all donation records: SITE_URL/api/app?api_key=API_KEY
     * Query for donations in queue: SITE_URL/api/app?is_completed=false&api_key=API_KEY
     * Query for completed donations: SITE_URL/api/app?is_completed=true&api_key=API_KEY
     * Query for a single donation record: SITE_URL/api/app?id=[id]&api_key=API_KEY
     */
    let is_completed = typeof req.query.is_completed === 'undefined'
                       ? ""
                       : req.query.is_completed.toLowerCase();

    let id = req.query.id;

    DB(TABLE)
        .select('id', 'donor', 'who_to_notify', 'recipient', 'book', 'is_completed')
        .orderBy('created', 'desc')
        .modify(function(queryBuilder) {
            if (is_completed === 'true' || is_completed === 'false'
                || is_completed === '0' || is_completed === '1') {
                // convert from string to boolean
                is_completed = is_completed === 'true' || is_completed === '1';
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
            for (let i = 0; i < data.length; i++) {
                // Is is ok to make 'donor' a constant? Yes.
                const donor = JSON.parse(data[i].donor);
                const recipient = JSON.parse(data[i].recipient);
                let is_completed_string = data[i].is_completed
                                          ? "completed"
                                          : "in the queue";
                console.log("Tracking ID = " + data[i].id + " from " +
                            donor.title + " " + donor.first_name +
                            " " + donor.last_name + ".\n"
                            + recipient.donation_type + " " + recipient.title
                            + " " + recipient.first_name + " "
                            + recipient.last_name + ".\nDonated on "
                            + donor.date_of_donation + ".\nStatus: "
                            + is_completed_string + ".\n");
            }
            console.log("=====================\n");

            callback({
                status: 200,
                message: 'Records retrieved.',
                data: data
            });

        })
        .catch(function (error) {
            LOGGER.module().fatal('FATAL: Unable to read record ' + error);
            throw 'FATAL: Unable to read record ' + error;
        });
};

/**
 * Updates record
 * @param req
 * @param callback
 */
exports.update = function (req, callback) {
    let id = req.query.id;
    let request_body = req.body;
    console.log(request_body);

    /**
     * This updates all fields from the request_body, with newlines included,
     * into the database. Any key from the request body that is not in the
     * database is ignored. Is that okay? This could be problematic. Keep an
     * eye on this.
     *
     * Should I check for valid values for each field before updating the DB?
     * If so, at which level (model, controller or view)? At the form level.
     *
     * If I have last_updated keys in my JSON fields, I'll need to automatically
     * add the current timestamp to each JSON field before updating the database.
     * Do you have a recommendation on how to implement this type of
     * timestamping within JSON? Take the following approach:
     * 1) Use moment.js time library (the built-in time library isn’t very good)
     *    to get the current timestamp.
     * 2) Construct the key-value pair.
     * 3) Then add the key-value pair to the JSON before inserting the JSON into
     *    the database.
     */

    // Validate the request body

    DB(TABLE)
        .where({
            id: id
        })
        .update({
            donor: request_body.donor,
            who_to_notify: request_body.who_to_notify,
            recipient: request_body.recipient,
            book: request_body.book,
            is_completed: request_body.is_completed
        })
        .then(function (data) {

            if (data === 1) {
                console.log("Updated " + id);

                callback({
                    status: 200,
                    message: 'Record updated.'
                });
            }

        })
        .catch(function (error) {
            LOGGER.module().fatal('FATAL: Unable to update record ' + error);
            throw 'FATAL: Unable to update record ' + error;
        });
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
                    console.log("Delete " + count + " records.");
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
