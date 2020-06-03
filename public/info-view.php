<?php
	ini_set('display_errors', 1); // Added for testing the Living Library integration.
?>


<head>

	<!-- [if lt IE 7]> <html class="ie6"> <![endif] -->
	<!-- [if IE 7]> <html class="ie7"> <![endif] -->
	<!-- [if IE 8]> <html class="ie8"> <![endif] -->
	<!-- [if gt IE 8]><! -->

	<!--?php $this->load->view("partials/head-partial.php"); ?>-->

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

	<meta name="page" content="info-view">

	<!-- Positioning -->
	<style>
		#add_info_button 			{ margin-left: -8px; margin-top: -10px; }
		/*#add_info_message			{ width: 200px; }*/
		#gen_letter_button			{ margin-left: 0px; margin-top: -10px; }
		#upper_well					{ padding-bottom: 0px; }
		#lower_well					{ padding-bottom: 0px; }
		#description_area			{ width: 455px; height: 100px;}
		#gift_quantity_label		{ margin-left: 5px; }
		#gift_quantity_box			{ margin-left: 5px; }

		#back_button				{ margin-top: -10px; }

		#edit-gift-button			{ margin-left: 18px; margin-top: 20px; }

        #important-checkbox         { margin-left: 0px; margin-top:10px; }
        #skip-letter-checkbox 		{ margin-top: -5px; }
        #skip_gift_label			{ margin-top: -17px; }
        #important_label			{ margin-top:-15px; }

        #username-label				{ margin-right: 20px; }

       /* #add_info_message			{ margin-left: 50px; }*/
	</style>

</head>


<header id="header-bar">
	<!--?php $this->load->view("partials/header-bar.php"); ?>-->

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

	</div>

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
		<!--?php $this->load->view("partials/menu-bar.php"); ?>-->

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
			                  <a href="#">Donation Form</a>
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

		<form id="donor-input-form" method="post">
			<div class="well donor-info-form-section" id="upper_well">

				<table class="table">

					<tr>
						<td>
							<label for="title-edit-box" class="form-label-text" id="title-label">Title:</label>
							<div id="dropdown-box"></div>

							<input type="text" class="input-medium" id="title-edit-box" placeholder="Enter new title:" />
						</td>

						<td>
							<label for="fname_input_box" class="form-label-text">First Name:</label>
							<input type="text" id="fname_input_box" class="input_form-default" name="fName"/>
						</td>

						<td>
							<label for="lName_input_box" class="form-label-text">Last Name:</label>
							<input type="text" id="lName_input_box" class="input_form-default" name="lName"/>
						</td>
					</tr>

					<tr>
						<td>
							<label for="org_input_box" class="form-label-text">Organization:</label>
							<input type="text" id="org_input_box" class="input_form-default" name="org"/>
						</td>
						<td>
							<label for="addr1_input_box" class="form-label-text">Address 1:</label>
							<input type="text" id="addr1_input_box" class="input_form-default" name="addr1"/>
						</td>

						<td>
							<label for="addr2_input_box" class="form-label-text">Address 2:</label>
							<input type="text" id="addr2_input_box" class="input_form-default" name="addr2"/>
						</td>
					</tr>

					<tr>
						<td>
							<label for="city_input_box" class="form-label-text">City:</label>
							<input type="text" id="city_input_box" class="input_form-default" name="city"/>
						</td>

						<td>
							<label for="state_input_box" class="form-label-text">State:</label>
							<input type="text" id="state_input_box" class="input-medium" name="state"/>
						</td>

						<td>
							<label for="zip_input_box" class="form-label-text">Zip:</label>
							<input type="text" id="zip_input_box" class="input-small" name="zip"/>
						</td>
					</tr>

					<tr>
						<td>
							<label for="country_input_box" class="form-label-text">Country:</label>
							<input type="text" id="country_input_box" class="input_form-default" name="country" value="USA"/>
						</td>

						<td>
							<label for="phone_input_box" class="form-label-text">Phone:</label>
							<input type="text" id="phone_input_box" class="input_form-default" name="phone"/>
						</td>

						<td>
							<label for="email_input_box" class="form-label-text">Email:</label>
							<input type="text" id="email_input_box" class="input_form-default" name="email"/>
						</td>
					</tr>

				</table>

			</div>

			<div class="well donor-info-form-section" id="lower_well">
				<table class="table">

					<tr>
						<td class="span7" rowspan="2">
							<label for="description_area" class="form-label-text">Gift Description:</label>
							<textarea class="textarea" id="description_area" name="giftDescription"></textarea>
						</td>
						<td class="span2">
							<!-- Spacer -->
						</td>
						<td class="span3">
							<label for="gift-date-box" class="form-label-text" id="gift_date_label">Select Gift:</label>
							<input type="text" class="input-small" id="gift-date-box" name="giftDate"/>

							<div id="gift-date-box-section"></div>
						</td>

						<td class="span3">
							<label for="gift_quantity_box" class="form-label-text" id="gift_quantity_label" for="gift_quantity_box">Gift Quantity:</label>
							<input type="text" class="input-small" id="gift_quantity_box" name="giftQuantity"/>
						</td>
					</tr>

					<tr>
						<td id="important_gift_check" colspan="2" rowspan="2">
                                <div id="skip-letter-check-box">
                                    <input type='hidden' name='skipLetterFlag' value="0"/>
                                    <input type="checkbox" name="skipLetterFlag" id="skip-letter-checkbox" value="1"></input>
                                    <label for="skip-letter-checkbox" class="form-label-text left-edge-field" id="skip_gift_label">Bypass Letter Request</label>
                                </div>
                                <div>
                                <div id="important-check-box"> <!-- this is not directly related to the important_gift_check td ID -->
                                    <input type='hidden' name='importantFlag' value="0"/>
                                    <input type="checkbox" name="importantFlag" id="important-checkbox" value="1"></input>
                                    <label for="important-checkbox" class="form-label-text left-edge-field" id="important_label">Hand-Typed Letter</label>
                                </div>
                            </td>
						<td>
							<button type="button" class="btn" id="edit-gift-button">Edit Gift</button>
						</td>
					</tr>
				</table>
			</div>

			<!-- This table creates a row with the submit button and an 'adding donor info' status message to the right of the button-->
			<table class="table lower_controls"><tr>
				<td class="span1"><button type="submit" class="btn-grey" id="add_info_button">Save</button></td>
				<td class="span1"><button type="button" class="btn-grey" id="back_button">Back</button></td>
				<td class="span1"><button type="button" class="btn-grey" id="gen_letter_button">Letter</button></td>
				<td class="span9"><div id="add_info_message"></div></td>
				<!--td class=""><input type="checkbox" id="add_gift_checkbox" name="addGiftCheckbox">&nbsp&nbspDo not add a gift at this time</input></td></tr-->
			</table>
		</form>

	</div>

	<div class="copyright-text">
		<p>University of Denver, University Libraries &copy2013</p>
	</div>

</body>


<footer id="footer-bar">
	<!--?php $this->load->view("partials/footer-bar.php"); ?-->

	<!--Load javascript functions-->
	<!--?php $this->load->view("partials/javascript-partial.php"); ?>-->

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
	<!-- $pageLoader loads editDonorView.initPage() -->
	<!-- Added for the Living Library integration -->
	<?php
			/* Any security issues with using $_SERVER['REQUEST_URI']?
			 * I read that "using this code has security implications. The client can
			 * set ... REQUEST_URI to any arbitrary value it wants"
			 * (https://stackoverflow.com/questions/6768793/get-the-full-url-in-php).
			 */
			$uri_components = parse_url($_SERVER['REQUEST_URI']);
			parse_str($uri_components['query'], $params);
	?>

	<script src="get_donations.js"></script>
	<script>
			get_donation(<?php echo $params['is_completed']; ?>,
									 <?php echo $params['id']; ?>);
	</script>

</footer>
