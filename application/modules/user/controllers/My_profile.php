<?php

class  My_profile extends  MYREST_Controller  {

    function __construct ()  {
        parent::__construct();
        $_POST= $this->post();
        $this->load->model('My_profile_model');
    }
    
    public function get_my_profile_post()
    {
        $result                             = $this->My_profile_model->get_my_profile($this->user_id);
        unset($result['password']);
        $this->api_response["response_code"]= self::HTTP_OK;

        $result['profile_image'] = BASE_APP_URL.PROFILE_UPLOAD_PATH.'/'.$result['profile_image'];
        $this->api_response["data"]         = $result;
        $this->api_response["message"]      = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

    public function update_profile_post()
    {
        $post_data                          = $this->input->post();

        $update_data = array();

        if(isset($post_data['first_name']))
            $update_data['first_name'] = $post_data['first_name'];
         if(isset($post_data['last_name']))
            $update_data['last_name'] = $post_data['last_name'];
            
        if(!empty($update_data))
        {

            $this->db->where('user_id',$this->user_id);
            $this->db->update(USER,$update_data);
            //echo $this->db->last_query();die('ddf');
        }
        $this->api_response["response_code"]= self::HTTP_OK;
        ///$this->api_response["data"]         = $result;
        $this->api_response["message"]      = "Profile updated successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

     public function update_bank_details_post()
    {

        if ($this->form_validation->run('myprofile/bank_details') == FALSE)
        {
            $this->send_validation_errors();
        }
        $post_data                          = $this->input->post();

        $update_data = array(
            "account_holder_name" => $post_data['account_holder_name'],
            "bank_name"           => $post_data['bank_name'],
            "branch_name"         => $post_data['branch_name'],
            "account_number"      => $post_data['account_number'],
            "ifsc_code"           => $post_data['ifsc_code'],
            );

      
        if(!empty($update_data))
        {

            $this->db->where('user_id',$this->user_id);
            $this->db->update(USER_BANK_DETAILS,$update_data);
        }
        $this->api_response["response_code"]= self::HTTP_OK;
        ///$this->api_response["data"]         = $result;
        $this->api_response["message"]      = "Profile updated successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);
  
    }

    public function upload_profile_image_post()
    {
        $config['upload_path']   = PROFILE_UPLOAD_PATH; 
         $config['allowed_types'] = 'gif|jpg|png'; 
         $config['max_size']      = 1000; 
         $config['max_width']     = 10240; 
         $config['max_height']    = 76800;  

         // var_dump($_SERVER['DOCUMENT_ROOT']);
         // print_r($config);
         // die('dfd');
         $this->load->library('upload', $config);
            
         if ( ! $this->upload->do_upload('userfile')) {
                $this->api_response["response_code"]= self::HTTP_INTERNAL_SERVER_ERROR;
                $this->api_response["error"] = $this->upload->display_errors();
                $this->api_response["message"]      = "";
                $this->response($this->api_response,$this->api_response["response_code"]);
         }
            
         else { 
           

             $this->api_response["response_code"]= self::HTTP_OK;
             $image_info = $this->upload->data();

             $this->db->where("user_id",$this->user_id);
             $this->db->update(USER,array('profile_image' => $image_info['file_name']));
             $this->api_response["data"]['image_url'] = BASE_APP_URL.PROFILE_UPLOAD_PATH.'/'.$image_info['file_name'];
            $this->api_response["message"]      = "Profile image uploaded successfully.";
            $this->response($this->api_response,$this->api_response["response_code"]);
         } 
    }

    public function get_my_earnings_post()
    {
       $result = $this->My_profile_model->get_my_earnings($this->user_id);
       $withdrawal_result = $this->My_profile_model->get_my_withdrawal_list($this->user_id);

       $earning_data = array();

       $total_earning = 0;
       foreach ($result as $key => $value)
        {
        $total_earning+=$value['cashback'];

        //pending
        if($value['status'] == '0')
        {
            $earning_data['pending'] = $value['cashback'];
            
        }

        //approved
        if($value['status'] == '1')
        {
            # code...
            $earning_data['approved'] = $value['cashback'];
        }

       
       
       }

       //  $earning_data['paid'] = 0;
       // foreach ($withdrawal_result as $key => $value) {
       //     # code...
       //  if($value['status'] == '1')
       //  $earning_data['paid']+=$value['cashback'];
       // }
          //$total_earning += $earning_data['paid']; 
          $earning_data["total"] = $total_earning; 

        $this->api_response["response_code"]= self::HTTP_OK;
        $this->api_response["message"]      = "";
        $this->api_response["data"]['earning']      = $earning_data;
        $this->api_response["data"]['withdrawal_list']      = $withdrawal_result;
        $this->response($this->api_response,$this->api_response["response_code"]);

       }



      public function make_withdrawal_post()
    {
        $this->form_validation->set_rules('amount', 'Amount', 'required|trim');
        $this->form_validation->set_rules('name', 'Name', 'required|trim');
        $this->form_validation->set_rules('email', 'Email', 'required|trim|valid_email');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $withdrawal_data = $this->input->post();

        $prepare_data = array(
            "amount"     => $withdrawal_data["amount"],
            "name"       => $withdrawal_data["name"],
            "email"      => $withdrawal_data["email"],
            "user_id"    => $this->user_id,
            "created_at" => format_date(),
            "updated_at"    => format_date()
            );

        $this->db->insert(WITHDRAWAL,$prepare_data);

        $this->api_response["response_code"] = 200;
        $this->api_response["data"]['withdrawal_id'] = $this->db->insert_id();
        $this->api_response["message"] = "Withdrawal requested successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);

    }

  

     public function logout_post()
    {
        //$session_key = $this->input->get_request_header('session_key');

        $this->db->where('session_key',session_id());
        $this->db->delete(ACTIVE_LOGIN);

        $this->api_response["response_code"]= self::HTTP_OK;
        $this->api_response["message"]      = "Logout successfully.";
        $this->response($this->api_response,$this->api_response["response_code"]);
    }

  


    
   
//...
}