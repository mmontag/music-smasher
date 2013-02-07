<!DOCTYPE html>
<!--

Music Smasher
Author: matt.montag@gmail.com
Date: February 12, 2011

-->
<?php
  $app_path = "";

  // Match instant play requests
  $uri = trim($_SERVER['REQUEST_URI'], '/');
  $match = array();
  preg_match("/^(.*)\/now/", $uri, $match);
  $match = substr($match[1], 0, 100);
  $match = str_replace('-', ' ', $match);
  $match = ucwords(strtolower($match));
  $match = htmlspecialchars($match, ENT_COMPAT, 'UTF-8');
  $ogtitle = "Music Smasher";
  $canonical_url = "http://musicmasher.net";
  if ($match) {
    $ogtitle = "play $match on Music Smasher";
    $canonical_url = "http://musicsmasher.net" . $_SERVER['REQUEST_URI'];
  }
?>
<html>
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
  <title>Music Smasher</title>
  <base href="http://<?= $_SERVER['HTTP_HOST'] ?>"/>
  <meta property="fb:admins" content="16903206"/>
  <meta property="og:title" content="<?= $ogtitle ?>"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="<?= $canonical_url ?>"/>
  <meta property="og:image" content="http://www.musicsmasher.net/images/screenshot.png"/>
  <meta property="og:description"
        content="Find any song. Music Smasher searches Spotify, Rdio, 
                 Grooveshark, SoundCloud, Bandcamp, MOG, and YouTube."/>
  <link href='http://fonts.googleapis.com/css?family=Fredoka+One' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="<?= $app_path ?>/smasher.css">
  <link rel="shortcut icon" href="<?= $app_path ?>/favicon.ico">
  <script type="text/javascript">

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-25089589-2']);
    _gaq.push(['_setAllowLinker', true]);
    // Disabled to prevent duplicate tracking - see https://github.com/kendagriff/backbone.analytics
    //_gaq.push(['_trackPageview']);

    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

  </script>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
  <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.1/underscore-min.js"></script>
  <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.1/backbone-min.js"></script>
  <script type="text/javascript" src="<?= $app_path ?>/smasher.js"></script>
</head>
<body class="centered">
<div class="container">
  <table class="table"><tr><td class="search">
    <form id="qform">
      <h1 class="pagetitle"><a href="<?= $app_path ?>/">
        Music&#8202;Smasher
      </a></h1>
      <div class="tagline">Find Any Song.</div>
      <input id="q"/>
      <? if(rand(0, 10) < 5) {
//      <div class="warning">
//        Caution: Strange experiments are currently taking place at Music Smasher... :)
//      </div>
      ?>
      <? } else { ?>
      <div class="tip">
        Hot Tip! Use Shift+Enter to search if you're feeling lucky.
      </div>
      <? } ?>
      <div class="logos">
        <img src="images/logos_white_retina.png">
      </div>
      <div class="details">
        <a href="http://www.mattmontag.com/music/music-smasher-streaming-music-api-mashup">Feedback</a> - 
        
        <iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.musicsmasher.net%2F&amp;send=false&amp;layout=button_count&amp;width=85&amp;show_faces=false&amp;action=like&amp;colorscheme=dark&amp;font=lucida+grande&amp;height=21&amp;appId=132115193511995" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px; vertical-align: bottom;" allowTransparency="true"></iframe>

        <input type="checkbox" id="us" name="us" checked /> US Catalog Only
      </div>
    </form>
  </td></tr></table>
  <div class="content">
    <div id="services"></div>

    <div class="footer">
      by <a href="http://www.mattmontag.com">Matt Montag</a>
    </div>
    <div class="playContainerSpacer"></div>
  </div>
  <div class="playContainer">
    <div class="playHeader">
      <span class="info"></span>
      <span class="minimizeButton"><img src="images/minimize.png" width="30" height="30"></span>
      <span class="closeButton"><img src="images/close.png" width="30" height="30"></span>
    </div>
    <iframe class="playFrame" name="playFrame"></iframe>
    <!-- Spotify protocol uri target iframe, workaround to prevent Grooveshark onbeforeunload -->
    <iframe class="spotifyTarget" name="spotifyTarget"></iframe>
  </div>
</div>
<!-- Templates -->
<script type="text/template" id="tpl-track">
  <li>
    <a href="{{ url }}" data-autoplayurl="{{ autoPlayUrl }}" target="m">{% if (artist) { %}{{ artist }} - {% } %}{{ track }}</a>
    {% if (popularity !== undefined) { %}
    <span class="album withPopularity">{{ album }}</span>
    <span class="popularity"><span class="popularityValue" style="width: {{ popularity }}%"></span></span>
    {% } else { %}
    <span class="album">{{ album }}</span>
    {% } %}
  </li>
</script>
<script type="text/template" id="tpl-service">
  <div class="col" id="{{ apiName }}">
    <h2>
    <a href="{{ apiURL }}" target="_blank"><img src="images/{{ apiName }}.png" class="logo"></a>
    {{ apiNiceName }} <span class="num-results"></span></h2>
    <div class="loading">
      <img class="spinner" src="images/spinner.gif">
      <div class="refresh">Refresh <img src="images/refresh.png"></div>
    </div>
    <div class="note">{{ note }}</div>
    <div class="results"></div>
    <div class="toggleMore">More</div>
  </div>
</script>
<script type="text/template" id="tpl-playheader">
  {% if (artist) { %}{{ artist }} - {% } %}{{ track }}
</script>
</body>
</html>