<?php

 function format_date($date="now",$format="Y-m-d H:i:s")
{

	if(is_numeric($date))
	{
		return date($format,$date);
	}

	if(is_string($date))
		return date($format,strtotime($date));
}




