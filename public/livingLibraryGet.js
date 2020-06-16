/*
 * Donor Application
 *
 * Living Library Functions involving GET requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */

const TITLES_TABLE = 'tbl_titles_lookup',
      STATES_TABLE = 'tbl_states_lookup',
      RELATIONSHIPS_TABLE = 'tbl_relationships_lookup',
      SUBJECT_AREAS_TABLE = 'tbl_subject_areas_lookup',
      SUBJECT_AREA_COLS = 3; // how many columns to use when displaying
                             // subject area checkboxes

function create_donation() {
    const api_base_url = 'http://localhost:8000/api/v1/living-library/donations';
    const api_key = '5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    hide_table_header_and_content();

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = 'Living Library: Donation Form';
    }

    let form_html = '<form id="donor-input-form" method="post">';

    // Donor table
    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td colspan="3"><h4>Person making donation</h4></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="donor_title_dropdown" '
                 + 'class="form-label-text">Title:'
                 + '</label>'
                 + '<select class="input-medium title_dropdown" '
                 + 'id="donor_title_dropdown" name="donor_title">'
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
                 + '<label for="donor_address_input_box" '
                 + 'class="form-label-text">Address:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="donor_address_input_box" '
                 + 'class="input_form-default" '
                 + 'name="donor_address"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="donor_city_input_box" '
                 + 'class="form-label-text">City:'
                 + '</label>'
                 + '<input type="text" id="donor_city_input_box" '
                 + 'class="input_form-default" name="donor_city"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="donor_state_dropdown" '
                 + 'class="form-label-text">State:'
                 + '</label>'
                 + '<select class="input_form-default state_dropdown" '
                 + 'id="donor_state_dropdown" name="donor_state">'
                 + '</select>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td colspan="3">'
                 + '<label for="donor_zip_input_box" '
                 + 'class="form-label-text">Zip:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="donor_zip_input_box" '
                 + 'class="input-medium" '
                 + 'name="donor_zip"/>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close Donor table

    // Who To Notify table
    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td colspan="3"><h4>Person(s) to be notified of donation</h4></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="notify_title_dropdown" '
                 + 'class="form-label-text">Title:'
                 + '</label>'
                 + '<select class="input-medium title_dropdown" '
                 + 'id="notify_title_dropdown" name="notify_title">'
                 + '</select>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_first_name_input_box" '
                 + 'class="form-label-text">First Name:'
                 + '</label>'
                 + '<input type="text" id="notify_first_name_input_box" '
                 + 'class="input_form-default" name="notify_first_name"/>'
                 + '</td>';

    form_html += '<td>'
              + '<label for="notify_last_name_input_box" '
              + 'class="form-label-text">Last Name:'
              + '</label>'
              + '<input type="text" id="notify_last_name_input_box" '
              + 'class="input_form-default" name="notify_last_name"/>'
              + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="notify_address_input_box" '
                 + 'class="form-label-text">Address:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="notify_address_input_box" '
                 + 'class="input_form-default" '
                 + 'name="notify_address"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_city_input_box" '
                 + 'class="form-label-text">City:'
                 + '</label>'
                 + '<input type="text" id="notify_city_input_box" '
                 + 'class="input_form-default" name="notify_city"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_state_dropdown" '
                 + 'class="form-label-text">State:'
                 + '</label>'
                 + '<select class="input_form-default state_dropdown" '
                 + 'id="notify_state_dropdown" name="notify_state">'
                 + '</select>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="notify_zip_input_box" '
                 + 'class="form-label-text">Zip:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="notify_zip_input_box" '
                 + 'class="input-medium" '
                 + 'name="notify_zip"/>'
                 + '</td>';

    form_html += '<td colspan="2">'
                 + '<label for="notify_relation_to_donor_dropdown" '
                 + 'class="form-label-text">Relation to Donor:'
                 + '</label>'
                 + '<select class="input_form-default relationship_dropdown" '
                 + 'id="notify_relation_to_donor_dropdown" '
                 + 'name="notify_relation_to_donor">'
                 + '</select>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close Who To Notify table

    // Recipient table
    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td colspan="3"><h4>Person receiving donation</h4></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="recipient_title_dropdown" '
                 + 'class="form-label-text">Title:'
                 + '</label>'
                 + '<select class="input-medium title_dropdown" '
                 + 'id="recipient_title_dropdown" name="recipient_title">'
                 + '</select>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="recipient_first_name_input_box" '
                 + 'class="form-label-text">First Name:'
                 + '</label>'
                 + '<input type="text" id="recipient_first_name_input_box" '
                 + 'class="input_form-default" name="recipient_first_name"/>'
                 + '</td>';

    form_html += '<td>'
              + '<label for="recipient_last_name_input_box" '
              + 'class="form-label-text">Last Name:'
              + '</label>'
              + '<input type="text" id="recipient_last_name_input_box" '
              + 'class="input_form-default" name="recipient_last_name"/>'
              + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td colspan="3">'
                 + '<div>'
                 + '<label for="recipient_donation_type_radio_choice1" '
                 + 'class="radio inline">'
                 + '<input type="radio" '
                 + 'id="recipient_donation_type_radio_choice1" '
                 + 'name="recipient_donation_type" checked/>In Honor of'
                 + '</label>'
                 + '</div>'
                 + '<div>'
                 + '<label for="recipient_donation_type_radio_choice2" '
                 + 'class="radio inline">'
                 + '<input type="radio" '
                 + 'id="recipient_donation_type_radio_choice2" '
                 + 'name="recipient_donation_type"/>In Memory of'
                 + '</label>'
                 + '</div>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close Recipient table

    // Donation Info table
    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td colspan="3"><h4>Donation information</h4></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="donor_amount_of_donation_input_box" '
                 + 'class="form-label-text">Amount of Donation (e.g. 100.00):'
                 + '</label>'
                 + '<input type="text" id="donor_amount_of_donation_input_box" '
                 + 'class="input_form-default" name="donor_amount_of_donation"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="gift-date-box" '
                 + 'class="form-label-text">Donation Date:'
                 + '</label>'
                 + '<input type="text" id="gift-date-box" '
                 + 'class="input_form-default" name="donor_date_of_donation"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="donor_notes_textarea" '
                 + 'class="form-label-text">Notes:'
                 + '</label>'
                 + '<textarea id="donor_notes_textarea" '
                 + 'class="input_form-default" name="donor_notes"></textarea>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close Donation Info table

    // Subject Areas table
    form_html += '<table class="table" id="subject_areas">';

    form_html += '<tr>';
    form_html += '<td colspan="' + SUBJECT_AREA_COLS
                 + '"><h4>Subject areas</h4></td>';
    form_html += '</tr>';

    form_html += '</table>'; // close Subject Areas table

    form_html += '<input type="hidden" id="donation_id_hidden_box" '
                 + 'name="donation_id" value=""/>';

    form_html += '<table class="table lower_controls">'
                 + '<tr>'
                 + '<td class="span1">'
                 + '<button type="submit" '
                 + 'class="btn-grey" id="save_donation_button" '
                 + 'onclick="save_book_plate(event);">Send to Queue'
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

    // Populate Title dropdown menus
    let titles_url = api_base_url + '?tbl=' + TITLES_TABLE + '&is_active=true'
                     + '&api_key=' + api_key;
    populate_dropdown_menu(TITLES_TABLE, titles_url,
                           document.getElementsByClassName('title_dropdown'),
                           '--Select a title--');

    // Populate State dropdown menus
    let states_url = api_base_url + '?tbl=' + STATES_TABLE + '&is_active=true'
                     + '&api_key=' + api_key;
    populate_dropdown_menu(STATES_TABLE, states_url,
                           document.getElementsByClassName('state_dropdown'),
                           '--Select a state--');

    // Populate Relation to Donor dropdown menu
    let relationships_url = api_base_url + '?tbl=' + RELATIONSHIPS_TABLE
                     + '&is_active=true' + '&api_key=' + api_key;
    populate_dropdown_menu(RELATIONSHIPS_TABLE, relationships_url,
                           document.getElementsByClassName('relationship_dropdown'),
                           '--Select a relation to donor--');

    // Add Subject Area checkboxes
    fetch(api_base_url + '?tbl=' + SUBJECT_AREAS_TABLE + '&is_active=true'
          + '&api_key=' + api_key)
        .then(function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem fetching the '
                             + 'subject areas. Status Code: '
                             + response.status);
                return false;
            }

            response.json().then(function(data) {
                console.log("Inside subject areas fetch");

                // Add checkboxes to <table>
                let checkbox_html = '';

                if (data.length === 0) {
                    checkbox_html += '<tr>';
                    checkbox_html += '<td colspan="' + SUBJECT_AREA_COLS
                                 + '">No subject areas found.</td>';
                    checkbox_html += '</tr>';
                }

                let table = document.querySelector('#subject_areas');
                for (let i = 0; i < data.length; i++) {
                    console.log("data[" + i + "].subject = "
                                + data[i].subject);

                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = 'checkbox_' + i;
                    checkbox.name = 'subject_areas[]';
                    checkbox.value = data[i].subject;
                    console.log("checkbox.id = " + checkbox.id);

                    let label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.className = 'checkbox inline';
                    // label.setAttribute('class', 'checkbox inline');
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(checkbox.value));
                    // label.innerHTML = checkbox.value;

                    let td = document.createElement('td');
                    td.appendChild(label);

                    if (i % SUBJECT_AREA_COLS == 0) {
                        let newRow = document.createElement('tr');
                        newRow.appendChild(td);
                        table.appendChild(newRow);
                    } else {
                        let lastRow = table.rows[table.rows.length - 1];
                        lastRow.appendChild(td);
                    }
                }
            });
        })
        .catch(function(error) {
            /* LOGGER is not defined
            LOGGER.module().error('FATAL: [create_donation] Unable to fetch '
                                  + label_name + ' ' + error);
            */
            console.log('FATAL: [create_donation] Unable to fetch subject '
                        + 'areas ' + error);
            throw 'FATAL: [create_donation] Unable to fetch subject areas '
                  + error;
        });
}

/**
 * Populates dropdown menu(s) by fetching values from a lookup table
 * @param table_name     the lookup table whose values will populate each
 *                       element's dropdown menu
 * @param url            the url of the API being queried
 * @param html_elements  the dropdown menu(s) to be populated (i.e. the <select>
 *                       tags); an HTMLCollection object
 * @param text_for_default_option   the option each dropdown menu should display
 *                                  by default
 */
function populate_dropdown_menu(table_name, url, html_elements,
                                text_for_default_option) {
    // Create new <select> element and add its default option
    let select = document.createElement('select');
    let default_option = document.createElement('option');

    default_option.text = text_for_default_option;
    default_option.setAttribute('value', '');
    default_option.setAttribute('selected', '');

    select.add(default_option);
    select.selectedIndex = 0;

    let field_name; // name of the database field we need to reference
    let label_name; // name of the values being fetched

    switch(table_name) {
        case TITLES_TABLE:
            field_name = 'title', label_name = 'titles';
            break;
        case STATES_TABLE:
            field_name = 'state_full', label_name = 'states';
            break;
        case RELATIONSHIPS_TABLE:
            field_name = 'relationship', label_name = 'relationships';
            break;
        default:
            console.log(table_name + " is not a lookup table. Cannot populate "
                        + "dropdown menu.")
            return false;
    }

    // Fetch dropdown menu options from database and add to <select> element
    fetch(url)
        .then(function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem fetching the '
                             + label_name + '. Status Code: '
                             + response.status);
                return false;
            }

            response.json().then(function(data) {
                console.log("Inside " + label_name + " fetch");

                // Add dropdown menu options to <select> element
                let option;
                for (let i = 0; i < data.length; i++) {
                    console.log("data[" + i + "]." + field_name + " = "
                                + data[i][field_name]);

                    option = document.createElement('option');
                    option.text = data[i][field_name];
                    option.value = data[i][field_name];
                    select.add(option);
                }

                /* Replace all relevant dropdown menus with the newly-populated
                 * <select> element
                 */
                let need_to_clone = false;
                for (let node of html_elements) {
                    /* Can only use a given <select> element once in the DOM.
                     * So clone it if it's needed for more than one dropdown
                     * menu.
                     */
                    let select_copy;
                    if (need_to_clone) {
                        select_copy = select.cloneNode(true);
                    } else {
                        select_copy = select;
                        need_to_clone = true;
                    }

                    select_copy.setAttribute('class', node.getAttribute('class'));
                    select_copy.setAttribute('id', node.getAttribute('id'));
                    select_copy.setAttribute('name', node.getAttribute('name'));
                    node.parentNode.replaceChild(select_copy, node);
                }
            });
        })
        .catch(function(error) {
            /* LOGGER is not defined
            LOGGER.module().error('FATAL: [create_donation] Unable to fetch '
                                  + label_name + ' ' + error);
            */
            console.log('FATAL: [create_donation] Unable to fetch '
                        + label_name + ' ' + error);
            throw 'FATAL: [create_donation] Unable to fetch ' + label_name + ' '
                  + error;
        });

    return true;
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
