function get_donations(is_completed) {
    const url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            let html = '';

            if (data.length === 0) {
                html += '<p class="label">No donation records found.</p>';
            } else {
                html += '<table>';
                html += '<tr>';
                html += is_completed === 'false'
                        ? '<th>Book Plate Form</th>'
                        : '<th>Full Record</th>';
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

                    if (donor !== null) {
                        console.log("Tracking ID = " + data[i].id + " from " +
                                    donor.title + " " + donor.first_name +
                                    " " + donor.last_name);
                    } else {
                        console.log("Donor field of " + data[i].id + " is "
                                    + donor);
                    }

                    if (recipient !== null) {
                        console.log(recipient.donation_type + " " + recipient.title
                                    + " " + recipient.first_name + " "
                                    + recipient.last_name);
                    } else {
                        console.log("Recipient field of " + data[i].id + " is "
                                      + recipient);
                    }

                    if (donor !== null) {
                        console.log("Donated on " + donor.date_of_donation
                                    + ".\nStatus: " + is_completed_string);
                    }
                    console.log();

                    html += '<tr>';

                    html += '<td><a href="#" onclick="get_donation('
                            + data[i].is_completed + ', ' + data[i].id + ')">'
                            + data[i].id + '</a></td>';

                    html += '<td>' + data[i].id + '</td>';

                    html += '<td>';
                    if (donor !== null) {
                        html += donor.title + ' ' + donor.first_name + ' '
                                + donor.last_name;
                    }
                    html += '</td>';

                    html += '<td>';
                    if (recipient !== null) {
                        html += recipient.title + ' ' + recipient.first_name
                                + ' ' + recipient.last_name;
                    }
                    html += '</td>';

                    html += '<td>';
                    if (donor !== null) {
                        html += donor.date_of_donation;
                    }
                    html += '</td>';

                    html += '</tr>';
                }
                html += '</table>';
            }
            console.log(html);
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

function get_donation(is_completed, id) {
    const url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&id=' + id
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    if (is_completed)
        get_completed_donation(url);
    else {
        get_queued_donation(url);
    }
}

function get_completed_donation(url) {
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);
            const book = JSON.parse(data[0].book);
            let html = '';

            if (donor === null) {
                html += '<p><span class="label">No person making donation.'
                        + '</span></p>';
            } else {
                html += '<h2>Person making donation</h2>';
                html += '<p><span class="label">Title: </span>' + donor.title
                        + '</p>';
                html += '<p><span class="label">First Name: </span>'
                        + donor.first_name + '</p>';
                html += '<p><span class="label">Last Name: </span>'
                        + donor.last_name + '</p>';
                html += '<p><span class="label">Address: </span>' + donor.address
                        + '</p>';
                html += '<p><span class="label">City: </span>'
                        + donor.city + '</p>';
                html += '<p><span class="label">State: </span>'
                        + donor.state + '</p>';
                html += '<p><span class="label">Zip: </span>'
                        + donor.zip + '</p>';
            }

            if (who_to_notify === null) {
                html += '<p><span class="label">No person to be notified of '
                        + 'donation.</span></p>';
            } else {
                html += '<h2>Person(s) to be notified of donation</h2>';
                for (let i = 0; i < who_to_notify.length; i++) {
                    html += '<div class="content_block">';
                    html += '<p><span class="label">Title: </span>'
                            + who_to_notify[i].title + '</p>';
                    html += '<p><span class="label">First Name: </span>'
                            + who_to_notify[i].first_name + '</p>';
                    html += '<p><span class="label">Last Name: </span>'
                            + who_to_notify[i].last_name + '</p>';
                    html += '<p><span class="label">Address: </span>'
                            + who_to_notify[i].address + '</p>';
                    html += '<p><span class="label">City: </span>'
                            + who_to_notify[i].city + '</p>';
                    html += '<p><span class="label">State: </span>'
                            + who_to_notify[i].state + '</p>';
                    html += '<p><span class="label">Zip: </span>'
                            + who_to_notify[i].zip + '</p>';
                    html += '<p><span class="label">Relation to Donor: </span>'
                            + who_to_notify[i].relation_to_donor + '</p>';
                    html += '</div>';
                }
            }

            if (recipient === null) {
                html += '<p><span class="label">No person receiving donation.'
                        + '</span></p>';
            } else {
                html += '<h2>Person receiving donation</h2>';
                html += '<p><span class="label">Title: </span>'
                        + recipient.title + '</p>';
                html += '<p><span class="label">First Name: </span>'
                        + recipient.first_name + '</p>';
                html += '<p><span class="label">Last Name: </span>'
                        + recipient.last_name + '</p>';
                html += '<p><span class="label">Donation Type: </span>'
                        + recipient.donation_type + '</p>';
            }

            if (donor === null) {
                html += '<p><span class="label">No donation date or amount.'
                        + '</span></p>';
            } else {
                html += '<h2>Donation Information</h2>';
                html += '<p><span class="label">Amount of Donation: </span>'
                        + donor.amount_of_donation + '</p>';
                html += '<p><span class="label">Date of Donation: </span>'
                        + donor.date_of_donation + '</p>';
            }

            if (book === null) {
                html += '<p><span class="label">No book information.</span>'
                        + '</p>';
            } else {
                html += '<h2>Book Information</h2>';
                html += '<p><span class="label">Author Name: </span>'
                        + book.author_name + '</p>';
                html += '<p><span class="label">Book Title: </span>'
                        + book.book_title + '</p>';
                html += '<p><span class="label">Bibliographic Number: </span>'
                        + book.bibliographic_number + '</p>';
                html += '<p><span class="label">Call Number: </span>'
                        + book.call_number + '</p>';
            }

            console.log(html);
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

function get_queued_donation(url) {
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);
            let html = '';

            if (donor === null) {
                html += '<p><span class="label">No person making donation.'
                        + '</span>';
            } else {
                html += '<p><span class="label">Person making donation: </span>';
                html += donor.title + ' ' + donor.first_name + ' '
                        + donor.last_name + '</p>';

                if (donor.notes !== null) {
                    html += '<p><span class="label">Notes: </span>'
                            + donor.notes + '</p>';
                }
            }

            if (who_to_notify === null || who_to_notify.length === 0) {
                html += '<p><span class="label">No person to be notified of '
                        + 'donation.</span>';
            } else {
                html += '<p><span class="label">Person(s) to be notified of '
                        + 'donation: </span>';
                for (let i = 0; i < who_to_notify.length; i++) {
                    if (i > 0)
                        html += ', ';
                    html += who_to_notify[i].title + ' '
                            + who_to_notify[i].first_name + ' '
                            + who_to_notify[i].last_name;
                }
                html += '</p>';
            }

            if (recipient === null) {
                html += '<p><span class="label">No person receiving donation.'
                        + '</span>';
            } else {
                html += '<p><span class="label">Person receiving donation: '
                        + '</span>';
                html += recipient.title + ' ' + recipient.first_name + ' '
                        + recipient.last_name + ' (' + recipient.donation_type
                        + ')</p>';
            }

            if (donor === null) {
                html += '<p><span class="label">No date of donation.</span>';
            } else {
                html += '<p><span class="label">Date of donation: </span>'
                        + donor.date_of_donation + '</p>';
            }

            if (donor === null || donor.subject_areas === null
                || donor.subject_areas.length === 0) {
                html += '<p><span class="label">No subject areas selected.</span>'
                       + '</p>';
            } else {
                html += '<p><span class="label">Selected subject areas: </span>';
                for (let i = 0; i < donor.subject_areas.length; i++) {
                    if (i > 0)
                        html += ', ';
                    html += donor.subject_areas[i];
                }
                html += '</p>';
            }

            console.log(html);
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
