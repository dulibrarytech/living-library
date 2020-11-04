/*
 * Donor Application
 *
 * Living Library Functions involving GET requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, August 2020
 */

'use strict';

/* The number of "person to be notified of donation" form field groups that
 * are present on the donation form (the user can add more as needed)
 */
let add_person_to_notify_counter = 1;

/**
 * Builds the Donation Form webpage
 */
const create_donation = function () {

    // How many columns to use when displaying subject area checkboxes
    const SUBJECT_AREA_COLS = 3;

    living_library_helper.hide_table_content();

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = 'Living Library: Donation Form';
    }

    let form_html = '<form id="donation-form" method="post" '
                    + 'onsubmit="save_donation(event);">';

    // Donor table
    form_html += '<table class="table">';

    form_html += '<tr>';
    form_html += '<td colspan="3"><h4>Person making donation</h4></td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td colspan="3">'
                 + living_library_config.get_form_symbol_explanation_text()
                 + '</td>';
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
                 + 'class="form-label-text">'
                 + living_library_config.get_donation_form_info()
                                        .zip_code_label_text
                 + '</label>'
                 + '<input type="text" '
                 + 'id="donor_zip_input_box" '
                 + 'class="input-medium" '
                 + 'name="donor_zip" '
                 + living_library_config.get_form_validation_rules()
                                        .zip_code_validation + '/>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close Donor table

    // Who To Notify table
    form_html += '<div class="table">';

    form_html += '<table id="notify_section_1">';

    form_html += '<tr>';
    form_html += '<td colspan="3">'
                 + '<h4>Person <span id="notify_person_heading_num_1"></span>'
                 + 'to be notified of donation</h4>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="notify_title_dropdown_1" '
                 + 'class="form-label-text">Title:'
                 + '</label>'
                 + '<select class="input-medium title_dropdown '
                 + 'notify_person_1" '
                 + 'id="notify_title_dropdown_1" '
                 + 'name="notify_title">'
                 + '</select>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_first_name_input_box_1" '
                 + 'class="form-label-text">First Name:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="notify_first_name_input_box_1" '
                 + 'class="input_form-default notify_person_1" '
                 + 'name="notify_first_name"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_last_name_input_box_1" '
                 + 'class="form-label-text">Last Name:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="notify_last_name_input_box_1" '
                 + 'class="input_form-default notify_person_1" '
                 + 'name="notify_last_name"/>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="notify_address_input_box_1" '
                 + 'class="form-label-text">Address:'
                 + '</label>'
                 + '<input type="text" '
                 + 'id="notify_address_input_box_1" '
                 + 'class="input_form-default notify_person_1" '
                 + 'name="notify_address"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_city_input_box_1" '
                 + 'class="form-label-text">City:'
                 + '</label>'
                 + '<input type="text" id="notify_city_input_box_1" '
                 + 'class="input_form-default notify_person_1" '
                 + 'name="notify_city"/>'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="notify_state_input_box_1" '
                 + 'class="form-label-text">State:'
                 + '</label>'
                 + '<select class="input_form-default state_dropdown '
                 + 'notify_person_1" '
                 + 'id="notify_state_input_box_1" '
                 + 'name="notify_state">'
                 + '</select>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '<tr>';
    form_html += '<td>'
                 + '<label for="notify_zip_input_box_1" '
                 + 'class="form-label-text">'
                 + living_library_config.get_donation_form_info()
                                        .zip_code_label_text
                 + '</label>'
                 + '<input type="text" '
                 + 'id="notify_zip_input_box_1" '
                 + 'class="input-medium notify_person_1" '
                 + 'name="notify_zip" '
                 + living_library_config.get_form_validation_rules()
                                        .zip_code_validation + '/>'
                 + '</td>';

    form_html += '<td colspan="2">'
                 + '<label for="notify_relation_to_donor_input_box_1" '
                 + 'class="form-label-text">Relation to Donor:'
                 + '</label>'
                 + '<select class="input_form-default relationship_dropdown '
                 + 'notify_person_1" '
                 + 'id="notify_relation_to_donor_input_box_1" '
                 + 'name="notify_relation_to_donor">'
                 + '</select>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close notify_section_1 table

    form_html += '<table>'; // open add_person_to_notify table

    form_html += '<tr id="add_person_to_notify_row">';
    form_html += '<td>'
                 + '<button class="btn btn-light btn-bold" '
                 + 'onclick="add_person_to_notify(event);">'
                 + 'Add person to be notified'
                 + '</button>'
                 + '</td>';
    form_html += '</tr>';

    form_html += '</table>'; // close add_person_to_notify table

    form_html += '</div>'; // close Who To Notify div

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
                 + '<label for="recipient_donation_type">'
                 + '</label>'
                 + '<label for="recipient_donation_type_radio_choice1" '
                 + 'class="radio inline">'
                 + '<input type="radio" '
                 + 'id="recipient_donation_type_radio_choice1" '
                 + 'name="recipient_donation_type" '
                 + 'value="In Honor of" checked/>In Honor of'
                 + '</label>'
                 + '</div>'
                 + '<div>'
                 + '<label for="recipient_donation_type_radio_choice2" '
                 + 'class="radio inline">'
                 + '<input type="radio" '
                 + 'id="recipient_donation_type_radio_choice2" '
                 + 'name="recipient_donation_type" '
                 + 'value="In Memory of"/>In Memory of'
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
                 + 'class="form-label-text">Amount of Donation (e.g. 1500.00):'
                 + '</label>'
                 + '<input type="number" '
                 + 'id="donor_amount_of_donation_input_box" '
                 + 'class="input_form-default" name="donor_amount_of_donation" '
                 + living_library_config.get_form_validation_rules()
                                        .dollar_amount_validation + ' />'
                 + '</td>';

    form_html += '<td>'
                 + '<label for="gift-date-box" '
                 + 'class="form-label-text">Donation Date (YYYY-MM-DD):'
                 + '</label>'
                 + '<input type="text" id="gift-date-box" '
                 + 'class="input_form-default" name="donor_date_of_donation" '
                 + living_library_config.get_form_validation_rules()
                                        .date_validation + '/>'
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

    form_html += '<table class="table lower_controls">'
                 + '<tr>'
                 + '<td>'
                 + '<button type="submit" '
                 + 'class="btn-grey" id="save_donation_button" '
                 + 'style="margin-right: 20px;">'
                 + 'Send to Queue'
                 + '</button>'
                 + '<div id="donation-form-confirmation" '
                 + 'style="display: inline-block; padding: 0px;">'
                 + '</div>'
                 + '</td>'
                 + '</tr>'
                 + '</table>';

    form_html += '</form>';

    let form_content_element = document.querySelector('#form-content');

    if (form_content_element) {
        form_content_element.innerHTML = form_html;
    }

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'HEAD',
        mode: 'cors'
    })
        .then(function () {
            // Populate Title dropdown menus
            let titles_url = living_library_api_url + '&tbl=' +
                             living_library_config.get_titles_table() +
                             '&is_active=true';

            living_library_helper.populate_dropdown_menu(
                living_library_config.get_titles_table(),
                titles_url,
                document.getElementsByClassName('title_dropdown'),
                '--Select a title--'
            );

            // Populate State dropdown menus
            let states_url = living_library_api_url + '&tbl=' +
                             living_library_config.get_states_table() +
                             '&is_active=true';

            living_library_helper.populate_dropdown_menu(
                living_library_config.get_states_table(),
                states_url,
                document.getElementsByClassName('state_dropdown'),
                '--Select a state--'
            );

            // Populate Relation to Donor dropdown menu
            let relationships_url = living_library_api_url + '&tbl=' +
                                    living_library_config
                                    .get_relationships_table() +
                                    '&is_active=true';

            living_library_helper.populate_dropdown_menu(
                living_library_config.get_relationships_table(),
                relationships_url,
                document.getElementsByClassName('relationship_dropdown'),
                '--Select a relation to donor--'
            );

            // Add Subject Area checkboxes
            fetch(living_library_api_url +
                  '&tbl=' + living_library_config.get_subject_areas_table() +
                  '&is_active=true')
                .then(function(response) {
                    if (response.status !== 200) {
                        throw 'Status Code ' + response.status;
                    }

                    return response.json();
                })
                .then(function(data) {
                    let table = document.querySelector('#subject_areas');

                    if (data.length === 0) {
                        let row = table.insertRow();
                        let cell = row.insertCell();
                        cell.colSpan = SUBJECT_AREA_COLS;
                        cell.innerHTML = 'No subject areas found.';
                        return;
                    }

                    for (let i = 0; i < data.length; i++) {
                        let checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = 'checkbox_' + i;
                        checkbox.name = 'donor_subject_areas';
                        checkbox.value = data[i].term;

                        let label = document.createElement('label');
                        label.htmlFor = checkbox.id;
                        label.className = 'checkbox inline';
                        label.innerHTML = checkbox.value;
                        label.insertBefore(checkbox, label.childNodes[0]);

                        // decide where to insert cell
                        let row = i % SUBJECT_AREA_COLS == 0
                                  ? table.insertRow()
                                  : table.rows[table.rows.length - 1];
                        row.insertCell().appendChild(label);
                    }
                })
                .catch(function(error) {
                    console.error('ERROR: Unable to fetch subject areas: ' +
                                  error);
                });
        })
        .catch(function (error) {
            console.error('ERROR: HEAD request failed: ' + error);
            living_library_helper
            .insert_error_message('Error loading page', true);
        });

    // Set required fields
    living_library_helper
    .update_required_fields_in_form(living_library_config
                                    .get_donation_form_info());

    viewUtils.setUserLabel();
};

/**
 * Adds additional form fields to the Donation Form (so that the user can add
 * more persons to be notified of donation)
 * @param  {Object}  event   the event triggered by clicking the "Add person to
 *                           be nofified" button
 */
const add_person_to_notify = function (event) {
    // Stop the form from submitting the default way
    event.preventDefault();

    // Increment counter since we're adding a person
    add_person_to_notify_counter++;

    if (add_person_to_notify_counter == 2) {
        let notify_person_1_element =
            document.getElementById("notify_person_heading_num_1");
        if (notify_person_1_element.innerHTML == '') {
            notify_person_1_element.innerHTML = '1 ';
        }
    }

    let new_div_element = document.querySelector("#notify_section_1")
                                  .cloneNode(true);
    new_div_element.id = 'notify_section_' + add_person_to_notify_counter;

    let notify_heading_span_element =
        new_div_element.querySelector("#notify_person_heading_num_1");
    notify_heading_span_element.id = 'notify_person_heading_num_'
                                     + add_person_to_notify_counter;
    notify_heading_span_element.innerHTML = add_person_to_notify_counter + ' ';

    // Update labels (i.e. the 'for' attributes)
    let label_elements = new_div_element.querySelectorAll('label[for$="_1"]');
    for (let label_element of label_elements) {
        label_element.htmlFor = label_element.htmlFor.substring(0,
            label_element.htmlFor.lastIndexOf('_1')) + '_' +
            add_person_to_notify_counter;
    }

    // Update class attributes
    let elements_with_numbered_class =
        new_div_element.querySelectorAll('[class$="_1"]');
    for (let element_with_numbered_class of elements_with_numbered_class) {
        element_with_numbered_class.className =
            element_with_numbered_class.className.substring(0,
            element_with_numbered_class.className.lastIndexOf('_1')) + '_' +
            add_person_to_notify_counter;
    }

    // Update id attributes
    let elements_with_numbered_id =
        new_div_element.querySelectorAll('[id$="_1"]');
    for (let element_with_numbered_id of elements_with_numbered_id) {
        // Remove cloned values from input tags
        if (element_with_numbered_id.tagName == 'INPUT') {
            element_with_numbered_id.value = '';
        }

        // Update ids
        element_with_numbered_id.id =
            element_with_numbered_id.id.substring(0,
            element_with_numbered_id.id.lastIndexOf('_1')) + '_' +
            add_person_to_notify_counter;
    }

    let last_row_element = document.querySelector('#add_person_to_notify_row');

    // Insert new_div_element before last_row_element
    last_row_element.parentNode.insertBefore(new_div_element, last_row_element);
};

/**
 * Builds the Donation Queue (if is_completed=false) or Completed Donations (if
 * is_completed=true) webpages
 * @param  {(boolean|number|string)}  is_completed   the type of donation
 *                                                   records desired
 */
const get_donations = function (is_completed) {
    is_completed = living_library_helper
                   .validate_is_completed_parameter(is_completed);

    $("#table-content").html('');

    $("#page-label").text(is_completed
                          ? "Living Library: Completed Donations"
                          : "Living Library: Donation Queue");

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'HEAD',
        mode: 'cors'
    })
        .then(function () {
            fetch(living_library_api_url + '&is_completed=' + is_completed)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let html = '';

                    if (data.length === 0) {
                        html += '<table class="table table-bordered '
                                + 'table-striped">'
                                + '<tr>'
                                + '<td>No donation records found.</td>'
                                + '</tr>'
                                + '</table>';
                    } else {
                        // Donations table
                        html += '<table id="date-range-filter">'
                                + '<tr>'
                                + '<td>'
                                + '<div class="form-group form-inline">'
                                + '<label for="start_date_input_box">'
                                + 'From:'
                                + '</label> '
                                + '<input type="text" '
                                + 'class="form-control" '
                                + 'id="start_date_input_box" '
                                + 'name="start_date" '
                                + 'placeholder="YYYY-MM-DD" /> '
                                + '<label for="end_date_input_box">'
                                + 'To:'
                                + '</label> '
                                + '<input type="text" '
                                + 'class="form-control" '
                                + 'id="end_date_input_box" '
                                + 'name="end_date" '
                                + 'placeholder="YYYY-MM-DD" />'
                                + '</div>'
                                + '</td>'
                                + '</tr>'
                                + '</table>';
                        html += '<table id="donations" class="display" ' +
                                'style="width:100%">';
                        html += '<thead>'
                                + '<tr>'
                                + '<th>'
                                + (is_completed ? 'Full Record'
                                                : 'Book Plate Form')
                                + '</th> '
                                + '<th>ID</th> '
                                + '<th>Donor Name</th> '
                                + '<th>Recipient Name</th> '
                                + '<th>Donation Amount</th> '
                                + '<th>Date of Donation</th> ';
                        if (!is_completed) {
                            html += '<th>Delete Record?</th> ';
                        }
                        html += '</tr>'
                                + '</thead>';
                        html += '<tbody>';

                        for (let i = 0; i < data.length; i++) {
                            const donor = living_library_helper
                                          .get_valid_json(data[i], 'donor'),
                                  recipient = living_library_helper
                                              .get_valid_json(data[i],
                                                              'recipient');

                            let donation_id = living_library_helper
                                              .get_field_value(data[i], 'id');

                            let donation_status = data[i].is_completed
                                                  ? 'completed'
                                                  : 'queued';

                            html += '<tr>';

                            html += '<td style="text-align: center;">';
                            if (typeof donation_id === 'number') {
                                html += '<a href="' + baseUrl + _getDonationUrl
                                        + donation_status + '/' + donation_id
                                        + '" title='
                                        + (data[i].is_completed
                                           ? '"Full Record">'
                                           : '"Book Plate Form">')
                                        + '<img src="' + baseUrl
                                        + (data[i].is_completed
                                           ? 'img/living_library_application_' +
                                             'view_list.png" />'
                                           : 'img/living_library_application_' +
                                             'form.png" />')
                                        + '</a>';
                            }
                            html += '</td>';

                            html += '<td style="text-align: right;">'
                                    + donation_id
                                    + '</td>';

                            html += '<td>';
                            if (living_library_helper
                                .is_non_null_object(donor)) {
                                html += living_library_helper
                                        .get_field_value(donor, 'donor_title')
                                        + ' ' +
                                        living_library_helper
                                        .get_field_value(donor,
                                                         'donor_first_name')
                                        + ' ' +
                                        living_library_helper
                                        .get_field_value(donor,
                                                         'donor_last_name');
                            } else {
                                html += living_library_config
                                        .get_error_text_for_invalid_json();
                            }
                            html += '</td>';

                            html += '<td>';
                            if (living_library_helper
                                .is_non_null_object(recipient)) {
                                html += living_library_helper
                                        .get_field_value(recipient,
                                                         'recipient_title')
                                        + ' ' +
                                        living_library_helper
                                        .get_field_value(recipient,
                                                         'recipient_first_name')
                                        + ' ' +
                                        living_library_helper
                                        .get_field_value(recipient,
                                                         'recipient_last_name');
                            } else {
                                html += living_library_config
                                        .get_error_text_for_invalid_json();
                            }
                            html += '</td>';

                            html += '<td>';
                            if (living_library_helper
                                .is_non_null_object(donor)) {
                                html += living_library_helper.get_field_value(
                                            donor, 'donor_amount_of_donation'
                                        );
                            } else {
                                html += living_library_config
                                        .get_error_text_for_invalid_json();
                            }
                            html += '</td>';

                            html += '<td style="text-align: center;">';
                            if (living_library_helper
                                .is_non_null_object(donor)) {
                                html += living_library_helper.get_field_value(
                                            donor, 'donor_date_of_donation'
                                        );
                            } else {
                                html += living_library_config
                                        .get_error_text_for_invalid_json();
                            }
                            html += '</td>';

                            if (!is_completed) {
                                html += '<td style="text-align: center;">'
                                        + '<a href="#" '
                                        + 'onclick="delete_donation(event, '
                                        + donation_id + ');">'
                                        + 'Delete'
                                        + '</a>'
                                        + '</td> ';
                            }

                            html += '</tr>';
                        }
                        html += '</tbody>';
                        html += '</table>';
                    }

                    let table_content_element =
                        document.querySelector('#table-content');

                    if (table_content_element) {
                        table_content_element.innerHTML = html;
                    }

                    // Apply DataTables plugin to donations table
                    $(document).ready( function () {
                        let cols_not_to_be_searched = is_completed ? [ 0 ]
                                                                   : [ 0, 6 ];

                        let donations_table = $('#donations').DataTable( {
                            dom: 'Blfrtip',
                            select: true,
                            buttons: [
                                {
                                    extend: 'csv',
                                    text: 'Export records',
                                    filename: 'living_library_donations',
                                    exportOptions: {
                                        columns: [ 1, 2, 3, 4, 5 ]
                                    }
                                }
                            ],
                            columnDefs: [
                                {
                                    targets: cols_not_to_be_searched,
                                    searchable: false
                                },
                                {
                                    targets: [ 4 ],
                                    visible: false,
                                    searchable: false
                                }
                            ]
                        });

                        /*
                         * Add event listeners to the two date range filtering
                         * inputs
                         */
                        $('#start_date_input_box').keyup( function() {
                            donations_table.draw();
                        });
                        $('#end_date_input_box').keyup( function() {
                            donations_table.draw();
                        });
                    });
                })
                .catch((error) => {
                    console.error('Error with fetch request of get_donations ' +
                                  'function: ' + error);
                });
        })
        .catch(function (error) {
            console.error('ERROR: HEAD request failed: ' + error);
            living_library_helper
            .insert_error_message('Error loading page', true);
        });

    viewUtils.setUserLabel();
};

/**
 * Constructs the API URL and calls the relevant function that builds either the
 * Book Plate Form (if is_completed=false) or the Donation Record webpage (if
 * is_completed=true).
 * @param {(boolean|number|string)} is_completed  the donation record's status,
 *                                                i.e. if it's completed or not
 * @param {(number|string)}         id            the donation record's id
 */
const get_donation = function (is_completed, id) {
    is_completed = living_library_helper
                   .validate_is_completed_parameter(is_completed);
    const url = living_library_api_url + '&id=' + id;

    living_library_helper.hide_table_content();

    if (is_completed) {
        get_completed_donation(url);
    } else {
        get_queued_donation(url);
    }
};

/**
 * Builds the Donation Record webpage (for a completed donation)
 * @param {string}  url  the URL to fetch the donation record from the database
 */
const get_completed_donation = function (url) {
    $("#page-label").html('Living Library: Donation Record');

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'HEAD',
        mode: 'cors'
    })
        .then(function () {
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.length > 0) {
                        let is_completed =
                            living_library_helper
                            .validate_is_completed_parameter(data[0]
                                                             .is_completed);

                        if (!is_completed) {
                            living_library_helper
                            .insert_error_message('Donation not yet completed. '
                                                  + '<a href="' + baseUrl
                                                  + _getDonationUrl + 'queued/'
                                                  + data[0].id + '">'
                                                  + 'View Book Plate Form</a>.',
                                                  false);

                            return false;
                        }

                        const donor = living_library_helper
                                      .get_valid_json(data[0], 'donor'),
                              who_to_notify = living_library_helper
                                              .get_valid_json(data[0],
                                                              'who_to_notify'),
                              recipient = living_library_helper
                                          .get_valid_json(data[0], 'recipient'),
                              book = living_library_helper
                                     .get_valid_json(data[0], 'book');

                        let html = '<h4>Person making donation</h4>';
                        html += '<dl>';
                        html += '<dt>Title: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_title')
                                + '</dd>';
                        html += '<dt>First Name: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_first_name')
                                + '</dd>';
                        html += '<dt>Last Name: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_last_name')
                                + '</dd>';
                        html += '<dt>Address: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_address')
                                + '</dd>';
                        html += '<dt>City: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_city')
                                + '</dd>';
                        html += '<dt>State: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_state')
                                + '</dd>';
                        html += '<dt>Zip: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor, 'donor_zip')
                                + '</dd>';
                        html += '</dl>';

                        html += '<h4>Person(s) to be notified of donation</h4>';
                        if (!Array.isArray(who_to_notify) ||
                            who_to_notify.length === 0) {
                            html += '<p>None</p>';
                        } else {
                            for (let i = 0; i < who_to_notify.length; i++) {
                                html += '<dl class="name_address_block">';
                                html += '<dt>Title: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_title')
                                        + '</dd>';
                                html += '<dt>First Name: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_first_name')
                                        + '</dd>';
                                html += '<dt>Last Name: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_last_name')
                                        + '</dd>';
                                html += '<dt>Address: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_address')
                                        + '</dd>';
                                html += '<dt>City: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_city')
                                        + '</dd>';
                                html += '<dt>State: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_state')
                                        + '</dd>';
                                html += '<dt>Zip: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_zip')
                                        + '</dd>';
                                html += '<dt>Relation to Donor: </dt>'
                                        + '<dd>' +
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                            'notify_relation_to_donor')
                                        + '</dd>';
                                html += '</dl>';
                            }
                        }

                        html += '<h4>Person receiving donation</h4>';
                        html += '<dl>';
                        html += '<dt>Title: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(recipient, 'recipient_title')
                                + '</dd>';
                        html += '<dt>First Name: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(recipient,
                                                 'recipient_first_name')
                                + '</dd>';
                        html += '<dt>Last Name: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(recipient,
                                                 'recipient_last_name')
                                + '</dd>';
                        html += '<dt>Donation Type: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(recipient,
                                                 'recipient_donation_type')
                                + '</dd>';
                        html += '</dl>';

                        let donation_amount =
                            living_library_helper
                            .get_field_value(donor, 'donor_amount_of_donation');
                        if (typeof donation_amount === 'number') {
                            donation_amount = Intl.NumberFormat('en-US', {
                                                  style: 'currency',
                                                  currency: 'USD',
                                                  minimumFractionDigits: 2
                                              }).format(donation_amount);
                        } else {
                            console.warn('Error in donation record field: ' +
                                         'donor_amount_of_donation is not a ' +
                                         'number.');
                        }
                        html += '<h4>Donation Information</h4>';
                        html += '<dl>';
                        html += '<dt>Amount of Donation: </dt>'
                                + '<dd>' + donation_amount + '</dd>';
                        html += '<dt>Date of Donation: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(donor,
                                                 'donor_date_of_donation')
                                + '</dd>';
                        html += '</dl>';

                        html += '<h4>Subject Areas</h4>';
                        let subject_areas = [];
                        if (living_library_helper.is_non_null_object(donor) &&
                            Array.isArray(donor.donor_subject_areas) &&
                            donor.donor_subject_areas.length > 0) {
                            for (let i = 0;
                                 i < donor.donor_subject_areas.length; i++) {
                                let subject =
                                    living_library_helper.get_field_value(
                                        donor.donor_subject_areas, i
                                    );
                                if (subject !== '') {
                                    subject_areas.push(subject);
                                }
                            }
                        }
                        html += '<p>'
                                + (subject_areas.length === 0
                                   ? 'None'
                                   : subject_areas.join('; '))
                                + '</p>';

                        html += '<h4>Book Information</h4>';
                        html += '<dl>';
                        html += '<dt>Author Name: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(book, 'book_author_name')
                                + '</dd>';
                        html += '<dt>Book Title: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(book, 'book_title')
                                + '</dd>';
                        html += '<dt>Bibliographic Number: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(book,
                                                 'book_bibliographic_number')
                                + '</dd>';
                        html += '<dt>Call Number: </dt>'
                                + '<dd>' +
                                living_library_helper
                                .get_field_value(book, 'book_call_number')
                                + '</dd>';
                        html += '</dl>';

                        html += '<h4>Notes</h4>';
                        let notes = living_library_helper
                                    .get_field_value(donor, 'donor_notes');
                        html += '<p style="white-space: pre-wrap;">'
                                + (notes === '' ? 'None' : notes)
                                + '</p>';

                        let record_content_element =
                            document.querySelector('#record-content');

                        if (record_content_element) {
                            record_content_element.innerHTML = html;
                        }
                    } else {
                        living_library_helper.insert_error_message(
                            'Error: No donation record found.', true
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error with fetch request of ' +
                                  'get_completed_donation function: ' + error);
                });
        })
        .catch(function (error) {
            console.error('ERROR: HEAD request failed: ' + error);
            living_library_helper
            .insert_error_message('Error loading page', true);
        });

    viewUtils.setUserLabel();
};

/**
 * Builds the Book Plate Form webpage (for a queued donation)
 * @param   {string}   url   the API URL to fetch the donation record from the
 *                           database
 */
const get_queued_donation = function (url) {
    let has_required_input_boxes = true;

    $("#page-label").html('Living Library: Book Plate Form');

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'HEAD',
        mode: 'cors'
    })
        .then(function () {
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.length > 0) {
                        let is_completed =
                            living_library_helper
                            .validate_is_completed_parameter(data[0]
                                                             .is_completed);

                        if (is_completed) {
                            living_library_helper
                            .insert_error_message('Donation already completed. '
                                                  + '<a href="' + baseUrl
                                                  + _getDonationUrl
                                                  + 'completed/' + data[0].id
                                                  + '">View full record</a>.',
                                                  false);

                            has_required_input_boxes = false;

                            return false;
                        }

                        const donor = living_library_helper
                                      .get_valid_json(data[0], 'donor'),
                              who_to_notify = living_library_helper
                                              .get_valid_json(data[0],
                                                              'who_to_notify'),
                              recipient = living_library_helper
                                          .get_valid_json(data[0], 'recipient');

                        /* Add information from the donation record */
                        let html = '<dl>';

                        html += '<dt>Person making donation: </dt>'
                                + '<dd><span class="collapse-whitespace">';
                        if (living_library_helper.is_non_null_object(donor)) {
                            html += living_library_helper
                                    .get_field_value(donor, 'donor_title')
                                    + ' ' +
                                    living_library_helper
                                    .get_field_value(donor, 'donor_first_name')
                                    + ' ' +
                                    living_library_helper
                                    .get_field_value(donor, 'donor_last_name');
                        } else {
                            html += living_library_config
                                    .get_error_text_for_invalid_json();
                        }
                        html += '</span></dd>';

                        html += '<dt>Notes: </dt>'
                                + '<dd>';
                        if (living_library_helper.is_non_null_object(donor)) {
                            html += living_library_helper
                                    .get_field_value(donor, 'donor_notes');
                        } else {
                            html += living_library_config
                                    .get_error_text_for_invalid_json();
                        }
                        html += '</dd>';

                        html += '<dt>Person(s) to be notified of donation: '
                                + '</dt>'
                                + '<dd>';
                        if (Array.isArray(who_to_notify) &&
                            who_to_notify.length > 0) {
                            let persons_to_be_notified = [];
                            for (let i = 0; i < who_to_notify.length; i++) {
                                if (living_library_helper
                                    .is_non_null_object(who_to_notify[i])) {
                                    let person = [];

                                    let notify_title =
                                        living_library_helper.get_field_value(
                                            who_to_notify[i], 'notify_title'
                                        );
                                    if (notify_title !== '') {
                                        person.push(notify_title);
                                    }

                                    let notify_first_name =
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_first_name');
                                    if (notify_first_name !== '') {
                                        person.push(notify_first_name);
                                    }

                                    let notify_last_name =
                                        living_library_helper
                                        .get_field_value(who_to_notify[i],
                                                         'notify_last_name');
                                    if (notify_last_name !== '') {
                                        person.push(notify_last_name);
                                    }

                                    if (person.length > 0) {
                                        persons_to_be_notified
                                        .push(person.join(' '));
                                    }
                                }
                            }
                            html += persons_to_be_notified.join('; ');
                        } else {
                            html += living_library_config
                                    .get_error_text_for_invalid_json();
                        }
                        html += '</dd>';

                        html += '<dt>Person receiving donation: </dt>'
                                + '<dd><span class="collapse-whitespace">';
                        if (living_library_helper
                            .is_non_null_object(recipient)) {
                            html += living_library_helper
                                    .get_field_value(recipient,
                                                     'recipient_title')
                                    + ' ' +
                                    living_library_helper
                                    .get_field_value(recipient,
                                                     'recipient_first_name')
                                    + ' ' +
                                    living_library_helper
                                    .get_field_value(recipient,
                                                     'recipient_last_name')
                                    + ' (' +
                                    living_library_helper
                                    .get_field_value(recipient,
                                                     'recipient_donation_type')
                                    + ')';
                        } else {
                            html += living_library_config
                                    .get_error_text_for_invalid_json();
                        }
                        html += '</span></dd>';

                        html += '<dt>Date of donation: </dt>'
                                + '<dd>';
                        if (living_library_helper.is_non_null_object(donor)) {
                            html += living_library_helper.get_field_value(
                                        donor, 'donor_date_of_donation'
                                    );
                        } else {
                            html += living_library_config
                                    .get_error_text_for_invalid_json();
                        }
                        html += '</dd>';

                        html += '<dt>Subject areas: </dt>'
                                + '<dd>';
                        if (living_library_helper.is_non_null_object(donor) &&
                            Array.isArray(donor.donor_subject_areas) &&
                            donor.donor_subject_areas.length > 0) {
                            let subject_areas = [];
                            for (let i = 0;
                                 i < donor.donor_subject_areas.length; i++) {
                                let subject =
                                    living_library_helper.get_field_value(
                                        donor.donor_subject_areas, i
                                    );
                                if (subject !== '') {
                                    subject_areas.push(subject);
                                }
                            }

                            html += subject_areas.join('; ');
                        }
                        html += '</dd>';

                        html += '</dl>';

                        let record_content_element =
                            document.querySelector('#record-content');

                        if (record_content_element) {
                            record_content_element.innerHTML = html;
                        }

                        /* Add book plate form */
                        let form_html = '<form id="book-plate-form" '
                                        + 'method="post" '
                                        + 'onsubmit="save_book_plate(event);">';

                        form_html += '<table class="table">';

                        form_html += '<tr>';
                        form_html += '<td colspan="2">'
                                     + '<h4>Book Plate Information</h4>'
                                     + '</td>';
                        form_html += '</tr>';

                        form_html += '<tr>';
                        form_html += '<td colspan="2">'
                                     + living_library_config
                                       .get_form_symbol_explanation_text()
                                     + '</td>';
                        form_html += '</tr>';

                        form_html += '<tr>';
                        form_html += '<td>'
                                     + '<label for="book_author_name_input_box"'
                                     + ' class="form-label-text">Author Name:'
                                     + '</label>'
                                     + '<input type="text" '
                                     + 'id="book_author_name_input_box" '
                                     + 'class="input_form-default" '
                                     + 'name="book_author_name"/>'
                                     + '</td>';

                        form_html += '<td>'
                                     + '<label for="book_title_input_box" '
                                     + 'class="form-label-text">Book Title:'
                                     + '</label>'
                                     + '<input type="text" '
                                     + 'id="book_title_input_box" '
                                     + 'class="input_form-default" '
                                     + 'name="book_title"/>'
                                     + '</td>';
                        form_html += '</tr>';

                        form_html += '<tr>';
                        form_html += '<td>'
                                     + '<label for='
                                     + '"book_bibliographic_number_input_box" '
                                     + 'class="form-label-text">'
                                     + 'Bibliographic Number:'
                                     + '</label>'
                                     + '<input type="text" '
                                     + 'id='
                                     + '"book_bibliographic_number_input_box" '
                                     + 'class="input_form-default" '
                                     + 'name="book_bibliographic_number"/>'
                                     + '</td>';

                        form_html += '<td>'
                                     + '<label for='
                                     + '"book_call_number_input_box" '
                                     + 'class="form-label-text">Call Number:'
                                     + '</label>'
                                     + '<input type="text" '
                                     + 'id="book_call_number_input_box" '
                                     + 'class="input_form-default" '
                                     + 'name="book_call_number"/>'
                                     + '</td>';
                        form_html += '</tr>';

                        form_html += '</table>';

                        form_html += '<input type="hidden" '
                                     + 'id="donation_id_hidden_box" '
                                     + 'name="donation_id" value=""/>';

                        form_html += '<table class="table lower_controls">'
                                     + '<tr>'
                                     + '<td>'
                                     + '<button type="submit" '
                                     + 'class="btn-grey" '
                                     + 'id="save_book_plate_button">'
                                     + 'Save Book Plate'
                                     + '</button>'
                                     + '<div id="book-plate-form-confirmation">'
                                     + '</div>'
                                     + '</td>'
                                     + '</tr>'
                                     + '</table>';

                        form_html += '</form>';

                        let form_content_element =
                            document.querySelector('#form-content');

                        if (form_content_element) {
                            form_content_element.innerHTML = form_html;
                        }

                        let donation_id_hidden_box =
                            document.querySelector('#donation_id_hidden_box');

                        if (donation_id_hidden_box) {
                            donation_id_hidden_box.setAttribute('value',
                                                                data[0].id);
                        }
                    } else {
                        living_library_helper.insert_error_message(
                            'Error: No donation record found.', true
                        );

                        has_required_input_boxes = false;
                    }
                })
                .then(() => {
                    if (has_required_input_boxes) {
                        living_library_helper.update_required_fields_in_form(
                            living_library_config.get_book_plate_form_info()
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error with fetch request of ' +
                                  'get_queued_donation function: ' + error);
                });
        })
        .catch(function (error) {
            console.error('ERROR: HEAD request failed: ' + error);
            living_library_helper
            .insert_error_message('Error loading page', true);
        });

    viewUtils.setUserLabel();
};

/**
 * Loads the specified lookup table's records, i.e. subject areas, titles, or
 * relationships. This includes (1) a form to add a new record to the lookup
 * table and (2) a list of all active menu choices, each with a hyperlink to a
 * page where the user can update or delete the given menu choice.
 * @param   {string}    table    the lookup table to display
 */
const get_menu_choices = function (table) {
    // How many columns to use when displaying records
    const MENU_CHOICE_COLS = 2;

    living_library_helper.hide_table_content();

    let label, link_text, valid_table = true;

    switch (table) {
        case 'subjectarea':
            label = 'Subject Area',
            link_text = 'subjectArea',
            table = living_library_config.get_subject_areas_table();
            break;
        case 'title':
            label = 'Title',
            link_text = 'title',
            table = living_library_config.get_titles_table();
            break;
        case 'relationship':
            label = 'Relationship',
            link_text = 'relationship',
            table = living_library_config.get_relationships_table();
            break;
        default:
            console.error('ERROR: Invalid parameter value for menu choices ' +
                          'table: ' + table);

            living_library_helper
            .insert_error_message('Error: No records found.', true);

            valid_table = false;
    }

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = valid_table
                                       ? 'Living Library: ' + label + 's'
                                       : 'Living Library';
    }

    if (!valid_table) {
        return false;
    }

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'HEAD',
        mode: 'cors'
    })
        .then(function () {
            // Add menu choice form
            let html = '<form id="add-menu-choice-form" method="post" ' +
                       `onsubmit="add_menu_choice(event, '${table}');">`;

            html += '<table class="table">';

            html += '<tr>';
            html += '<td><h4>Add ' + label + '</h4></td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td>'
                    + living_library_config
                      .get_form_symbol_explanation_text()
                    + '</td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td>'
                    + '<label for="new_menu_choice_input_box" '
                    + 'class="form-label-text">'
                    + label + ':'
                    + '</label>'
                    + '<input type="text" id="new_menu_choice_input_box" '
                    + 'class="input_form-default" name="new_menu_choice"/>'
                    + '</td>';
            html += '</tr>';

            html += '</tr>';
            html += '<td>'
                    + '<button type="submit" class="btn btn-light btn-bold">'
                    + 'Save ' + label
                    + '</button>'
                    + '<div id="add-menu-choice-form-confirmation">'
                    + '</div>'
                    + '</td>';
            html += '</tr>';

            html += '</table>';
            html += '</form>';

            // Menu choices table
            html += '<table id="menu_choices" class="table">'
                    '</table>';

            html += '<tr>';
            html += '<td colspan="' + MENU_CHOICE_COLS + '">'
                    + '<h4>Edit ' + label + 's</h4>'
                    + '</td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td colspan="' + MENU_CHOICE_COLS + '">'
                    + '<p>( click ' + label + ' term to edit )</p>'
                    + '</td>';
            html += '</tr>';

            let form_content_element = document.querySelector('#form-content');

            if (form_content_element) {
                form_content_element.innerHTML = html;
            }

            living_library_helper
            .update_required_fields_in_form(living_library_config
                                            .get_add_menu_choice_form_info());

            // Populate menu choices
            fetch(living_library_api_url + '&tbl=' + table + '&is_active=true')
                .then(function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem fetching '
                                      + table + '. Status Code: '
                                      + response.status);
                        return false;
                    }

                    response.json().then(function(data) {
                        let table_element =
                            document.querySelector('#menu_choices');

                        if (data.length === 0) {
                            let row = table_element.insertRow();
                            let cell = row.insertCell();
                            cell.colSpan = MENU_CHOICE_COLS;
                            cell.innerHTML = 'No ' + label.toLowerCase() +
                                             's found.';
                            return;
                        }

                        for (let i = 0; i < data.length; i++) {
                            let anchor_element = document.createElement('a');
                            anchor_element.href = baseUrl + _editMenuChoiceUrl +
                                                  link_text + '/' + data[i].id;
                            anchor_element.title = 'Edit this ' + label;
                            anchor_element.innerHTML = data[i].term;

                            // decide where to insert cell
                            let row = i % MENU_CHOICE_COLS == 0
                                      ? table_element.insertRow()
                                      : table_element.rows[table_element
                                                           .rows.length - 1];
                            row.insertCell().appendChild(anchor_element);
                        }
                    });
                })
                .catch(function(error) {
                    console.error('ERROR: [get_menu_choices] Unable to fetch ' +
                                  table + ': ' + error);
                });
        })
        .catch(function (error) {
            console.error('ERROR: HEAD request failed: ' + error);
            living_library_helper
            .insert_error_message('Error loading page', true);
        });

    viewUtils.setUserLabel();
};

/**
 * Loads two forms for the specified lookup table record: The first form allows
 * the user to update the text of the menu choice. The second form allows the
 * user to remove the menu choice from the lookup table (to 'delete' the menu
 * choice, we set is_active=false).
 * @param  {string}           table            the lookup table containing the
 *                                             menu choice
 * @param  {(number|string)}  menu_choice_id   the id of the menu choice
 * @param  {string}           table_link_text  the text to be used in hyperlinks
 *                                             to identify the lookup table
 */
const edit_menu_choice = function (table, menu_choice_id, table_link_text) {
    living_library_helper.hide_table_content();

    let label, valid_table = true;

    switch (table) {
        case 'subjectarea':
            label = 'Subject Area',
            table = living_library_config.get_subject_areas_table();
            break;
        case 'title':
            label = 'Title',
            table = living_library_config.get_titles_table();
            break;
        case 'relationship':
            label = 'Relationship',
            table = living_library_config.get_relationships_table();
            break;
        default:
            console.error('ERROR: Invalid parameter value for menu choices ' +
                          'table: ' + table);

            living_library_helper
            .insert_error_message('Error: No record found.', true);

            valid_table = false;
    }

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = valid_table
                                       ? 'Living Library: ' + label + 's'
                                       : 'Living Library';
    }

    if (!valid_table) {
        return false;
    }

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'HEAD',
        mode: 'cors'
    })
        .then(function () {
            // 'Update menu choice' form
            let html = '<form id="update-menu-choice-form" method="post" ' +
                       `onsubmit="update_menu_choice(event, '${table}', `
                       + `'${menu_choice_id}');">`;

            html += '<table class="table">';

            html += '<tr>';
            html += '<td><h4>Update ' + label + '</h4></td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td>'
                    + living_library_config
                      .get_form_symbol_explanation_text()
                    + '</td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td>'
                    + '<label for="updated_menu_choice_input_box" '
                    + 'class="form-label-text">'
                    + 'Change &ldquo;'
                    + '<span class="menu-choice-term"></span>'
                    + '&rdquo; to:'
                    + '</label>'
                    + '<input type="text" id="updated_menu_choice_input_box" '
                    + 'class="input_form-default" name="updated_menu_choice"/>'
                    + '</td>';
            html += '</tr>';

            html += '</tr>';
            html += '<td>'
                    + '<button type="submit" class="btn btn-light btn-bold">'
                    + 'Update'
                    + '</button>'
                    + '<div id="update-menu-choice-form-confirmation">'
                    + '</div>'
                    + '</td>';
            html += '</tr>';

            html += '</table>';
            html += '</form>';

            // 'Delete menu choice' form
            html += '<form id="delete-menu-choice-form" method="post" ' +
                    `onsubmit="delete_menu_choice(event, '${table}', ` +
                    `'${menu_choice_id}', '${table_link_text}');">`;

            html += '<table class="table">';

            html += '<tr>';
            html += '<td><h4>Delete ' + label + '</h4></td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td>'
                    + '<button type="submit" class="btn btn-light btn-bold">'
                    + 'Delete &ldquo;'
                    + '<span class="menu-choice-term"></span>'
                    + '&rdquo;'
                    + '</button>'
                    + '<div id="delete-menu-choice-form-confirmation">'
                    + '</div>'
                    + '</td>';
            html += '</tr>';

            html += '</table>';
            html += '</form>';

            let form_content_element = document.querySelector('#form-content');

            if (form_content_element) {
                form_content_element.innerHTML = html;
            }

            living_library_helper.update_required_fields_in_form(
                living_library_config.get_update_menu_choice_form_info()
            );

            // Populate menu choice term
            fetch(living_library_api_url + '&tbl=' + table + '&is_active=true' +
                  '&id=' + menu_choice_id)
                .then(function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem fetching '
                                      + table + ' with id = ' + menu_choice_id
                                      + '. Status Code: ' + response.status);

                        living_library_helper
                        .insert_error_message('Error: No ' + label.toLowerCase()
                                              + ' record found.', true);

                        return false;
                    }

                    response.json().then(function(data) {
                        let span_elements =
                            document.getElementsByClassName('menu-choice-term');

                        if (data.length === 0) {
                            console.error('Error: No ' + label.toLowerCase() +
                                          's found.');
                        } else if (data.length === 1) {
                            for (let element of span_elements) {
                                element.innerHTML = data[0].term;
                            }
                        } else {
                            console.error('Error: Fetch response for ' + label +
                                          ' with id = ' + menu_choice_id +
                                          ' is of length ' + data.length);
                        }
                    });
                })
                .catch(function(error) {
                    console.error('ERROR: [edit_menu_choice] Unable to fetch ' +
                                  table + ' with id = ' + menu_choice_id +
                                  ': ' + error);
                });
        })
        .catch(function (error) {
            console.error('ERROR: HEAD request failed: ' + error);
            living_library_helper
            .insert_error_message('Error loading page', true);
        });

    viewUtils.setUserLabel();
};
