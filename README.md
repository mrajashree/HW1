#Provisioning and Configuring Servers

## Service Providers
I have used Digital Ocean and AWS as the Service Providers.
First I need to run the command npm install.
```
npm install
```
This installs all the dependencies specified in the package.json file
The node_modules folder created by running this command should contain the required dependencies: aws-sdk, needle, fs.

### 1. Digital Ocean

1. First step is creating an account with Digital Ocean, and obtaining my api key. Otherwise I would have to manually copy it in the ~/.ssh/authorized_keys file of the droplet.
2. The createDroplet method returns the public IP address of the droplet.
3. The node js file then creates an inventory file and enters the IP address of this droplet. The following command creates the inventory file and enters the IP address in it.
```
node digital_ocean.js <config.token> <id of your ssh key>
```

### 2. AWS

1. On creating an AWS account, first step was creating a Security Group and editing the Inbound rules for that group. The following rules need to be added to the existing default one:
Type: All TCP, Protocol: TCP, Port Range: 0-65535, Source: 0.0.0.0/0
Type: SSH, Protocol: TCP, Port: 22, Source: 0.0.0.0/0
Type: All ICMP, Protocol: All, Port Range: N/A, Source: 0.0.0.0/0
2. Next step is creating a User. For every user, a 'credentials' file is provided. This file contains the accessKeyId and secretAccessKey for the User. Save this file. Add this user to the group created in step 1.
3. The AWS SDK for Javascript documentation has a lot of examples and my code uses the one provided for ec2 instances.
http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html
4. The runInstances method creates an instance and the describeInstances method retrieves the public IP address of the created instance. It also creates an inventory and fills the IP address in it. The following command creates the inventory file and enters the IP address in it.
```
node aws_ec2.js <accessKeyId> <secretAccessKey> <name of .pem file (without .pem extension)>
```

### Deploy nginx webserver

The ec2 instance takes around a minute to get running and so one must wait before running the ansible command and check the status of the instance. We can determine whether the servers are running by pinging them. The following command is used to ping the created droplet and instance:
```
ansible all -m ping -i inventory
```
The ansible playbook then deploys the nginx webserver on the droplet who's IP address is entered in the inventory by the js program. The command used is as follows:
```
ansible-playbook nginx.yml -i inventory
```

## Ansible playbook
The digital ocean tutorial on ansible playbooks was very helpful in creating the playbook:
https://www.digitalocean.com/community/tutorials/how-to-create-ansible-playbooks-to-automate-system-configuration-on-ubuntu

The playbook has two tasks, one to install epel and the other to install nginx, because Cent os required epel.

## AWS service description - Amazon Route 53
Amazon Route 53 is a highly available and scalable DNS web service. It gives developers an extremely reliable way of managing their domains. As for all other services, Amazon provides good documentation for Route 53 as well. It lets you register domain names, translates domain names into IP addresses and sends automated requests over to the internet to your application to verify that it's reachable, available and functional. It is designed to work closely with other services like EC2, S3 etc

## Link to screencast
https://www.youtube.com/watch?v=__7vmlyiCT4&feature=youtu.be
