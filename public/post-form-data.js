const save_book_plate = function (event) {
    console.log("Inside save_book_plate function");

    const BOOK_PLATE_FORM_FIELDS = ["author_name", "book_title",
                                    "bibliographic_number", "call_number"];

    // Stop the form from submitting the default way
    event.preventDefault();

    let form_data = document.getElementById('donor-input-form').elements;

    let form_as_JSON = form_to_JSON(BOOK_PLATE_FORM_FIELDS, form_data);
    console.log("form_as_JSON = " + JSON.stringify(form_as_JSON));

    /* TO-DO: Add the book_timestamp key-value pair with the current time.
     * (The book fields publisher and date_published are not needed.)
     */

    let book_field = new URLSearchParams();
    book_field.append('book', JSON.stringify(form_as_JSON));

    const url = 'http://localhost:8000/api/v1/living-library/donations?id='
                + form_data.donation_id.value
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    console.log("url = " + url);

    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: book_field
    });

};

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} form_elements  the form elements
 * @return {Object}                                    form data as an object literal
 *
 * Adapted from: https://www.learnwithjason.dev/blog/get-form-values-as-json/
 */
const form_to_JSON = function (expected_form_fields, form_elements) {
    return [].reduce.call(form_elements, (data, element) => {
        if (expected_form_fields.includes(element.name)) {
            data[element.name] = element.value;
        }
        return data;
    }, {});
};
