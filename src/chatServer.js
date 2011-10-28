/**
* A chat server over TCP written in javascript using node.js
* The source is available at http://github.com/swvist/chatServer
* @author Vipin Nair <swvist@gmail.com>
* @copyright Copyright (C) 2011, Vipin Nair 
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.

* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
* Module for network connections
*/
var net = require('net');

/**
* Helper Module for new line terminated protocols
*/
var carrier = require('carrier');

/**
* User object constructor
*/
function user(uname,conn){
	this.username=uname;
	this.conn=conn;
}

/**
* Array to keep track of online users
*/
var onlineUsers = [];

/**
* Returns the reciever details from the message
*/
function toUser(str){
	if(str.charAt(0)==='@'){
		var uname = (str.split(' ',1)).toString();
		return uname.slice(1,uname.length);
	}
}

/**
* Returns the string after removing reciever details
*/
function extractMessage(str){
	return str.substr(str.indexOf(' ')+1,str.length);
}


var server = new net.createServer(function(conn){
	console.log("Connection Established\n");
	var u = new user();
	conn.write("\n\nWelcome to chatServer V1.0\nThis a free software published under GPLv3\nType '@<USERNAME> <MESSSAGE>' to chat with <USERNAME>\nType '@All <MESSAGE>' to brodcast a message to everyone.\n");
	if(onlineUsers.length==0){
		conn.write("There are no users online. Please wait for new users to join.\n");
	}
	else{
		userList = "";
		onlineUsers.forEach(function(person){
			userList =  person.username + '\t';
		});
		conn.write("Online Users : " + userList + "\n");
	}
	conn.write("Enter Username : ");
	carrier.carry(conn,function(line){
		if(!u.username){
			u.username = line;
			u.conn=conn;
			onlineUsers.push(u);
		}
		if(line == "quit"){
			conn.end();
			onlineUsers.splice(onlineUsers.indexOf(u),1);
		}
		reciever = toUser(line);
		msg = extractMessage(line);
		formattedLine = u.username + "=>" +reciever+" : "+ msg + "\n";
		onlineUsers.forEach(function(person){
			if(reciever!="All"){
				if(person.username!=u.username && person.username==reciever){
					person.conn.write(formattedLine);
				}
			}
			else{
				person.conn.write(formattedLine);
			}
		});
	});
}).listen(9999);

