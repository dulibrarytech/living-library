function get_donations(is_completed) {
    const url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            let html = '<table>';
            html += '<tr>';
            html += is_completed === 'false'
                    ? '<th>Book Plate Form</th>'
                    : '<th>Full Record</th>'
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
                html += '<td><a href="#" onclick="get_donation('
                        + data[i].is_completed + ', ' + data[i].id + ')">'
                        + data[i].id + '</a></td>';
                html += '<td>' + data[i].id + '</td>';
                html += '<td>' + donor.title + ' ' + donor.first_name + ' '
                        + donor.last_name + '</td>';
                html += '<td>' + recipient.title + ' ' + recipient.first_name + ' '
                        + recipient.last_name + '</td>';
                html += '<td>' + donor.date_of_donation + '</td>';
                html += '</tr>';
            }
            html += '</table>';
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

    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);
            let html = '<p><span class="label">Person making donation: </span>';
            html += donor.title + ' ' + donor.first_name + ' '
                    + donor.last_name + '</p>';
            if (donor.notes !== null) {
                html += '<p><span class="label">Notes: </span>'
                        + donor.notes + '</p>';
            }
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
            html += '<p><span class="label">Person receiving donation: </span>';
            html += recipient.title + ' ' + recipient.first_name + ' '
                    + recipient.last_name + ' (' + recipient.donation_type
                    + ')</p>';
            html += '<p><span class="label">Date of donation: </span>'
                    + donor.date_of_donation + '</p>';
            if (donor.subject_areas === null) {
                html+= '<p><span class="label">No subject areas selected</span></p>'
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
