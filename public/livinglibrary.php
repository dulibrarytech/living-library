<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/*
 * Donor Application
 *
 * Living Library functions
 *
 * Author: Scott Salvaggio
 *
 * University of Denver, June 2020
 */
class LivingLibrary extends CI_Controller {

  function __construct()
  {
      parent::__construct();
      $this->load->helper('url');
      $this->load->helper('sanitizer_helper');
  }

	/**
	 * Loads Living Library default page (i.e. the Donation Queue)
	 */
	public function index()
	{
    $data['pageLoader'] = "<script>get_donations(false);</script>";

    $this->load->view('living-library-view', $data);
	}

  /**
	 * Loads Living Library: Donation Form
	 */
  public function createDonation()
	{
		$data['pageLoader'] = "<script>create_donation();</script>";

		$this->load->view('living-library-view', $data);
	}

  /**
	 * Loads table of Living Library donations (either queued donations or
   * completed donations) based on $donationStatus.
   * @param   donationStatus   either "queued" (the default) or "completed"
	 */
  public function getDonations($donationStatus = "queued")
	{
    $donationStatus = is_string($donationStatus)
                      ? strtolower($donationStatus)
                      : $donationStatus;

		$data['pageLoader'] = $donationStatus == "completed"
                          ? "<script>get_donations(true);</script>"
                          : "<script>get_donations(false);</script>";

		$this->load->view('living-library-view', $data);
	}

  /**
	 * Loads individual Living Library donation record. For a queued donation,
   * it loads the book plate form. For a completed donation, it loads the
   * full record view.
   * @param   donationStatus     either "queued" (the default) or "completed"
   * @param   donationID         id of donation record
	 */
  public function getDonation($donationStatus = "queued", $donationID)
	{
    $donationStatus = is_string($donationStatus)
                      ? strtolower($donationStatus)
                      : $donationStatus;

		$data['pageLoader'] = $donationStatus == "completed"
                          ? "<script>get_donation(true, "
                          : "<script>get_donation(false, ";
    $data['pageLoader'] .= $donationID . ");</script>";

		$this->load->view('living-library-view', $data);
	}
}
