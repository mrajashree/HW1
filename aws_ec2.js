var AWS = require('aws-sdk');
var fs = require("fs");
AWS.config.region = 'us-west-2';
AWS.config.update({accessKeyId: process.argv[2], secretAccessKey: process.argv[3]});
var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-44da5574', // Platform: Amazon Linux, Owner: Amazon Images Virtualization: HVM
  InstanceType: 't2.micro',
  MinCount: 1, MaxCount: 1, KeyName: process.argv[4]
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  //console.log("Created instance", instanceId);
  console.log(data);

  var param = {InstanceIds: [instanceId]};
  var timerID = setInterval( function() {
	  ec2.describeInstances(param, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else  
	  {
	  	if(data.Reservations[0].Instances[0].PublicIpAddress)
	  	{
	  		console.log( "instances!!!! : ",data.Reservations[0].Instances[0]);
	  		clearInterval(timerID);
		  	console.log("public ip",data.Reservations[0].Instances[0].PublicIpAddress);
		  	/*fs.writeFile("inventory","[webservers]\n",function (err) {
				  if (err) return console.log(err);
				  console.log("write successful");
				});*/
	  			fs.appendFile("inventory","\nnode1 ansible_ssh_host="+JSON.stringify(data.Reservations[0].Instances[0].PublicIpAddress)+" ansible_ssh_user=ec2-user ansible_become=true ansible_ssh_private_key_file="+process.argv[4]+".pem",function (err) {
				  if (err) return console.log(err);
				  console.log("append successful");
				});
				/*fs.appendFile("inventory",JSON.stringify(data.Reservations[0].Instances[0].PublicIpAddress),function (err) {
				  if (err) return console.log(err);
				  console.log("append successful");
				});
				fs.appendFile("inventory"," ansible_ssh_user=ec2-user",function (err) {
				  if (err) return console.log(err);
				  console.log("append successful");
				});
				fs.appendFile("inventory"," ansible_become=true",function (err) {
				  if (err) return console.log(err);
				  console.log("append successful");
				});*/
			}
	  	//console.log(data);  
	    }   //console.log(data);           // successful response
	});
	},1000);
  // Add tags to the instance
  params = {Resources: [instanceId], Tags: [
    {Key: 'Name', Value: 'instanceName1'}
  ]};
  ec2.createTags(params, function(err) {
    console.log("Tagging instance", err ? "failure" : "success");
  });
});

