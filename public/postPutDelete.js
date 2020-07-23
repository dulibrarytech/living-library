/*
 * Donor Application
 *
 * Living Library Functions involving POST, PUT, and DELETE requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */
const save_donation = function (event) {
    event.preventDefault();

    console.log("Inside save_donation function");

    let form_data = document.getElementById('donor-input-form').elements;

    let donor_data_as_JSON = form_to_JSON(living_library_config
                                          .get_donation_form_info().donor_fields,
                                          form_data);
    if (typeof donor_data_as_JSON.donor_subject_areas === 'undefined') {
        donor_data_as_JSON.donor_subject_areas = [];
    }
    console.log("donor_data_as_JSON = " + JSON.stringify(donor_data_as_JSON));

    let notify_data_as_JSON = [],
        notify_persons_data = document.getElementsByClassName('notify_person_1'),
        i = 1;
    while(notify_persons_data.length !== 0) {
        if (containsNonEmptyElementValue(notify_persons_data)) {
            notify_data_as_JSON.push(form_to_JSON(living_library_config
                                                  .get_donation_form_info()
                                                  .notify_fields,
                                                  notify_persons_data));
        }
        notify_persons_data = document.getElementsByClassName('notify_person_'
                                                              + (++i));
    }
    console.log("notify_data_as_JSON = " + JSON.stringify(notify_data_as_JSON));

    let recipient_data_as_JSON = form_to_JSON(living_library_config
                                              .get_donation_form_info()
                                              .recipient_fields,
                                              form_data);
    console.log("recipient_data_as_JSON = "
                + JSON.stringify(recipient_data_as_JSON));

    /* Use this code if sending Fetch request with
     * Content-Type = application/x-www-form-urlencoded:

    let donation_data = new URLSearchParams();
    donation_data.append('donor', JSON.stringify(donor_data_as_JSON));
    donation_data.append('who_to_notify', JSON.stringify(notify_data_as_JSON));
    donation_data.append('recipient', JSON.stringify(recipient_data_as_JSON));

     *
     */

    /* Use this code if sending Fetch request with
     * Content-Type = application/json
     */
    let donation_data = {
        donor: JSON.stringify(donor_data_as_JSON),
        who_to_notify: JSON.stringify(notify_data_as_JSON),
        recipient: JSON.stringify(recipient_data_as_JSON)
    }


    console.log("donation_data = ");
    console.log(donation_data);

    console.log("fetch url = " + living_library_config.get_api() +
          '?api_key=' + living_library_config.get_api_key());

    /* Use this code if sending Fetch request with
     * Content-Type = application/x-www-form-urlencoded:

    fetch(living_library_config.get_api() +
          '?api_key=' + living_library_config.get_api_key(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: donation_data
    }).then(response => console.log(response));

     *
     */

    fetch(living_library_config.get_api() +
          '?api_key=' + living_library_config.get_api_key(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donation_data),
        mode: 'cors'
    })
        .then(function (response) {
            console.log('Inside save_donation fetch: first "then" function');
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log('Inside second "then" function');
            if (data.length > 0) {
                console.log(data[0]);

                alert('Donation ID ' + data[0].id +
                      ' added to Donation Queue.');

                window.location.href = baseUrl + 'index.php/livinglibrary/' +
                                       'getDonations/queued';
            } else {
                alert('An error occurred when submitting the donation form.');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [save_donation] An error occurred during or '
                        + 'after POST request: ' + error);
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
    event.preventDefault();

    console.log("Inside save_book_plate function");

    let form_data = document.getElementById('donor-input-form').elements;

    let form_as_JSON = form_to_JSON(living_library_config
                                    .get_book_plate_form_info().book_fields,
                                    form_data);
    console.log("form_as_JSON = " + JSON.stringify(form_as_JSON));

    let book_plate_data = { book: JSON.stringify(form_as_JSON) };
    console.log("book_plate_data = ");
    console.log(book_plate_data);
    console.log("book_plate_data.book = " + book_plate_data.book);
    console.log("typeof book_plate_data.book = " + typeof book_plate_data.book);

    fetch(living_library_config.get_api() +
          '?id=' + form_data.donation_id.value +
          '&api_key=' + living_library_config.get_api_key(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book_plate_data),
        mode: 'cors'
    })
        .then(function (response) {
            console.log('Inside save_book_plate fetch: "then" function');
            console.log(response);
            if (response.ok) {
                alert('Book plate saved for Donation ID ' +
                      form_data.donation_id.value + '.');

                window.location.href = baseUrl + 'index.php/livinglibrary/' +
                                       'getDonation/completed/' +
                                       form_data.donation_id.value;
            } else {
                alert('An error occurred when saving the book plate. Could not '
                      + 'find Donation ID ' + form_data.donation_id.value
                      + '.');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [save_book_plate] An error occurred during or '
                        + 'after PUT request: ' + error);
        });
};

const add_menu_choice = function (event, table) {
    event.preventDefault();

    console.log("Inside add_menu_choice function");

    console.log("table = " + table);

    let form_data = document.getElementById('add-menu-choice-form').elements;

    for (let element of form_data) {
        console.log(element.name + ' = ' + element.value);
    }

    let form_as_JSON = form_to_JSON(['new_menu_choice'], form_data);
    console.log('form_as_JSON = ');
    console.log(form_as_JSON);

    fetch(living_library_config.get_api() +
          '?tbl=' + table +
          '&api_key=' + living_library_config.get_api_key(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_as_JSON),
        mode: 'cors'
    })
        .then(function (response) {
            console.log('Inside add_menu_choice fetch: first "then" function');
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log('Inside second "then" function');
            if (data.length > 0) {
                console.log(data[0]);

                alert('Form submitted.');

                /*
                window.location.href = baseUrl + 'index.php/livinglibrary/' +
                                       'getDonations/queued';
                */
            } else {
                alert('An error occurred when adding the menu choice.');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [add_menu_choice] An error occurred during or '
                        + 'after PUT request: ' + error);
        });
};

/**
 * Updates the text of the specified lookup table record.
 * @param   table           the lookup table to update
 * @param   id              the id of the menu choice to be updated (i.e. the
 *                          lookup table record id)
 */
const update_menu_choice = function (event, table, id) {
    event.preventDefault();

    console.log("Inside update_menu_choice function");

    console.log("table = " + table);
    console.log("id = " + id);

    let form_data = document.getElementById('update-menu-choice-form').elements;

    for (let element of form_data) {
        console.log(element.name + ' = ' + element.value);
    }

    let form_as_JSON = form_to_JSON(['updated_menu_choice'], form_data);
    console.log('form_as_JSON = ');
    console.log(form_as_JSON);

    fetch(living_library_config.get_api() +
          '?tbl=' + table +
          '&id=' + id +
          '&api_key=' + living_library_config.get_api_key(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_as_JSON),
        mode: 'cors'
    })
        .then(function (response) {
            console.log('Inside update_menu_choice fetch "then" function');
            console.log(response);

            if (response.ok) {
                alert('Form submitted.');

                /*
                window.location.href = baseUrl + 'index.php/livinglibrary/' +
                                       'getDonations/queued';
                */
            } else {
                alert('An error occurred when updating the menu choice.');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [update_menu_choice] An error occurred during '
                        + 'or after PUT request: ' + error);
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
            } else if (element.name === 'donor_amount_of_donation') {
                data[element.name] = parseFloat(element.value);
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
