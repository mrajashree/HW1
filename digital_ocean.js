var needle = require("needle");
var os   = require("os");
//var sleep = require("sleep");
var fs = require("fs");

var config = {};
config.token = process.argv[2];

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};


// Documentation for needle:
// https://github.com/tomas/needle
var dropletId;
var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},

	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[process.argv[3]],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	getDroplet: function ( dropletId, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
	},

	getSshKey: function(onResponse)
	{
		var data = 
		{
			"name": "SSH_key",
			"ssh_pub_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDJdYyhKanHRBd7Ovle83NSdwmDiEPktrfu7chVcXwWcKfposDPF1q8q6Scf43Ki7/D6FOvzdg4Ee4XSwQAv/+3aMhduU5TABOkfX0p5+WtrRmn12dfmbBRVacJs3rgc5ADIfDVNeDPnLt/k3vJa1fz1KATcox4duxHfXAjkAZcR8za7UDfNJMpokKvoB4lSttNecx7GTV2CYsVdSkPGzBtv7pM5j+a8V3ZHlq7S/y7vYqjUwUDmZ9CFYNga9bLpPzG/ZwlyytJ1uiwa98m/CEP6S9oucR23EpqDSZOCQyK1hZAW5hqTJ/HeK2Vd9FQcmI1bL4jhIWrchBa4Oc3bbOd4VU57nhUU/ZajG3RqPoWo34gfh61Yr4tTHLho9cf7wSyA4Wzy+5M3Z1fTk0BCMb6P3tFWdh/FMCpfaxfsvZo6OLhuhHQn6EnrRg6u/mVsuKkDewUphAFOFlqsvoT+Dy7cAVWMpWuxFgkb71nS6ujO5E31ap/5Nk5tVkMl9eDuzFqORX4MkhXMa3rGe9rv6Qkig7La/Tnwr14NmpkyLiv4giEVlTTfx3ZbubvpwysOi8guUxP9vHgHlv35S1YqDSKYTo8nihBsnOfDZBqbxjQLHarPbo42c7KVz2AEgLR0pKTP2ks21Cj+jfj63twLGSWFxgz0/+5Idrfw2mivJxGkw== rajashree.28m@gmail.com"
		};

		needle.post("https://api.digitalocean.com/v2/account/keys",data, {headers:headers,json:true}, onResponse );
	},

	listKeys: function(onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/account/keys",{headers:headers}, onResponse)
	},

	delDroplet: function( dropletId, onResponse)
	{
		needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, null, {headers:headers}, onResponse)
	}
};

// #############################################
// #1 Print out a list of available regions
// Comment out when completed.
// https://developers.digitalocean.com/#list-all-regions
// use 'slug' property
/*client.listRegions(function(error, response)
{
	var data = response.body;
	//console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.regions )
	{
		for(var i=0; i<data.regions.length; i++)
		{
			console.log(data.regions[i]);
		}
	}
});*/

/*client.listImages(function(error, response)
{
	var data = response.body;
	//console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.images )
	{
		for(var i=0; i<data.images.length; i++)
		{
			console.log(data.images[i]);
		}
	}
});*/

/*client.getSshKey(function(error,response,body)
{
	var data = response.body;
	console.log(JSON.stringify(response.body));


});*/

/*client.listKeys(function(error,response,body)
{
	var data = response.body;
	console.log(JSON.stringify(response.body));
});*/
// #############################################
// #2 Extend the client object to have a listImages method
// Comment out when completed.
// https://developers.digitalocean.com/#images
// - Print out a list of available system images, that are AVAILABLE in a specified region.
// - use 'slug' property


// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.
 var name = "rsmandao"+os.hostname();
 var region = "nyc1"; // Fill one in from #1
 var image = "centos-6-5-x64"; // Fill one in from #2
client.createDroplet(name, region, image, function(err, resp, body)
 {
 	var data = resp.body;
 	console.log(body);
 	// StatusCode 202 - Means server accepted request.
 	if(!err && resp.statusCode == 202)
 	{
 		console.log( JSON.stringify( body, null, 3 ) );
 		console.log("Id : ", data.droplet.id);
 		dropletId = data.droplet.id;

 		//sleep.sleep(5);
 		var timerID = setInterval(function() {
			client.getDroplet(dropletId, function(error, response)
			{
				var data = response.body;
				console.log( JSON.stringify(response.body) );

				if( response.headers )
				{
					console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
				}

				if( data.droplet )
				{
					if(data.droplet.networks.v4.length > 0)
					{
						clearInterval(timerID);
						console.log("IP : ", data.droplet.networks.v4[0].ip_address);
						fs.writeFile("inventory","[webservers]\nnode0 ansible_ssh_host="+JSON.stringify(data.droplet.networks.v4[0].ip_address)+" ansible_ssh_user=root ansible_become=true",function (err) {
						  if (err) return console.log(err);
						  console.log("write successful");
						});
						/*fs.appendFile("inventory","node0 ansible_ssh_host=",function (err) {
						  if (err) return console.log(err);
						  console.log("append successful");
						});
						fs.appendFile("inventory",JSON.stringify(data.droplet.networks.v4[0].ip_address),function (err) {
						  if (err) return console.log(err);
						  console.log("append successful");
						});
						fs.appendFile("inventory"," ansible_ssh_user=root",function (err) {
						  if (err) return console.log(err);
						  console.log("append successful");
						});
						fs.appendFile("inventory"," ansible_become=root",function (err) {
						  if (err) return console.log(err);
						  console.log("append successful");
						});*/
					}
				}
			});
		},1000);
 	}
 });


// #############################################
// #4 Extend the client to retrieve information about a specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#retrieve-an-existing-droplet-by-id
// REMEMBER POST != GET
// Most importantly, print out IP address!
/*sleep.sleep(10);
client.getDroplet(dropletId, function(error, response)
{
	var data = response.body;
	console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}

	if( data.droplet )
	{
		console.log("IP : ", data.droplet.networks.v4[0].ip_address);
	}
});*/

// #############################################
// #5 In the command line, ping your server, make sure it is alive!
// ping xx.xx.xx.xx

// #############################################
// #6 Extend the client to DESTROY the specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/#delete-a-droplet
// HINT, use the DELETE verb.
// HINT #2, needle.delete(url, data, options, callback), data needs passed as null.
// No response body will be sent back, but the response code will indicate success.
// Specifically, the response code will be a 204, which means that the action was successful with no returned body data.
/*client.delDroplet(function (err,resp,body)
{
 	if(!err && resp.statusCode == 204)
 	{
			console.log("Deleted!");
 	}
});*/

// #############################################
// #7 In the command line, ping your server, make sure it is dead!
// ping xx.xx.xx.xx
// It could be possible that digitalocean reallocated your IP address to another server, so don't fret it is still pinging.
