<?php

class Cron_model extends MY_Model 
{

	function __construct()
	{
		parent::__construct();
		
	}

	public function save_offer_type($offers = array())
	{
		$offer_type = array_column($offers, "category");
		
		$offer_type= array_unique($offer_type);
		//print_r($offer_type);

		$flag = $this->insert_with_ignore(OFFER_TYPE,"offer_type",$offer_type);
		return 1;
	}

	public function save_stores($offers = array())
	{
		$stores = array_column($offers, "offer_name");
		$store_images = array_column($offers, "store_image");
		$store_images = array_unique($store_images);
		
		$stores= array_unique($stores);
		$stores= array_map(array($this,"render_store_name"), $stores);
		

		$store_data =array();
		foreach ($stores as $key => $value) {

			$store_data[] = array(
				"name" => $value,
				"image" => $store_images[$key]
				);
			
		}

		
		$flag = $this->insert_with_ignore(STORE,"name,image",$store_data);
		return 1;
	}

	public function render_store_name($store)
	{

		if(strpos($store, '.com') != false)
		  {
			$arr = explode(".com", $store);
			return $arr[0];  	
		  }

		  if(strpos($store, '.co.in') != false)
		  {
			$arr = explode(".co.in", $store);
			return $arr[0];  	
		  }

		  if(strpos($store, '.in ') != false)
		  {
			$arr = explode(".in ", $store);
			return $arr[0];  	
		  }

	}

	public function save_offers($offers)
	{
		$offer_types = $this->get_offer_types();
		$stores = $this->get_stores();
		
		$insert_arr = array();
		foreach ($offers as $key => $value) 
		{
			# code...
			$data_array = array();
			$data_array["featured"] = $value['featured'];
			$data_array["exclusive"] = $value['exclusive'];
			$data_array["promo_id"] = $value['promo_id'];
			$data_array["offer_name"] = $value['offer_name'];
			$data_array["coupon_title"] = $value['coupon_title'];
			$data_array["coupon_description"] = $value['coupon_description'];
			$data_array["coupon_code"] = $value['coupon_code'];
			$data_array["link"] = $value['link'];
			$data_array["offer_id"] = $value['offer_id'];
			$data_array["expiry_date"] = $value['coupon_expiry'].' 23:59:59';
			$data_array["created_at"] = date("Y-m-d H:i:s");
			$data_array["updated_at"] = date("Y-m-d H:i:s");
			$data_array["image"] = $value["store_image"];

			if(!empty($value['coupon_type']))
			{
				switch ($value['coupon_type']) {
					case 'Coupon':
						$data_array["coupon_type"] = 1;//for coupon
						break;
					case 'Promotion':
						$data_array["coupon_type"] = 2;//for promotion
						break;
					default:
						$data_array["coupon_type"] = 1;//for coupon
						break;
				}
			}

		
			$offer_index =  array_search($value["category"], $offer_types);
			if($offer_index != false)
			{
				$data_array["offer_type_id"] = $offer_index;
			}
			else
				continue;

			
			$store_name  = $this->render_store_name($value['offer_name']);
			$store_index = array_search($store_name, $stores);
			if($store_index != false)
			{
				$data_array["store_id"] = $store_index;
			}
			else
				continue;

			$insert_arr[] = $data_array;

		}
		
		print_r($insert_arr);
		$flag = $this->insert_with_ignore(STORE_OFFER,"featured,exclusive,promo_id,offer_name,coupon_title,coupon_description,coupon_code,link,offer_id,expiry_date,created_at,updated_at,image,coupon_type,offer_type_id,store_id",$insert_arr);
		die('dfd');

	}


	public function get_stores()
	{
	   $result =	$this->get_table_data("store_id,name",STORE);
	   return array_column($result, "name","store_id");
	}



}