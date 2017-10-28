<?php

class  Template extends MY_Controller  {

    function __construct ()  {
        parent::__construct();
        
        //$this->load->library('form_validation');
        //$this->form_validation->CI =& $this;
    }
    
    public function index_get($path = "")
    {
        //if($path == "")
            $this->load->view("landing");
        //else
          //  $this->load->view($path);
    }

    public function javascript_var($lang='')
    {
        if(!empty($filename))
        {
            $lang_field = explode(".js", $filename);
            $this->lang->load('javascript', 'english');
            $lang = $this->lang->line($lang_field[0]);
            
        }
        
        $data['lang'] = $lang;

        $this->load->view('template/common/javascript_var', $data);
    }

    public function template_get($folder = "",$view="")
    {    
            $this->load->view("template/$folder/$view");
    }
    
    public function javascript_var_get($filename="")
    {

        if(!empty($filename))
        {
            $lang_field = explode(".js", $filename);
            $this->lang->load('javascript', 'english');
            $lang = $this->lang->line($lang_field[0]);
            ?>
            SERVER_GLOBAL = <?php echo json_encode($lang);?>;
            <?php

        }
    }
//...
}