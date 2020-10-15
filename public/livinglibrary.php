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
	 * Loads Living Library Donation Form
	 */
  public function createDonation()
	{
		$data['pageLoader'] = "<script>create_donation();</script>";

		$this->load->view('living-library-view', $data);
	}

  /**
	 * Loads table of Living Library donations (either queued donations or
   * completed donations) based on $donationStatus.
   * Defaults to loading queued donations.
   * @param  {string}   $donationStatus   the type of records to load; either
   *                                      "queued" (the default) or "completed"
	 */
  public function getDonations($donationStatus = "queued")
	{
    $donationStatus = $this->toLowerCaseIfString($donationStatus);

		$data['pageLoader'] = $donationStatus == "completed"
                          ? "<script>get_donations(true);</script>"
                          : "<script>get_donations(false);</script>";

		$this->load->view('living-library-view', $data);
	}

  /**
	 * Loads individual Living Library donation record.
   * For a queued donation, it loads the book plate form.
   * For a completed donation, it loads the full record view.
   * Defaults to loading the book plate form.
   * @param  {string}  $donationStatus   the type of records to load; either
   *                                     "queued" (the default) or "completed"
   * @param  {number}  $donationID       the ID of the donation record
	 */
  public function getDonation($donationStatus = "queued", $donationID = NULL)
	{
    $donationStatus = $this->toLowerCaseIfString($donationStatus);

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
   * @param   {string}    $table     the lookup table to display
	 */
  public function getMenuChoices($table = NULL)
	{
    $table = $this->toLowerCaseIfString($table);

    if ($table !== NULL) {
      $data['pageLoader'] = "<script>get_menu_choices('" . $table .
                            "');</script>";

      $this->load->view('living-library-view', $data);
    } else {
      $this->load->view('living-library-error');
    }

	}

  /**
	 * Loads page for updating or deleting the specified lookup table record.
   * @param   {string}    $table     the lookup table to display
   * @param   {number}    $id        the ID of the menu choice (i.e. the lookup
   *                                 table record ID)
	 */
  public function editMenuChoice($table = NULL, $id = NULL)
	{
    $table_lowercase = $this->toLowerCaseIfString($table);

    if ($table_lowercase !== NULL && $this->isIntegerOrIntegerString($id)) {
      $data['pageLoader'] = "<script>edit_menu_choice('" . $table_lowercase
                            . "', '" . $id . "', '" . $table . "');</script>";

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

  /**
   * Converts $value to lowercase if it's a string.
   * @param   {string or other data type}  $value   the value to be made
   *                                                lowercase (if it's a string)
   * @returns {same data type as $value}            $value (if not a string);
   *                                                otherwise, the lowercase
   *                                                string
   */
  function toLowerCaseIfString($value)
  {
    return is_string($value) ? strtolower($value) : $value;
  }
}
