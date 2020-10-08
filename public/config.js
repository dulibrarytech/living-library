/*
 * Donor Application
 *
 * Living Library config file
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, August 2020
 */

'use strict';

const living_library_config = (function () {

    let obj = {};

    /* Lookup tables */

    /**
     * Returns the string used by the Living Library API to identify the
     * relationships lookup table
     * @returns  {string}  the string that identifies the relationships table
     */
    obj.get_relationships_table = function () {
        return 'relationships';
    };

    /**
     * Returns the string used by the Living Library API to identify the
     * states lookup table
     * @returns  {string}  the string that identifies the states table
     */
    obj.get_states_table = function () {
        return 'states';
    };

    /**
     * Returns the string used by the Living Library API to identify the
     * subject areas lookup table
     * @returns  {string}  the string that identifies the subject areas table
     */
    obj.get_subject_areas_table = function () {
        return 'subject_areas';
    };

    /**
     * Returns the string used by the Living Library API to identify the
     * titles lookup table
     * @returns  {string}  the string that identifies the titles table
     */
    obj.get_titles_table = function () {
        return 'titles';
    };

    /* Donation Form object */
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
     * Returns the above Donation Form object
     * @returns  {Object}  the Donation Form object
     */
    obj.get_donation_form_info = function () {
        return donation_form;
    };

    /* Book Plate Form object */
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
    book_plate_form.required_label_for_attributes =
        book_plate_form.required_ids;

    /**
     * Returns the above Book Plate Form object
     * @returns  {Object}  the Book Plate Form object
     */
    obj.get_book_plate_form_info = function () {
        return book_plate_form;
    };

    /* Add Menu Choice Form object */
    let add_menu_choice_form = {
        // The name attributes of the form fields
        menu_choice_fields: ['new_menu_choice'],

        // The id attributes of all required form fields
        required_ids: ['new_menu_choice_input_box']
    };

    // The 'for' attributes of all required form field label tags
    add_menu_choice_form.required_label_for_attributes =
        add_menu_choice_form.required_ids;

    /**
     * Returns the above Add Menu Choice Form object
     * @returns  {Object}  the Add Menu Choice Form object
     */
    obj.get_add_menu_choice_form_info = function () {
        return add_menu_choice_form;
    };

    /* Update Menu Choice Form object */
    let update_menu_choice_form = {
        // The name attributes of the form fields
        menu_choice_fields: ['updated_menu_choice'],

        // The id attributes of all required form fields
        required_ids: ['updated_menu_choice_input_box']
    };

    // The 'for' attributes of all required form field label tags
    update_menu_choice_form
    .required_label_for_attributes = update_menu_choice_form.required_ids;

    /**
     * Returns the above Update Menu Choice Form object
     * @returns  {Object}  the Update Menu Choice Form object
     */
    obj.get_update_menu_choice_form_info = function () {
        return update_menu_choice_form;
    };

    /* Form Validation Rules object */
    let form_validation_rules = {
        general_validation: '^(?!\\s*$).+', // at least one non-whitespace character
        zip_code_validation: 'pattern="^\\d{5}|\\d{5}-\\d{4}"',
        dollar_amount_validation: 'min=0.01 step=0.01',
        // -- Date regex taken from http://html5pattern.com/Dates [Full Date Validation (YYYY-MM-DD) by Patrick Denny] --
        date_validation: 'pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"'
    };

    /**
     * Returns the above Form Validation Rules object
     * @returns  {Object}  the Form Validation Rules object
     */
    obj.get_form_validation_rules = function () {
        return form_validation_rules;
    };

    /**
     * Returns a textual explanation of each form symbol
     * @returns  {string}  the text explaining each form symbol
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
     * @returns  {string}  the error text (in this case, an empty string)
     */
    obj.get_error_text_for_invalid_json = function () {
        // return '<span class="error">error loading field</span>';

        /*
         * If you want error text for this situation, uncomment the line above
         * and delete the line below.
         */
        return '';
    };

    return obj;

}());
