<?php

class  Store_offer extends  MYREST_Controller  
{

    function __construct ()  {
        parent::__construct();
        $_POST= $this->post();
        $this->load->model('Store_offer_model');
    }
    
    public function get_store_offers_post()
    {
        $post_data                          = $this->input->post();
        $result                             = $this->Store_offer_model->get_store_offers($post_data);
        $this->api_response["response_code"]= self::HTTP_OK;
        $result['result'] = array_map(array($this,"add_user_id_to_link") ,$result["result"]);
        $this->api_response["data"]         = $result;
        $this->api_response["message"]      = "signup";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

    public function get_store_list_post()
    {
        $post_data                          = $this->input->post();
        $result                             = $this->Store_offer_model->get_store_list($post_data);
        $this->api_response["response_code"]= self::HTTP_OK;

        $this->api_response["data"]         = $result;
        $this->api_response["message"]      = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

    public function get_banner_list_post()
    {
        $result["banners"]  = $this->Store_offer_model->get_banner_list();

        $user_data = $this->Store_offer_model->get_single_row("user_id",ACTIVE_LOGIN,array("session_key" => session_id()));
       
        if(isset($user_data['user_id']))
        {
            $this->user_id = $user_data["user_id"];
        }
        else
        {
            $this->user_id = 0;
        }

        $result['banners'] = array_map(array($this,"add_user_id_to_link") ,$result["banners"]);
        $result["banner_path"] = base_url()."/".BANNER_IMAGE_PATH."/";
        $this->api_response["response_code"]= self::HTTP_OK;

        $this->api_response["data"]         = $result;
        $this->api_response["message"]      = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

    public function store_details_post()
    {
        $post_data     = $this->input->post();
        $result        = $this->Store_offer_model->store_details($post_data);
        $this->api_response["response_code"]= self::HTTP_OK;
        $result = array_map(array($this,"add_user_id_to_link") ,$result);

        $this->api_response["data"]         = $result;
        $this->api_response["message"]      = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

    private function add_user_id_to_link($value)
    {
        $value['link'] = $value['link'].'&aff_sub='.$this->user_id;
        $value['cashback_text'] = CUSTOMER_CPS_TEXT;

        return $value;
    }


    
   
//...
}