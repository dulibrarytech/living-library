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
                            + '<a href="record-view.php?id='
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
            $("#page-label").html('Donation Record');

            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);
            const book = JSON.parse(data[0].book);

            let html = '';

            if (donor === null) {
                html += '<h4>No person making donation.</h4>';
            } else {
                html += '<h4>Person making donation</h4>';
                html += '<dl>';
                html += '<dt>Title: </dt>'
                        + '<dd>' + donor.title + '</dd>';
                html += '<dt>First Name: </dt>'
                        + '<dd>' + donor.first_name + '</dd>';
                html += '<dt>Last Name: </dt>'
                        + '<dd>' + donor.last_name + '</dd>';
                html += '<dt>Address: </dt>'
                        + '<dd>' + donor.address + '</dd>';
                html += '<dt>City: </dt>'
                        + '<dd>' + donor.city + '</dd>';
                html += '<dt>State: </dt>'
                        + '<dd>' + donor.state + '</dd>';
                html += '<dt>Zip: </dt>'
                        + '<dd>' + donor.zip + '</dd>';
                html += '</dl>';
            }

            if (who_to_notify === null) {
                html += '<h4>No person to be notified of donation.</h4>';
            } else {
                html += '<h4>Person(s) to be notified of donation</h4>';
                for (let i = 0; i < who_to_notify.length; i++) {
                    html += '<dl class="name_address_block">';
                    html += '<dt>Title: </dt>'
                            + '<dd>' + who_to_notify[i].title + '</dd>';
                    html += '<dt>First Name: </dt>'
                            + '<dd>' + who_to_notify[i].first_name + '</dd>';
                    html += '<dt>Last Name: </dt>'
                            + '<dd>' + who_to_notify[i].last_name + '</dd>';
                    html += '<dt>Address: </dt>'
                            + '<dd>' + who_to_notify[i].address + '</dd>';
                    html += '<dt>City: </dt>'
                            + '<dd>' + who_to_notify[i].city + '</dd>';
                    html += '<dt>State: </dt>'
                            + '<dd>' + who_to_notify[i].state + '</dd>';
                    html += '<dt>Zip: </dt>'
                            + '<dd>' + who_to_notify[i].zip + '</dd>';
                    html += '<dt>Relation to Donor: </dt>'
                            + '<dd>' + who_to_notify[i].relation_to_donor + '</dd>';
                    html += '</dl>';
                }
            }

            if (recipient === null) {
                html += '<h4>No person receiving donation.</h4>';
            } else {
                html += '<h4>Person receiving donation</h4>';
                html += '<dl>';
                html += '<dt>Title: </dt>'
                        + '<dd>' + recipient.title + '</dd>';
                html += '<dt>First Name: </dt>'
                        + '<dd>' + recipient.first_name + '</dd>';
                html += '<dt>Last Name: </dt>'
                        + '<dd>' + recipient.last_name + '</dd>';
                html += '<dt>Donation Type: </dt>'
                        + '<dd>' + recipient.donation_type + '</dd>';
                html += '</dl>';
            }

            if (donor === null) {
                html += '<h4>No donation date or amount.</h4>';
            } else {
                html += '<h4>Donation Information</h4>';
                html += '<dl>';
                html += '<dt>Amount of Donation: </dt>'
                        + '<dd>' + donor.amount_of_donation + '</dd>';
                html += '<dt>Date of Donation: </dt>'
                        + '<dd>' + donor.date_of_donation + '</dd>';
                html += '</dl>';
            }

            if (book === null) {
                html += '<h4>No book information.</h4>';
            } else {
                html += '<h4>Book Information</h4>';
                html += '<dl>';
                html += '<dt>Author Name: </dt>'
                        + '<dd>' + book.author_name + '</dd>';
                html += '<dt>Book Title: </dt>'
                        + '<dd>' + book.book_title + '</dd>';
                html += '<dt>Bibliographic Number: </dt>'
                        + '<dd>' + book.bibliographic_number + '</dd>';
                html += '<dt>Call Number: </dt>'
                        + '<dd>' + book.call_number + '</dd>';
                html += '</dl>';
            }

            console.log(html);
            let id = document.querySelector('#record-content');

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
            $("#page-label").html('Book Plate Form');

            const donor = JSON.parse(data[0].donor);
            const who_to_notify = JSON.parse(data[0].who_to_notify);
            const recipient = JSON.parse(data[0].recipient);

            let html = '<dl>';

            if (donor === null) {
                html += '<dt>No person making donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Person making donation: </dt>'
                        + '<dd>' + donor.title + ' ' + donor.first_name + ' '
                        + donor.last_name + '</dd>';

                if (donor.notes !== null) {
                    html += '<dt>Notes: </dt>'
                            + '<dd>' + donor.notes + '</dd>';
                }
            }

            if (who_to_notify === null || who_to_notify.length === 0) {
                html += '<dt>No person to be notified of donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Person(s) to be notified of donation: </dt>';
                html += '<dd>';
                for (let i = 0; i < who_to_notify.length; i++) {
                    if (i > 0)
                        html += '; ';
                    html += who_to_notify[i].title + ' '
                            + who_to_notify[i].first_name + ' '
                            + who_to_notify[i].last_name;
                }
                html += '</dd>';
            }

            if (recipient === null) {
                html += '<dt>No person receiving donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Person receiving donation: </dt>'
                        + '<dd>' + recipient.title + ' ' + recipient.first_name
                        + ' ' + recipient.last_name + ' ('
                        + recipient.donation_type + ')</dd>';
            }

            if (donor === null) {
                html += '<dt>No date of donation.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Date of donation: </dt>'
                        + '<dd>' + donor.date_of_donation + '</dd>';
            }

            if (donor === null || donor.subject_areas === null
                || donor.subject_areas.length === 0) {
                html += '<dt>No subject areas selected.</dt>'
                        + '<dd></dd>';
            } else {
                html += '<dt>Selected subject areas: </dt>';
                html += '<dd>';
                for (let i = 0; i < donor.subject_areas.length; i++) {
                    if (i > 0)
                        html += '; ';
                    html += donor.subject_areas[i];
                }
                html += '</dd>';
            }

            html += '</dl>';

            console.log(html);
            let id = document.querySelector('#record-content');

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
