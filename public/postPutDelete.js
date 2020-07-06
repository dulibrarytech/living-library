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

    let donation_data = new URLSearchParams();
    donation_data.append('donor', JSON.stringify(donor_data_as_JSON));
    donation_data.append('who_to_notify', JSON.stringify(notify_data_as_JSON));
    donation_data.append('recipient', JSON.stringify(recipient_data_as_JSON));

    console.log(living_library_config.get_api() +
          '?api_key=' + living_library_config.get_api_key());

    fetch(living_library_config.get_api() +
          '?api_key=' + living_library_config.get_api_key(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: donation_data
    }).then(response => console.log(response));
    // console.log(test);
/*
        .then(function (response) {
            console.log('Inside save_donation fetch: first "then" function');
            return response.json();
        })
        .then(function (data) {
            console.log('Inside second "then" function');
            if (data.length > 0) {
                console.log(data[0]);

                /*
                window.location.href = baseUrl + 'index.php/livinglibrary/' +
                                       'getDonations/queued';
                */

/*                alert('Donation ID ' + data[0].id + ' added to Donation Queue.');
                // return 'Donation ID ' + data[0].id + ' added to Donation Queue.';
            } else {
                alert('There was an error submitting the donation form.');
                // return 'There was an error submitting the donation form.';
            }
        })
        /*
        .then(function (message) {
              console.log('Inside third "then" function');
              alert(message);
        })
        */
/*
        .catch(function (error) {
            console.log('FATAL: [save_donation] Unable to POST: ' + error);
            // throw 'FATAL: [create_donation] Unable to POST: ' + error;
        });
*/
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

    let book_field = new URLSearchParams();
    book_field.append('book', JSON.stringify(form_as_JSON));

    let book_plate_data = { book: form_as_JSON };
    console.log("book_plate_data = ");
    console.log(book_plate_data);
    console.log("book_plate_data.book = ");
    console.log(book_plate_data.book);
    let book_plate_data_string = JSON.stringify(book_plate_data);
    console.log("JSON.stringify(book_plate_data) = " + book_plate_data_string);
    console.log("typeof book_plate_data_string = " + typeof book_plate_data_string);

    fetch(living_library_config.get_api() +
          '?id=' + form_data.donation_id.value +
          '&api_key=' + living_library_config.get_api_key(), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book_plate_data),
        mode: 'cors'
    }).then(response => console.log(response));

    /*
        .then(function (response) {
            console.log('Inside save_book_plate fetch: "then" function');
            console.log(response);
            if (response.ok) {
                console.log("Request succeeded: " + response.status);
            } else {
                console.log("Response failed: " + response.status)
            }
        })
        .catch(function (error) {
            console.log('FATAL: [save_book_plate] Unable to PUT: ' + error);
            // throw 'FATAL: [save_book_plate] Unable to PUT: ' + error;
        });
    */
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
