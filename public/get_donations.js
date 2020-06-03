function get_donations(is_completed) {
    is_completed = validate_is_completed_parameter(is_completed);

    const base_url = 'http://localhost/donordb/living-library';
    const api_url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    fetch(api_url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);

            /*
             * Recreating browseDonorsView.initPage() from libs/donorDB/views.js
             */

            $(".content-window").css("height", "770px");
            $(".pre-scrollable").css("max-height", "485px");

            $("#page-label").text(is_completed
                                  ? "Completed Donations"
                                  : "Donation Queue");

            /* Original donordb code for table-header
             *
            $("#table-header").html("<thead> <th class='span2'><!--SPACE--></th> <th class='span4'>Last Name / Organization</th> <th class='span4'>First Name</th> <th style='align:right'><!--SPACE--></th> </thead>");

            utils.getDonorDataArray(setQueue);
            viewUtils.setUserLabel();
            */

            $("#table-header").html("<thead> " +
                                    "<th class='span1_wider'>" +
                                    (is_completed
                                    ? "Full Record"
                                    : "Book Plate Form") +
                                    "</th> " +
                                    "<th class='span1'>ID</th> " +
                                    "<th class='span4'>Donor Name</th> " +
                                    "<th class='span4'>Recipient Name</th> " +
                                    "<th style='align:right'>Date of Donation</th> " +
                                    "</thead>");

            $("#table-content").html('');
            let html = '';

            if (data.length === 0) {
                html += '<p class="label">No donation records found.</p>';
            } else {
                html += '<table class="table table-bordered table-striped">';
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

                    html += '<td class="span1_wider" style="text-align: center">'
                            + '<a href="info-view.php?id='
                            + data[i].id
                            + '&is_completed=' + data[i].is_completed + '">'
                            + '<img src="' + base_url
                            + (data[i].is_completed
                              ? '/images/application_view_list.png" />'
                              : '/images/application_form.png" />')
                            + '</a>'
                            + '</td>';

                    html += '<td class="span1" style="text-align: center">'
                            + data[i].id + '</td>';

                    html += '<td class="span4 name-cell4">';
                    if (donor !== null) {
                        html += donor.title + ' ' + donor.first_name + ' '
                                + donor.last_name;
                    }
                    html += '</td>';

                    html += '<td class="span4 name-cell4">';
                    if (recipient !== null) {
                        html += recipient.title + ' ' + recipient.first_name
                                + ' ' + recipient.last_name;
                    }
                    html += '</td>';

                    html += '<td style="text-align: center">';
                    if (donor !== null) {
                        html += donor.date_of_donation;
                    }
                    html += '</td>';

                    html += '</tr>';
                }
                html += '</table>';
            }
            console.log(html);

            /*
            let id = document.querySelector('#donations');

            if (id) {
                id.innerHTML = html;
            }
            */
            $("#table-content").html(html);
        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        })
}

function get_donation(is_completed, id) {
    is_completed = validate_is_completed_parameter(is_completed);
    const url = 'http://localhost:8000/api/v1/living-library/donations?is_completed='
                + is_completed + '&id=' + id
                + '&api_key=5JdEkElWVdscN61BIdFGg2G2yt8x5aCR';

    if (is_completed) {
        get_completed_donation(url);
        console.log("Based on URL parameter, this is a completed donation");
    } else {
        get_queued_donation(url);
        console.log("Based on URL parameter, this is a queued donation");
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
            let id = document.querySelector('#table-content');

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
            let id = document.querySelector('#table-content');

            if (id) {
                id.innerHTML = html;
            }
        })
        .catch((error) => {
            console.log('In the catch block');
            console.log(error);
        })
}

 /**
  * Returns a valid boolean value based on is_completed parameter.
  * Defaults to false for any invalid value or type.
  * Any number that is not 1 is considered false.
  * @param is_completed
  */
function validate_is_completed_parameter(is_completed) {
    console.log("before switch, is_completed = " + is_completed);
    switch (typeof is_completed) {
        case 'boolean':
            break;
        case 'number':
            is_completed = is_completed == 1;
            break;
        case 'string':
            is_completed = is_completed.toLowerCase() == 'true' ||
                           is_completed == '1';
            break;
        default:
            is_completed = false;
    }
    console.log("after switch, is_completed = " + is_completed);
    return is_completed;
}
