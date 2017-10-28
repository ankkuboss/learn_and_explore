<?php

class My_profile_model extends MY_Model 
{

	public function get_my_profile($user_id)
	{
		 $this->db->select("*")
		->from(USER." U")
		->join(USER_BANK_DETAILS." BD","U.user_id=BD.user_id ","INNER")
		->where("U.user_id>=",$user_id);
		
		$result = $this->db->get()
		->row_array();

		return $result ;
	}

	function convert_expiry_date_to_time($value)
	{
		 $value['expiry_time'] = strtotime($value['expiry_date']);
		 $value['today'] = strtotime(format_date());
		 return $value;
	}

	public function get_store_list($post_data = array())
	{
		// $result = $this->db->select("S.*")
		// ->from(STORE." S")
		// ->get()
		// ->result_array();
		// return $result ;

		$current_date = format_date();
		$result = $this->db->select("S.*")
		->from(STORE_OFFER." SO")
		->join(OFFER_TYPE." OT","SO.offer_type_id=OT.offer_type_id ","INNER")
		->join(STORE." S","S.store_id=SO.store_id ","INNER")
		->where("expiry_date>=",$current_date)
		->group_by("store_id")
		->get()
		->result_array();

		return $result;
	}

	public function store_details($post_data = array())
	{
		$current_date = format_date();
		 $result = $this->db->select("SO.offer_name,SO.coupon_title,SO.coupon_description,SO.image,SO.coupon_code,SO.promo_id,SO.offer_id,SO.expiry_date,OT.offer_type,S.name as store_name,SO.link,SO.coupon_type")
		->from(STORE_OFFER." SO")
		->join(OFFER_TYPE." OT","SO.offer_type_id=OT.offer_type_id ","INNER")
		->join(STORE." S","S.store_id=SO.store_id ","INNER")
		->where("SO.expiry_date>=","DATE_ADD('{$current_date}',INTERVAL 30 MINUTE)")
		->where("S.store_id",$post_data['store_id'])
		->order_by("expiry_date","DESC")
		->get()
		->result_array();
		$result = array_map(array($this,"convert_expiry_date_to_time"), $result);
//echo $this->db->last_query();die('dfd');
		return $result;
	}

	function get_my_earnings($user_id)
	{
		$result= $this->db->select("SUM(amount) as cashback,status")
		->from(CASHBACK)
		->where("user_id",$user_id)
		->group_by("status")
		->get()
		->result_array();

		return $result;
	}

	function get_my_withdrawal_list($user_id)
	{
		$result= $this->db->select("amount as cashback,status,email,name,created_at")
		->from(WITHDRAWAL)
		->where("user_id",$user_id)
		->get()
		->result_array();

		return $result;
	}


}
