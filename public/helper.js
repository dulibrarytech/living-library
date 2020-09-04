/*
 * Donor Application
 *
 * Living Library helper functions
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, August 2020
 */

'use strict';

const living_library_helper = (function () {

    let obj = {};

    /**
     * Determines whether the given HTMLCollection contains any non-empty element
     * values.
     * @param  {HTMLCollection}   form_elements    the elements to be checked
     * @return {boolean}                           true if exists >= 1 non-empty
     *                                             element; false otherwise
     */
    obj.containsNonEmptyElementValue = function (form_elements) {
        for (let element of form_elements) {
            if (element.value.trim().length > 0) {
                return true;
            }
        }
        return false;
    };

    /**
     * Retrieves input data from a form and returns it as a JSON object.
     * @param  {Array}            expected_form_fields  the form fields that
     *                                                  will be matched
     * @param  {HTMLCollection}   form_elements   the form elements (i.e
     *                                            the data input by the
     *                                            user); can also be an
     *                                            HTMLFormControlsCollection
     * @return {Object}                           form data as an object literal
     *
     * Adapted from:
     * https://www.learnwithjason.dev/blog/get-form-values-as-json/
     */
    obj.form_to_json = function (expected_form_fields, form_elements) {
        return [].reduce.call(form_elements, (data, element) => {
            if (obj.is_valid_element(element.name, expected_form_fields) &&
                obj.is_valid_value(element)) {
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
     * Returns the specified object property (if it's a string or number)
     * @param   {Object}            object     the object to check
     * @param   {string or number}  property   the property to check for
     * @returns                                the object property (if it's a
     *                                         string or number); otherwise, an
     *                                         empty string
     */
    obj.get_field_value = function (object, property) {
        if (obj.is_non_null_object(object)) {
            if (typeof object[property] === 'string' ||
                typeof object[property] === 'number') {
                return object[property];
            }

            let field_label = typeof property === 'number'
                              ? 'element at index ' + property
                              : property;

            if (Array.isArray(object[property])) {
                console.log('Error in donation record field: ' + field_label +
                            ' is an array: [' + object[property].join(', ') +
                            ']');
            } else {
                console.log('Error in donation record field: ' + field_label +
                            ' = ' + object[property]);
            }
        }

        // No field value, so return the empty string
        return '';
    };

    /**
     * Parses the JSON stored in the specified object property
     * @param   {Object}  object     object whose property needs to be parsed
     * @param   {string}  property   name of property to be parsed
     * @returns {Object}             the resulting parsed object;
     *                               otherwise, 'undefined'
     */
    obj.get_valid_json = function (object, property) {
        console.log('Inside get_valid_json function');

        console.log('object = ');
        console.log(object);
        console.log('property = ' + property);

        let field;

        if (typeof object === 'undefined' || object === null) {
            console.log("Error: donation record is " + object);
        } else if (object.hasOwnProperty(property)) {
            try {
                field = JSON.parse(object[property]);
            } catch (error) {
                console.log('Error parsing JSON for donation id ' +
                            object.id + ': ' + error + ':\n' +
                            'donation_' + object.id + '.' + property +
                            ' = ' + object[property]);
            }
        } else {
            console.log(`Error: Cannot find '${property}' field in donation `
                        + 'record with id = ');
            console.log(object.id);
        }

        console.log("get_valid_json function is returning:");
        console.log(field);

        return field;
    };

    /**
     * Removes table content element from view.
     */
    obj.hide_table_content = function () {
        $("#table-content").html('');
        document.getElementById("table-content")
                .setAttribute("id", "no-table-content");
    }

    /**
     * Inserts the given error message onto the page.
     * @param   {string}   error_header_text    the text to be inserted into
     *                                          the error message header
     * @param   {boolean}  display_help_msg     whether or not to display the
     *                                          default help message within
     *                                          content_section_element
     */
    obj.insert_error_message = function (error_header_text,
                                         display_help_msg = false) {
        let content_section_element = document
                                      .getElementById('content-section');

        if (content_section_element) {
            content_section_element.innerHTML =
                display_help_msg
                ? 'For help, contact the ' +
                  '<a href="https://library.du.edu/contact/' +
                  'department-directory.html">' +
                  'Digital Infrastructure &amp; Technology Coordinator ' +
                  'in Library Technology Services</a>.'
                : '';

            content_section_element.className = 'error-block';
        }

        let error_header_element = document.createElement('div');
        error_header_element.className = 'error-header error';
        error_header_element.innerHTML = error_header_text;
        content_section_element.parentNode
                               .insertBefore(error_header_element,
                                             content_section_element);
    }

    /**
     * Inserts the given message into the specified DOM element.
     * @param   {Object}   element      the DOM element to insert into
     * @param   {boolean}  is_success   whether form submission succeeded (true)
     *                                  or failed (false)
     * @param   {string}   message      the message to be inserted
     * @param   {function} callback     function to be called after message
     *                                  has been displayed
     */
    obj.insert_form_confirmation = function (element, is_success, message,
                                             callback) {
        console.log('Inside insert_form_confirmation function');

        if (element) {
            element.innerHTML = message;

            if (is_success) {
                element.className = 'form-submit-confirmation success';
                setTimeout(callback, 4000);
            } else {
                element.className = 'form-submit-confirmation error';
            }
        }
    };

    /**
     * Checks whether the variable is a non-null object
     * @param               field   the variable to check
     * @returns {boolean}           true if non-null object; false, otherwise
     */
    obj.is_non_null_object = function (field) {
        return typeof field === 'object' && field !== null;
    };

    /**
     * Determines whether element_name is a valid field (i.e. if it's a field we
     * want to store in the database record)
     * @param  {string}  element_name     the name attribute of the form element
     * @param  {Array}   valid_form_fields   the list of valid form fields
     * @return {boolean}                     true if element_name is valid;
     *                                       false otherwise
     *
     * Adapted from:
     * https://www.learnwithjason.dev/blog/get-form-values-as-json/
     */
    obj.is_valid_element = function (element_name, valid_form_fields) {
        return valid_form_fields.includes(element_name);
    };

    /**
     * Determines whether the element's value is valid (i.e. if we want to
     * store it in the database record). Prevents storing checkbox or radio
     * button values unless they are selected by the user.
     * @param  {string}  element   the form element
     * @return {boolean}           - true if element's value is valid (the value
     *                             is considered valid if it's not a checkbox or
     *                             radio button; if it's a checkbox or radio
     *                             button, it must be selected in order to be
     *                             valid)
     *                             - false otherwise
     *
     * Adapted from:
     * https://www.learnwithjason.dev/blog/get-form-values-as-json/
     */
    obj.is_valid_value = function (element) {
        return (!['checkbox', 'radio'].includes(element.type) ||
                element.checked);
    };

    /**
     * Populates dropdown menu(s) by fetching values from a lookup table
     * @param table_name     the lookup table whose values will populate each
     *                       element's dropdown menu
     * @param url            the url of the API being queried
     * @param html_elements  the dropdown menu(s) to be populated (i.e. the
     *                       <select> tags); an HTMLCollection object
     * @param text_for_default_option   the option each dropdown menu should
     *                                  display by default
     */
    obj.populate_dropdown_menu = function (table_name, url, html_elements,
                                           text_for_default_option) {
        // Create new <select> element and add its default option
        let select = document.createElement('select');
        let default_option = document.createElement('option');

        default_option.value = '';
        default_option.setAttribute('selected', '');
        default_option.text = text_for_default_option;

        select.add(default_option);
        select.selectedIndex = 0;

        if (table_name !== living_library_config.get_titles_table() &&
            table_name !== living_library_config.get_states_table() &&
            table_name !== living_library_config.get_relationships_table()) {
            console.error('ERROR: ' + table_name + ' is not a lookup table. ' +
                          'Cannot populate dropdown menu.');
            return false;
        }

        // Fetch dropdown menu options from database and add to <select> element
        fetch(url)
            .then(function(response) {
                console.log("Inside " + table_name + " fetch");
                if (response.status !== 200) {
                    console.error('ERROR: Unable to fetch ' + table_name +
                                  '. Status Code: ' + response.status);
                    return false;
                }

                return response.json();
            })
            .then(function(data) {
                // Add dropdown menu options to <select> element
                let option;
                for (let i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.value = data[i].term;
                    option.innerHTML = data[i].term;
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
            })
            .catch(function(error) {
                console.error('ERROR: Unable to fetch ' + table_name + ': ' +
                              error);
            });
    }

    /**
     * Updates HTML for all required form fields
     * @param {Object} required_fields   an object containing the following
     *                                   properties:
     *                                   - required_label_for_attributes =
     *                                     the 'for' attributes of the label
     *                                     tags that need to be updated
     *                                   - required_ids =
     *                                     the id attributes of the input tags
     *                                     that need to be updated
     */
    obj.update_required_fields_in_form = function (required_fields) {
        console.log("Inside update_required_fields_in_form");

        for (let element of required_fields.required_label_for_attributes) {
            let label_element = document
                                .querySelector(`label[for="${element}"]`);

            label_element.innerHTML = '<abbr class="required" title="required">'
                                      + '* </abbr>' + label_element.innerHTML;
        }

        for (let element of required_fields.required_ids) {
            let form_element = document.querySelector(`#${element}`);

            /**
             * Add general validation rule to element (if there is no existing
             * validation)
             */
            if (form_element.tagName === 'INPUT' && !form_element.pattern &&
                !form_element.min) {
                form_element.title = 'Enter at least one character (e.g. a ' +
                                     'letter or number)';

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
                form_element.parentNode.insertBefore(span,
                                                     form_element.nextSibling);
            }
        }
    }

    /**
     * Returns a valid boolean value based on is_completed parameter.
     * Defaults to false for any invalid value or type.
     * Any value that is not 1 or true is considered false.
     * @param   {boolean, number or string}  is_completed  the value to validate
     * @returns {boolean}   true if value is true, 1, '1' or 'true';
     *                      false otherwise
     */
    obj.validate_is_completed_parameter = function (is_completed) {
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

    return obj;

}());
