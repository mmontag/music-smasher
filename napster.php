<?php

// Napster API session key cache

$fname = "napster.txt";
$expiration = 1800; //seconds
$now = time();
$apikey = "UAxDdnVgwvbeMpsPBAXh";
$url = "https://connect-ssl.napster.com/rest/1.2/security/createSession?countryCode=US&explicit=Y&apiKey=$apikey";

if(file_exists($fname)) {
	list($session_key, $session_time) = explode("|", file_get_contents($fname));
	if($session_time < $now - $expiration) {
		$session_key = fetch_new_key();
	}
} else {
	$session_key = fetch_new_key();
}

echo($session_key);

//***********************************************

function fetch_new_key() {
	global $fname, $url;
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($ch);
	$num = preg_match("#<sessionKey>(.*)</sessionKey>#i",$output,$regs);
	if($num == 0) die("Error fetching sessionKey");
	
	$key = $regs[1];
	$time = time();
	
	file_put_contents($fname, "$key|$time");
	
	return $key;
}

?>