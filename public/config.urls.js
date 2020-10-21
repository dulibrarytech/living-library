/*
 * Donor Application
 *
 * paths
 *
 * Author:
 *
 * University of Denver, June 2013
 */

var pathArray = window.location.href.split( '/' );
var baseUrl = "";
if(pathArray[2] == "localhost") {
	// baseUrl     = "http://" + document.domain + "/donordb/";
	baseUrl     = "https://" + document.domain + "/donordb/";
}
else {

	baseUrl     = "https://" + document.domain + "/";
}

var _editUrl   			= baseUrl + "index.php/edit";
var _searchUrl  		= baseUrl + "index.php/search";
var _loginUrl			= baseUrl + "index.php/login";
var _logoutUrl  		= baseUrl + "index.php/login/logout";
var _statsUrl   		= baseUrl + "index.php/search/statisticsView";
var _statsSearchUrl  	= baseUrl + "index.php/search/statisticsSearch";

var EDIT_VIEW	= baseUrl + "index.php/views/edit-view.php";

var _serverErrorView = baseUrl + "html/server_error.html";

/* Living Library integration */
var _getQueuedDonationsUrl = "index.php/livinglibrary/getDonations/queued";
var _getDonationUrl = "index.php/livinglibrary/getDonation/";
var _getCompletedDonationUrl = _getDonationUrl + "completed/";
var _getMenuChoicesUrl = "index.php/livinglibrary/getMenuChoices/";
var _editMenuChoiceUrl = "index.php/livinglibrary/editMenuChoice/";
