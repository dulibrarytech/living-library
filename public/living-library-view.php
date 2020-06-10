

<?php
	ini_set('display_errors', 1); // Added for testing the Living Library integration.
?>


<head>

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

				<div class="donor-info-form-section" id="record-content"></div>
				<div id="form-content"></div>

			</div><!--/Table content section -->
		</div>

	</div><!--/Results Table Section -->

	<div class="copyright-text">
		<p>University of Denver, University Libraries &copy2013</p>
	</div>

</body>


<footer id="footer-bar">
	<!--?php $this->load->view("partials/footer-bar.php"); ?-->

	<!--Load javascript functions-->
	<?php $this->load->view("partials/javascript-partial.php"); ?>

	<script>//authentication.validateSession();</script>

	<!-- Run page loader for requested page (set in CI controller) -->
	<!--?php echo $pageLoader; ?-->

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

	<!-- No is_completed parameter in URL causes an "Uncaught SyntaxError:
			 Unexpected token". Also, if the is_completed value is a string and it's
		   not surrounded by quotes, then this causes an "Uncaught ReferenceError:
			 [parameter value] is not defined". If the is_completed value is a string
			 (i.e. it's surrounded by quotes), then the model will handle the string
			 value, whether valid or invalid.

			 Both of these errors occur because get_donations() doesn't have a valid
		   parameter value (but get_donations() is built to handle any or no
			 parameter value), so they seem to be caused from this PHP page (not from
			 get_donations()). Perhaps we should only call get_donations() if we have
			 a valid parameter value, i.e. 0, false, 1, or true. However, we could
		 	 also try checking the parameter first and only changing it enough to
		 	 prevent the error messages (since get_donations() can take care of the
		 	 full validation behavior). -->
	<script>
			get_donations(<?php echo $params['is_completed']; ?>);
	</script>

</footer>
