<?php

class  User extends  MYREST_Controller  {

    function __construct ()  {
        parent::__construct();
        $_POST = $this->post();
        
        $this->load->model("User_model");
    }
    


    public function user_list_post()
    {
        $this->form_validation->set_rules('search_str', 'search', 'trim');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $post_data = $this->input->post();

        //$user_data = $this->Auth_model->get_single_row("*",'admin',array("email"=> $post_data["email"]));
        $result = $this->User_model->get_users($post_data);
        
        $this->api_response["response_code"] = 200;
        $this->api_response["data"]['users'] = $result;
        $this->api_response["message"] = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
       
    }

    public function get_user_details_post()
    {
        $this->form_validation->set_rules('user_id', 'user id', 'required|trim');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $post_data = $this->input->post();

        $user_data = $this->User_model->get_user_details($post_data);

        $this->api_response["response_code"] = 200;
        $this->api_response["data"]['user_details'] = $user_data;
        $this->api_response["message"] = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
    }

    public function add_cashback_post()
    {
        $this->form_validation->set_rules('user_id', 'user id', 'required|trim');
        $this->form_validation->set_rules('cashback', 'cashback', 'required|trim');
        $this->form_validation->set_rules('order_amt', 'order amount', 'required|trim');
        $this->form_validation->set_rules('retailer_name', 'retailer name', 'required|trim');
        $this->form_validation->set_rules('transaction_id', 'transaction id', 'required|trim');
        $this->form_validation->set_rules('voucher_code', 'voucher code', 'required|trim');
        $this->form_validation->set_rules('date', 'date', 'required|trim');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $cashback_data = $this->input->post();

        $prepare_data = array(
            "user_id"        => $cashback_data["user_id"],
            "amount"         => $cashback_data["cashback"],
            "order_amount"   => $cashback_data["order_amt"],
            "retailer_name"  => $cashback_data["retailer_name"],
            "transaction_id" => $cashback_data["transaction_id"],
            "coupon_code"    => $cashback_data["voucher_code"],
            "purchase_date"  => format_date($cashback_data["date"]),
            "user_id"        => $cashback_data["user_id"],
            );

        $this->db->insert(CASHBACK,$prepare_data);

        $this->api_response["response_code"] = 200;
        $this->api_response["data"]['cashback_id'] = $this->db->insert_id();
        $this->api_response["message"] = "Cashback added.";
        $this->response($this->api_response,$this->api_response["response_code"]);

    }

    public function get_user_cashback_history_post()
    {
         $this->form_validation->set_rules('user_id', 'user id', 'required|trim');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }
         $cashback_data = $this->input->post();

        $result = $this->User_model->get_user_cashback_history($cashback_data);
        $this->api_response["response_code"] = 200;
        $this->api_response["data"] =$result;
        $this->api_response["message"] = "";
        $this->response($this->api_response,$this->api_response["response_code"]);

    }

    public function get_withdrawal_list_post()
    {
        $result = $this->User_model->get_withdrawal_list();
        $this->api_response["response_code"] = 200;
        $this->api_response["data"]["withdrawal_list"] =$result;
        $this->api_response["message"] = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
    }
//...
}