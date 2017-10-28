<?php

class Store_offer_model extends MY_Model 
{

	public function get_store_offers($post_data = array())
	{

		$offset = 0;
		$limit = 40;
		$sort_field= "SO.created_at";
		$sort_order = "DESC";
		if(isset($post_data["offset"]))
		{
			$offet = $post_data["offset"];
		}

		if(isset($post_data["limit"]))
		{
			$limit = $post_data["limit"];
		}

		$current_date = format_date();
		$current_date  = strtotime($current_date." +30 minutes");
		
		 $this->db->select("SQL_CALC_FOUND_ROWS SO.offer_id,SO.offer_name,SO.coupon_title,SO.image,SO.coupon_code,SO.promo_id,SO.expiry_date,OT.offer_type,S.name as store_name,SO.link,SO.coupon_type",FALSE)
		->from(STORE_OFFER." SO")
		->join(OFFER_TYPE." OT","SO.offer_type_id=OT.offer_type_id ","INNER")
		->join(STORE." S","S.store_id=SO.store_id ","INNER")
		->where("SO.expiry_date>=",$current_date)
		->order_by("SO.expiry_date","DESC");
	
		$this->db->limit($limit,$offset);
		
		$result = $this->db->get()
		->result_array();

		$row = $this->db->query("SELECT FOUND_ROWS() as total")->row_array();
		$result = array_map(array($this,"convert_expiry_date_to_time"), $result);

		
		$res = array();
		$res['result'] = $result;
		$res['total'] = $row["total"];
		$res['next_offset'] = $offset + $limit;
		return $res ;
	}

	function convert_expiry_date_to_time($value)
	{
		 $value['expiry_time'] = strtotime($value['expiry_date'])*1000;
		 $value['today'] = strtotime(format_date())*1000;
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
		 $this->db->select("S.*")
		->from(STORE_OFFER." SO")
		->join(OFFER_TYPE." OT","SO.offer_type_id=OT.offer_type_id ","INNER")
		->join(STORE." S","S.store_id=SO.store_id ","INNER")
		->where("expiry_date>=",$current_date);

		if(isset($post_data['q']) && $post_data['q'] != "")
		{
			$this->db->like("S.name",$post_data['q']);
		}

		$result =$this->db->group_by("store_id")
		->get()
		->result_array();

		return $result;
	}

	public function get_banner_list()
	{
		 $this->db->select("*")
		->from(BANNER)
		->where("status",1);

		$result =$this->db->get()
		->result_array();

		return $result;
	}

	public function store_details($post_data = array())
	{
		$current_date = format_date();
		$new_time = date("Y-m-d H:i:s",strtotime($current_date." +30 minutes"));
		 $result = $this->db->select("SO.offer_name,SO.coupon_title,SO.coupon_description,SO.image,SO.coupon_code,SO.promo_id,SO.offer_id,SO.expiry_date,OT.offer_type,S.name as store_name,SO.link,SO.coupon_type")
		->from(STORE_OFFER." SO")
		->join(OFFER_TYPE." OT","SO.offer_type_id=OT.offer_type_id ","INNER")
		->join(STORE." S","S.store_id=SO.store_id ","INNER")
		->where("SO.expiry_date>=",$new_time)
		->where("S.store_id",$post_data['store_id'])
		->order_by("expiry_date","ASC")
		->get()
		->result_array();
		$result = array_map(array($this,"convert_expiry_date_to_time"), $result);
//echo $this->db->last_query();die('dfd');
		return $result;
	}


}