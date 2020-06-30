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

    /* Required form fields */
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
                                        'gift-date-box']
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
    obj.get_required_donation_form_fields = function () {
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
     * Returns the hex number for the UTF-8 character used to indicate that a
     * form field has invalid input
     * @returns {number}
     */
    obj.get_invalid_input_symbol = function () {
       return 2716;
    };

    /**
     * Returns the hex number for the UTF-8 character used to indicate that a
     * form field has valid input
     * @returns {number}
     */
    obj.get_valid_input_symbol = function () {
       return 2714;
    };

    /**
     * Returns a textual explanation of each form symbol
     * @returns {string}
     */
    obj.get_form_symbol_explanation_text = function () {
        return '<p>( <abbr class="required" title="required">*'
               + '</abbr> indicates required field; '
               + '&#x' + obj.get_invalid_input_symbol() + ' and '
               + '&#x' + obj.get_valid_input_symbol() + ' indicate invalid or '
               + 'valid input, respectively )'
               + '</p>';
    };

    return obj;

}());
