<?php

class MY_Model extends CI_MODEL 
{

	function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function get_single_row($select="*",$table,$where="1")
	{

		return  $this->db->select($select)
		->from($table)
		->where($where)
		->limit(1)
		->get()
		->row_array();


	}

	public function check_auth_key($user_id,$from_login = false)
    {
    	$active_user = $this->get_single_row("*",ACTIVE_LOGIN,array("user_id"=>$user_id));



    	if(empty($active_user))
    	{
    		$active_user = array();
    		$active_user['user_id'] = $user_id;
    		$active_user['session_key'] = session_id();//random_string('alnum',20);
    		$active_user['created_at'] = format_date();
    		$active_user['updated_at'] = format_date();

    		$this->db->insert(ACTIVE_LOGIN,$active_user);

    		return $active_user['session_key'];

    	}
    	else{
    		$current_time = format_date();

    		$key_create_time = $active_user["updated_at"];
    		$datediff =strtotime($current_time)- strtotime($key_create_time);

			$days=  floor($datediff / (60 * 60 * 24));

			if($days > 5)
			{
				if($from_login)
				{
					$active_user = array();
					$active_user['session_key'] = session_id();//random_string('alnum',20);
					$active_user['updated_at'] = format_date();
					$this->db->where('user_id', $user_id);
					$this->db->update(ACTIVE_LOGIN, $active_user);
					return $active_user['session_key'] ;
				}
				else
					return false;
			}
			else{
				return $active_user['session_key'];
			}
    	}
    	
    }

     public function generate_auth_key($user_id)
    {
    	$active_admin = $this->get_single_row("*",ACTIVE_LOGIN,array("user_id"=>$user_id));

 		if(!empty($active_admin))
    	{
    		$this->db->delete(ACTIVE_LOGIN,array("user_id" => $user_id));
    	}
    	$active_admin = array();
		$active_admin['user_id'] = $user_id;
		$active_admin['session_key'] = random_string('alnum',20);//session_id();
		$active_admin['created_at'] = format_date();
		$active_admin['updated_at'] = format_date();
    	$this->db->insert(ACTIVE_LOGIN,$active_admin);

    	return $active_admin['session_key'];
    	
    }

    public function get_table_data($select="*",$table,$where=array())
	{

		  $this->db->select($select)
		->from($table);

		$this->db->where($where);
		//->limit(1)
		return $this->db->get()
		->result_array();


	}


}