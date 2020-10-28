

<?php
	ini_set('display_errors', 1); // Added for testing the Living Library integration.
?>


<head>
	<meta charset="utf-8" />

	<!-- [if lt IE 7]> <html class="ie6"> <![endif] -->
	<!-- [if IE 7]> <html class="ie7"> <![endif] -->
	<!-- [if IE 8]> <html class="ie8"> <![endif] -->
	<!-- [if gt IE 8]><! -->

	<?php $this->load->view("partials/head-partial.php"); ?>

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
	<?php $this->load->view("partials/header-bar.php"); ?>
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
		<?php $this->load->view("partials/menu-bar.php"); ?>

		<table style="width: 100%"><tr>
			<td>
				<div class="container generic-label" id="page-label">Living Library</div>
			</td>
			<td align="right" style="text-align: right;">
				<div class="small-label" id="username-label"></div>
			</td>
		</tr></table>

		<!-- Content Section -->
		<div class="generic-label error">Error loading page</div>
		<div class="error-block">
			For help, contact the
			<a href="https://library.du.edu/contact/department-directory.html">
				Digital Infrastructure &amp; Technology Coordinator in Library
				Technology Services</a>.
		</div>
		<!--/Content Section -->

	</div><!--/Main Content Window -->

	<div class="copyright-text">
		<p>University of Denver, University Libraries &copy2013</p>
	</div>

</body>


<footer id="footer-bar">
	<!--?php $this->load->view("partials/footer-bar.php"); ?-->

	<!--Load javascript functions-->
	<?php $this->load->view("partials/javascript-partial.php"); ?>

	<!-- Run page loader for requested page (set in CI controller) -->
	<!--?php if ($pageLoader) echo $pageLoader; ?> -->

</footer>
