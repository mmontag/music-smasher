<!--doctype html-->
<!--

Music Smasher
Author: matt.montag@gmail.com
Date: July 20, 2011

Notes: Napster API search is disabled as of December 1, 2011. Napster has been acquired by Rhapsody.

-->
<html>
<head><title>MUSIC SMASHER</title>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-25089589-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
<link rel="stylesheet" href="smasher.css">
</head>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="http://use.typekit.com/cra3tda.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
<script type="text/javascript" src="smasher.js"></script>
<body>
<center>
<? /*
<h1 id="pagetitle" style="line-height: 2em; width: 430px; text-align: left">
	<img src="images/hulksmash.jpg" style="float: right; height: 130px; margin: -3px -7px -15px 0" title="Hulk smash art by Kevin Nowlan">
*/ ?>
<div class="brick">
<h1 id="pagetitle" style="line-height: 2em;">
	<span style="font-size: 3em;">MUSIC</span><br>
	<span style="font-size: 2em;">SMASHER</span>
</h1>
</div>
<div class="brick">
<p>Try an obscure music search and see what turns up.  
<a href="http://www.mattmontag.com/music/music-smasher-streaming-music-api-mashup">Feedback</a>

<form id="qform">
	<p><input id="q"> <input type="submit" value="Smash"><br><input type="checkbox" id="us" name="us" checked> US Catalog Only
</form>
</div><br>

<div class="col" id="spotify">
<h2>
	<img src="images/spotify.png" class="logo">
	Spotify <span class="num-results"></span></h2>
	<div class="loading"></div>
	<div class="results"></div>
</div>

<div class="col" id="rdio">
	<h2>
	<img src="images/rdio.jpg" class="logo">
	Rdio <span class="num-results"></span></h2>
	<div class="loading"></div>
	<div class="results"></div>
</div>

<div class="col" id="grooveshark">
<h2>
	<img src="images/grooveshark.png" class="logo">
	Grooveshark <span class="num-results"></span></h2>
	<div class="loading"></div>
	<div class="results"></div>
</div>
<!--
<div class="col" id="napster">
	<h2>
	<img src="images/napster.png" class="logo">
	Napster <span class="num-results"></span></h2>
	<div class="loading"></div>
	<div class="results"></div>
</div>

<div class="col" id="rhapsody">
	<h2>
	<img src="images/rhapsody.gif" class="logo">
	Rhapsody <span class="num-results"></span></h2>
	Coming soon (maybe)
	<div class="loading"></div>
	<div class="results"></div>
</div>

<div class="col" id="bandcamp">
	<h2>
	<img src="images/bandcamp.png" class="logo">
	Bandcamp</h2>
	Coming soon
	<div class="loading"></div>
	<div class="results"></div>
</div>
-->
<div class="footer">
	by <a href="http://www.mattmontag.com">Matt Montag</a>
</div>

</center>
</body>
</html>
