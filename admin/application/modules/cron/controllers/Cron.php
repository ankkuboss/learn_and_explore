<?php

class  Cron extends  MX_Controller  {

	
    function __construct ()  {
       parent::__construct();

       $this->load->model("Cron_model");
  		
    }

    function get_coupon_codes()
    {
        echo $url =VC_API_URL.VC_API_KEY;
    	$curlSession = curl_init();
    	curl_setopt($curlSession, CURLOPT_URL, "$url");
    	curl_setopt($curlSession, CURLOPT_HTTPGET, 1);
    	curl_setopt($curlSession, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curlSession, CURLOPT_USERAGENT, "Mozilla/4.0");
	    curl_setopt($curlSession, CURLOPT_SSL_VERIFYPEER, 0);

        $jsonData = curl_exec($curlSession);

        curl_close($curlSession);
        echo "<pre>";
        $offers = json_decode($jsonData,TRUE);
         print_r($offers );
        $this->Cron_model->save_offer_type($offers);
        $this->Cron_model->save_stores($offers);
        $this->Cron_model->save_offers($offers);


    die('dfdf');

    	
    }
   


}

