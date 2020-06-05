function save_book_plate() {
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

    /*
    for (field of form_data) {
        console.log(field);
    }
    */

    console.log("==============\n New form testing starts here");
    let hard_coded_json = '{"author_name": "Hard Coded JSON Test", '
                          + '"book_title": "We sure hope this works!", '
                          + '"bibliographic_number": "b39845734 ", '
                          + '"call_number": "HG60543.G56 2008", '
                          + '"publisher": "", '
                          + '"date_published": "", '
                          + '"book_timestamp": "2020-05-26 13:58:00"}';
    console.log("hard_coded_json = " + hard_coded_json);

    let form_params_with_hard_coded_json = new URLSearchParams();
    form_params_with_hard_coded_json.append('book', hard_coded_json);

    console.log("form_params_with_hard_coded_json contains...");
    for (field of form_params_with_hard_coded_json) {
        console.log(field);
    }

    fetch(url, {
        method: 'PUT',
        headers: {
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        // body: JSON.stringify(form_data_params)
        body: form_params_with_hard_coded_json
    });

}
