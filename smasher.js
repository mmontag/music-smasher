var napsterSessionKey = '';

// Do this when the page loads
$(document).ready(function() {
	
	var spotify = new iAPI('spotify');

		spotify.numResults = function(){
			return this.items.length;
		}
		
		spotify.endpoint = function() {
			return('http://ws.spotify.com/search/1/track.json?q=' + this.query);
		}
		
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
		}
			
	var napster = new iAPI('napster');

		napster.endpoint = function() {
			url = 'http://connect.napster.com/rest/1.2/search/tracks?searchTerm='+this.query+'&format=json&countryCode=US&maxResults=100&sessionKey='+napsterSessionKey;
			console.log("napster query: " + url);
			return('blabber.php?mode=native&url='+escape(url));
		}

		napster.napsterKey = function () {
			console.log("Fetching Napster session key");
			$.get('bonk.php', function(data) {
				napsterSessionKey = data;
			});
		}
		
		napster.parse = function() {
			this.data = this.data.searchResults.track;
			for(key in this.data){ 
				this.items.push('<li>' + 
					this.data[key].artistName + ' - ' + 
					this.data[key].trackName + '<br><span class="album">'+ 
					this.data[key].albumName +'</span></li>');
			}
		}


	var grooveshark = new iAPI('grooveshark');

		grooveshark.endpoint = function() {
			return('http://www.mattmontag.com/smasher/blabber.php?mode=native&url='+escape('http://tinysong.com/s/'+escape(this.query)+'?format=json&limit=30&key=b52cef0a3536b4feed58c9c2b0a2bdce'));
		}
		
		grooveshark.parse = function() {
			for(key in this.data){ 
				this.items.push('<li><a href="' + 
					this.data[key].Url + '" target="m">' +
					this.data[key].ArtistName + ' - ' + 
					this.data[key].SongName + '</a><br><span class="album">'+ 
					this.data[key].AlbumName+'</span></li>');
			}	
		}
		
	var rdio = new iAPI('rdio');
		
		rdio.numResults = function(){
			//return this.data.result.number_results;
			return this.items.length;
		}

		rdio.endpoint = function() {
			return('beep.php?api=rdio&query='+this.query);
		}
		
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
		}

	// Prefetch Napster session key
	//napster.napsterKey();
	
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
			//napster.submit(q); 
		} catch(e) {
			console.log(e);
		}
		return false;
	});

});

function iAPI(name){
	// Properties
	this.apiName = name;
	this.items = []; //array of HTML strings, i.e. "<li>Radiohead - Karma Police</li>"
	this.data = [];  //JSON parsed data structure
	this.query = "";
	this.busy = false;
	
	$('#'+this.apiName+' .loading').append('<img src="images/ajax_loading.gif"><br><div class="refresh">Refresh <img src="images/refresh.png"></div>');
	$('#'+this.apiName+' .refresh').click($.proxy(function(event) {
		//var q = $('#q').val(); 
		console.log(this.apiName + ' refresh');
		this.submit(this.query); // Reuse old query value
	}, this));
	
	// Methods
	this.submit = function(query){
		console.log(this.apiName + ' submit');
		this.query = query;
		this.items = [];
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
		$('<ul/>', {
			'class': 'result-list',
			html: this.items.join('')
		}).appendTo('#'+this.apiName+' .results');	
	};
	
	// Abstract methods
	this.endpoint = function(){};
	this.parse = function(){};
}