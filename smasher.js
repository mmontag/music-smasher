// Do this when the page loads
$(document).ready(function() {
	
	var spotify = new iAPI('spotify', 'Spotify');

		spotify.numResults = function(){
			return this.items.length;
		};
		
		spotify.endpoint = function() {
			return('http://ws.spotify.com/search/1/track.json?q=' + this.query);
		};
		
		spotify.parse = function() {
			for(key in this.data.tracks){ 
				var territories = this.data.tracks[key].album.availability.territories.split(' ');
				if($.inArray("US", territories) == -1 && $('#us').is(':checked')) continue;
				var artistString = '';
				for(key2 in this.data.tracks[key].artists) {
					if(artistString.length > 0) artistString = artistString + ', ';
					artistString = artistString + this.data.tracks[key].artists[key2].name;
				}
				this.items.push('<li><a href="' + 
					this.data.tracks[key].href + '">' + 
					artistString + ' - ' + 
					this.data.tracks[key].name + '</a><br><span class="album">'+ 
					this.data.tracks[key].album.name+'</span></li>');
			}
		};
	
	var mog = new iAPI('mog', 'MOG');
	
		mog.numResults = function() {
			return this.items.length;
		};
	
		mog.endpoint = function() {
			return('https://search.mog.com/mfastsearch?nq=' + this.query + '&ntn=26');
		};
		
		mog.parse = function() {
			this.data = this.data[2]; // MOG returns junk outside here
			for(key in this.data) {
				
				//var url    = this.data[key][
				var url = "https://mog.com/tracks/mn" + this.data[key][2][1];
				var artist = this.data[key][0][2];
				var album  = this.data[key][1][2];
				var track  = this.data[key][2][2];
				
				this.items.push('<li><a href="' + 
					url + '" target="m">' + 
					artist + ' - ' + 
					track + '</a><br><span class="album">'+ 
					album + '</span></li>');
			}
		};
		
	var soundcloud = new iAPI('soundcloud', 'SoundCloud');
	
		soundcloud.endpoint = function() {
			return('http://api.soundcloud.com/tracks.json?q=' + this.query + '&client_id=f7def983532e3e44229d757cdab43cbe');
		};
		
		soundcloud.parse = function() {
			for(key in this.data) {
				this.items.push('<li><a href="' + 
					this.data[key].permalink_url + '" target="m">' +
					this.data[key].title + '</a><br><span class="album">'+ 
					this.data[key].user.username + '</span></li>');
			}
		};
		
	var bandcamp = new iAPI('bandcamp', 'Bandcamp');
	
		bandcamp.note = "Bandcamp will only match your search against full artist names.";
	
		bandcamp.numResults = function() {
			return this.items.length;
		};
	
		bandcamp.endpoint = function() {
			var ep = 'http://api.bandcamp.com/api/band/3/search?callback=?&name=' + this.query + '&key=drepradstrendirheinbryni';
			console.log(ep);
			return(ep);
		};
		
		bandcamp.parse = function() {
			
			// YUCK. Bandcamp, you can do better than this

			var apikey = "drepradstrendirheinbryni";
			//veidihundr samvinnaritutlaaptarlapustr drepradstrendirheinbryni eyjafjallajokull
			var ep = "http://api.bandcamp.com/api";
			var bands = this.data.results;
			var band_ids = [];
			for(key in bands) {
				band_ids.push(bands[key].band_id);
			}
			console.log(band_ids);
			band_ids.push(1);
			var band_string = band_ids.join(',');	
			var url = ep + "/band/3/discography?callback=?&band_id=" + band_string + "&key=" + apikey;
			console.log(url);
			
			var self = this;
			
			var ajax = $.getJSON(url, function(data) {
				console.log(data);
				var album_ids = [];
				for(artist_id in data) {	
					var albums = data[artist_id].discography;
					for(key in albums) {
						var album_id = albums[key].album_id;
						var Artist = albums[key].artist;

						var ArtistURL = albums[key].url.substr(0,albums[key].url.indexOf("/album/"));
						
						var url = ep + "/album/2/info?callback=?&album_id=" + album_id + "&key=" + apikey;
						console.log(url);
						
						var ajax = $.getJSON(url, function(data) {
							console.log(data);
							var Album = data.title;
							for(key in data.tracks) {
								var Track = data.tracks[key].title;
								var URL = ArtistURL + data.tracks[key].url;
								self.items.push('<li><a href="' + 
									URL + '" target="m">' +
									Artist + ' - ' + 
									Track + '</a><br><span class="album">'+ 
								 	Album + '</span></li>');
							}
							self.updateDOM();
						});
					}
				}
			});
			
			// this.items.push('<li><a href="' + 
			// 	this.data[key].Url + '" target="m">' +
			// 	this.data[key].ArtistName + ' - ' + 
			// 	this.data[key].SongName + '</a><br><span class="album">'+ 
			// 	this.data[key].AlbumName+'</span></li>');
		};
			
	var grooveshark = new iAPI('grooveshark', 'Grooveshark');
	
		grooveshark.note = "Grooveshark will return a maximum of 15 results.";

		grooveshark.endpoint = function() {
			return('proxy.php?mode=native&url='+escape('http://tinysong.com/s/' + escape(this.query) + '?format=json&limit=30&key=b52cef0a3536b4feed58c9c2b0a2bdce'));
		};
		
		grooveshark.parse = function() {
			for(key in this.data) { 
				this.items.push('<li><a href="' + 
					this.data[key].Url + '" target="m">' +
					this.data[key].ArtistName + ' - ' + 
					this.data[key].SongName + '</a><br><span class="album">'+ 
					this.data[key].AlbumName+'</span></li>');
			}	
		};
		
	var rdio = new iAPI('rdio', 'Rdio');
		
		rdio.numResults = function(){
			//return this.data.result.number_results;
			return this.items.length;
		};

		rdio.endpoint = function() {
			return('oauthproxy.php?api=rdio&query=' + this.query);
		};
		
		rdio.parse = function() {
			for(key in this.data.result.results) {
				//Rdio search includes results that are unavailable for streaming. I don't show them.
				if(this.data.result.results[key].canDownload || this.data.result.results[key].canSample) {
					this.items.push('<li><a href="' + 
						this.data.result.results[key].shortUrl + '" target="m">' +
						this.data.result.results[key].artist + ' - ' + 
						this.data.result.results[key].name + '</a><br><span class="album">'+ 
						this.data.result.results[key].album + '</span></li>');
				}
			}
		};
	
	// Set cursor to search box
	$('#q').focus();

	// Hook form submit action to each API
	$('#qform').submit(function(event) {
		event.preventDefault();
		var q = $('#q').val();
		try {
			spotify.submit(q);
			rdio.submit(q); 
			grooveshark.submit(q);
			soundcloud.submit(q);
			mog.submit(q);
			bandcamp.submit(q);
		} catch(e) {
			console.log(e);
		}
		return false;
	});
	
	// Create each service result container in DOM
	rdio.addToDOM();
	spotify.addToDOM();
	grooveshark.addToDOM();
	soundcloud.addToDOM();
	mog.addToDOM();
	bandcamp.addToDOM();

});

function iAPI(name, nicename){
	// Properties
	this.apiNiceName = nicename;
	this.apiName = name;
	this.items = []; //array of HTML strings, i.e. "<li>Radiohead - Karma Police</li>"
	this.data = [];  //JSON parsed data structure
	this.query = "";
	this.note = "";
	this.busy = false;
		
	// Methods
	this.addToDOM = function() {
		var html = '<div class="col" id="'+ this.apiName + '"> \
		<h2> \
			<img src="images/' + this.apiName + '.png" class="logo"> \
			' + this.apiNiceName + ' <span class="num-results"></span></h2> \
			<div class="loading"> \
				<img src="images/ajax_loading.gif"><br> \
				<div class="refresh">Refresh <img src="images/refresh.png"></div> \
			</div> \
			<div class="note">' + this.note + '</div> \
			<div class="results"></div> \
		</div>';
		$('#services').append(html);
	
		$('#'+this.apiName+' .refresh').click($.proxy(function(event) {
			//var q = $('#q').val(); 
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
		if(this.busy == true) { 
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
		console.log(data);
		this.parse();
		if(this.numResults() == 0) {
			$('<p>No results found.</p>').appendTo('#'+this.apiName+' .results');
		} else {
			this.updateDOM();
		}
	};
	
	this.updateDOM = function(){
		$('#'+this.apiName+' .num-results').html(this.numResults() + ' Results');
		$('#'+this.apiName+' .results').html('<ul class="result-list">' + this.items.join('') + '</ul>');	
	};
	
	// Abstract methods
	this.endpoint = function(){};
	this.parse = function(){};

}