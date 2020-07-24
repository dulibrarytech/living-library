/*
 * Donor Application
 *
 * Living Library helper functions
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, July 2020
 */

const living_library_helper = (function () {

    let obj = {};

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
