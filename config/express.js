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

const HTTPS = require('https'),
    HTTP = require('http'),       
    FS = require('fs'),
    EXPRESS = require('express'),
    CONFIG = require('../config/config'),
    COMPRESS = require('compression'),
    BODYPARSER = require('body-parser'),
    METHODOVERRIDE = require('method-override'),
    HELMET = require('helmet'),
    XSS = require('../libs/dom'),
    CORS = require('cors');

module.exports = function() {

    /////
    // https server
    /////
    // const APP = EXPRESS(),
    //     SERVER = HTTPS.createServer({
    //         key: FS.readFileSync(CONFIG.sslKey),
    //         cert: FS.readFileSync(CONFIG.sslCertificate)
    //     }, APP);
    // SERVER.listen(process.env.APP_PORT, () => {
    //     console.log(`https server running on port: ${process.env.APP_PORT}`);
    // });
    /////
    // end https server
    /////

    /////
    // http server
    /////
    const APP = EXPRESS();
    HTTP.createServer(APP).listen(process.env.APP_PORT, () => {
        console.log(`http server running on port: ${process.env.APP_PORT}`);
    });
    /////
    // end http server
    /////

    if (process.env.NODE_ENV === 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    } else if (process.env.NODE_ENV === 'production') {
        APP.use(COMPRESS());
    }

    APP.use(BODYPARSER.urlencoded({
        extended: true
    }));
    APP.use(BODYPARSER.json());
    APP.use(METHODOVERRIDE());
    APP.use(HELMET());

    APP.use(EXPRESS.static('./public'));
    APP.use(XSS.sanitize_req_query);
    APP.use(XSS.sanitize_req_body);
    APP.use(CORS({
        origin: CONFIG.corsAllowedOrigin
    }));
    APP.set('views', './views');
    APP.set('view engine', 'ejs');

    require('../living-library/routes.js')(APP);
};
