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

const CONFIG = require('../config/config'),
      DUAPP = require('../living-library/controller'),
      KEY_AUTH = require('../libs/key-auth');

module.exports = function (app) {

    app.route(CONFIG.apiRoute)
        .post(KEY_AUTH.verify, DUAPP.create)
        .get(KEY_AUTH.verify, DUAPP.read)
        .put(KEY_AUTH.verify, DUAPP.update)
        .delete(KEY_AUTH.verify, DUAPP.delete);
};
