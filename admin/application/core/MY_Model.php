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

	public function check_auth_key($user_id,$from_login= false)
    {
    	$active_admin = $this->get_single_row("*",ACTIVE_ADMIN_LOGIN,array("admin_id"=>$user_id));

        if(empty($active_admin))
    	{
    		$active_admin = array();
    		$active_admin['admin_id'] = $user_id;
    		$active_admin['session_key'] = session_id();//random_string('alnum',20);
    		$active_admin['created_at'] = format_date();
    		$active_admin['updated_at'] = format_date();

    		$this->db->insert(ACTIVE_ADMIN_LOGIN,$active_admin);

    		return $active_admin['session_key'];

    	}
    	else{
    		$current_time = format_date();

    		$key_create_time = $active_admin["created_at"];
    		$datediff =strtotime($current_time)- strtotime($key_create_time);

			$days=  floor($datediff / (60 * 60 * 24));
			if($days > 15)
			{

				if($from_login)
				{
					$active_admin = array();
					$active_admin['session_key'] = session_id();//random_string('alnum',20);
	    			$active_admin['created_at'] = format_date();
	    			$active_admin['updated_at'] = format_date();
	    			$this->db->where('admin_id',$user_id);
					$this->db->update(ACTIVE_ADMIN_LOGIN,$active_admin);
					return $active_admin['session_key'];
				}
				else
				{
					return false;
				}
			}
			else{
				return $active_admin['session_key'];
			}
    	}
    	
    }

    public function generate_auth_key($user_id)
    {
    	$active_admin = $this->get_single_row("*",ACTIVE_ADMIN_LOGIN,array("admin_id"=>$user_id));

    	if(!empty($active_admin))
    	{
    		$this->db->delete(ACTIVE_ADMIN_LOGIN,array("admin_id" => $user_id));
    	}

    	$active_admin = array();
		$active_admin['admin_id'] = $user_id;
		$active_admin['session_key'] = session_id();//random_string('alnum',20);
		$active_admin['created_at'] = format_date();
		$active_admin['updated_at'] = format_date();

    	$this->db->insert(ACTIVE_ADMIN_LOGIN,$active_admin);

    	return $active_admin['session_key'];
    	
    }

    public function check_auth_key1($user_id,$from_login = false)
    {
    	$active_user = $this->get_single_row("*",ACTIVE_LOGIN,array("user_id"=>$user_id));

    	if(empty($active_user))
    	{
    		$active_user = array();
    		$active_user['user_id'] = $user_id;
    		$active_user['session_key'] = random_string('alnum',20);
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
					$active_user['session_key'] = random_string('alnum',20);
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

    public function get_table_data($select="*",$table,$where=array())
	{

		  $this->db->select($select)
		->from($table);

		$this->db->where($where);
		//->limit(1)
		return $this->db->get()
		->result_array();


	}

	public function insert_with_ignore($table,$columns,$data)
	{

		$cols = explode(",", $columns);
		$sql = "";
		if(count($cols) == 1)
		{
			$val_str = "('".implode("'),('", $data)."')";
			$sql = "INSERT IGNORE INTO $table($columns) VALUES $val_str;";
			$this->db->query($sql);
		}
		else
		{
			$strs = array();
			$i = 0;
			
			foreach ($data as $key => $value) {

				$strs[] = "('".implode("','", $value)."')";
				$i++;
				if($i == 150)
				{
					$i = 0;
					$val_str = implode(",", $strs);
					$sql = "INSERT IGNORE INTO $table($columns) VALUES $val_str;";
					$this->db->query($sql);
					$strs = array();
				}

				

				# code...
			}
			
			if($i < 150)
			{
				$val_str = implode(",", $strs);
				$sql = "INSERT IGNORE INTO $table($columns) VALUES $val_str;";
				$this->db->query($sql);
			}

		}
		
		return 1;
	}

	public function get_offer_types()
	{
	   $result =	$this->get_table_data("offer_type_id,offer_type",OFFER_TYPE);
	   return array_column($result, "offer_type","offer_type_id");
	}


}