/*
 * Donor Application
 *
 * Living Library config file
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */

const living_library_config = (function () {

    let obj = {};

    /**
     * Resolves living library api base url
     * @returns {string}
     */
    obj.get_api = function () {

        let api = 'http://localhost:8000';

        /* TODO: Update this because the donordb's domain will be different from
         * the living library backend api's domain, right?

        if (document.domain !== 'localhost') {
            api = location.protocol + '//' + document.domain + ':' + location.port;
        }

        */

        return api + '/api/v1/living-library/donations';
    };

    /**
     * Resolves living library api key
     * @returns {string}
     */
    obj.get_api_key = function () {
        return ENTER_API_KEY_HERE;
    };

    /* Lookup tables */
    obj.get_relationships_table = function () {
        return 'tbl_relationships_lookup';
    };

    obj.get_states_table = function () {
        return 'tbl_states_lookup';
    };

    obj.get_subject_areas_table = function () {
        return 'tbl_subject_areas_lookup';
    };

    obj.get_titles_table = function () {
        return 'tbl_titles_lookup';
    };

    /* Form field groups, required fields, etc. */
    let donation_form = {
        // The name attributes of the form fields
        donor_fields: ['donor_title', 'donor_first_name',
                       'donor_last_name', 'donor_address',
                       'donor_city', 'donor_state', 'donor_zip',
                       'donor_amount_of_donation',
                       'donor_date_of_donation', 'donor_notes',
                       'donor_subject_areas'],
        notify_fields: ['notify_title', 'notify_first_name',
                        'notify_last_name', 'notify_address',
                        'notify_city', 'notify_state', 'notify_zip',
                        'notify_relation_to_donor'],
        recipient_fields: ['recipient_title', 'recipient_first_name',
                           'recipient_last_name', 'recipient_donation_type'],

        // The id attributes of all required form fields
        required_ids: ['donor_first_name_input_box',
                       'donor_last_name_input_box',
                       'donor_address_input_box',
                       'donor_city_input_box',
                       'donor_state_dropdown',
                       'donor_zip_input_box',
                       'recipient_first_name_input_box',
                       'recipient_last_name_input_box',
                       'recipient_donation_type_radio_choice1',
                       'recipient_donation_type_radio_choice2',
                       'donor_amount_of_donation_input_box',
                       'gift-date-box'],
        // The 'for' attributes of all required form field label tags
        required_label_for_attributes: ['donor_first_name_input_box',
                                        'donor_last_name_input_box',
                                        'donor_address_input_box',
                                        'donor_city_input_box',
                                        'donor_state_dropdown',
                                        'donor_zip_input_box',
                                        'recipient_first_name_input_box',
                                        'recipient_last_name_input_box',
                                        'recipient_donation_type',
                                        'donor_amount_of_donation_input_box',
                                        'gift-date-box'],
        // Reusable label text
        zip_code_label_text: 'Zip (e.g. 80210 or 80210-4711):'
    };

    /**
     * Returns the above donation form object
     * @returns {Object}
     */
    obj.get_donation_form_info = function () {
        return donation_form;
    };

    let book_plate_form = {
        // The name attributes of the form fields
        book_fields: ["book_author_name", "book_title",
                      "book_bibliographic_number", "book_call_number"],

        // The id attributes of all required form fields
        required_ids: ['book_title_input_box',
                       'book_bibliographic_number_input_box',
                       'book_call_number_input_box']
    };

    // The 'for' attributes of all required form field label tags
    book_plate_form.required_label_for_attributes = book_plate_form.required_ids;

    /**
     * Returns the above book plate form object
     * @returns {Object}
     */
    obj.get_book_plate_form_info = function () {
        return book_plate_form;
    };

    /* Form field validation rules */
    let form_validation_rules = {
        general_validation: '^(?!\\s*$).+', // at least one non-whitespace character
        zip_code_validation: 'pattern="^\\d{5}|\\d{5}-\\d{4}"',
        dollar_amount_validation: 'min=0.01 step=0.01',
        // -- Date regex taken from http://html5pattern.com/Dates [Full Date Validation (YYYY-MM-DD) by Patrick Denny] --
        date_validation: 'pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"',
    };

    /**
     * Returns the above form validation rules object
     * @returns {Object}
     */
    obj.get_form_validation_rules = function () {
        return form_validation_rules;
    };

    /**
     * Returns a textual explanation of each form symbol
     * @returns {string}
     */
    obj.get_form_symbol_explanation_text = function () {
        return '<p>( <abbr class="required" title="required">*'
               + '</abbr> indicates required field, '
               + '&#x2716 indicates invalid value, '
               + '&#x2714 indicates valid value )'
               + '</p>';
    };

    /**
     * Returns error text to display on webpage if field contains invalid JSON
     * @returns {string}    error text (in this case, an empty string)
     */
    obj.get_error_text_for_invalid_json = function () {
        /* If you want error text for this situation, uncomment the line below */
        // return '<span class="error">error loading field</span>';

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
     * Checks whether the variable is a non-null object
     * @param               field   the variable to check
     * @returns {boolean}           true if non-null object; false, otherwise
     */
    obj.is_non_null_object = function (field) {
        return typeof field === 'object' && field !== null;
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

    return obj;

}());
