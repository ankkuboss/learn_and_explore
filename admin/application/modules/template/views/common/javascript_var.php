<?php
	echo "
	var server_global_temp = ".json_encode($lang)."
	if(SERVER_GLOBAL!==undefined)
	{
		angular.extend(SERVER_GLOBAL, server_global_temp);
	}
	else
	{
	Object.defineProperty(window, 'SERVER_GLOBAL', {value:server_global_temp, writable:true});
	}";
	echo "\n";
?>
