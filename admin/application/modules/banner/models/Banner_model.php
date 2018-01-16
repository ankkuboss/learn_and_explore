<?php

class Banner_model extends MY_Model 
{

	function __construct()
	{
		parent::__construct();
		
	}

	public function get_banners()
	{
		$result = $this->db->select("*")
		->from(BANNER)
/*		->where("status",1)
*/		->get()
		->result_array();
		return $result ;
	}
}