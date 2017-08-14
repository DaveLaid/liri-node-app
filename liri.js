// Load the fs package to read and write
var fs = require("fs");

// Includes the NPM Request Package
var request = require("request");

// Grabs the keys variable.
var keys = require("./keys.js");

// Gets all of the Twitter keys from the keys.js file.
var twitterID = keys.twitterKeys;
var spotifyID = keys.spotifyKeys;

// This variable captures the first argument.
var action = process.argv[2];
// This variable will (eventually) capture everything after the first argument.
var nodeArgs = process.argv;

// Create an empty variable for holding the song or movie name
var songTitle = "";
var movieName = "";


// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    movieName = movieName + "+" + nodeArgs[i];
    songTitle = songTitle + "+" + nodeArgs[i];
  }
  else {
    movieName += nodeArgs[i];
    songTitle += nodeArgs[i];
  }
}




//Twitter variables: 
var Twitter = require('twitter-js-client').Twitter;
var twitter = new Twitter(twitterID);


//Spotify variables
var Spotify = require('node-spotify-api');
var spotify = new Spotify(spotifyID);


// Switch/Case statements to activate a function.
switch (action) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
}


// If the "my-tweets" argument was called, activate "myTweets" function
function myTweets() {

	//Callback functions defined in variables.
	var error = function (err, response, body) {
		console.log('ERROR [%s]', err);
	};

	var success = function (data) {
		var parseData = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			console.log("Tweet: " + parseData[i].text);
			console.log("Time: " + parseData[i].created_at);
			console.log(" ");
		}
	};

	twitter.getHomeTimeline({ count: '21'}, error, success);
	
}



// If the "spotify-this-song" argument was called, activate "spotifyThisSong" function
function spotifyThisSong() {
	
	if (songTitle === "") {
		 spotify.search({ type: 'track', query: 'The Sign Ace of Base', limit: 20 }, function(err, data) {
		 	var artistName = "Artist(s): " + data.tracks.items[0].artists[0].name;
			var songName = "Song Title: " + data.tracks.items[0].name;
			var previewLink = "Preview Link: " + data.tracks.items[0].preview_url;
			var albumName = "Album Name: " + data.tracks.items[0].album.name;

		 	console.log(artistName);
			console.log(songName);
			console.log(previewLink); 
			console.log(albumName); 

		    if (err) {
		    	return console.log('Error occurred to find "The Sign" : ' + err);
		    }

		    var spotifyLog = artistName + songName + previewLink + albumName;

				fs.appendFile('log.txt', spotifyLog, function(err) {

				  // If an error was experienced we say it.
				  if (err) {
				    console.log(err);
				  }

				});

		 });
 	}

 	else {
		spotify.search({ type: 'track', query: songTitle, limit: 20 }, function(err, data) {
			var artistName = "Artist(s): " + data.tracks.items[0].artists[0].name;
			var songName = "Song Title: " + data.tracks.items[0].name;
			var previewLink = "Preview Link: " + data.tracks.items[0].preview_url;
			var albumName = "Album Name: " + data.tracks.items[0].album.name;

			console.log(artistName);
			console.log(songName);
			console.log(previewLink); 
			console.log(albumName);

			if (err) {
		    	return console.log('Error occurred: ' + err);
		  	}

			var spotifyLog = artistName + songName + previewLink + albumName;

				fs.appendFile('log.txt', spotifyLog, function(err) {

				  // If an error was experienced in writing to log.txt:
				  if (err) {
				    console.log(err);
				  }

				});

		});
	}
	// search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);


}



// If the "movie-this" argument was called, activate "movieThis" function
function movieThis() {

// If user types nothing, then make the movieName variable for Mr. Nobody.
if (movieName === "") {
	movieName = "mr+nobody";
}

//run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

console.log(queryUrl);
	request(queryUrl, function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	    console.log("Title of the movie: " + JSON.parse(body).Title);
	    console.log("Year the movie came out: " + JSON.parse(body).Year);
	    console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
	    console.log("Rotton Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
	    console.log("Country where the movie was produced: " + JSON.parse(body).Country);
	    console.log("Language of the movie: " + JSON.parse(body).Language);
	    console.log("Plot of the movie: " + JSON.parse(body).Plot);
	    console.log("Actors in the movie: " + JSON.parse(body).Actors);
	   
	  }

	});

}



// If the "do-what-it-says" argument was called, activate "doWhatItSays" function
function doWhatItSays() {
	// NOTE TO SELF: this is what is inside random.txt:  spotify-this-song,"I Want it That Way"
	fs.readFile("random.txt", "utf8", function(error, data) {

		// If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}

		// Split the data by commas (to make it more readable and to work with it)
		var dataArr = data.split(",");

		action = dataArr[0];
		songTitle = dataArr[1];
		spotifyThisSong();

	});

}