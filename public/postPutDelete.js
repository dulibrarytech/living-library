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
 * @param  {Object}  event  the event triggered by submitting the Donation Form
 */
const save_donation = function (event) {
    event.preventDefault();

    let form_data = document.getElementById('donation-form').elements;

    let donor_data_as_JSON = living_library_helper
                             .form_to_json(living_library_config
                                           .get_donation_form_info()
                                           .donor_fields,
                                           form_data);
    if (typeof donor_data_as_JSON.donor_subject_areas === 'undefined') {
        donor_data_as_JSON.donor_subject_areas = [];
    }

    let notify_data_as_JSON = [],
        notify_persons_data =
            document.getElementsByClassName('notify_person_1'),
        i = 1;
    while(notify_persons_data.length !== 0) {
        if (living_library_helper
            .containsNonEmptyElementValue(notify_persons_data)) {
            notify_data_as_JSON.push(living_library_helper
                                     .form_to_json(living_library_config
                                                   .get_donation_form_info()
                                                   .notify_fields,
                                                   notify_persons_data));
        }
        notify_persons_data = document.getElementsByClassName('notify_person_'
                                                              + (++i));
    }

    let recipient_data_as_JSON = living_library_helper
                                 .form_to_json(living_library_config
                                               .get_donation_form_info()
                                               .recipient_fields,
                                               form_data);

    let donation_data = {
        donor: JSON.stringify(donor_data_as_JSON),
        who_to_notify: JSON.stringify(notify_data_as_JSON),
        recipient: JSON.stringify(recipient_data_as_JSON)
    };

    let confirmation_div_element =
        document.getElementById('donation-form-confirmation');

    living_library_helper.fetch_with_timeout(living_library_api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donation_data),
        mode: 'cors'
    })
        .then(function (response) {
            if (response.ok) {
                return response.json().then(data => ({
                    data: data,
                    status: response.status,
                    ok: response.ok
                }));
            } else {
                return ({
                    status: response.status,
                    ok: response.ok
                });
            }
        })
        .then(function (response) {
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
            console.error('ERROR: [save_donation] An error occurred during or '
                          + 'after POST request: ' + error);

            living_library_helper
            .insert_form_confirmation(confirmation_div_element, false,
                                      'Error submitting the donation form');
        });
};

/**
 * Processes the Book Plate Form data, updating the donation record in the
 * database.
 * @param {Object}  event  the event triggered by submitting the Book Plate Form
 */
const save_book_plate = function (event) {
    event.preventDefault();

    let form_data = document.getElementById('book-plate-form').elements;

    let form_as_JSON = living_library_helper
                       .form_to_json(living_library_config
                                     .get_book_plate_form_info().book_fields,
                                     form_data);

    let book_plate_data = { book: JSON.stringify(form_as_JSON) };

    let confirmation_div_element =
        document.getElementById('book-plate-form-confirmation');

    living_library_helper.fetch_with_timeout(
        living_library_api_url + '&id=' + form_data.donation_id.value, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book_plate_data),
        mode: 'cors'
    })
        .then(function (response) {
            let completed_donation_url = baseUrl + _getCompletedDonationUrl +
                                         form_data.donation_id.value;

            if (response.ok) {
                living_library_helper
                .insert_form_confirmation(confirmation_div_element, true,
                                          'Success -- book plate saved!',
                                          function () {
                                              window.location.href =
                                                  completed_donation_url;
                                          });
            } else {
                let error_msg;
                switch (response.status) {
                    case 404:
                        error_msg = "Error when saving book plate -- " +
                                    "Couldn't find donation record " +
                                    "with ID " + form_data.donation_id.value;
                        break;
                    case 409:
                        error_msg = 'Error -- This donation (ID = ' +
                                    form_data.donation_id.value +
                                    ') is already completed (<a href="' +
                                    completed_donation_url + '">' +
                                    'view full record</a>). ' +
                                    'Cannot save book plate.';
                        break;
                    default:
                        error_msg = 'Error when saving the book plate';
                }

                living_library_helper
                .insert_form_confirmation(confirmation_div_element, false,
                                          error_msg);
            }
        })
        .catch(function (error) {
            console.error('ERROR: [save_book_plate] An error occurred during '
                          + 'or after PUT request: ' + error);

            living_library_helper
            .insert_form_confirmation(confirmation_div_element, false,
                                      'Error when saving the book plate');
        });
};

/**
 * Deletes the specified donation record.
 * @param  {Object}          event  the event triggered by clicking a donation
 *                                  record's Delete hyperlink (from the Donation
 *                                  Queue webpage)
 * @param  {(number|string)} id     the id of the donation record to be deleted
 */
const delete_donation = function (event, id) {
    event.preventDefault();

    if (confirm("Delete Donation " + id + "?")) {
        living_library_helper.fetch_with_timeout(
            living_library_api_url + '&id=' + id, {
            method: 'DELETE',
            mode: 'cors'
        })
            .then(function (response) {
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
                console.error('ERROR: [delete_donation] An error occurred '
                              + 'during or after DELETE request: ' + error);

                alert('Error -- Unable to delete Donation ' + id);
            });
    }
};

/**
 * Processes the Add Menu Choice Form data, creating a new menu choice record
 * (or updating an existing menu choice record) in the database.
 * @param  {Object}  event   the event triggered by submitting the Add Menu
 *                           Choice Form
 * @param  {string}  table   the lookup table to add to (or update)
 */
const add_menu_choice = function (event, table) {
    event.preventDefault();

    let form_data = document.getElementById('add-menu-choice-form').elements;

    let form_as_JSON = living_library_helper
                       .form_to_json(['new_menu_choice'], form_data);

    let confirmation_div_element =
        document.getElementById('add-menu-choice-form-confirmation');

    living_library_helper.fetch_with_timeout(
        living_library_api_url + '&tbl=' + table, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_as_JSON),
        mode: 'cors'
    })
        .then(function (response) {
            return response.json()
                .then(data => ({
                    data: data,
                    status: response.status,
                    ok: response.ok
                }))
                .catch(error => {
                    console.error('ERROR: [add_menu_choice] Response does ' +
                                  'not contain JSON body content: ' + error);

                    return ({
                        status: response.status,
                        ok: response.ok
                    });
                });
        })
        .then(function (response) {
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
            console.error('ERROR: [add_menu_choice] An error occurred during '
                          + 'or after PUT request: ' + error);

            living_library_helper
            .insert_form_confirmation(confirmation_div_element, false,
                                      'Error -- unable to add ' +
                                      form_as_JSON.new_menu_choice +
                                      ' to list');
        });
};

/**
 * Updates the text of the specified menu choice.
 * @param  {Object}          event  the event triggered by submitting the Update
 *                                  Menu Choice Form
 * @param  {string}          table  the lookup table to update
 * @param  {(number|string)} id     the id of the menu choice to be updated
 *                                  (i.e. the lookup table record id)
 */
const update_menu_choice = function (event, table, id) {
    event.preventDefault();

    let form_data = document.getElementById('update-menu-choice-form').elements;

    let form_as_JSON = living_library_helper
                       .form_to_json(['updated_menu_choice'], form_data);

    let confirmation_div_element =
        document.getElementById('update-menu-choice-form-confirmation');

    living_library_helper.fetch_with_timeout(living_library_api_url + '&tbl=' +
        table + '&id=' + id + '&is_active=true', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form_as_JSON),
        mode: 'cors'
    })
        .then(function (response) {
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
            console.error('ERROR: [update_menu_choice] An error occurred '
                          + 'during or after PUT request: ' + error);

            living_library_helper
            .insert_form_confirmation(confirmation_div_element, false,
                                      'Error -- unable to update');
        });
};

/**
 * Removes the specified menu choice from view on the website. To remove the
 * menu choice from view, we set is_active=false.
 * @param  {Object}           event            the event triggered by submitting
 *                                             the Delete Menu Choice Form
 * @param  {string}           table            the lookup table to update
 * @param  {(number|string)}  id               the id of the menu choice to be
 *                                             removed (i.e. the lookup table
 *                                             record id)
 * @param  {string}           table_link_text  the text to be used in hyperlinks
 *                                             to identify the lookup table
 */
const delete_menu_choice = function (event, table, id, table_link_text) {
    event.preventDefault();

    let confirmation_div_element =
        document.getElementById('delete-menu-choice-form-confirmation');

    living_library_helper.fetch_with_timeout(living_library_api_url + '&tbl=' +
        table + '&id=' + id + '&is_active=true', {
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
            console.error('ERROR: [delete_menu_choice] An error occurred '
                          + 'during or after PUT request: ' + error);

            living_library_helper
            .insert_form_confirmation(confirmation_div_element, false,
                                      'Error -- unable to delete');
        });
};
