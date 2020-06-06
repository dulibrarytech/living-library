const save_book_plate = function (event) {
    const BOOK_PLATE_FORM_FIELDS = ["author_name", "book_title",
                                    "bibliographic_number", "call_number"];

    console.log("typeof event = " + typeof event);

    // Stop the form from submitting the default way
    event.preventDefault();

    console.log("Inside save_book_plate function");

    /* Using a FormData object

    const form = new FormData(document.getElementById('donor-input-form'));
    console.log("donation id = " + form.get('donation_id'));

    const url = 'http://localhost:8000/api/v1/living-library/donations?id='
                + form.get('donation_id')
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    */

    // let form_data = document.querySelector('#donor-input-form');
    // let form_data = document.getElementById('donor-input-form');

    /* This code allows me to access each form field. To form valid JSON
     * with wrapping quotes, I would need construct it manually in the for
     * loop below.

    let form_data = $("#donor-input-form").serialize();
    console.log(form_data);
    let = form_data_params = new URLSearchParams(form_data);

    console.log("donation id = " + form_data_params.get('donation_id'));

    let form_json = '{';
    for (const [key, value] of form_data_params) {
        console.log(key + " = " + value);
        form_json += key + ": " + value;
    }
    form_json += '}';

    console.log("form_json = " + form_json);

    const url = 'http://localhost:8000/api/v1/living-library/donations?id='
                + form_data_params.get('donation_id')
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    console.log("url = " + url);

    */

    /*
    for (field of form_data) {
        console.log(field);
    }
    */

    console.log("Testing form_data.elements approach:")
    let form_data = document.getElementById('donor-input-form').elements;

    /* form_data is an HTMLFormControlsCollection, which is “array-like”
     * See NOTE below for more details.
     */
    console.log("typeof form_data = " + typeof form_data); // object

    /* The code below uses the formToJSON approach from
    https://www.learnwithjason.dev/blog/get-form-values-as-json/

    Explanation from above link:

    As it stands, formToJSON() is actually made of three parts:
    1. A reducer function to combine our form elements into a single object.
    2. An initial value of {} to hold our form data.
    3. A call to reduce() using call(), which allows us to force reduce() to
       work with elements, even though it’s technically not an array.

    NOTE: The form elements are actually what’s called an
    HTMLFormControlsCollection, which is “array-like”, meaning it’s basically an
    array, but it’s missing some of the array methods, and has some of its own
    special properties and methods.
    */

    /* Since form_data is not an array, we can't use certain array methods like
     * forEach(). So this doesn't work:
     * form_data.forEach(console.log); <-- error: form_data.forEach is not a function
     */

    // Iterate over the form controls
    for (i = 0; i < form_data.length; i++) {
        console.log("Info for form_data[" + i + "]");
        console.log("form_data[i].nodeName = " + form_data[i].nodeName);
        console.log("form_data[i].type = " + form_data[i].type);
        console.log("form_data[i].name = " + form_data[i].name);
        console.log("form_data[i].value = " + form_data[i].value);
        console.log("=============");
    }

    // Access specific elements by name
    console.log("Accessing specific form elements by name");
    console.log("author_name = " + form_data.author_name.value);
    console.log("book_title = " + form_data.book_title.value);
    console.log("bibliographic_number = " + form_data.bibliographic_number.value);
    console.log("call_number = " + form_data.call_number.value);
    console.log("donation_id = " + form_data.donation_id.value);

    console.log("==============\n New form testing starts here");
    let hard_coded_json = '{"author_name":' + '"' + form_data.author_name.value + '", '
                          + '"book_title":' + '"' + form_data.book_title.value + '", '
                          + '"bibliographic_number":' + '"' + form_data.bibliographic_number.value + '", '
                          + '"call_number":' + '"' + form_data.call_number.value + '", '
                          + '"publisher": "", '
                          + '"date_published": "", '
                          + '"book_timestamp": "2020-05-26 13:58:00"}';
    console.log("hard_coded_json = " + hard_coded_json);

    // Calling form_to_JSON function
    let form_as_JSON = form_to_JSON(BOOK_PLATE_FORM_FIELDS, form_data);
    console.log("form_to_JSON(form_data) = " + JSON.stringify(form_as_JSON));

    /* TO-DO: Add the book_timestamp key-value pair with the current time.
     * (The book fields publisher and date_published are not needed.)
     */

    /*
    let form_params_with_hard_coded_json = new URLSearchParams();
    form_params_with_hard_coded_json.append('book', hard_coded_json);

    console.log("form_params_with_hard_coded_json contains...");
    for (field of form_params_with_hard_coded_json) {
        console.log(field);
    }
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
