<?php

class Auth_model extends MY_Model 
{

	public function registration($data)
	{
		$this->db->insert(USER,$data);
		return $this->db->insert_id();
	}


}