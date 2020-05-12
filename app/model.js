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
    DB = require('../config/db')(),
    TABLE = 'donorinformation';

/**
 * Creates record
 * @param req
 * @param callback
 */
exports.create = function (req, callback) {
    // let record = req.body;
    console.log(req.body);

    /* original insert query
    DB(TABLE)
        .insert(record)
        .then(function (data) {
            callback({
                status: 201,
                message: 'Record created.'
            });
        })
        .catch(function (error) {
            LOGGER.module().error('FATAL: Unable to create record ' + error);
            throw 'FATAL: Unable to create record ' + error;
        });
    */

    /* returning doesn't work in MySQL, so I need another way to get the
     * newly-created donorID
     */
    DB(TABLE)
        //.returning('donorID') <-- doesn't work in MySQL
        .insert(req.body)
        //.insert(req.body, 'donorID')
        .then(function (data) {
            // DB... or use async library (check backend app)
            console.log("Added " + data);
            var donorID = data;
            callback({
                status: 201,
                message: 'Record created.'
            });
        })
        .catch(function (error) {
            LOGGER.module().error('FATAL: Unable to create record ' + error);
            throw 'FATAL: Unable to create record ' + error;
        });

    /*
    DB('notifydonorinformation')
        .insert(record)
        .then(function (data) {
            callback({
                status: 201,
                message: 'Record created.'
            });
        })
        .catch(function (error) {
            LOGGER.module().error('FATAL: Unable to create record ' + error);
            throw 'FATAL: Unable to create record ' + error;
        });
    */

    /* Same as above, but might allow for inserting into multiple
     * tables (still have the problem of needing the donorID of the
     * newly-created donorinformation record)
    DB
        .insert(record).into(TABLE)
        .then(function (data) {
            callback({
                status: 201,
                message: 'Record created.'
            });
        })
        .catch(function (error) {
            LOGGER.module().error('FATAL: Unable to create record ' + error);
            throw 'FATAL: Unable to create record ' + error;
        });
    */
};

/**
 * Reads record
 * @param req
 * @param callback
 */
exports.read = function (req, callback) {

    /* original read query
    DB(TABLE)
        .select('*')
        .where({
            id: req.query.id
        })
    */

    /* Query for Donation Queue page (in old app, see getDonorQueue() from
     * donationsmodel.php for model, and dashboard.php and donorQueue.php for
     * view)
    DB('queue')
        .join('donorinformation', 'queue.donorID', '=',
              'donorinformation.donorID')
        .join('donationamountinformation', 'donationamountinformation.donorID',
              '=', 'donorinformation.donorID')
        .select('queue.donorID', 'donorinformation.donorTitle',
                'donorinformation.donorFirstName',
                'donorinformation.donorLastName',
                'donationamountinformation.dateOfDonation')
        .orderBy('queue.timestamp', 'desc')
        .then(function (data) {

            callback({
                status: 200,
                message: 'Record retrieved.',
                data: data
            });

        })
        .catch(function (error) {
            LOGGER.module().fatal('FATAL: Unable to read record ' + error);
            throw 'FATAL: Unable to read record ' + error;
        });
     */

    /* Query for Completed Donations page (in old app, see
     * getCompletedDonations() from donationsmodel.php for model, and
     * dashboard.php and completedDonations.php for view)
     */
    DB('completeddonations')
        .join('donorinformation', 'completeddonations.donorID', '=',
              'donorinformation.donorID')
        .join('donationamountinformation', 'donationamountinformation.donorID',
              '=', 'donorinformation.donorID')
        .select('completeddonations.donorID', 'donorinformation.donorTitle',
                'donorinformation.donorFirstName',
                'donorinformation.donorLastName',
                'donationamountinformation.dateOfDonation')
        .orderBy('completeddonations.timestamp', 'desc')
        .then(function (data) {

            callback({
                status: 200,
                message: 'Record retrieved.',
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
