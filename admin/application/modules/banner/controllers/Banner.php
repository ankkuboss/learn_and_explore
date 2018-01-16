<?php

class  Banner extends  MYREST_Controller  {

    function __construct ()  {
        parent::__construct();
        $_POST = $this->post();
        
        //$this->load->library('form_validation');
        //$this->form_validation->CI =& $this;
        $this->load->model("Banner_model");
    }
    


    public function banner_list_post()
    {
        $result                                = $this->Banner_model->get_banners();
        $this->api_response["response_code"]   = 200;
        foreach ($result as $key => $value) {
            $result[$key]['banner_path']  = BASE_APP_URL.BANNER_IMAGE_PATH."/";
        }
        $this->api_response["data"]['banners'] = $result;
        $this->api_response["message"]         = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
       
    }

    public function add_banner_post()
    {
        $this->form_validation->set_rules('name', 'Name', 'trim|required');
        $this->form_validation->set_rules('link', 'Link', 'trim|required');
        $this->form_validation->set_rules('image', 'image', 'trim|required');
        $this->form_validation->set_rules('status', 'Status', 'trim|required');
        if ($this->form_validation->run() == FALSE)
        {
            $this->send_validation_errors();
        }

        $post_data = $this->input->post();

        $current_date = format_date();
        $prepare_data = array(
            "name"        => $post_data["name"],
            "link"        => $post_data["link"],
            "image"       => $post_data["image"],
            "status"      => $post_data["status"],
            "created_at"  => $current_date,
            "updated_at"  => $current_date
            );

        $this->db->insert(BANNER,$prepare_data);

        $this->api_response["response_code"] = 200;
        $this->api_response["data"]['banner_id'] = $this->db->insert_id();
        $this->api_response["message"] = $this->lang->line("banner_add_success");
        $this->response($this->api_response,$this->api_response["response_code"]);


    }
    public function update_banner_post()
    {

        $post_data = $this->input->post();
        $where =[];
        $where['id'] = $post_data['banner_id'];
        $result                                = $this->Banner_model->get_single_row( '*','BANNER',$where);
        $this->api_response["response_code"]   = 200;
        $this->api_response["data"]['banners'] = $result;
        $this->api_response["message"]         = "";
        $this->response($this->api_response,$this->api_response["response_code"]);
        $current_date = format_date();
        $prepare_data = array(
            "name"        => $result["name"],
            "link"        => $result["link"],
            "image"       => $result["image"],
            "status"      => $result["status"],
            );
    }
    public function update_banner_data_post()
    {
        $post_data = $this->input->post();
        $current_date = format_date();
        $where['id']= $post_data['id'];
        $prepare_data = array(
            "name"        => $post_data["name"],
            "link"        => $post_data["link"],
            "image"       => $post_data["image"],
            "status"      => $post_data["status"],
            );
        $this->api_response["message"] = "Banner Updated successfully";
        $this->db->where('id', $where['id']);
        $this->db->update(BANNER,$prepare_data);
    }

    public function upload_banner_image_post()
    {
        $config['upload_path']   = BANNER_UPLOAD_PATH; 
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
                echo $this->api_response["error"];
         }
            
         else { 
           

             $this->api_response["response_code"]= self::HTTP_OK;
             $image_info = $this->upload->data();

             $this->api_response["data"]['image_url'] = $image_info['file_name'];
            $this->api_response["message"]      = "Banner image uploaded successfully.";
            $this->response($this->api_response,$this->api_response["response_code"]);
         } 
    }
//...
}