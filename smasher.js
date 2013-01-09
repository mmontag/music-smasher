// Do this when the page loads
$(document).ready(function() {
	
	var spotify = new iAPI('spotify', 'Spotify', 'http://www.spotify.com');

		spotify.numResults = function(){
			return this.items.length;
		};
		
		spotify.endpoint = function() {
			return('http://ws.spotify.com/search/1/track.json?q=' + this.query);
		};
		
		spotify.parse = function() {
			for(var key in this.data.tracks){
				var territories = this.data.tracks[key].album.availability.territories.split(' ');
				if($.inArray("US", territories) == -1 && $('#us').is(':checked')) continue;
				var artistString = '';
				for(var key2 in this.data.tracks[key].artists) {
					if(artistString.length > 0) artistString = artistString + ', ';
					artistString = artistString + this.data.tracks[key].artists[key2].name;
				}
				this.items.push(new Track(
					this.data.tracks[key].href,
					artistString,
					this.data.tracks[key].name,
					this.data.tracks[key].album.name
				));
			}
		};
	
	var mog = new iAPI('mog', 'MOG', 'http://www.mog.com');
	
		mog.numResults = function() {
			return this.items.length;
		};
	
		mog.endpoint = function() {
			return('http://search.mog.com/v2/tracks/search.json?q=' + this.query + '&count=50&index=0&allow_nonstreamable_token=0');
		};
		
		mog.parse = function() {
			mogdata = this.data;
			console.log("MOG", this.data);
			for(var key in this.data.tracks) {

				this.items.push(new Track(
					"http://mog.com/tracks/mn" + this.data.tracks[key].track_id,
					this.data.tracks[key].artist_name,
					this.data.tracks[key].album_name,
					this.data.tracks[key].track_name
				));
			}
		};
		
	var soundcloud = new iAPI('soundcloud', 'SoundCloud', 'http://www.soundcloud.com');
	
		// Hello, curious hacker person. Wouldn't it be easy to steal this API key and do Evil Things?
		// Why yes, and it would also be fairly easy to burn your neighbor's house down. I trust that you won't do these things.
		// Music Smasher is fast because most of the API requests are sent directly to the service provider, instead of first
		// going through a proxy in order to hide an API key. Let's keep it that way!
		
		soundcloud.endpoint = function() {
			return('http://api.soundcloud.com/tracks.json?q=' + this.query + '&client_id=f7def983532e3e44229d757cdab43cbe');
		};
		
		soundcloud.parse = function() {
			for(var key in this.data) {
				this.items.push(new Track(
					this.data[key].permalink_url,
					null,
					this.data[key].title,
					this.data[key].user.username
				));
			}
		};
		
	var bandcamp = new iAPI('bandcamp', 'Bandcamp', 'http://www.bandcamp.com');
	
		bandcamp.note = "Bandcamp will only match your search against full artist names.";
	
		bandcamp.numResults = function() {
			return this.items.length;
		};

		bandcamp.endpoint = function() {
			var ep = 'http://api.bandcamp.com/api/band/3/search?callback=?&name=' + this.query + '&key=drepradstrendirheinbryni';
			return(ep);
		};
		
		bandcamp.parse = function() {
			
			// YUCK. Bandcamp, you can do better than this

			var apikey = "drepradstrendirheinbryni";
			var ep = "http://api.bandcamp.com/api";
			var bands = this.data.results;
			var band_ids = [];
			for(var key in bands) {
				band_ids.push(bands[key].band_id);
			}
			band_ids.push(1);
			var band_string = band_ids.join(',');
			var url = ep + "/band/3/discography?callback=?&band_id=" + band_string + "&key=" + apikey;
			
			var self = this;
			
			var ajax = $.getJSON(url, function(data) {
				var album_ids = [];
				for(var artist_id in data) {
					var albums = data[artist_id].discography;
					for(var key in albums) {
						var album_id = albums[key].album_id;
						var Artist = albums[key].artist;

						var ArtistURL = albums[key].url.substr(0,albums[key].url.indexOf("/album/"));
						
						var url = ep + "/album/2/info?callback=?&album_id=" + album_id + "&key=" + apikey;
						
						var ajax = $.getJSON(url, function(data) {
							var Album = data.title;
							for(var key in data.tracks) {
								var Track = data.tracks[key].title;
								var URL = ArtistURL + data.tracks[key].url;
								self.items.push(new Track(
									URL,
									Artist,
									Track,
									Album
								));
							}
							self.updateDOM();
						});
					}
				}
			});
		};
			
	var grooveshark = new iAPI('grooveshark', 'Grooveshark', 'http://www.grooveshark.com');
		
		//grooveshark.note = "Down for maintenance. Will be back by midnight PST.";
		grooveshark.note = "Grooveshark will return a maximum of 15 results.";

		grooveshark.endpoint = function() {
			return('proxy.php?mode=native&url='+escape('http://tinysong.com/s/' + escape(this.query) + '?format=json&limit=32'));
		};
		
		grooveshark.parse = function() {
			for(var key in this.data) {
				this.items.push(new Track(
					this.data[key].Url,
					this.data[key].ArtistName,
					this.data[key].SongName,
					this.data[key].AlbumName
				));
			}
		};
		
	var rdio = new iAPI('rdio', 'Rdio', 'http://www.rdio.com');
		
		rdio.numResults = function(){
			return this.items.length;
		};

		rdio.endpoint = function() {
			return('oauthproxy.php?api=rdio&query=' + this.query);
		};
		
		rdio.parse = function() {
			for(var key in this.data.result.results) {
				//Rdio search includes results that are unavailable for streaming. I don't show them.
				if(this.data.result.results[key].canDownload || this.data.result.results[key].canSample) {
					this.items.push(new Track(
						this.data.result.results[key].shortUrl,
						this.data.result.results[key].artist,
						this.data.result.results[key].name,
						this.data.result.results[key].album
					));
				}
			}
		};

	var youtube = new iAPI('youtube', 'YouTube', 'http://www.youtube.com');

		youtube.maxResults = 20;

		youtube.note = "YouTube will return a maximum of " + youtube.maxResults + " results.";
		
		youtube.numResults = function(){
			return this.items.length;
		};

		youtube.endpoint = function() {
			return('http://gdata.youtube.com/feeds/api/videos?q=' + escape(this.query) + '&orderby=relevance&start-index=1&max-results=' + this.maxResults + '&v=2&alt=json');
		};
		
		youtube.parse = function() {
			if (!this.data.feed.entry) return;
			for(var key in this.data.feed.entry) {
				//Filter out bad YouTube video results.
				var video = this.data.feed.entry[key];
				if (!this.is_blocked(video) && !this.is_live(video) && this.is_music(video) && !this.is_cover_or_remix(video)) {
					var videoId = video.id.$t.split(":")[3];
					var videoTitle = video.title.$t;
					var videoDescription = video.media$group.media$description.$t;
					this.items.push(new Track(
						'http://www.youtube.com/watch?v=' + videoId,
						null,
						videoTitle,
						videoDescription
					));
				}
			}
		};

		// Bunch of YouTube convenience functions borrowed from Tubalr. Thanks Cody - github.com/cjstewart88
		youtube.is_blocked = function (video) {
			var blocked = false;

			if (video.author[0].name.$t.toLowerCase().search('vevo') >= 0) blocked = true;
			if (typeof video.app$control !== "undefined" && video.app$control.yt$state.$t == "Syndication of this video was restricted by the content owner.") blocked = true;
			if (typeof video.app$control !== "undefined" && video.app$control.yt$state.$t == "Syndication of this video was restricted by its owner.") blocked = true;

			return blocked;
		};

		youtube.is_music = function (video) {
			var music = true;

			if (video.media$group.media$category[0].$t != "Music") music = false;

			return music;
		};

		// youtube.is_unique = function (track_name, video) {
		//   var unique = true
		//   $.each(videos, function () {
		//     if (this.VideoID == video.id.$t.split(":")[3]) unique = false;
		//     var tmp_title1 = this.VideoTitle.toLowerCase().replace(/ *\([^)]*\) */g, '').replace(/[^a-zA-Z ]/g, "");
		//     var tmp_title2 = video.title.$t.toLowerCase().replace(/ *\([^)]*\) */g, '').replace(/[^a-zA-Z ]/g, "");
		//     if (tmp_title1 == tmp_title2) unique = false;
		//   });
		//   return unique;
		// }

		youtube.is_cover_or_remix = function (video) {
			var cover_or_remix = false;

			if (video.title.$t.toLowerCase().search("cover") != -1 || video.title.$t.toLowerCase().search("remix") != -1 || video.title.$t.toLowerCase().search("alternate") != -1) cover_or_remix = true;

			return cover_or_remix;
		};

		youtube.is_live = function (video) {
			var live_video = false;

			if (this.query.toLowerCase().search("live") > -1) return live_video;

			if (video.title.$t.toLowerCase().search("live") > -1 || video.title.$t.toLowerCase().search("@") > -1 || video.title.$t.toLowerCase().search("19") > -1 || video.title.$t.toLowerCase().search("200") > -1) live_video = true;

			if (!live_video) {
			$.each(video.category, function () {
				if (this.term.toLowerCase() == "live") live_video = true;
			});
			}

			return live_video;
		};

	// Set cursor to search box
	$('#q').focus();

	// Hook form submit action to each API
	$('#qform').submit(function(event) {
		event.preventDefault();
		
		var q = $('#q').val();
		
		// Clean up query - the following are Allowed Characters
		q = $.trim(q.replace(/[^\w\u00C0-\u017E\-!$]+/g,' ').substring(0,80));
		if(q === '') return false;
		
		// Wait 2.5 seconds before allowing another submission
		if (waiting === true) { console.log("wait!"); return false; }
		setTimeout(function(){ waiting = false; console.log("ready"); }, 2500);

		// Switch to full view
		$('body').removeClass("centered");

		// Don't duplicate search
		if(q == lastsearch) {
			console.log("cancelling repeat search");
			return false;
		}

		try {
			spotify.submit(q);
			rdio.submit(q);
			grooveshark.submit(q);
			soundcloud.submit(q);
			mog.submit(q);
			bandcamp.submit(q);
			youtube.submit(q);
			lastsearch = q;
			waiting = true;
			appRouter.navigate(q.replace(/[ -]+/g,"-")); // query to URL (see below)
		} catch(e) {
			console.log(e);
		}
		return false;
	});
	
	var search = function(query) {
	
	};
	
	// Create each service result container in DOM
	rdio.addToDOM();
	spotify.addToDOM();
	grooveshark.addToDOM();
	soundcloud.addToDOM();
	youtube.addToDOM();
	mog.addToDOM();
	bandcamp.addToDOM();
	
	$('#q').keydown(function(event) { if (event.keyCode == '13') { event.stopPropagation(); $('#qform').submit(); } });
	
	// Define URL to Method routing
	var AppRouter = Backbone.Router.extend({
		
		routes: {
			"*query":	"search"
		},
		
		search: function(query) {
			if(!query) {
				$('body').addClass("centered");
			} else {
				$('body').removeClass("centered");
				query = query.replace(/[ -]+/g," "); // URL to query (see above)
				console.log("[Router] search:",query);
				$('#q').val(query);
				$('#qform').submit();
			}
		}
	});
	
	// Instantiate the router
	var appRouter = new AppRouter();
	
	// Start history and routing
	console.log("backbone history start", Backbone.history.start({ pushState: true, root: "/" }));

});

function Track(url, artist, track, album) {
	this.url = url;
	this.artist = artist;
	this.track = track;
	this.album = album;
}

function iAPI(name, nicename, url){
	// Properties
	this.apiNiceName = nicename;
	this.apiName = name;
	this.apiURL = url;
	this.items = []; //array of tracks
	this.data = [];  //JSON parsed data structure - not normalized, and different for every service
	this.query = "";
	this.note = "";
	this.busy = false;
	this.template = _.template($('#tpl-service').html());
	this.itemTemplate = _.template($('#tpl-track').html());
		
	// Methods
	this.addToDOM = function() {
		var html = this.template(this);
		$('#services').append(html);
	
		$('#'+this.apiName+' .refresh').click($.proxy(function(event) {
			console.log(this.apiName + ' refresh');
			this.submit(this.query); // Reuse old query value
		}, this));
	};
	
	this.submit = function(query){

		console.log(this.apiName + ' submit');
				
		this.query = query;
		this.items = [];
		$('#'+this.apiName+' .note').hide();
		$('#'+this.apiName+' .loading').show();
		$('#'+this.apiName+' .results').empty();
		$('#'+this.apiName+' .num-results').empty();
		if(this.busy === true) {
			console.log('hanging up on ajax call for '+this.apiName);
			this.ajax.abort();
		}
		this.ajax = $.getJSON(this.endpoint(), $.proxy(this.callback, this)); // Enforce scope of callback with proxy
		this.busy = true;
	};
	
	this.numResults = function(){
		if (this.data === null || this.data === undefined) return 0;
		return this.data.length;
	};
	
	this.callback = function(data){
		this.busy = false;
		this.data = data;
		$('#'+this.apiName+' .loading').hide();
		console.log(this.apiName+' received callback');
		//console.log(data);
		this.parse();
		if(this.numResults() === 0) {
			$('<p>No results found.</p>').appendTo('#'+this.apiName+' .results');
		} else {
			this.updateDOM();
		}
	};

	// Re-renders entire list of items
	this.updateDOM = function(){
		$('#'+this.apiName+' .num-results').html(this.numResults() + ' Results');
		var htmlItems = [];
		for(var i = 0, length = this.items.length; i < length; i++) {
			htmlItems.push(this.itemTemplate(this.items[i]));
		}
		$('#'+this.apiName+' .results').html('<ul class="result-list">' + htmlItems.join('') + '</ul>');
	};

	// Abstract methods
	this.endpoint = function(){};
	this.parse = function(){};
	this.playTrack = function(){};
}

var instantListen = {
	_query: '',

	setQuery: function(query) {
		this._query = query;
	},

	notify: function(resultsArray) {

	}

};

// Underscore template setup: use Mustache.js {{ }} style templates
// http://underscorejs.org/#template
_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g, // {{ }}
    escape: /\{#(.+?)#\}/g, // {# #}
    evaluate: /\{%(.+?)%\}/g // {% %}
};

// Evil global stuff
var waiting = false;
var lastsearch = '';

// Browser shim stuff
window.console||(window.console={log:function(){}}); //console.log bypass for older browsers

// IE8/9 CORS cross-domain requests compatibility
// https://github.com/jaubourg/ajaxHooks/blob/master/src/ajax/xdr.js
(function( jQuery ) {

if ( window.XDomainRequest ) {
	jQuery.ajaxTransport(function( s ) {
		if ( s.crossDomain && s.async ) {
			if ( s.timeout ) {
				s.xdrTimeout = s.timeout;
				delete s.timeout;
			}
			var xdr;
			return {
				send: function( _, complete ) {
					function callback( status, statusText, responses, responseHeaders ) {
						xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
						xdr = undefined;
						complete( status, statusText, responses, responseHeaders );
					}
					xdr = new XDomainRequest();
					xdr.open( s.type, s.url );
					xdr.onload = function() {
						callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
					};
					xdr.onerror = function() {
						callback( 404, "Not Found" );
					};
					if ( s.xdrTimeout ) {
						xdr.ontimeout = function() {
							callback( 0, "timeout" );
						};
						xdr.timeout = s.xdrTimeout;
					}
					xdr.send( ( s.hasContent && s.data ) || null );
				},
				abort: function() {
					if ( xdr ) {
						xdr.onerror = jQuery.noop();
						xdr.abort();
					}
				}
			};
		}
	});
}
})( jQuery );