

<?php
	ini_set('display_errors', 1); // Added for testing the Living Library integration.
?>


<head>

	<!-- [if lt IE 7]> <html class="ie6"> <![endif] -->
	<!-- [if IE 7]> <html class="ie7"> <![endif] -->
	<!-- [if IE 8]> <html class="ie8"> <![endif] -->
	<!-- [if gt IE 8]><! -->

	<!--?php $this->load->view("../application/views/partials/head-partial.php"); ?>-->

	<!-- App title text -->
	<link href='https://fonts.googleapis.com/css?family=Lusitana' rel='stylesheet' type='text/css'>

	<link rel="stylesheet" type="text/css" href="http://localhost/donordb/assets/css/bootstrap.css" />
	<link rel="stylesheet" type="text/css" href="http://localhost/donordb/assets/css/main.css" />
	<link rel="stylesheet" href="http://localhost/donordb/assets/css/jquery-ui.css" />

	<!-- DU Sheild favicon -->
	<link rel="shortcut icon" href="http://localhost/donordb/img/kwak_favicon.ico" />

	<!-- Add fancyBox -->
	<link rel="stylesheet" href="http://localhost/donordb/libs/fancyBox/source/jquery.fancybox.css" type="text/css" media="screen" />

	<!-- end of head-partial.php -->

	<meta name="page" content="table-view">

	<!-- Positioning -->
	<style>
		#lname_label 		{ margin-left: 25px; }
		#lname_input_box 	{ margin-top:  9px; margin-left: 25px; }
		#date_label 		{ margin-left: 25px; padding-bottom: 9px }
		#fromDate			{ margin-left: 25px; }
		#toDate				{ margin-left: 85px; }
		#search_submit		{ margin-left: 475px; margin-bottom: 9px; }
		#username-label		{ margin-right: 20px; }
		#page-label			{ margin-bottom: -10px; }
	</style>

</head>


<header id="header-bar">
	<!--?php $this->load->view("../application/views/partials/header-bar.php"); ?>-->

	<!doctype html>
	<html lang="en">
	<head>
	<title>| 5</title>

		<link rel="stylesheet" type="text/css" href="http://localhost/donordb/assets/css/bootstrap.css" />
		<link rel="stylesheet" type="text/css" href="http://localhost/donordb/assets/css/main.css" />

		<!-- Added for the Living Library integration -->
		<!-- needed for dropdown navbar menu -->
		<link rel="stylesheet" type="text/css" href="living-library.css" />

	</head>

	<body>

	<div id="container" class="container">
	<div id="top-nav">

	    <div class="navbar-wrapper" style="z-index: -1;">
	        <div class="navbar navbar-fixed-top">
	            <div class="navbar-inner" id="header-bar-base">
	                <div class="container">
	                    <img alt="du logo full" id="logo" width="140" height="40" src="http://localhost/donordb/img/du-logo.gif" />
						<span class="pull-right smalltext" style="text-align: right;" />
	                </div> <!-- /container -->
	            </div>
	        </div> <!-- /navbar -->
	    </div> <!-- /navbar-wrapper -->

	</div> <!--/topnav -->

	</body>

	<!-- end of header-bar.php -->
</header>


<body>

	<!-- Title Box text -->
	<div id="app-title" class="container">
		<div class="container">
			<div id="app-title-box">
				|5
			</div>
		</div>
	</div>

	<!-- Main Content Window -->
	<div class="container content-window">

		<!-- Menu Bar -->
		<!--?php $this->load->view("../application/views/partials/menu-bar.php"); ?>-->

		<!doctype html>
		<html lang="en">
		<head>
		<title>| 5</title>

			<link rel="stylesheet" type="text/css" href="http://localhost/donordb/assets/css/bootstrap.css" />
			<link rel="stylesheet" type="text/css" href="http://localhost/donordb/assets/css/main.css" />

		</head>

		<body>

		    <div class="container bannersNav" id="nav-bar">
		        <!--section id="page-banners"-->
		        <ul class="nav nav-tabs">
		            <li class="navbar-item"><a class="active" title="Application Home" href="http://localhost/donordb/index.php/search">Search</a></li>

		            <li class="navbar-item"><a title="Browse Donors" href="http://localhost/donordb/index.php/search/browseDonors">Browse Donors</a></li>

		            <li class="navbar-item"><a title="" href="http://localhost/donordb/index.php/edit/addDonorView">Add Donor Info</a></li>

		            <li class="navbar-item"><a title="New Gift" href="http://localhost/donordb/index.php/edit/addGiftView/1">Anonymous Gift</a></li>

		            <li class="navbar-item"><a title="Statistics" href="http://localhost/donordb/index.php/search/statisticsView">Statistics</a></li>

								<!-- Added for the Living Library integration -->
								<li class="navbar-item dropdown">
			              <a title="Living Library">Living Library</a>
			              <div class="dropdown-content">
			                  <a href="donation-form.php">Donation Form</a>
			                  <a href="table-view.php?is_completed=false">Donation Queue</a>
			                  <a href="table-view.php?is_completed=true">Completed Donations</a>
			              </div>
			          </li>

		            <li class="navbar-item" id="logout-link" style="border: none;"><a title="Logout" onclick="authentication.logout();">Logout</a></li> <!-- call controller -->

		        </ul>
		        <!--/section-->
		    </div>

		</body>
		</html>

		<!-- end of menu-bar.php -->

		<table style="width: 100%"><tr>
			<td>
				<div class="container generic-label" id="page-label"></div>
			</td>
			<td align="right" style="text-align: right;">
				<div class="small-label" id="username-label"></div>
			</td>
		</tr></table>

		<!-- Record Section -->
		<div id="results-section">

			<!-- Record Content Section -->
			<div class="container pre-scrollable" id="scroll-section">

				<div class="donor-info-form-section" id="record-content"></div>

				<div>
					<form id="donor-input-form" method="post">

						<table class="table">
							<tr>
								<td><h4>Person making donation</h4></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>
									<label for="donor_title_dropdown" class="form-label-text">Title:</label>

									<select class='input-medium' id='donor_title_dropdown' name='donor_title'>
										<option value='' selected>--Select a title--</option>
										<option value='Ms.'>Ms.</option>
										<option value='Mr.'>Mr.</option>
									</select>
								</td>

								<td>
									<label for="donor_first_name_input_box" class="form-label-text">First Name:</label>
									<input type="text" id="donor_first_name_input_box" class="input_form-default" name="donor_first_name"/>
								</td>

								<td>
									<label for="donor_last_name_input_box" class="form-label-text">Last Name:</label>
									<input type="text" id="donor_last_name_input_box" class="input_form-default" name="donor_last_name"/>
								</td>
							</tr>

							<tr>
								<td>
									<label for="donor_address_input_box" class="form-label-text">Address:</label>
									<input type="text" id="donor_address_input_box" class="input_form-default" name="donor_address"/>
								</td>

								<td>
									<label for="donor_city_input_box" class="form-label-text">City:</label>
									<input type="text" id="donor_city_input_box" class="input_form-default" name="donor_city"/>
								</td>

								<td>
									<label for="donor_state_dropdown" class="form-label-text" id="state-label">State:</label>

									<!-- delete this div if you're not going to use it - note that the id is not unique -->
									<div id="dropdown-box"></div>

									<select class='input-medium' id='donor_state_dropdown' name='donor_state'>
										<option value=''>Select a state</option>
										<option value='Ms.'>CA</option>
										<option value='Mr.'>CO</option>
									</select>
								</td>
							</tr>

							<tr>
								<td>
									<label for="donor_zip_input_box" class="form-label-text">Zip:</label>
									<input type="text" id="donor_zip_input_box" class="input_form-default" name="donor_zip"/>
								</td>

								<td></td>
								<td></td>
							</tr>

						</table>

						<table class="table">

							<tr>
								<td><h4>Person(s) to be notified of donation</h4></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>
									<!-- all the title labels have id="title-lable" - either make this a class or a unique id -->
									<label for="notify_title_dropdown" class="form-label-text" id="title-label">Title:</label>

									<!-- delete this div if you're not going to use it - note that the id is not unique -->
									<div id="dropdown-box"></div>

									<select class='input-medium' id='notify_title_dropdown' name='notify_title'>
										<option value=''>Select a title</option>
										<option value='Ms.'>Ms.</option>
										<option value='Mr.'>Mr.</option>
									</select>
								</td>

								<td>
									<label for="notify_first_name_input_box" class="form-label-text">First Name:</label>
									<input type="text" id="notify_first_name_input_box" class="input_form-default" name="notify_first_name"/>
								</td>

								<td>
									<label for="notify_last_name_input_box" class="form-label-text">Last Name:</label>
									<input type="text" id="notify_last_name_input_box" class="input_form-default" name="notify_last_name"/>
								</td>
							</tr>

							<tr>
								<td>
									<label for="notify_address_input_box" class="form-label-text">Address:</label>
									<input type="text" id="notify_address_input_box" class="input_form-default" name="notify_address"/>
								</td>

								<td>
									<label for="notify_city_input_box" class="form-label-text">City:</label>
									<input type="text" id="notify_city_input_box" class="input_form-default" name="notify_city"/>
								</td>

								<td>
									<label for="notify_state_dropdown" class="form-label-text" id="state-label">State:</label>

									<!-- delete this div if you're not going to use it - note that the id is not unique -->
									<div id="dropdown-box"></div>

									<select class='input-medium' id='notify_state_dropdown' name='notify_state'>
										<option value=''>Select a state</option>
										<option value='Ms.'>CA</option>
										<option value='Mr.'>CO</option>
									</select>
								</td>
							</tr>

							<tr>
								<td>
									<label for="notify_zip_input_box" class="form-label-text">Zip:</label>
									<input type="text" id="notify_zip_input_box" class="input_form-default" name="notify_zip"/>
								</td>

								<td>
									<label for="notify_relation_to_donor_dropdown" class="form-label-text" id="state-label">Relation to Donor:</label>

									<!-- delete this div if you're not going to use it - note that the id is not unique -->
									<div id="dropdown-box"></div>

									<select class='input_form-default' id='notify_relation_to_donor_dropdown' name='notify_relation_to_donor'>
										<option value=''>Select a relation to donor</option>
										<option value='Ms.'>CA</option>
										<option value='Mr.'>CO</option>
									</select>
								</td>

								<td></td>
							</tr>

						</table>

						<table class="table">

							<tr>
								<td><h4>Person receiving donation</h4></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>
									<label for="recipient_title_dropdown" class="form-label-text" id="title-label">Title:</label>
									<div id="dropdown-box"></div>

									<select class='input-medium' id='recipient_title_dropdown' name='recipient_title'>
										<option value=''>Select a title</option>
										<option value='Ms.'>Ms.</option>
										<option value='Mr.'>Mr.</option>
									</select>
								</td>

								<td>
									<label for="recipient_first_name_input_box" class="form-label-text">First Name:</label>
									<input type="text" id="recipient_first_name_input_box" class="input_form-default" name="recipient_first_name"/>
								</td>

								<td>
									<label for="recipient_last_name_input_box" class="form-label-text">Last Name:</label>
									<input type="text" id="recipient_last_name_input_box" class="input_form-default" name="recipient_last_name"/>
								</td>
							</tr>

							<tr>
								<td>
									<div>
										<label for="recipient_donation_type_radio_choice1" class="radio inline">
								      <input type="radio" id="recipient_donation_type_radio_choice1" name="recipient_donation_type" checked>In Honor of
								    </label>
									</div>
									<div>
								    <label for="recipient_donation_type_radio_choice2" class="radio inline">
								      <input type="radio" id="recipient_donation_type_radio_choice2" name="recipient_donation_type">In Memory of
								    </label>
									</div>
								</td>

								<td></td>

								<td></td>
							</tr>

						</table>

						<table class="table">

							<tr>
								<td><h4>Donation information</h4></td>
								<td></td>
								<td></td>
							</tr>

							<tr>
								<td>
									<label for="donor_amount_of_donation_input_box" class="form-label-text">Amount of Donation (e.g. 100.00):</label>
									<input type="text" id="donor_amount_of_donation_input_box" class="input_form-default" name="donor_amount_of_donation"/>
								</td>
								<td>
									<label for="gift-date-box" class="form-label-text" id="gift_date_label">Donation Date:</label>
									<input type="text" class="input_form-default" id="gift-date-box" name="donor_date_of_donation"/>

									<div id="gift-date-box-section"></div>
								</td>

								<td>
									<label for="donor_notes_textarea" class="form-label-text">Notes:</label>
									<textarea class="input_form-default" id="donor_notes_textarea" name="donor_notes"></textarea>
								</td>
							</tr>

						</table>

						<table class="table">

							<tr>
								<td><h4>Subject areas</h4></td>
								<td></td>
							</tr>

							<tr>
								<td>
									<label for="inlineCheckbox1" class="checkbox inline">
										<input type="checkbox" id="inlineCheckbox1" value="option1"/>Information Science
									</label>
								</td>

								<td>
									<label for="inlineCheckbox2" class="checkbox inline">
										<input type="checkbox" id="inlineCheckbox2" value="option2"/>Computer Science
									</label>
								</td>
								<!--
								This adds too much space between checkbox and label:
								<td>
									<input type="checkbox" id="inlineCheckbox3" value="option3"/>
									<label for="inlineCheckbox3" class="checkbox inline">3</label>
								</td>

								<td>
									<input type="checkbox" id="inlineCheckbox4" value="option4"/>
									<label for="inlineCheckbox4" class="checkbox inline">4</label>
								</td>

								Original checkbox code:
								<td id="important_gift_check" colspan="2" rowspan="2">
								<div id="skip-letter-check-box">
                    <input type='hidden' name='skipLetterFlag' value="0"/>
                    <input type="checkbox" name="skipLetterFlag" id="skip-letter-checkbox" value="1"></input>
                    <label for="skip-letter-checkbox" class="form-label-text left-edge-field" id="skip_gift_label">Bypass Letter Request</label>
                </div>

								Online example code:
								<label class="checkbox inline">
									<input type="checkbox" id="inlineCheckbox1" value="option1"> 1
								</label>
								<label class="checkbox inline">
									<input type="checkbox" id="inlineCheckbox2" value="option2"> 2
								</label>
								<label class="checkbox inline">
									<input type="checkbox" id="inlineCheckbox3" value="option3"> 3
								</label>
								</td>
								-->
							</tr>

							<tr>
								<td>
									<label for="inlineCheckbox1" class="checkbox inline">
										<input type="checkbox" id="inlineCheckbox1" value="option1"/>Geography
									</label>
								</td>

								<td>
									<label for="inlineCheckbox2" class="checkbox inline">
										<input type="checkbox" id="inlineCheckbox2" value="option2"/>Art
									</label>
								</td>
							</tr>

							<tr>
								<td>
									<label for="inlineCheckbox1" class="checkbox inline">
										<input type="checkbox" id="inlineCheckbox1" value="option1"/>Music
									</label>
								</td>

								<td>
									<label for="inlineCheckbox2" class="checkbox inline">
										<input type="checkbox" id="inlineCheckbox2" value="option2"/>Political Science/International Relations
									</label>
								</td>
							</tr>

						</table>

						<table class="table lower_controls"><tr>
							<td class="span1"><button type="submit" class="btn-grey" id="save_book_plate_button" onclick="save_book_plate(event);">Send to Queue</button></td>
						</table>

					</form>
				</div>

			</div><!--/Record Content Section-->
		</div><!--/Record Section -->
	</div><!--/Main Content Window -->

	<div class="copyright-text">
		<p>University of Denver, University Libraries &copy2013</p>
	</div>

</body>


<footer id="footer-bar">
	<!--?php $this->load->view("partials/footer-bar.php"); ?-->

	<!--Load javascript functions-->
	<!--?php $this->load->view("../application/views/partials/javascript-partial.php"); ?>-->

	<!-- JQuery -->
	<script src="http://localhost/donordb/assets/js/jquery-1.9.1.js"></script>
	<script src="http://localhost/donordb/assets/js/jquery-ui.js"></script>
	<script src="http://localhost/donordb/assets/js/jquery.js"></script>
	<script src="http://localhost/donordb/assets/js/jquery.validate.js"></script>
	<script src="http://localhost/donordb/assets/js/jquery-scrollto.js"></script>
	<script src="http://localhost/donordb/assets/js/jquery-migrate-1.2.1.js"></script>
	<script src="http://localhost/donordb/libs/jquery.scrollTo-1.4.3.1-min.js"></script>

	<!-- Site Operations -->
	<script src="http://localhost/donordb/libs/donorDB/config.urls.js"></script>
	<script src="http://localhost/donordb/libs/donorDB/utils.js"></script>
	<script src="http://localhost/donordb/libs/donorDB/loginForm.js"></script>

	<!--script src="<?php //echo base_url();?>libs/donorDB/tables.js"></script-->
	<!--script src="<?php //echo base_url();?>libs/donorDB/authentication.js"></script>-->
	<script src="http://localhost/donordb/libs/donorDB/letter.js"></script>
	<script src="http://localhost/donordb/libs/donorDB/form.js"></script>

	<!-- Page Load Scripts -->
	<script src="http://localhost/donordb/libs/donorDB/views.js"></script>

	<!-- External Libs -->
	<script src="http://localhost/donordb/libs/dateUtils.js"></script>
	<script type="text/javascript" src="http://localhost/donordb/libs/fancyBox/source/jquery.fancybox.pack.js"></script>

	<!-- end of javascript-partial.php -->

	<script>//authentication.validateSession();</script>

	<!-- Run page loader for requested page (set in CI controller) -->
	<!--?php echo $pageLoader; ?>-->
	<!-- $pageLoader loads browseDonorsView.initPage() -->

	<!-- Added for the Living Library integration -->
	<script src="get_donations.js"></script>
	<script src="post-form-data.js"></script>

	<script>//authentication.validateSession();</script>

</footer>
