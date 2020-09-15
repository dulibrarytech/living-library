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
      DB = require('../config/db')(),
      CONFIG = require('../config/config');

/*
module.exports.migrateTest = function () {
    console.log("Inside migrateTest function");
    DB(CONFIG.dbOrigDonorTable)
        .select('*')
        .where({
            donorID: 1
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log('Error: ' + error);
        });
};
*/

console.log("donations table name = " + CONFIG.dbDonationsTable);
console.log("donor table name = " + CONFIG.dbOrigDonorTable);

DB(CONFIG.dbOrigDonorTable)
    .select('*')
    .where({
        donorID: 1
    })
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log('Error: ' + error);
    });
