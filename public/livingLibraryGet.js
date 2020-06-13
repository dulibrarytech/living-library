/*
 * Donor Application
 *
 * Living Library Functions involving GET requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */

function create_donation_using_then_promises() {
    const api_base_url = 'http://localhost:8000/api/v1/living-library/donations';
    const api_key = '5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';
    const titles_table = 'tbl_titles_lookup';

    // Fetch titles from lookup table
    fetch(api_base_url + '?tbl=' + titles_table + '&is_active=true'
          + '&api_key=' + api_key)
    .then(function(response) {
        if (response.status !== 200) {
            console.warn('Looks like there was a problem. Status Code: '
                        + response.status);
            return;
        }

        response.json().then(function(data) {
            console.log("Inside Titles fetch");

            let title_options_html = '';

            for (let i = 0; i < data.length; i++) {
                console.log("data[" + i + "].title = " + data[i].title);

                if (i > 0) {
                    title_options_html += ' ';
                }

                title_options_html += '<option value="' + data[i].title
                                      + '">' + data[i].title
                                      + '</option>';
            }

            console.log("[Inside Titles fetch] title_options_html = " + title_options_html);

            return title_options_html;
        });
    })
    .catch(function(error) {
        LOGGER.module().error('FATAL: [create_donation] Unable to fetch titles ' + error);
        throw 'FATAL: [create_donation] Unable to fetch titles ' + error;
    })
    .then(function(title_options_html) {

        console.log("title_options_html = " + title_options_html);

        hide_table_header_and_content();

        let page_label_element = document.querySelector('#page-label');

        if (page_label_element) {
            page_label_element.innerHTML = 'Living Library: Donation Form';
        }

        let form_html = '<form id="donor-input-form" method="post">';

        form_html += '<table class="table">';

        form_html += '<tr>';
        form_html += '<td><h4>Person making donation</h4></td>';
        form_html += '<td></td>';
        form_html += '<td></td>';
        form_html += '</tr>';

        form_html += '<tr>';
        form_html += '<td>'
                     + '<label for="donor_title_dropdown" '
                     + 'class="form-label-text">Title:'
                     + '</label>'
                     + '<select class="input-medium" id="donor_title_dropdown" '
                     + 'name="donor_title">'
                     + title_options_html
                     + '</select>'
                     + '</td>';

        form_html += '<td>'
                     + '<label for="donor_first_name_input_box" '
                     + 'class="form-label-text">First Name:'
                     + '</label>'
                     + '<input type="text" id="donor_first_name_input_box" '
                     + 'class="input_form-default" name="donor_first_name"/>'
                     + '</td>';

        form_html += '<td>'
                  + '<label for="donor_last_name_input_box" '
                  + 'class="form-label-text">Last Name:'
                  + '</label>'
                  + '<input type="text" id="donor_last_name_input_box" '
                  + 'class="input_form-default" name="donor_last_name"/>'
                  + '</td>';
        form_html += '</tr>';

        form_html += '<tr>';
        form_html += '<td>'
                     + '<label for="bibliographic_number_input_box" '
                     + 'class="form-label-text">Bibliographic Number:'
                     + '</label>'
                     + '<input type="text" '
                     + 'id="bibliographic_number_input_box" '
                     + 'class="input_form-default" '
                     + 'name="bibliographic_number"/>'
                     + '</td>';

        form_html += '<td>'
                     + '<label for="call_number_input_box" '
                     + 'class="form-label-text">Call Number:'
                     + '</label>'
                     + '<input type="text" id="call_number_input_box" '
                     + 'class="input_form-default" name="call_number"/>'
                     + '</td>';
        form_html += '</tr>';

        form_html += '</table>'; // close table with text input boxes

        form_html += '<input type="hidden" id="donation_id_hidden_box" '
                     + 'name="donation_id" value=""/>';

        form_html += '<table class="table lower_controls">'
                     + '<tr>'
                     + '<td class="span1">'
                     + '<button type="submit" '
                     + 'class="btn-grey" id="save_book_plate_button" '
                     + 'onclick="save_book_plate(event);">Save Book Plate'
                     + '</button>'
                     + '</td>'
                     + '</tr>'
                     + '</table>';

        form_html += '</form>';

        console.log(form_html);
        let form_content_element = document.querySelector('#form-content');

        if (form_content_element) {
           form_content_element.innerHTML = form_html;
        }
    });
}

function create_donation() {
    const api_base_url = 'http://localhost:8000/api/v1/living-library/donations';
    const api_key = '5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';
    const titles_table = 'tbl_titles_lookup';

    hide_table_header_and_content();

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = 'Living Library: Donation Form';
    }

    let form_html = '<form id="donor-input-form" method="post">';

    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td><h4>Person making donation</h4></td>';
    form_html += '<td></td>';
    form_html += '<td></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="donor_title_dropdown" '
                 + 'class="form-label-text">Title:'
                 + '</label>'
                 + '<select class="input-medium" id="donor_title_dropdown" '
                 + 'name="donor_title">';
                 + '</select>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="donor_first_name_input_box" '
                 + 'class="form-label-text">First Name:'
                 + '</label>'
                 + '<input type="text" id="donor_first_name_input_box" '
                 + 'class="input_form-default" name="donor_first_name"/>'
                 + '</td>';

    form_html += '<td>'
              + '<label for="donor_last_name_input_box" '
              + 'class="form-label-text">Last Name:'
              + '</label>'
              + '<input type="text" id="donor_last_name_input_box" '
              + 'class="input_form-default" name="donor_last_name"/>'
              + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="bibliographic_number_input_box" '
                 + 'class="form-label-text">Bibliographic Number:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="bibliographic_number_input_box" '
                 + 'class="input_form-default" '
                 + 'name="bibliographic_number"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="call_number_input_box" '
                 + 'class="form-label-text">Call Number:'
                 + '</label>'
                 + '<input type="text" id="call_number_input_box" '
                 + 'class="input_form-default" name="call_number"/>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close table with text input boxes

    form_html += '<input type="hidden" id="donation_id_hidden_box" '
                 + 'name="donation_id" value=""/>';

    form_html += '<table class="table lower_controls">'
                 + '<tr>'
                 + '<td class="span1">'
                 + '<button type="submit" '
                 + 'class="btn-grey" id="save_book_plate_button" '
                 + 'onclick="save_book_plate(event);">Save Book Plate'
                 + '</button>'
                 + '</td>'
                 + '</tr>'
                 + '</table>';

    form_html += '</form>';

    console.log(form_html);
    let form_content_element = document.querySelector('#form-content');

    if (form_content_element) {
        form_content_element.innerHTML = form_html;
    }

    let donor_title_dropdown = document.querySelector('#donor_title_dropdown');
    donor_title_dropdown.length = 0;

    let default_title_option = document.createElement('option');
    default_title_option.text = '--Select a title--';
    default_title_option.setAttribute('value', '');
    default_title_option.setAttribute('selected', '');

    donor_title_dropdown.add(default_title_option);
    donor_title_dropdown.selectedIndex = 0;

    // fetch titles from database to build title dropdown menu
    fetch(api_base_url + '?tbl=' + titles_table + '&is_active=true'
          + '&api_key=' + api_key)
        .then(function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem with fetching '
                             'titles. Status Code: ' + response.status);
                return;
            }

            response.json().then(function(data) {
                console.log("Inside Titles fetch");

                let option;

                for (let i = 0; i < data.length; i++) {
                    console.log("data[" + i + "].title = " + data[i].title);

                    option = document.createElement('option');
                    option.text = data[i].title;
                    option.value = data[i].title;
                    donor_title_dropdown.add(option);
                }
            });
        })
        .catch(function(error) {
            LOGGER.module().error('FATAL: [create_donation] Unable to fetch titles ' + error);
            throw 'FATAL: [create_donation] Unable to fetch titles ' + error;
        });
}

/* This causes the following errors:
- Uncaught ReferenceError: require is not defined
- Uncaught ReferenceError: Cannot access 'ASYNC' before initialization

const LOGGER = require('../libs/log4'),
      ASYNC = require('async');
*/

function create_donation_async() {
    const api_base_url = 'http://localhost:8000/api/v1/living-library/donations';
    const api_key = '5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';
    const titles_table = 'tbl_titles_lookup';

    /**
     * 1.) Fetch titles from lookup table
     */
    function fetch_titles(callback) {
        let obj = {};

        fetch(api_base_url + '?tbl=' + titles_table + '&is_active=true'
              + '&api_key=' + api_key)
            .then(function(response) {
                if (response.status !== 200) {
                    console.warn('Looks like there was a problem. Status Code: '
                                 + response.status);
                    return;
                }

                response.json().then(function(data) {
                    console.log("Inside Titles fetch");

                    obj.titles = '';
                    for (let i = 0; i < data.length; i++) {
                        console.log("data[" + i + "].title = " + data[i].title);

                        if (i > 0) {
                            obj.titles += ' ';
                        }

                        obj.titles += '<option value="' + data[i].title + '">'
                                      + data[i].title
                    	                + '</option>';
                    }

                    callback(null, obj);
                    return false;
                });
            })
            .catch(function(error) {
                LOGGER.module().error('FATAL: [create_donation/fetch_titles] Unable to fetch titles ' + error);
                throw 'FATAL: [create_donation/fetch_titles] Unable to fetch titles ' + error;
            });
    }

    /**
     * 2.) Build html and add it to page
     */
    function build_html(obj, callback) {
        hide_table_header_and_content();

        let page_label_element = document.querySelector('#page-label');

        if (page_label_element) {
            page_label_element.innerHTML = 'Living Library: Donation Form';
        }

        let form_html = '<form id="donor-input-form" method="post">';

        form_html += '<table class="table">';

        form_html += '<tr>';
        form_html += '<td><h4>Person making donation</h4></td>';
        form_html += '<td></td>';
        form_html += '<td></td>';
        form_html += '</tr>';

        form_html += '<tr>';
        form_html += '<td>'
                     + '<label for="donor_title_dropdown" '
                     + 'class="form-label-text">Title:'
                     + '</label>'
                     + '<select class="input-medium" id="donor_title_dropdown" '
                     + 'name="donor_title">'
                     + obj.titles
                     + '</select>'
                     + '</td>';

        form_html += '<td>'
                     + '<label for="donor_first_name_input_box" '
                     + 'class="form-label-text">First Name:'
                     + '</label>'
                     + '<input type="text" id="donor_first_name_input_box" '
                     + 'class="input_form-default" name="donor_first_name"/>'
                     + '</td>';

        form_html += '<td>'
                  + '<label for="donor_last_name_input_box" '
                  + 'class="form-label-text">Last Name:'
                  + '</label>'
                  + '<input type="text" id="donor_last_name_input_box" '
                  + 'class="input_form-default" name="donor_last_name"/>'
                  + '</td>';
        form_html += '</tr>';

        form_html += '<tr>';
        form_html += '<td>'
                     + '<label for="bibliographic_number_input_box" '
                     + 'class="form-label-text">Bibliographic Number:'
                     + '</label>'
                     + '<input type="text" '
                     + 'id="bibliographic_number_input_box" '
                     + 'class="input_form-default" '
                     + 'name="bibliographic_number"/>'
                     + '</td>';

        form_html += '<td>'
                     + '<label for="call_number_input_box" '
                     + 'class="form-label-text">Call Number:'
                     + '</label>'
                     + '<input type="text" id="call_number_input_box" '
                     + 'class="input_form-default" name="call_number"/>'
                     + '</td>';
        form_html += '</tr>';

        form_html += '</table>'; // close table with text input boxes

        form_html += '<input type="hidden" id="donation_id_hidden_box" '
                     + 'name="donation_id" value=""/>';

        form_html += '<table class="table lower_controls">'
                     + '<tr>'
                     + '<td class="span1">'
                     + '<button type="submit" '
                     + 'class="btn-grey" id="save_book_plate_button" '
                     + 'onclick="save_book_plate(event);">Save Book Plate'
                     + '</button>'
                     + '</td>'
                     + '</tr>'
                     + '</table>';

        form_html += '</form>';

        console.log(form_html);
        let form_content_element = document.querySelector('#form-content');

        if (form_content_element) {
            form_content_element.innerHTML = form_html;
        }

        callback(null, obj);
        return false;

        /*
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
        */
    }

    /**
     * Is this waterfall approach needed here? I don't think secondFunction
     * is necessary since I can populate the entire tbl_donations record with
     * one insert. <-- This is correct (no waterfall approach needed here).
     */
    ASYNC.waterfall([
        fetch_titles,
        build_html
    ], function (error, results) {
        console.log("Inside create_donation waterfall function");

        if (error) {
            LOGGER.module().error('ERROR: [create_donation/async.waterfall] ' + error);
        }

        /*
        callback({
            status: 201,
            message: 'Record created.',
            data: results.data
        });
        */
    });
}

function create_donation_old() {
    const api_base_url = 'http://localhost:8000/api/v1/living-library/donations';
    const api_key = '5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';
    const titles_table = 'tbl_titles_lookup';

    hide_table_header_and_content();

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = 'Living Library: Donation Form';
    }

    let form_html = '<form id="donor-input-form" method="post">';

    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td><h4>Person making donation</h4></td>';
    form_html += '<td></td>';
    form_html += '<td></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="donor_title_dropdown" '
                 + 'class="form-label-text">Title:'
                 + '</label>'
                 + '<select class="input-medium" id="donor_title_dropdown" '
                 + 'name="donor_title">';

    /* This code is for when you're trying to find an existing select element.
     * But since we're building the HTML, this select element does not yet
     * exist in the DOM.

    let donor_title_dropdown = document.getElementById('donor_title_dropdown');
    donor_title_dropdown.length = 0;

    let default_title_option = document.createElement('option');
    default_title_option.text = '--Select a title--';
    default_title_option.setAttribute('value', '');
    default_title_option.setAttribute('selected', '');

    donor_title_dropdown.add(default_title_option);
    donor_title_dropdown.selectedIndex = 0;

    fetch(api_base_url + '?tbl=' + titles_table + '&is_active=true'
          + '&api_key=' + api_key)
        .then(function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem. Status Code: '
                             + response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(function(data) {
                let option;

                for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                	  option.text = data[i].name;
                	  option.value = data[i].abbreviation;
                	  donor_title_dropdown.add(option);
                }
            });
        })
        .catch(function(error) {
            console.error('Fetch Error: ', error);
        });

    */

    // fetch titles from database to build dropdown menu
    form_html += '<option value="Mr.">Mr.</option>'
                 + '<option value="Ms.">Ms.</option>';
    fetch(api_base_url + '?tbl=' + titles_table + '&is_active=true'
          + '&api_key=' + api_key)
        .then(function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem. Status Code: '
                             + response.status);
                return;
            }

            response.json().then(function(data) {
                console.log("Inside Titles fetch");
                for (let i = 0; i < data.length; i++) {
                    console.log("data[" + i + "].title = " + data[i].title);
                    form_html += '<option value="' + data[i].title + '">'
                                 + data[i].title
                	               + '</option>';
                }
            });
        })
        .catch(function(error) {
            console.error('Fetch Error: ', error);
        });

    form_html += '</select>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="donor_first_name_input_box" '
                 + 'class="form-label-text">First Name:'
                 + '</label>'
                 + '<input type="text" id="donor_first_name_input_box" '
                 + 'class="input_form-default" name="donor_first_name"/>'
                 + '</td>';

    form_html += '<td>'
              + '<label for="donor_last_name_input_box" '
              + 'class="form-label-text">Last Name:'
              + '</label>'
              + '<input type="text" id="donor_last_name_input_box" '
              + 'class="input_form-default" name="donor_last_name"/>'
              + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="bibliographic_number_input_box" '
                 + 'class="form-label-text">Bibliographic Number:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="bibliographic_number_input_box" '
                 + 'class="input_form-default" '
                 + 'name="bibliographic_number"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="call_number_input_box" '
                 + 'class="form-label-text">Call Number:'
                 + '</label>'
                 + '<input type="text" id="call_number_input_box" '
                 + 'class="input_form-default" name="call_number"/>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close table with text input boxes

    form_html += '<input type="hidden" id="donation_id_hidden_box" '
                 + 'name="donation_id" value=""/>';

    form_html += '<table class="table lower_controls">'
                 + '<tr>'
                 + '<td class="span1">'
                 + '<button type="submit" '
                 + 'class="btn-grey" id="save_book_plate_button" '
                 + 'onclick="save_book_plate(event);">Save Book Plate'
                 + '</button>'
                 + '</td>'
                 + '</tr>'
                 + '</table>';

    form_html += '</form>';

    console.log(form_html);
    let form_content_element = document.querySelector('#form-content');

    if (form_content_element) {
        form_content_element.innerHTML = form_html;
    }
}

function get_donations(is_completed) {
    is_completed = validate_is_completed_parameter(is_completed);

    const base_url = 'http://localhost/donordb/';
    const api_url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    fetch(api_url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);

            /*
             * Recreating browseDonorsView.initPage() from libs/donorDB/views.js
             */

            $(".content-window").css("height", "770px");
            $(".pre-scrollable").css("max-height", "485px");

            $("#page-label").text(is_completed
                                  ? "Living Library: Completed Donations"
                                  : "Living Library: Donation Queue");

            /* Original donordb code for table-header
             *
            $("#table-header").html("<thead> <th class='span2'><!--SPACE--></th> <th class='span4'>Last Name / Organization</th> <th class='span4'>First Name</th> <th style='align:right'><!--SPACE--></th> </thead>");

            utils.getDonorDataArray(setQueue);
            viewUtils.setUserLabel();
            */

            $("#table-header").html("<thead> " +
                                    "<th class='span1_wider'>" +
                                    (is_completed
                                    ? "Full Record"
                                    : "Book Plate Form") +
                                    "</th> " +
                                    "<th class='span1'>ID</th> " +
                                    "<th class='span4'>Donor Name</th> " +
                                    "<th class='span4'>Recipient Name</th> " +
                                    "<th style='align:right'>Date of Donation</th> " +
                                    "</thead>");

            $("#table-content").html('');
            let html = '';

            if (data.length === 0) {
                html += '<p class="label">No donation records found.</p>';
            } else {
                html += '<table class="table table-bordered table-striped">';
                for (let i = 0; i < data.length; i++) {
                    const donor = JSON.parse(data[i].donor);
                    const recipient = JSON.parse(data[i].recipient);
                    let is_completed_string = data[i].is_completed
                                              ? 'completed'
                                              : 'in the queue';

                    if (donor !== null) {
                        console.log("Tracking ID = " + data[i].id + " from " +
                                    donor.title + " " + donor.first_name +
                                    " " + donor.last_name);
                    } else {
                        console.log("Donor field of " + data[i].id + " is "
                                    + donor);
                    }

                    if (recipient !== null) {
                        console.log(recipient.donation_type + " " + recipient.title
                                    + " " + recipient.first_name + " "
                                    + recipient.last_name);
                    } else {
                        console.log("Recipient field of " + data[i].id + " is "
                                      + recipient);
                    }

                    if (donor !== null) {
                        console.log("Donated on " + donor.date_of_donation
                                    + ".\nStatus: " + is_completed_string);
                    }
                    console.log();

                    let donation_status = data[i].is_completed
                                          ? 'completed'
                                          : 'queued';

                    html += '<tr>';

                    html += '<td class="span1_wider" style="text-align: center">'
                            + '<a href="' + base_url + 'index.php/livinglibrary/'
                            + 'getDonation/' + donation_status + '/'
                            + data[i].id + '">'
                            + '<img src="' + base_url
                            + (data[i].is_completed
                              ? 'img/living_library_application_view_list.png" />'
                              : 'img/living_library_application_form.png" />')
                            + '</a>'
                            + '</td>';

                    html += '<td class="span1" style="text-align: center">'
                            + data[i].id + '</td>';

                    html += '<td class="span4 name-cell4">';
                    if (donor !== null) {
                        html += donor.title + ' ' + donor.first_name + ' '
                                + donor.last_name;
                    }
                    html += '</td>';

                    html += '<td class="span4 name-cell4">';
                    if (recipient !== null) {
                        html += recipient.title + ' ' + recipient.first_name
                                + ' ' + recipient.last_name;
                    }
                    html += '</td>';

                    html += '<td style="text-align: center">';
                    if (donor !== null) {
                        html += donor.date_of_donation;
                    }
                    html += '</td>';

                    html += '</tr>';
                }
                html += '</table>';
            }
            console.log(html);

            let id = document.querySelector('#table-content');

            if (id) {
                id.innerHTML = html;
            }

        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        });
}

function get_donation(is_completed, id) {
    is_completed = validate_is_completed_parameter(is_completed);
    const url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&id=' + id
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    hide_table_header_and_content();

    if (is_completed) {
        get_completed_donation(url);
        console.log("Based on URL parameter, this is a completed donation");
    } else {
        get_queued_donation(url);
        console.log("Based on URL parameter, this is a queued donation");
    }
}

function get_completed_donation(url) {
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            $("#page-label").html('Living Library: Donation Record');

            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);
            const book = JSON.parse(data[0].book);

            let html = '';

            if (donor === null) {
                html += '<h4>No person making donation.</h4>';
            } else {
                html += '<h4>Person making donation</h4>';
                html += '<dl>';
                html += '<dt>Title: </dt>'
                        + '<dd>' + donor.title + '</dd>';
                html += '<dt>First Name: </dt>'
                        + '<dd>' + donor.first_name + '</dd>';
                html += '<dt>Last Name: </dt>'
                        + '<dd>' + donor.last_name + '</dd>';
                html += '<dt>Address: </dt>'
                        + '<dd>' + donor.address + '</dd>';
                html += '<dt>City: </dt>'
                        + '<dd>' + donor.city + '</dd>';
                html += '<dt>State: </dt>'
                        + '<dd>' + donor.state + '</dd>';
                html += '<dt>Zip: </dt>'
                        + '<dd>' + donor.zip + '</dd>';
                html += '</dl>';
            }

            if (who_to_notify === null) {
                html += '<h4>No person to be notified of donation.</h4>';
            } else {
                html += '<h4>Person(s) to be notified of donation</h4>';
                for (let i = 0; i < who_to_notify.length; i++) {
                    html += '<dl class="name_address_block">';
                    html += '<dt>Title: </dt>'
                            + '<dd>' + who_to_notify[i].title + '</dd>';
                    html += '<dt>First Name: </dt>'
                            + '<dd>' + who_to_notify[i].first_name + '</dd>';
                    html += '<dt>Last Name: </dt>'
                            + '<dd>' + who_to_notify[i].last_name + '</dd>';
                    html += '<dt>Address: </dt>'
                            + '<dd>' + who_to_notify[i].address + '</dd>';
                    html += '<dt>City: </dt>'
                            + '<dd>' + who_to_notify[i].city + '</dd>';
                    html += '<dt>State: </dt>'
                            + '<dd>' + who_to_notify[i].state + '</dd>';
                    html += '<dt>Zip: </dt>'
                            + '<dd>' + who_to_notify[i].zip + '</dd>';
                    html += '<dt>Relation to Donor: </dt>'
                            + '<dd>' + who_to_notify[i].relation_to_donor + '</dd>';
                    html += '</dl>';
                }
            }

            if (recipient === null) {
                html += '<h4>No person receiving donation.</h4>';
            } else {
                html += '<h4>Person receiving donation</h4>';
                html += '<dl>';
                html += '<dt>Title: </dt>'
                        + '<dd>' + recipient.title + '</dd>';
                html += '<dt>First Name: </dt>'
                        + '<dd>' + recipient.first_name + '</dd>';
                html += '<dt>Last Name: </dt>'
                        + '<dd>' + recipient.last_name + '</dd>';
                html += '<dt>Donation Type: </dt>'
                        + '<dd>' + recipient.donation_type + '</dd>';
                html += '</dl>';
            }

            if (donor === null) {
                html += '<h4>No donation date or amount.</h4>';
            } else {
                html += '<h4>Donation Information</h4>';
                html += '<dl>';
                html += '<dt>Amount of Donation: </dt>'
                        + '<dd>' + donor.amount_of_donation + '</dd>';
                html += '<dt>Date of Donation: </dt>'
                        + '<dd>' + donor.date_of_donation + '</dd>';
                html += '</dl>';
            }

            if (book === null) {
                html += '<h4>No book information.</h4>';
            } else {
                html += '<h4>Book Information</h4>';
                html += '<dl>';
                html += '<dt>Author Name: </dt>'
                        + '<dd>' + book.author_name + '</dd>';
                html += '<dt>Book Title: </dt>'
                        + '<dd>' + book.book_title + '</dd>';
                html += '<dt>Bibliographic Number: </dt>'
                        + '<dd>' + book.bibliographic_number + '</dd>';
                html += '<dt>Call Number: </dt>'
                        + '<dd>' + book.call_number + '</dd>';
                html += '</dl>';
            }

            console.log(html);
            let id = document.querySelector('#record-content');

            if (id) {
                id.innerHTML = html;
            }
        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        });
}

function get_queued_donation(url) {
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            $("#page-label").html('Living Library: Book Plate Form');

            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);

            /* Add information from the donation record */
            let html = '<dl>';

            if (donor === null) {
                html += '<dt>No person making donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Person making donation: </dt>'
                        + '<dd>' + donor.title + ' ' + donor.first_name + ' '
                        + donor.last_name + '</dd>';

                if (donor.notes !== null) {
                    html += '<dt>Notes: </dt>'
                            + '<dd>' + donor.notes + '</dd>';
                }
            }

            if (who_to_notify === null || who_to_notify.length === 0) {
                html += '<dt>No person to be notified of donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Person(s) to be notified of donation: </dt>';
                html += '<dd>';
                for (let i = 0; i < who_to_notify.length; i++) {
                    if (i > 0)
                        html += '; ';
                    html += who_to_notify[i].title + ' '
                            + who_to_notify[i].first_name + ' '
                            + who_to_notify[i].last_name;
                }
                html += '</dd>';
            }

            if (recipient === null) {
                html += '<dt>No person receiving donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Person receiving donation: </dt>'
                        + '<dd>' + recipient.title + ' ' + recipient.first_name
                        + ' ' + recipient.last_name + ' ('
                        + recipient.donation_type + ')</dd>';
            }

            if (donor === null) {
                html += '<dt>No date of donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Date of donation: </dt>'
                        + '<dd>' + donor.date_of_donation + '</dd>';
            }

            if (donor === null || donor.subject_areas === null
                || donor.subject_areas.length === 0) {
                html += '<dt>No subject areas selected.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Selected subject areas: </dt>';
                html += '<dd>';
                for (let i = 0; i < donor.subject_areas.length; i++) {
                    if (i > 0)
                        html += '; ';
                    html += donor.subject_areas[i];
                }
                html += '</dd>';
            }

            html += '</dl>';

            html += '<br>';

            html += '<h4>Book Plate Information</h4>';

            console.log(html);
            let record_content_element = document.querySelector('#record-content');

            if (record_content_element) {
                record_content_element.innerHTML = html;
            }

            /* Add book plate form */
            let form_html = '<form id="donor-input-form" method="post">';

            form_html += '<table class="table">';

            form_html += '<tr>';
            form_html += '<td>'
                         + '<label for="author_name_input_box" '
                         + 'class="form-label-text">Author Name:'
                         + '</label>'
                         + '<input type="text" id="author_name_input_box" '
                         + 'class="input_form-default" name="author_name"/>'
                         + '</td>';

            form_html += '<td>'
                         + '<label for="book_title_input_box" '
                         + 'class="form-label-text">Book Title:'
                         + '</label>'
                         + '<input type="text" id="book_title_input_box" '
                         + 'class="input_form-default" name="book_title"/>'
                         + '</td>';
            form_html += '</tr>';

            form_html += '<tr>';
            form_html += '<td>'
                         + '<label for="bibliographic_number_input_box" '
                         + 'class="form-label-text">Bibliographic Number:'
                         + '</label>'
                         + '<input type="text" '
                         + 'id="bibliographic_number_input_box" '
                         + 'class="input_form-default" '
                         + 'name="bibliographic_number"/>'
                         + '</td>';

            form_html += '<td>'
                         + '<label for="call_number_input_box" '
                         + 'class="form-label-text">Call Number:'
                         + '</label>'
                         + '<input type="text" id="call_number_input_box" '
                         + 'class="input_form-default" name="call_number"/>'
                         + '</td>';
            form_html += '</tr>';

            form_html += '</table>'; // close table with text input boxes

            form_html += '<input type="hidden" id="donation_id_hidden_box" '
                         + 'name="donation_id" value=""/>';

            form_html += '<table class="table lower_controls">'
                         + '<tr>'
                         + '<td class="span1">'
                         + '<button type="submit" '
                         + 'class="btn-grey" id="save_book_plate_button" '
                         + 'onclick="save_book_plate(event);">Save Book Plate'
                         + '</button>'
                         + '</td>'
                         + '</tr>'
                         + '</table>';

            form_html += '</form>';

            console.log(form_html);
            let form_content_element = document.querySelector('#form-content');

            if (form_content_element) {
                form_content_element.innerHTML = form_html;
            }

            let donation_id_hidden_box =
                document.querySelector('#donation_id_hidden_box');

            console.log("donation id = " + data[0].id);
            if (donation_id_hidden_box) {
                donation_id_hidden_box.setAttribute('value', data[0].id);
            }
        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        });
}

/**
 * Removes table header and table content elements from view.
 */
function hide_table_header_and_content() {
    $("#table-header").html('');
    let table_header_element = document.getElementById("table-header");
    table_header_element.classList.remove("table-bordered");
    table_header_element.classList.remove("table");
    table_header_element.setAttribute("id", "no-table-header");

    $("#table-content").html('');
    document.getElementById("table-content")
            .setAttribute("id", "no-table-content");
}

 /**
  * Returns a valid boolean value based on is_completed parameter.
  * Defaults to false for any invalid value or type.
  * Any number that is not 1 is considered false.
  * @param is_completed
  */
function validate_is_completed_parameter(is_completed) {
    console.log("before switch, is_completed = " + is_completed);
    switch (typeof is_completed) {
        case 'boolean':
            break;
        case 'number':
            is_completed = is_completed == 1;
            break;
        case 'string':
            is_completed = is_completed.toLowerCase() == 'true' ||
                           is_completed == '1';
            break;
        default:
            is_completed = false;
    }
    console.log("after switch, is_completed = " + is_completed);
    return is_completed;
}