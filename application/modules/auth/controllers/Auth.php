<?php

class  Auth extends  MYREST_Controller  {

    function __construct ()  {

       
        parent::__construct();
        $_POST= $this->post();
        $this->load->model('Auth_model');

    }
    
    public function signup_post()
    {
        $post_data = $this->input->post();
        if ($this->form_validation->run('auth/signup') == FALSE)
        {
            $this->send_validation_errors();
        }

        $userData = array(
            "first_name" => $post_data['first_name'],
            "last_name" => $post_data['last_name'],
            "email" => $post_data['email'],
            "password" => md5($post_data['password']) ,
            "dob" => date("Y-m-d",strtotime($post_data['dob'])),
            );

        $insert_id = $this->Auth_model->registration($userData);

        $this->api_response["response_code"] = self::HTTP_OK;
        $this->api_response["data"] = $insert_id;
        $this->api_response["message"] = "signup successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

     public function login_post()
    {

        if ($this->form_validation->run('auth/login') == FALSE)
        {
            $this->send_validation_errors();
        }

        $post_data = $this->input->post();

        $user_data = $this->Auth_model->get_single_row("*",USER,array("email"=> $post_data["email"]));
            

        if(empty($user_data["password"]) || (isset($user_data["password"]) && $user_data["password"] != md5($post_data["password"])))
        {
            $this->api_response["response_code"] = self::HTTP_INTERNAL_SERVER_ERROR;
            $this->api_response["global_error"] = "Invalid username or password.";
            $this->response($this->api_response,$this->api_response["response_code"]);
        
        
        }
 
        $key = $this->Auth_model->generate_auth_key($user_data["user_id"]);
        if($key == false)
        {
            $this->api_response["response_code"] = self::HTTP_INTERNAL_SERVER_ERROR;
            $this->api_response["global_error"] = "Session expired.";
            $this->response($this->api_response,$this->api_response["response_code"]);
            
        }
            unset($user_data["password"]);
        $user_data["session_key"] = $key;


        $this->api_response["response_code"] = self::HTTP_OK;
        $this->api_response["data"] = $user_data;
        $this->api_response["message"] = "login successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);
        
    }

   
    
   
//...
}