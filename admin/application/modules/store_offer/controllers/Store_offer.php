<?php

class  Store_offer extends  MYREST_Controller  {

    function __construct ()  {
        parent::__construct();
        $_POST = $this->post();
        
        //$this->load->library('form_validation');
        //$this->form_validation->CI =& $this;
        $this->load->model("Store_offer_model");
    }
    


    public function offer_list_post()
    {
        $this->form_validation->set_rules('search_str', 'search', 'trim');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $post_data = $this->input->post();

        //$user_data = $this->Auth_model->get_single_row("*",'admin',array("email"=> $post_data["email"]));
        $result = $this->Store_offer_model->get_store_offers($post_data);
        
        $this->api_response["response_code"] = 200;
        $this->api_response["data"]['offers'] = $result;
        $this->api_response["message"] = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
       
    }
//...
}