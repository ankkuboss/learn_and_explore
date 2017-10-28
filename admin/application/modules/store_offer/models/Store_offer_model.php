<?php

class Store_offer_model extends MY_Model 
{

	function __construct()
	{
		parent::__construct();
		
	}

	public function get_store_offers($post_data = array())
	{
		$result = $this->db->select("SO.offer_name,SO.coupon_title,SO.image,SO.coupon_code,SO.promo_id,SO.offer_id,SO.expiry_date,OT.offer_type,S.name as store_name")
		->from(STORE_OFFER." SO")
		->join(OFFER_TYPE." OT","SO.offer_type_id=OT.offer_type_id ","INNER")
		->join(STORE." S","S.store_id=SO.store_id ","INNER")
		->get()
		->result_array();
		//$result= $this->get_table_data("*",USER);
		return $result ;
	}


}