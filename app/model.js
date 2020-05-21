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

    // 1.)
    function createDonor(callback) {
        let obj = {};

        DB(TABLE)
            .insert(request_body)
            .then(function (data) {
                console.log("Added " + data);
                obj.id = data;
                callback(null, obj);
                return false;
            })
            .catch(function (error) {
                LOGGER.module().error('FATAL [/app/model module (create/createDonor)] Unable to create record ' + error);
                throw 'FATAL [/app/model module (create/createDonor)] Unable to create record ' + error;
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
                LOGGER.module().error('FATAL: [/app/model module (create/secondFunction)] Unable to create record ' + error);
                throw 'FATAL: [/app/model module (create/secondFunction)] Unable to create record ' + error;
            });
    }

    ASYNC.waterfall([
       createDonor,
       secondFunction
    ], function (error, results) {
        console.log("Inside waterfall function");

        if (error) {
            LOGGER.module().error('ERROR: [/app/model module (create/async.waterfall)] ' + error);
        }

        callback({
            status: 201,
            message: 'Record created.',
            data: results.data
        });
    });
};

/**
 * Reads record
 * @param req
 * @param callback
 */
exports.read = function (req, callback) {

    /**
     * Query for all donation records: SITE_URL/api/app?api_key=API_KEY
     * Query for donations in queue: SITE_URL/api/app?is_completed=false&api_key=API_KEY
     * Query for completed donations: SITE_URL/api/app?is_completed=true&api_key=API_KEY
     */
    let is_completed = typeof req.query.is_completed === 'undefined'
                       ? ""
                       : req.query.is_completed.toLowerCase();

    DB(TABLE)
        .select('id', 'donor', 'recipient', 'is_completed')
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
        .then(function (data) {
            /** The Knex query returns a JSON object containing the query results.
             *  Why does Postman return the JSON object with escaped quotes \"
             *  and newlines in the callback? Is this okay?
             */
            for (let i = 0; i < data.length; i++) {
                // Is is ok to make 'donor' a constant?
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
        .then(function (data) {
            console.log("Deleted " + id)

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
