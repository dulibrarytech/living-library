/*
 * Donor Application
 *
 * Living Library Functions involving POST, PUT, and DELETE requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */
const API_KEY = '5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

const save_donation = function (event) {
    console.log("Inside save_donation function");

    const DONOR_FIELDS = ['donor_title', 'donor_first_name',
                          'donor_last_name', 'donor_address',
                          'donor_city', 'donor_state', 'donor_zip',
                          'donor_amount_of_donation',
                          'donor_date_of_donation', 'donor_notes',
                          'donor_subject_areas'];

    const NOTIFY_FIELDS = ['notify_title', 'notify_first_name',
                           'notify_last_name', 'notify_address',
                           'notify_city', 'notify_state', 'notify_zip',
                           'notify_relation_to_donor'];

    const RECIPIENT_FIELDS = ['recipient_title', 'recipient_first_name',
                              'recipient_last_name', 'recipient_donation_type'];

    /* Stop the form from submitting the default way
     * - commenting this out allows the error to display if a required form
     *   field is blank, but the form still gets submitted (and a new
     *   record is still created in the DB) because this function is called
     *   whenever the 'Send to Queue' button is clicked
     */
    event.preventDefault();

    let form_data = document.getElementById('donor-input-form').elements;

    let donor_data_as_JSON = form_to_JSON(DONOR_FIELDS, form_data);
    if (typeof donor_data_as_JSON.donor_subject_areas === 'undefined') {
        donor_data_as_JSON.donor_subject_areas = [];
    }
    console.log("donor_data_as_JSON = " + JSON.stringify(donor_data_as_JSON));

    let notify_data_as_JSON = [],
        notify_persons_data = document.getElementsByClassName('notify_person_1'),
        i = 1;
    while(notify_persons_data.length !== 0) {
        if (containsNonEmptyElementValue(notify_persons_data)) {
            notify_data_as_JSON.push(form_to_JSON(NOTIFY_FIELDS, notify_persons_data));
        }
        notify_persons_data = document.getElementsByClassName('notify_person_'
                                                              + (++i));
    }
    console.log("notify_data_as_JSON = " + JSON.stringify(notify_data_as_JSON));

    let recipient_data_as_JSON = form_to_JSON(RECIPIENT_FIELDS, form_data);
    console.log("recipient_data_as_JSON = "
                + JSON.stringify(recipient_data_as_JSON));

    let donation_data = new URLSearchParams();
    donation_data.append('donor', JSON.stringify(donor_data_as_JSON));
    donation_data.append('who_to_notify', JSON.stringify(notify_data_as_JSON));
    donation_data.append('recipient', JSON.stringify(recipient_data_as_JSON));

    const url = 'http://localhost:8000/api/v1/living-library/donations?api_key='
                + API_KEY;

    console.log("url = " + url);

    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: donation_data
    });
};

/**
 * Determines whether the given HTMLCollection contains any non-empty element
 * values.
 * @param  {HTMLCollection}   form_elements    the elements to be checked
 * @return {Boolean}                           true if exists >= 1 non-empty
 *                                             element
 */
const containsNonEmptyElementValue = function (form_elements) {
    for (element of form_elements) {
        if (element.value.trim().length > 0) {
            return true;
        }
    }
    return false;
};

const save_book_plate = function (event) {
    console.log("Inside save_book_plate function");

    const BOOK_PLATE_FORM_FIELDS = ["book_author_name", "book_title",
                                    "book_bibliographic_number",
                                    "book_call_number"];

    /* Stop the form from submitting the default way
     * - commenting this out allows the error to display if a required form
     *   field is blank, but the form still gets submitted (and a new
     *   record is still created in the DB) because this function is called
     *   whenever the 'Save Book Plate' button is clicked
     */
    event.preventDefault();

    let form_data = document.getElementById('donor-input-form').elements;

    let form_as_JSON = form_to_JSON(BOOK_PLATE_FORM_FIELDS, form_data);
    console.log("form_as_JSON = " + JSON.stringify(form_as_JSON));

    /* TO-DO: Add the book_timestamp key-value pair with the current time.
     * (The book fields publisher and date_published are not needed.)
     */

    let book_field = new URLSearchParams();
    book_field.append('book', JSON.stringify(form_as_JSON));

    const url = 'http://localhost:8000/api/v1/living-library/donations?id='
                + form_data.donation_id.value
                + '&api_key=' + API_KEY;

    console.log("url = " + url);

    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: book_field
    });
};

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {Array}            expected_form_fields  the form fields that will be
 *                                                  matched
 * @param  {HTMLCollection}   form_elements         the form elements (i.e the
 *                                                  data input by the user); can
 *                                                  also be an
 *                                                  HTMLFormControlsCollection
 * @return {Object}                                 form data as an object literal
 *
 * Adapted from: https://www.learnwithjason.dev/blog/get-form-values-as-json/
 */
const form_to_JSON = function (expected_form_fields, form_elements) {
    return [].reduce.call(form_elements, (data, element) => {
        if (is_valid_element(element.name, expected_form_fields) &&
            is_valid_value(element)) {
            if (element.type === 'checkbox') {
                data[element.name] = (data[element.name] || [])
                                     .concat(element.value.trim());
            } else {
                data[element.name] = element.value.trim();
            }
        }
        return data;
    }, {});
};

const is_valid_element = function (element_name, valid_form_fields) {
    return valid_form_fields.includes(element_name);
};

const is_valid_value = function (element) {
    return (!['checkbox', 'radio'].includes(element.type) || element.checked);
};