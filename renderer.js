// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {shell} = require('electron');
var Datastore = require('nedb');
var db = new Datastore({ 
      filename: 'data/datafile',
      autoload: true 
});

db.find({}, function (err, docs) {
	console.log(docs);
});

