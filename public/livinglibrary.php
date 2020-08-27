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
  public function getDonation($donationStatus = "queued", $donationID = NULL)
	{
    $donationStatus = is_string($donationStatus)
                      ? strtolower($donationStatus)
                      : $donationStatus;

    if ($this->isIntegerOrIntegerString($donationID)) {
      $data['pageLoader'] = $donationStatus == "completed"
                            ? "<script>get_donation(true, '"
                            : "<script>get_donation(false, '";
      $data['pageLoader'] .= $donationID . "');</script>";

      $this->load->view('living-library-view', $data);
    } else {
      $this->load->view('living-library-error');
    }
	}

  /**
	 * Loads page for adding to and editing the specified lookup table's records.
   * @param   table     the lookup table to display
	 */
  public function getMenuChoices($table = NULL)
	{
    $table_name = is_string($table)
                  ? strtolower($table)
                  : $table;

    if ($table_name !== NULL) {
      $data['pageLoader'] = "<script>get_menu_choices('" . $table_name .
                            "');</script>";

      $this->load->view('living-library-view', $data);
    } else {
      $this->load->view('living-library-error');
    }

	}

  /**
	 * Loads page for updating or deleting the specified lookup table record.
   * @param   table           the lookup table to display
   * @param   id              the id of the menu choice (i.e. the lookup table
   *                          record id)
	 */
  public function editMenuChoice($table = NULL, $id = NULL)
	{
    $table_name = is_string($table)
                  ? strtolower($table)
                  : $table;

    if ($table_name !== NULL && $this->isIntegerOrIntegerString($id)) {
      $data['pageLoader'] = "<script>edit_menu_choice('" . $table_name . "', '"
                            . $id . "', '" . $table . "');</script>";

      $this->load->view('living-library-view', $data);
    } else {
      $this->load->view('living-library-error');
    }
	}

  /**
   * Checks whether value is an integer or a string representing an integer.
   * @param   {string or integer}  $value   the value to check
   * @returns {boolean}                     true if $value is an integer or a
   *                                        string representing an integer;
   *                                        false otherwise
   */
  function isIntegerOrIntegerString($value)
  {
    return ctype_digit($value) || is_int($value);
  }
}
