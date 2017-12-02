<?php

class  MYREST_Controller  extends  MY_Controller  {

    
    
    function __construct ()  {
        parent::__construct();

        $allow_override     = $this->config->item("auth_override_class_method_http");
        $current_controller = $this->router->fetch_class();
        $current_method     = $this->router->fetch_method();

        if(array_key_exists($current_controller, $allow_override) &&
          (array_key_exists($current_method,$allow_override[$current_controller]) ||
            array_key_exists("*",$allow_override[$current_controller]))  
          )
        {
            //by pass method
        }
        else{
             $this->basic_auth();
        }
       
    }
    
    function basic_auth()
    {
    	$session_key = $this->input->get_request_header(AUTH_KEY);//session_id();//
    	$this->load->model("auth/Auth_model");
    	$session_data=  $this->Auth_model->get_single_row("admin_id",ACTIVE_ADMIN_LOGIN,array("session_key" => $session_key));

    	if(!isset($session_data['admin_id']))
    	{
    		$this->api_response["response_code"]= self::HTTP_INTERNAL_SERVER_ERROR;
	        $this->api_response["data"]         = array();
	        $this->api_response["global_error"] ="session key expired.";
	        $this->api_response["message"]      = "";
	        $this->response($this->api_response,$this->api_response["response_code"]);
    	}

      
    	 $key = $this->Auth_model->check_auth_key($session_data["admin_id"]);

        if($key == false)
        {
            $this->api_response["response_code"] = self::HTTP_INTERNAL_SERVER_ERROR;
            $this->api_response["global_error"] = "Session expired.";
            $this->response($this->api_response,$this->api_response["response_code"]);
            
        }

        
        $user_data=  $this->Auth_model->get_single_row("*",ADMIN,array("admin_id" => $session_data['admin_id']));


        if(!empty($user_data))
        {
        	$this->admin_id  = $user_data['admin_id'];
        	$this->user_email  = $user_data['email'];
        	
        }
        else
        {
        	$this->api_response["response_code"] = 401;
            $this->api_response["global_error"] = "Unauthorized!";
            $this->response($this->api_response,$this->api_response["response_code"]);
        }
    }
    
    
    
    
//...
}