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

	/*
	 * Loads Living Library View
	 * If
	 */
	public function index()
	{
    /*
		if($resetSearchCache)
		{
			$this->phpsessions->set('prevSearchResults', null);
		}

		$data['pageLoader'] = "<script>
									searchView.initPage();
									authentication.validateSession();
								</script>";
    */

    	$this->load->view('living-library-view');
    	//echo "<h1 style='margin-top:100px;'>ECHO TEST" . $resetSearchCache . "</h1>";
	}
}
