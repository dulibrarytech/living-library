<!doctype html>
<html lang="en">
<head>
<title>| 5</title>

	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/css/bootstrap.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo base_url();?>assets/css/main.css" />

</head>

<body>

    <div class="container bannersNav" id="nav-bar" role="navigation" aria-label="Main">
        <!--section id="page-banners"-->
        <ul class="nav nav-tabs">
            <li class="navbar-item"><a class="active" title="Application Home" href="<?php echo base_url();?>index.php/search">Search</a></li>

            <li class="navbar-item"><a title="Browse Donors" href="<?php echo base_url();?>index.php/search/browseDonors">Browse Donors</a></li>

            <li class="navbar-item"><a title="" href="<?php echo base_url();?>index.php/edit/addDonorView">Add Donor Info</a></li>

            <li class="navbar-item"><a title="New Gift" href="<?php echo base_url();?>index.php/edit/addGiftView/1">Anonymous Gift</a></li>

            <li class="navbar-item"><a title="Statistics" href="<?php echo base_url();?>index.php/search/statisticsView">Statistics</a></li>

						<!-- Living Library integration -->
						<li class="navbar-item dropdown">
								<a title="Living Library" tabindex="0" aria-haspopup="true">Living Library</a>
								<ul class="dropdown-content" aria-label="submenu">
										<li><a href="<?php echo base_url();?>index.php/livinglibrary/createDonation">Donation Form</a></li>
										<li><a href="<?php echo base_url();?>index.php/livinglibrary/getDonations/queued">Donation Queue</a></li>
										<li><a href="<?php echo base_url();?>index.php/livinglibrary/getDonations/completed">Completed Donations</a></li>
										<li><a href="<?php echo base_url();?>index.php/livinglibrary/getMenuChoices/subjectArea">Subject Areas</a></li>
										<li><a href="<?php echo base_url();?>index.php/livinglibrary/getMenuChoices/title">Titles</a></li>
										<li><a href="<?php echo base_url();?>index.php/livinglibrary/getMenuChoices/relationship">Relationships</a></li>
								</ul>
						</li>

            <li class="navbar-item" id="logout-link" style="border: none;"><a title="Logout" href="#" onclick="authentication.logout();">Logout</a></li> <!-- call controller -->

        </ul>
        <!--/section-->
    </div>

</body>
</html>
