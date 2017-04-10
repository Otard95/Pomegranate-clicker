/*
 *¨Initilize socket.io
 */

var socket = io();

socket.on('hasPlayer', function(data) {
  console.log(data);
});

socket.on('userCreate', function(data) {
  console.log(data);
});

socket.on('welcome', function(data) {
  console.log(data);
});
