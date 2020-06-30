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
        return API_KEY;
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

    /* Required form fields, validation attributes, etc. */
    let donation_form = {
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
        // Validation attributes
        zip_code_validation: 'pattern="^\\d{5}|\\d{5}-\\d{4}"',
        dollar_amount_validation: 'min=0.01 step=0.01',
        // -- Date regex taken from http://html5pattern.com/Dates [Full Date Validation (YYYY-MM-DD) by Patrick Denny] --
        date_validation: 'pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"',
        // Reusable label text
        zip_code_label_text: 'Zip (e.g. 80210 or 80210-4711):'
    };

    let book_plate_form = {
        // The id attributes of all required form fields
        required_ids: ['book_title_input_box',
                       'book_bibliographic_number_input_box',
                       'book_call_number_input_box']
        }

    // The 'for' attributes of all required form field label tags
    book_plate_form.required_label_for_attributes = book_plate_form.required_ids;

    /**
     * Returns the donation form's required fields
     * @returns {Object}
     */
    obj.get_donation_form_info = function () {
        return donation_form;
    };

    /**
     * Returns the book plate form's required fields
     * @returns {Object}
     */
    obj.get_required_book_plate_form_fields = function () {
        return book_plate_form;
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

    return obj;

}());