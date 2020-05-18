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
    console.log(req.body);

    /**
     * Donation Form submission actions
     */

    // 1.)
    function createDonor(callback) {
        let obj = {};

        DB(TABLE)
            .insert(req.body)
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
    let where_clause = typeof req.query.is_completed === 'undefined' ? "" : " WHERE"
                       + " is_completed = " + req.query.is_completed;
    console.log(where_clause === "" ? "where_clause is an empty string" : where_clause);

    DB
        .raw(`SELECT id,
                     donor->"$.title" AS title,
                     donor->"$.first_name" as first_name,
                     donor->"$.last_name" as last_name,
                     donor->"$.date_of_donation" as date_of_donation
              FROM ` + TABLE
              + where_clause +
              ` ORDER BY created desc`)
        .then(function (data) {
            for (let i = 0; i < data[0].length; i++) {
                console.log("Tracking ID = " + data[0][i].id + ", from " +
                            data[0][i].title + " " + data[0][i].first_name +
                            " " + data[0][i].last_name + ", donated on " +
                            data[0][i].date_of_donation);
            }

            callback({
                status: 200,
                message: 'Records retrieved.',
                data: data[0]
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
    let record = req.body;
    console.log(record);
    DB(TABLE)
        .where({
            donorID: req.query.id
        })
        .update({
            donorTitle: record.donorTitle
        })
        .then(function (data) {

            if (data === 1) {

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

    DB(TABLE)
        .where({
            donorID: req.query.id
        })
        .del()
        .then(function (data) {

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
