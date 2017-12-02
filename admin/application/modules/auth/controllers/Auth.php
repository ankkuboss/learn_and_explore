<?php

class  Auth extends  MYREST_Controller  {

    function __construct ()  {
        parent::__construct();
        $_POST = $this->post();
        
        //$this->load->library('form_validation');
        //$this->form_validation->CI =& $this;
        $this->load->model("Auth_model");
    }
    
    public function check_get()
    {
        echo "fdfd";
        die();
    }
    
    public function check_amount_get()
    {
        echo "1234";
        die();
    }

    public function login_post()
    {
        $this->form_validation->set_rules('email', 'Email', 'required');
        $this->form_validation->set_rules('password', 'Password', 'required');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $post_data = $this->input->post();

        $user_data = $this->Auth_model->get_single_row("*",'admin',array("email"=> $post_data["email"]));
        
        if(empty($user_data) ||  (isset($user_data["password"]) && $user_data["password"] != md5($post_data["password"])))
        {
            $this->api_response["response_code"] = 500;
            $this->api_response["global_error"] = "Invalid username or password.";
            $this->response($this->api_response,$this->api_response["response_code"]);
        
        
        }

        $key = $this->Auth_model->generate_auth_key($user_data["admin_id"]);

        if($key == false)
        {
            $this->api_response["response_code"] = 500;
            $this->api_response["global_error"] = "Session expired.";
            $this->response($this->api_response,$this->api_response["response_code"]);
            
        }
            unset($user_data["password"]);
        $user_data[AUTH_KEY] = $key;
        $this->api_response["response_code"] = 200;
        $this->api_response["data"] = $user_data;
        $this->api_response["message"] = "login successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);
            
        

        


        

    }
//...
}