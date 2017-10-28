<?php

class User_model extends MY_Model 
{

	function __construct()
	{
		parent::__construct();
		
	}

	public function get_users($post_data = array())
	{
		$result= $this->get_table_data("*",USER);
		return $result ;
	}

	public function get_user_details($post_data)
	{

		return $this->db->select("*")
		->from(USER." U")
		->join(USER_BANK_DETAILS." UBD","U.user_id=UBD.user_id")
		->where("U.user_id",$post_data["user_id"])
		->limit(1)
		->get()->row_array();
	}

	public function get_user_cashback_history($post_data)
	{
		$limit =10;
		$offset = 0;

		if(!empty($post_data['offset']))
		{
			$offset = $post_data['offset'];
		}

		if(!empty($post_data['limit']))
		{
			$limit = $post_data['limit'];
		}

		$result = $this->db->select("SQL_CALC_FOUND_ROWS  *",false)
		->from(CASHBACK)
		->where("user_id",$post_data["user_id"])
		->limit($limit,$offset)
		->get()->result_array();

		// And get the result
		$query = $this->db->query('SELECT FOUND_ROWS() AS total')->row_array();
		$total = $query['total']; 

		$next_offset = $offset+ $limit;

		return array("result" => $result,
			"total" => $total,
			"next_offset" => $next_offset
			);
		
	}

	public function get_withdrawal_list()
	{
		return $this->db->select("W.name,W.amount,W.status,U.email,U.first_name,U.last_name,U.user_id,W.withdrawal_id")
		->from(WITHDRAWAL." W")
		->join(USER." U","U.user_id=W.user_id","LEFT")
		->get()->result_array();
	}


}