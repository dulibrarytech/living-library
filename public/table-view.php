

<?php
	ini_set('display_errors', 1);
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

	<meta name="page" content="table-view">

	<!-- end of head-partial.php -->

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

		<!-- Results Table Section -->
		<div id="table-section">

			<div id="jumpTo"></div>

			<!-- Stationary table header -->
			<div class="table table-bordered" id="table-header"></div>

			<!-- Table content section -->
			<div class="container pre-scrollable" id="scroll-section">
	 			<div id="table-content"></div>
			</div>
		</div>

	</div>

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

	<script src="get_donations.js"></script>
	<script>get_donations('true');</script>

	<script>//authentication.validateSession();</script>

</footer>
