<?php
require APPPATH . '/libraries/REST_Controller.php';

class  MY_Controller  extends  REST_Controller  {

	var $api_response = array();
    var $user_id = NULL;
    var $user_email= NULL;
    var $user_cashback= NULL;
    function __construct ()  {
        parent::__construct();
        $this->load->library('form_validation');
        $this->form_validation->CI =& $this;

        $this->api_response["errors"] = array();
        $this->api_response["message"] = "";
        $this->api_response["response_code"] = 500;
        $this->api_response["global_error"] = "";
        $this->api_response["data"] = array();
    }

    

    public function api_response()
    {
    	$this->response($this->api_response,$this->api_response["response_code"]);
    	
    }
    public function send_validation_errors()
    {
    	$res = array();
    	$error= $this->form_validation->error_array(); 
    	
    	if(empty($error))
 			$error = array();

 		$this->api_response["errors"] = $error;
        $this->api_response["message"] = "";
        $this->api_response["response_code"] = 500;
        $this->api_response["global_error"] = "";
 		
 		if(empty($this->input->post()))
 		{
 			$this->api_response['global_error'] = "Please enter input parameters";
 		}
    	
    	$this->api_response();
    }
//...
}