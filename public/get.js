/*
 * Donor Application
 *
 * Living Library Functions involving GET requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */

/* The number of "person to be notified of donation" form field groups that
 * are present on the donation form (the user can add more as needed)
 */
let add_person_to_notify_counter = 1;

function create_donation() {

    // How many columns to use when displaying subject area checkboxes
    const SUBJECT_AREA_COLS = 3;

    hide_table_header_and_content();

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
                 + '<input type="number" id="donor_amount_of_donation_input_box" '
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
                 + '<td class="span1">'
                 + '<button type="submit" '
                 + 'class="btn-grey" id="save_donation_button">'
                 + 'Send to Queue'
                 + '</button>'
                 + '<div id="donation-form-confirmation">'
                 + '</div>'
                 + '</td>'
                 + '</tr>'
                 + '</table>';

    form_html += '</form>';

    let form_content_element = document.querySelector('#form-content');

    if (form_content_element) {
        form_content_element.innerHTML = form_html;
    }

    // Set required fields
    update_required_fields_in_form(living_library_config
                                   .get_donation_form_info());

    // Populate Title dropdown menus
    let titles_url = living_library_config.get_api() +
                     '?tbl=' + living_library_config.get_titles_table() +
                     '&is_active=true' +
                     '&api_key=' + living_library_config.get_api_key();
    populate_dropdown_menu(living_library_config.get_titles_table(), titles_url,
                           document.getElementsByClassName('title_dropdown'),
                           '--Select a title--');

    // Populate State dropdown menus
    let states_url = living_library_config.get_api() +
                     '?tbl=' + living_library_config.get_states_table() +
                     '&is_active=true' +
                     '&api_key=' + living_library_config.get_api_key();
    populate_dropdown_menu(living_library_config.get_states_table(), states_url,
                           document.getElementsByClassName('state_dropdown'),
                           '--Select a state--');

    // Populate Relation to Donor dropdown menu
    let relationships_url = living_library_config.get_api() + '?tbl=' +
                            living_library_config.get_relationships_table() +
                            '&is_active=true' +
                            '&api_key=' + living_library_config.get_api_key();
    populate_dropdown_menu(living_library_config.get_relationships_table(),
                           relationships_url,
                           document.getElementsByClassName('relationship_dropdown'),
                           '--Select a relation to donor--');

    // Add Subject Area checkboxes
    fetch(living_library_config.get_api() +
          '?tbl=' + living_library_config.get_subject_areas_table() +
          '&is_active=true' +
          '&api_key=' + living_library_config.get_api_key())
        .then(function(response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem fetching the '
                             + 'subject areas. Status Code: '
                             + response.status);
                return false;
            }

            response.json().then(function(data) {
                console.log("Inside subject areas fetch");

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
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(checkbox.value));

                    // decide where to insert cell
                    let row = i % SUBJECT_AREA_COLS == 0
                              ? table.insertRow()
                              : table.rows[table.rows.length - 1];
                    row.insertCell().appendChild(label);
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
 * Adds additional form fields to donation form (so that user can add another
 * person to be notified of donation)
 * @param event   the event triggered by clicking the "Add person to be
 *                nofified" button
 */
function add_person_to_notify(event) {
    console.log("Inside add_person_to_notify function");
    console.log("add_person_to_notify_counter = " + add_person_to_notify_counter);

    // Stop the form from submitting the default way
    event.preventDefault();

    // Increment counter since we're adding a person
    add_person_to_notify_counter++;

    if (add_person_to_notify_counter == 2) {
        let notify_person_1_element = document
                                      .getElementById("notify_person_heading_num_1");
        if (notify_person_1_element.innerHTML == '') {
            notify_person_1_element.innerHTML = '1 ';
        }
    }

    let new_div_element = document.querySelector("#notify_section_1")
                                  .cloneNode(true);
    console.log("new_div_element = ");
    console.log(new_div_element);
    console.log("Before updating div id: new_div_element.id = " + new_div_element.id);
    new_div_element.id = 'notify_section_' + add_person_to_notify_counter;
    console.log("After updating div id: new_div_element.id = " + new_div_element.id);

    let notify_heading_span_element = new_div_element
                                      .querySelector("#notify_person_heading_num_1");
    console.log("Before updating span id: span.id = " + notify_heading_span_element.id);
    notify_heading_span_element.id = 'notify_person_heading_num_'
                                     + add_person_to_notify_counter;
    console.log("After updating span id: span.id = " + notify_heading_span_element.id);
    notify_heading_span_element.innerHTML = add_person_to_notify_counter + ' ';

    // Update labels (i.e. the 'for' attributes)
    let label_elements = new_div_element.querySelectorAll('label[for$="_1"]');
    console.log("label_elements = " + label_elements);
    console.log("label_elements.length = " + label_elements.length);
    for (let label_element of label_elements) {
        console.log("Before updating label, for = "
                    + label_element.htmlFor);
        label_element.htmlFor = label_element.htmlFor
                                .substring(0,
                                           label_element.htmlFor
                                           .lastIndexOf('_1'))
                                + '_' + add_person_to_notify_counter;
        console.log("After updating label, for = "
                    + label_element.htmlFor);
    }

    // Update class attributes
    let elements_with_numbered_class = new_div_element.querySelectorAll('[class$="_1"]');
    console.log("elements_with_numbered_class = " + elements_with_numbered_class);
    console.log("elements_with_numbered_class.length = " + elements_with_numbered_class.length);
    for (let element_with_numbered_class of elements_with_numbered_class) {
        console.log("Before updating element, "
                    + element_with_numbered_class.tagName + "'s class = "
                    + element_with_numbered_class.className);
        element_with_numbered_class.className =
            element_with_numbered_class.className
                                       .substring(0,
                                                  element_with_numbered_class
                                                  .className.lastIndexOf('_1'))
            + '_' + add_person_to_notify_counter;
        console.log("After updating element, "
                    + element_with_numbered_class.tagName + "'s class = "
                    + element_with_numbered_class.className);
    }

    // Update id attributes
    let elements_with_numbered_id = new_div_element.querySelectorAll('[id$="_1"]');
    console.log("elements_with_numbered_id = " + elements_with_numbered_id);
    console.log("elements_with_numbered_id.length = " + elements_with_numbered_id.length);
    for (let element_with_numbered_id of elements_with_numbered_id) {
        console.log("Before updating element, "
                    + element_with_numbered_id.tagName + "'s id = "
                    + element_with_numbered_id.id);

        // Remove cloned values from input tags
        if (element_with_numbered_id.tagName == 'INPUT') {
            element_with_numbered_id.value = '';
        }

        // Update ids
        element_with_numbered_id.id =
            element_with_numbered_id.id
                                    .substring(0,
                                               element_with_numbered_id
                                               .id.lastIndexOf('_1'))
            + '_' + add_person_to_notify_counter;
        console.log("After updating element, "
                    + element_with_numbered_id.tagName + "'s id = "
                    + element_with_numbered_id.id);
    }

    console.log(new_div_element);

    let last_row_element = document.querySelector('#add_person_to_notify_row');

    // Insert new_div_element before last_row_element
    last_row_element.parentNode.insertBefore(new_div_element, last_row_element);

    console.log("End of func: add_person_to_notify_counter = "
                + add_person_to_notify_counter);
}

/**
 * Updates HTML for all required form fields
 * @param {Object} required_fields   an object containing the following
 *                                   properties:
 *                                   - required_label_for_attributes =
 *                                     the 'for' attributes of the label tags
 *                                     that need to be updated
 *                                   - required_ids =
 *                                     the id attributes of the input tags that
 *                                     need to be updated
 */
function update_required_fields_in_form(required_fields) {
    console.log("Inside update_required_fields_in_form");

    for (let element of required_fields.required_label_for_attributes) {
        let label_element = document.querySelector(`label[for="${element}"]`);

        label_element.innerHTML = '<abbr class="required" title="required">* '
                                   + '</abbr>' + label_element.innerHTML;
    }

    for (let element of required_fields.required_ids) {
        let form_element = document.querySelector(`#${element}`);

        /**
         * Add general validation rule to element (if there is no existing
         * validation)
         */
        if (form_element.tagName === 'INPUT' && !form_element.pattern &&
            !form_element.min) {
            form_element.title = 'Enter at least one character (e.g. a letter or number)';

            form_element.pattern = living_library_config
                                   .get_form_validation_rules()
                                   .general_validation;
        }

        // Add 'required' attribute
        form_element.required = true;

        // Create <span> for inline validation and insert after form_element
        if (form_element.type != 'radio') {
            let span = document.createElement('span');
            span.className = 'validity';
            form_element.parentNode.insertBefore(span, form_element.nextSibling);
        }
    }
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

    default_option.value = '';
    default_option.setAttribute('selected', '');
    default_option.text = text_for_default_option;

    select.add(default_option);
    select.selectedIndex = 0;

    let label_name; // name of the values being fetched

    switch(table_name) {
        case living_library_config.get_titles_table():
            label_name = 'titles';
            break;
        case living_library_config.get_states_table():
            label_name = 'states';
            break;
        case living_library_config.get_relationships_table():
            label_name = 'relationships';
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
                    option = document.createElement('option');
                    option.text = data[i].term;
                    option.value = data[i].term;
                    select.add(option);
                }

                /* Replace all relevant dropdown menus with the newly-populated
                 * <select> element
                 */
                for (let node of html_elements) {
                    /* Can only use a given <select> element once in the DOM.
                     * So we clone it. The parameter 'true' clones the subtree
                     * as well.
                     */
                    let select_copy = select.cloneNode(true);

                    select_copy.setAttribute('class', node.getAttribute('class'));
                    select_copy.setAttribute('id', node.getAttribute('id'));
                    select_copy.setAttribute('name', node.getAttribute('name'));

                    if (node.hasAttribute('required')) {
                        select_copy.required = node.required;
                    }

                    node.parentNode.replaceChild(select_copy, node);
                    console.log("Just replaced dropdown menu:");
                    console.log(select_copy);
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

    fetch(living_library_config.get_api() + '?is_completed=' + is_completed +
          '&api_key=' + living_library_config.get_api_key())
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            // console.log(data);

            $(".content-window").css("height", "770px");
            $(".pre-scrollable").css("max-height", "485px");

            $("#page-label").text(is_completed
                                  ? "Living Library: Completed Donations"
                                  : "Living Library: Donation Queue");

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
                html += '<table class="table table-bordered table-striped">'
                        + '<tr>'
                        + '<td>No donation records found.</td>'
                        + '</tr>'
                        + '</table>';
            } else {
                console.log("Found " + data.length + " record(s).");

                html += '<table class="table table-bordered table-striped">';
                for (let i = 0; i < data.length; i++) {
                    const donor = living_library_helper
                                  .get_valid_json(data[i], 'donor'),
                          recipient = living_library_helper
                                      .get_valid_json(data[i], 'recipient');

                    console.log('After parsing JSON, donor = ');
                    console.log(donor);
                    console.log('typeof donor = ' + typeof donor);

                    console.log('After parsing JSON, recipient = ');
                    console.log(recipient);
                    console.log('typeof recipient = ' + typeof recipient);

                    let donation_id = living_library_helper
                                      .get_field_value(data[i], 'id');

                    console.log('donation_id = ' + donation_id);

                    let donation_status = data[i].is_completed
                                          ? 'completed'
                                          : 'queued';

                    html += '<tr>';

                    html += '<td class="span1_wider" '
                            + 'style="text-align: center">';
                    if (typeof donation_id === 'number') {
                        html += '<a href="' + baseUrl + _getDonationUrl
                                + donation_status + '/' + donation_id + '">'
                                + '<img src="' + baseUrl
                                + (data[i].is_completed
                                   ? 'img/living_library_application_view_list.png" />'
                                   : 'img/living_library_application_form.png" />')
                                + '</a>';
                    }
                    html += '</td>';

                    html += '<td class="span1" style="text-align: center">'
                            + donation_id + '</td>';

                    html += '<td class="span4 name-cell4">';
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
                    html += '</td>';

                    html += '<td class="span4 name-cell4">';
                    if (living_library_helper.is_non_null_object(recipient)) {
                        html += living_library_helper
                                .get_field_value(recipient, 'recipient_title')
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

                    html += '<td style="text-align: center">';
                    if (living_library_helper.is_non_null_object(donor)) {
                        html += living_library_helper
                                .get_field_value(donor,
                                                 'donor_date_of_donation');
                    } else {
                        html += living_library_config
                                .get_error_text_for_invalid_json();
                    }
                    html += '</td>';

                    html += '</tr>';
                }
                html += '</table>';
            }
            // console.log(html);

            let table_content_element = document
                                        .querySelector('#table-content');

            if (table_content_element) {
                table_content_element.innerHTML = html;
            }

        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        });
}

function get_donation(is_completed, id) {
    is_completed = validate_is_completed_parameter(is_completed);
    const url = living_library_config.get_api() +
                '?is_completed='+ is_completed +
                '&id=' + id +
                '&api_key=' + living_library_config.get_api_key();

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

            const donor = living_library_helper
                          .get_valid_json(data[0], 'donor'),
                  who_to_notify = living_library_helper
                                  .get_valid_json(data[0], 'who_to_notify'),
                  recipient = living_library_helper
                              .get_valid_json(data[0], 'recipient'),
                  book = living_library_helper
                         .get_valid_json(data[0], 'book');

            console.log('After parsing JSON, donor = ');
            console.log(donor);
            console.log('typeof donor = ' + typeof donor);

            console.log('After parsing JSON, who_to_notify = ');
            console.log(who_to_notify);
            console.log('typeof who_to_notify = ' + typeof who_to_notify);

            console.log('After parsing JSON, recipient = ');
            console.log(recipient);
            console.log('typeof recipient = ' + typeof recipient);

            console.log('After parsing JSON, book = ');
            console.log(book);
            console.log('typeof book = ' + typeof book);

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
            if (!Array.isArray(who_to_notify) || who_to_notify.length === 0) {
                html += '<p>None</p>';
            } else {
                for (let i = 0; i < who_to_notify.length; i++) {
                    html += '<dl class="name_address_block">';
                    html += '<dt>Title: </dt>'
                            + '<dd>' +
                            living_library_helper
                            .get_field_value(who_to_notify[i], 'notify_title')
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
                            .get_field_value(who_to_notify[i], 'notify_address')
                            + '</dd>';
                    html += '<dt>City: </dt>'
                            + '<dd>' +
                            living_library_helper
                            .get_field_value(who_to_notify[i], 'notify_city')
                            + '</dd>';
                    html += '<dt>State: </dt>'
                            + '<dd>' +
                            living_library_helper
                            .get_field_value(who_to_notify[i], 'notify_state')
                            + '</dd>';
                    html += '<dt>Zip: </dt>'
                            + '<dd>' +
                            living_library_helper
                            .get_field_value(who_to_notify[i], 'notify_zip')
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
                    .get_field_value(recipient, 'recipient_first_name')
                    + '</dd>';
            html += '<dt>Last Name: </dt>'
                    + '<dd>' +
                    living_library_helper
                    .get_field_value(recipient, 'recipient_last_name')
                    + '</dd>';
            html += '<dt>Donation Type: </dt>'
                    + '<dd>' +
                    living_library_helper
                    .get_field_value(recipient, 'recipient_donation_type')
                    + '</dd>';
            html += '</dl>';

            let donation_amount = living_library_helper
                                  .get_field_value(donor,
                                                   'donor_amount_of_donation');
            if (typeof donation_amount === 'number') {
                donation_amount = Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                      minimumFractionDigits: 2
                                  }).format(donation_amount);
            } else {
                console.log('Error in donation record field: ' +
                            'donor_amount_of_donation is not a number.');
            }
            html += '<h4>Donation Information</h4>';
            html += '<dl>';
            html += '<dt>Amount of Donation: </dt>'
                    + '<dd>' + donation_amount + '</dd>';
            html += '<dt>Date of Donation: </dt>'
                    + '<dd>' +
                    living_library_helper
                    .get_field_value(donor, 'donor_date_of_donation')
                    + '</dd>';
            html += '</dl>';

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
                    .get_field_value(book, 'book_bibliographic_number')
                    + '</dd>';
            html += '<dt>Call Number: </dt>'
                    + '<dd>' +
                    living_library_helper
                    .get_field_value(book, 'book_call_number')
                    + '</dd>';
            html += '</dl>';

            console.log(html);
            let record_content_element = document
                                         .querySelector('#record-content');

            if (record_content_element) {
                record_content_element.innerHTML = html;
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

            const donor = living_library_helper
                          .get_valid_json(data[0], 'donor'),
                  who_to_notify = living_library_helper
                                  .get_valid_json(data[0], 'who_to_notify'),
                  recipient = living_library_helper
                              .get_valid_json(data[0], 'recipient');

            /* Add information from the donation record */
            let html = '<dl>';

            html += '<dt>Person making donation: </dt>'
                    + '<dd>';
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
            html += '</dd>';

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

            html += '<dt>Person(s) to be notified of donation: </dt>'
                    + '<dd>';
            if (Array.isArray(who_to_notify) && who_to_notify.length > 0) {
                let persons_to_be_notified = [];
                for (let i = 0; i < who_to_notify.length; i++) {
                    if (living_library_helper
                        .is_non_null_object(who_to_notify[i])) {
                        let person = [];

                        let notify_title = living_library_helper
                                           .get_field_value(who_to_notify[i],
                                                            'notify_title');
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
                            persons_to_be_notified.push(person.join(' '));
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
                    + '<dd>';
            if (living_library_helper.is_non_null_object(recipient)) {
                html += living_library_helper
                        .get_field_value(recipient, 'recipient_title')
                        + ' ' +
                        living_library_helper
                        .get_field_value(recipient, 'recipient_first_name')
                        + ' ' +
                        living_library_helper
                        .get_field_value(recipient, 'recipient_last_name')
                        + ' (' +
                        living_library_helper
                        .get_field_value(recipient, 'recipient_donation_type')
                        + ')';
            } else {
                html += living_library_config
                        .get_error_text_for_invalid_json();
            }
            html += '</dd>';

            html += '<dt>Date of donation: </dt>'
                    + '<dd>';
            if (living_library_helper.is_non_null_object(donor)) {
                html += living_library_helper
                        .get_field_value(donor, 'donor_date_of_donation');
            } else {
                html += living_library_config
                        .get_error_text_for_invalid_json();
            }
            html += '</dd>';

            html += '<dt>Selected subject areas: </dt>'
                    + '<dd>';
            if (living_library_helper.is_non_null_object(donor) &&
                Array.isArray(donor.donor_subject_areas) &&
                donor.donor_subject_areas.length > 0) {
                console.log('donor.donor_subject_areas is a non-empty array');

                let subject_areas = [];
                for (let i = 0; i < donor.donor_subject_areas.length; i++) {
                    let subject =
                        living_library_helper
                        .get_field_value(donor.donor_subject_areas, i);
                    if (subject !== '') {
                        subject_areas.push(subject);
                    }
                }

                html += subject_areas.join('; ');
            } else {
                console.log('donor.donor_subject_areas is empty or not valid');
                html += living_library_config
                        .get_error_text_for_invalid_json();
            }
            html += '</dd>';

            html += '</dl>';

            console.log(html);
            let record_content_element = document.querySelector('#record-content');

            if (record_content_element) {
                record_content_element.innerHTML = html;
            }

            /* Add book plate form */
            let form_html = '<form id="book-plate-form" method="post" '
                            + 'onsubmit="save_book_plate(event);">';

            form_html += '<table class="table">';

            form_html += '<tr>';
            form_html += '<td colspan="2"><h4>Book Plate Information</h4></td>';
            form_html += '</tr>';

            form_html += '<tr>';
            form_html += '<td colspan="2">'
                         + living_library_config
                           .get_form_symbol_explanation_text()
                         + '</td>';
            form_html += '</tr>';

            form_html += '<tr>';
            form_html += '<td>'
                         + '<label for="book_author_name_input_box" '
                         + 'class="form-label-text">Author Name:'
                         + '</label>'
                         + '<input type="text" id="book_author_name_input_box" '
                         + 'class="input_form-default" name="book_author_name"/>'
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
                         + '<label for="book_bibliographic_number_input_box" '
                         + 'class="form-label-text">Bibliographic Number:'
                         + '</label>'
                         + '<input type="text" '
                         + 'id="book_bibliographic_number_input_box" '
                         + 'class="input_form-default" '
                         + 'name="book_bibliographic_number"/>'
                         + '</td>';

            form_html += '<td>'
                         + '<label for="book_call_number_input_box" '
                         + 'class="form-label-text">Call Number:'
                         + '</label>'
                         + '<input type="text" id="book_call_number_input_box" '
                         + 'class="input_form-default" name="book_call_number"/>'
                         + '</td>';
            form_html += '</tr>';

            form_html += '</table>'; // close table with text input boxes

            form_html += '<input type="hidden" id="donation_id_hidden_box" '
                         + 'name="donation_id" value=""/>';

            form_html += '<table class="table lower_controls">'
                         + '<tr>'
                         + '<td class="span1">'
                         + '<button type="submit" '
                         + 'class="btn-grey" id="save_book_plate_button">'
                         + 'Save Book Plate'
                         + '</button>'
                         + '<div id="book-plate-form-confirmation">'
                         + '</div>'
                         + '</td>'
                         + '</tr>'
                         + '</table>';

            form_html += '</form>';

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
        .then(() => {
            update_required_fields_in_form(living_library_config
                                           .get_book_plate_form_info());
        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        });

    //
}

/**
 * Loads the specified lookup table's records, i.e. subject areas, titles, and
 * relationships. This includes (1) a form to add a new record to the lookup
 * table and (2) a list of all active records, each with a hyperlink allowing
 * the user to update or delete the given record.
 * @param   table     the lookup table to display
 */
function get_menu_choices(table) {
    // How many columns to use when displaying records
    const MENU_CHOICE_COLS = 2;

    console.log('table = ' + table);

    hide_table_header_and_content();

    let label, link_text;

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
            console.log('Invalid parameter value for table: ' + table);
            label = '';
    }

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = 'Living Library: ' + label + 's';
    }

    // Add menu choice form
    let html = '<form id="add-menu-choice-form" method="post" ' +
               `onsubmit="add_menu_choice(event, '${table}');">`;
    console.log("form tag = " + html);
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

    update_required_fields_in_form(living_library_config
                                   .get_add_menu_choice_form_info());

    // Populate menu choices
    fetch(living_library_config.get_api() +
          '?tbl=' + table +
          '&is_active=true' +
          '&api_key=' + living_library_config.get_api_key())
        .then(function(response) {
            console.log(response);

            if (response.status !== 200) {
                console.warn('Looks like there was a problem fetching '
                             + table + '. Status Code: ' + response.status);
                return false;
            }

            response.json().then(function(data) {
                console.log('Inside ' + label + 's fetch');

                let table_element = document.querySelector('#menu_choices');
                console.log('Menu choices table = ');
                console.log(table_element);

                if (data.length === 0) {
                    let row = table_element.insertRow();
                    let cell = row.insertCell();
                    cell.colSpan = MENU_CHOICE_COLS;
                    cell.innerHTML = 'No ' + label.toLowerCase() + 's found.';
                    return;
                }

                for (let i = 0; i < data.length; i++) {
                    let anchor_element = document.createElement('a');
                    anchor_element.href = baseUrl + _editMenuChoiceUrl +
                                          link_text + '/' + data[i].id;
                    anchor_element.appendChild(document
                                               .createTextNode(data[i].term));

                    // decide where to insert cell
                    let row = i % MENU_CHOICE_COLS == 0
                              ? table_element.insertRow()
                              : table_element.rows[table_element.rows.length - 1];
                    row.insertCell().appendChild(anchor_element);
                }
            });
        })
        .catch(function(error) {
            console.log('FATAL: [get_menu_choices] Unable to fetch ' + table +
                        ': ' + error);
        });
}

/**
 * Loads a form for the specified lookup table record. The form allows the user
 * to (1) update the text of the menu choice and (2) remove the menu choice from
 * the lookup table (to 'delete' the menu choice, we set is_active = false).
 * @param   table              the lookup table containing the menu choice
 * @param   menu_choice_id     the id of the menu choice
 * @param   table_link_text    the text to be used in hyperlinks to identify
 *                             the lookup table
 */
function edit_menu_choice(table, menu_choice_id, table_link_text) {
    console.log('table = ' + table);
    console.log('menu choice id = ' + menu_choice_id);
    console.log('table link text = ' + table_link_text);

    hide_table_header_and_content();

    let label;

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
            console.log('Invalid parameter value for table: ' + table);
            label = '';
    }

    let page_label_element = document.querySelector('#page-label');

    if (page_label_element) {
        page_label_element.innerHTML = 'Living Library: ' + label + 's';
    }

    // 'Update menu choice' form
    let html = '<form id="update-menu-choice-form" method="post" ' +
               `onsubmit="update_menu_choice(event, '${table}', `
               + `${menu_choice_id});">`;
    console.log("update menu choice form tag = " + html);
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
            `onsubmit="delete_menu_choice(event, '${table}', ${menu_choice_id},`
            + ` '${table_link_text}');">`;

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

    update_required_fields_in_form(living_library_config
                                   .get_update_menu_choice_form_info());

    // Populate menu choice term
    fetch(living_library_config.get_api() +
          '?tbl=' + table +
          '&is_active=true' +
          '&id=' + menu_choice_id +
          '&api_key=' + living_library_config.get_api_key())
        .then(function(response) {
            console.log(response);

            if (response.status !== 200) {
                console.warn('Looks like there was a problem fetching ' + table
                             + ' with id = ' + menu_choice_id
                             + '. Status Code: ' + response.status);
                return false;
            }

            response.json().then(function(data) {
                console.log('Inside ' + label + 's fetch');

                let span_elements = document
                                    .getElementsByClassName('menu-choice-term');
                console.log('Menu choice term elements = ');
                console.log(span_elements);

                if (data.length === 0) {
                    console.warn('No ' + label.toLowerCase() + 's found.');
                } else if (data.length === 1) {
                    for (let element of span_elements) {
                        element.innerHTML = data[0].term;
                    }
                } else {
                    console.warn('Error: Fetch response for ' + label +
                                 ' with id = ' + menu_choice_id +
                                 ' is of length ' + data.length);
                }
            });
        })
        .catch(function(error) {
            console.log('FATAL: [edit_menu_choice] Unable to fetch ' + table
                        + ' with id = ' + menu_choice_id + ': ' + error);
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
