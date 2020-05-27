/* Axios approach <-- this works by running 'node filename.js' as long as you run
 * it within your node.js app (which should have axios as a dependency).
const axios = require("axios");
const url = "http://localhost:8000/api/app?is_completed=true&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR";

const getData = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};

getData(url);
*/

/* Fetch approach 1 <-- Can't get this to work. To get around the "SyntaxError:
 * Unexpected end of input" error, I tried Pibo's fix from:
 * https://stackoverflow.com/questions/45696999/fetch-unexpected-end-of-input
 * This avoid the above error, but I can't access the JSON. The console.log
 * output says "JSON = [object Object]".
const url = "http://localhost:8000/api/app?is_completed=true&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR";

const getData = async url => {
    try {
        const response = await fetch(url, {
            mode: 'no-cors'
        });
        console.log("Response = " + response);
        // const json = await response.json();
        const text = await response.text();
        console.log("Response.text() = " + text);
        const json = text ? JSON.parse(text) : {};
        console.log("JSON = " + json);
    } catch (error) {
        console.log("In the catch block");
        console.log(error);
    }
};

getData(url);
*/

/* Fetch approach 2 <-- This gives an "Uncaught (in promise) SyntaxError:
 * Unexpected end of input" error, similar to the error mentioned above.
const url = "http://localhost:8000/api/app?is_completed=true&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR";

fetch(url, {
    mode: 'no-cors'
})
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
        console.log(data);
    })
*/

/* The code below works on Safari if I choose Developer > Disable Cross-Origin
 * restrictions. The quotes are being escaped \", and yet I can still access
 * the JSON keys without a problem.
 */

function get_donations(is_completed) {
    const url = 'http://localhost:8000/api/app?is_completed=' + is_completed
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    /*
    fetch(url, {
        mode: 'no-cors'
    })
    */
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            let html = '<table>';
            html += '<tr>';
            html += '<th>Book Plate Form</th>';
            html += '<th>Tracking Number</th>';
            html += '<th>Donor Name</th>';
            html += '<th>Recipient Name</th>';
            html += '<th>Date of Donation</th>';
            html += '</tr>';
            for (let i = 0; i < data.length; i++) {
                const donor = JSON.parse(data[i].donor);
                const recipient = JSON.parse(data[i].recipient);
                let is_completed_string = data[i].is_completed
                                          ? 'completed'
                                          : 'in the queue';
                console.log('Tracking ID = ' + data[i].id + ' from ' +
                            donor.title + ' ' + donor.first_name +
                            ' ' + donor.last_name + '.\n'
                            + recipient.donation_type + ' ' + recipient.title
                            + ' ' + recipient.first_name + ' '
                            + recipient.last_name + '.\nDonated on '
                            + donor.date_of_donation + '.\nStatus: '
                            + is_completed_string + '.\n');

                html += '<tr>';
                html += '<td>' + data[i].id + '</td>'; // To-Do: Should link to book plate form
                html += '<td>' + data[i].id + '</td>';
                html += '<td>' + donor.title + ' ' + donor.first_name + ' '
                        + donor.last_name + '</td>';
                html += '<td>' + recipient.title + ' ' + recipient.first_name + ' '
                        + recipient.last_name + '</td>';
                html += '<td>' + donor.date_of_donation + '</td>';
                html += '</tr>';
            }
            html += '</table>';
            let id = document.querySelector('#donations');

            if (id) {
                id.innerHTML = html;
            }
        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        })
}
