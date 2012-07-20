<?php
require_once ("OAuth.php");
require_once ("keys.php");
$hmac_method = new OAuthSignatureMethod_HMAC_SHA1();
$token = NULL; // 2-legged auth doesn't require access token
$sig_method = $hmac_method;

if(!$_GET['query']) die("Invalid query");

switch ($_GET['api']) {
	case "rdio":
		$key = $keys['rdio']['key'];
		$secret = $keys['rdio']['secret'];
		$endpoint = "http://api.rdio.com/1/";
		$dictionary = array(
			"method"=>"search", 
			"query"=>stripslashes($_GET['query']),
			"types"=>"Track",
			"count"=>"100",
			"never_or"=>"true"
			);
		break;
		
	case "soundcloud":
		// Nevermind, implementing soundcloud with JSONP for now
		break;
		
	case "some_other_api...":
	
	default:
		die("Invalid API");
}

// Get OAuth Signature
$consumer = new OAuthConsumer($key, $secret, NULL);
$request = OAuthRequest::from_consumer_and_token($consumer, $token, "POST", $endpoint, $dictionary);
$request->sign_request($sig_method, $consumer, $token);
$postdata = $request->to_postdata();

if(@$_GET['debug']) {
	// Display the post for testing - might want to disable this because it will show the API key
	?>
	<form method=post action="<?= $endpoint ?>">
	<?php
	foreach(explode('&', $postdata) as $item) {
		list($key, $value) = explode('=',$item);
		echo ("<input name='$key' value='".urldecode($value)."'><br>");
	}
	?>
	<input type="submit">
	</form>
	<? 
} else {
	// Issue a CURL request to the API provider
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $endpoint);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
	$output = curl_exec($ch);
	// Echo the JSON payload
	echo($output);
	exit(); //exit to make sure we don't print any extra characters
}
?>