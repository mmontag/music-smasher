<!--doctype html-->
<!--

Music Smasher
Author: matt.montag@gmail.com
Date: February 12, 2011

-->
<? $app_path = ""; ?>
<html>
<head><title>MUSIC SMASHER</title>
<meta property="fb:admins" content="16903206" />
<link rel="stylesheet" href="<?= $app_path ?>smasher.css">
<link rel="stylesheet" href="<?= $app_path ?>smasher-single-list.css">
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-25089589-2']);
  _gaq.push(['_setDomainName', 'none']);
  _gaq.push(['_setAllowLinker', true]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</head>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js"></script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.1/backbone-min.js"></script>
<script type="text/javascript" src="http://use.typekit.com/cra3tda.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
<script type="text/javascript" src="<?= $app_path ?>smasher.js"></script>
<body>
<center>
<div class="brick">
<h1 id="pagetitle" style="line-height: 2em;"><a href="/" style="color: black; text-decoration: none;">
	<span style="font-size: 3em;">MUSIC</span><br>
	<span style="font-size: 2em;">SMASHER</span>
</a></h1>
</div>
<div class="brick">
<p>Try an obscure music search and see what turns up.  
<a href="http://www.mattmontag.com/music/music-smasher-streaming-music-api-mashup">Feedback</a>

<form id="qform">
	<p><input id="q"/> <input type="submit" class="Button" value="Smash"/><br>
	<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fmattmontag.com%2Fsmasher%2F&amp;send=false&amp;layout=button_count&amp;width=85&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=lucida+grande&amp;height=21&amp;appId=132115193511995" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:85px; height:21px; vertical-align: middle;" allowTransparency="true"></iframe>
	<input type="checkbox" id="us" name="us" checked /> US Catalog Only
</form>
</div>
<? /*
<div style="clear:both; margin-bottom: 14px">
<script type="text/javascript"><!--
google_ad_client = "ca-pub-2678448370326077";
// music
google_ad_slot = "8916001482";
google_ad_width = 468;
google_ad_height = 15;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
*/?>
<div id="services"></div>

<div class="footer">
	by <a href="http://www.mattmontag.com">Matt Montag</a>
    <? /*
    <div id="links">
        I recommend these legendary headphones:<br>
        <a href="http://amzn.to/IZs9Aq">Sennheiser HD650</a>
        <a href="http://amzn.to/JlczLd">Bose QC15</a>
        <a href="http://amzn.to/JldJ9i">Grado SR-80i</a>
        <a href="http://amzn.to/Jleorz">Koss PortaPro</a>
    </div>
    */ ?>
</div>

<span id="theFist" style="x-display:none"><img src="<?= $app_path ?>images/fist.png"></span>
<audio id="punch" preload="auto" src="<?= $app_path ?>punch.wav"></audio>
</center>
</body>
</html>
