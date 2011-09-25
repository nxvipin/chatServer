/**
* A chat server over TCP written in javascript using node.js
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

// Module for network connections
var net = require('net');
// Helper Module for new line terminated protocols
var carrier = require('carrier');
//User object constructor
function user(uname,conn){
	this.username=uname;
	this.conn=conn;
}
//Array to keep track of online users
var onlineUsers = [];

var server = new net.createServer(function(conn){
	console.log("Connection Established\n");
	var u = new user();
	conn.write("Hello World!\n");
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
		formattedLine = u.username + " : " + line + "\n";
		onlineUsers.forEach(function(person){
			if(person.username!=u.username){
				person.conn.write(formattedLine);
			}
		});
	});
}).listen(9994);

