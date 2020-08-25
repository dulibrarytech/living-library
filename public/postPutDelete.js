/*
 * Donor Application
 *
 * Living Library Functions involving POST, PUT, and DELETE requests
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, August 2020
 */

'use strict';

/**
 * Processes the Donation Form data, creating a new donation record in the
 * database.
 * @param   event   the event triggered by submitting the Donation Form
 */
const save_donation = function (event) {
    event.preventDefault();

    console.log("Inside save_donation function");

    let form_data = document.getElementById('donation-form').elements;

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

    let donation_data = {
        donor: JSON.stringify(donor_data_as_JSON),
        who_to_notify: JSON.stringify(notify_data_as_JSON),
        recipient: JSON.stringify(recipient_data_as_JSON)
    }

    console.log("donation_data = ");
    console.log(donation_data);
    console.log("fetch url = " + living_library_config.get_api() +
          '?api_key=' + living_library_config.get_api_key());

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
            console.log('response = ');
            console.log(response);
            return response.json().then(data => ({
                data: data,
                status: response.status,
                ok: response.ok
            }));
        })
        .then(function (response) {
            console.log('Inside second "then" function');
            console.log('response = ');
            console.log(response);

            let confirmation_div_element =
                document.getElementById('donation-form-confirmation');

            if (response.ok && response.data.length === 1) {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, true,
                                          'Success -- donation with ID ' +
                                          response.data[0].id +
                                          ' added to queue!',
                                          function () {
                                              window.location.href = baseUrl +
                                                  _getQueuedDonationsUrl;
                                          });
            } else {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, false,
                                          'Error submitting the donation form');
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
    for (let element of form_elements) {
        if (element.value.trim().length > 0) {
            return true;
        }
    }
    return false;
};

/**
 * Processes the Book Plate Form data, updating the donation record in the
 * database.
 * @param   event   the event triggered by submitting the Book Plate Form
 */
const save_book_plate = function (event) {
    event.preventDefault();

    console.log("Inside save_book_plate function");

    let form_data = document.getElementById('book-plate-form').elements;

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
            console.log('response = ');
            console.log(response);

            let confirmation_div_element =
                document.getElementById('book-plate-form-confirmation');

            if (response.ok) {
                let redirect_url = baseUrl + _getCompletedDonationUrl +
                                   form_data.donation_id.value;

                living_library_helper
                .insert_form_confirmation(confirmation_div_element, true,
                                          'Success -- book plate saved!',
                                          function () {
                                              window.location.href =
                                                  redirect_url;
                                          });
            } else {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, false,
                                          "Error when saving book plate -- " +
                                          "Couldn't find donation record " +
                                          "with ID " +
                                          form_data.donation_id.value);
            }
        })
        .catch(function (error) {
            console.log('ERROR: [save_book_plate] An error occurred during or '
                        + 'after PUT request: ' + error);
        });
};

/**
 * Processes the Add Menu Choice Form data, creating a new menu choice record
 * (or updating an existing menu choice record) in the database.
 * @param   event   the event triggered by submitting the Add Menu Choice Form
 * @param   table   the lookup table to add to (or update)
 */
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
            console.log('response = ');
            console.log(response);

            return response.json()
                .then(data => ({
                    data: data,
                    status: response.status,
                    ok: response.ok
                }))
                .catch(error => {
                    console.log('ERROR: [add_menu_choice] Response does not ' +
                                'contain JSON body content: ' + error);

                    return ({
                        status: response.status,
                        ok: response.ok
                    });
                });
        })
        .then(function (response) {
            console.log('Inside add_menu_choice fetch: second "then" function');
            console.log('new response obj = ');
            console.log(response);

            let confirmation_div_element =
                document.getElementById('add-menu-choice-form-confirmation');

            if (response.ok && response.data.length === 1) {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, true,
                                          'Success -- ' + response.data[0].term
                                          + ' added to list!',
                                          function () {
                                              window.location.reload(true);
                                          });
            } else {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, false,
                                          response.status === 409
                                          ? 'Error -- ' +
                                            form_as_JSON.new_menu_choice +
                                            ' already in list'
                                          : 'Error -- unable to add ' +
                                            form_as_JSON.new_menu_choice +
                                            ' to list');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [add_menu_choice] An error occurred during or '
                        + 'after PUT request: ' + error);
        });
};

/**
 * Updates the text of the specified lookup table record.
 * @param   event  the event triggered by submitting the Update Menu Choice Form
 * @param   table  the lookup table to update
 * @param   id     the id of the menu choice to be updated (i.e. the lookup
 *                 table record id)
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
          '&is_active=true' +
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
            console.log('response = ');
            console.log(response);

            let confirmation_div_element =
                document.getElementById('update-menu-choice-form-confirmation');

            if (response.ok) {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, true,
                                          'Success -- Updated menu choice!',
                                          function () {
                                              window.location.reload(true);
                                          });
            } else {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, false,
                                          response.status === 404
                                          ? 'Error -- record ' + id +
                                            ' not found'
                                          : 'Error -- unable to update');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [update_menu_choice] An error occurred during '
                        + 'or after PUT request: ' + error);
        });
};

/**
 * Removes the specified lookup table record from view on the website. To
 * remove the record from view, we set is_active = false.
 * @param   event             the event triggered by submitting the Delete
 *                            Menu Choice Form
 * @param   table             the lookup table to update
 * @param   id                the id of the menu choice to be removed (i.e. the
 *                            lookup table record id)
 * @param   table_link_text   the text to be used in hyperlinks to identify
 *                            the lookup table
 */
const delete_menu_choice = function (event, table, id, table_link_text) {
    event.preventDefault();

    console.log("Inside delete_menu_choice function");

    console.log("table = " + table);
    console.log("id = " + id);

    fetch(living_library_config.get_api() +
          '?tbl=' + table +
          '&id=' + id +
          '&is_active=true' +
          '&api_key=' + living_library_config.get_api_key(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            is_active: false
        }),
        mode: 'cors'
    })
        .then(function (response) {
            console.log('Inside delete_menu_choice fetch "then" function');
            console.log('response = ');
            console.log(response);

            let confirmation_div_element =
                document.getElementById('delete-menu-choice-form-confirmation');

            if (response.ok) {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, true,
                                          'Success -- Removed menu choice',
                                          function () {
                                              window.location.href = baseUrl +
                                                  _getMenuChoicesUrl +
                                                  table_link_text;
                                          });
            } else {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, false,
                                          response.status === 404
                                          ? 'Error -- record ' + id +
                                            ' not found'
                                          : 'Error -- unable to delete');
            }
        })
        .catch(function (error) {
            console.log('ERROR: [delete_menu_choice] An error occurred during '
                        + 'or after PUT request: ' + error);
        });
};

/**
 * Deletes the specified donation record.
 * @param   event             the event triggered by clicking the donation
 *                            record's Delete hyperlink (in the table of the
 *                            Donation Queue webpage)
 * @param   id                the id of the donation record to be deleted
 */
const delete_donation = function (event, id) {
    event.preventDefault();

    console.log("Inside delete_donation function");
    console.log("id = " + id);

    if (confirm("Delete Donation " + id + "?")) {
        fetch(living_library_config.get_api() +
              '?id=' + id +
              '&api_key=' + living_library_config.get_api_key(), {
            method: 'DELETE',
            mode: 'cors'
        })
            .then(function (response) {
                console.log('Inside delete_donation fetch "then" function');
                console.log('response = ');
                console.log(response);

                if (response.ok) {
                    alert('Donation ' + id + ' deleted.');
                } else {
                    let error_msg;
                    switch (response.status) {
                        case 404:
                            error_msg = 'Error -- Donation ' + id +
                                        ' not found.';
                            break;
                        case 409:
                            error_msg = 'Error -- Donation ' + id + ' is ' +
                                        'already completed and therefore ' +
                                        'cannot be deleted.';
                            break;
                        default:
                            error_msg = 'Error -- Unable to delete Donation ' +
                                        id;
                    }
                    alert(error_msg);
                }

                location.reload(true);
            })
            .catch(function (error) {
                console.log('ERROR: [delete_donation] An error occurred during '
                            + 'or after DELETE request: ' + error);
            });
    }
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

/**
 * Determines whether element_name is a valid field (i.e. if it's a field we
 * want to store in the database record)
 * @param  {string}  element_name       the name attribute of the form element
 * @param  {Array}   valid_form_fields  the list of valid form fields
 * @return {boolean}                    true if element_name is valid; false
 *                                      otherwise
 *
 * Adapted from: https://www.learnwithjason.dev/blog/get-form-values-as-json/
 */
const is_valid_element = function (element_name, valid_form_fields) {
    return valid_form_fields.includes(element_name);
};

/**
 * Determines whether the element's value is valid (i.e. if we want to
 * store it in the database record). Prevents storing checkbox or radio button
 * values unless they are selected by the user.
 * @param  {string}  element   the form element
 * @return {boolean}           - true if element's value is valid (the value is
 *                             considered valid if it's not a checkbox or radio
 *                             button; if it's a checkbox or radio button, it
 *                             must be selected in order to be valid)
 *                             - false otherwise
 *
 * Adapted from: https://www.learnwithjason.dev/blog/get-form-values-as-json/
 */
const is_valid_value = function (element) {
    return (!['checkbox', 'radio'].includes(element.type) || element.checked);
};
