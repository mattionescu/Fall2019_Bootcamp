
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js');
    
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial 
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
  

  If you are looking for more understanding of exports and export modules - 
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
 
  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
      console.log(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  if(req.listing)
  {
    //res.send('<pre>' + JSON.stringify(req.listing, null, 2) + '</pre>');
    res.json(req.listing);
    //res.body = JSON.stringify(req.listing);
  }
  else
    res.status(404).send("Error: No listing under that ID exists!");
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
  var listing = req.listing;

  /* Replace the listings's properties with the new properties found in req.body */
 
  /*save the coordinates (located in req.results if there is an address property) */
 
  /* Save the listing */
  if(req.results) {
    req.body.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }

  Listing.findOneAndUpdate({name: listing.name}, req.body, function(err, list) {
    if(err) throw err;

    console.log(list);
    //res.send(list);
    //res.body = req.body;
  });

  Listing.findOne({name: listing.name}, (err, list) => {
    if(err) throw err;

    res.send(list);
  });
};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

  /* Add your code to remove the listins */

  if(!listing)
  {
    res.status(404).send("Error: No listing under that ID exists!");
    return;
  }

  Listing.findOneAndDelete({name: listing.name}, function(err, list) {
    if(err) throw err;

    console.log(list);
    res.send(list);
  });
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /* Add your code */

  Listing.find({}, function(err, listings) {
    if(err) throw err;

    //res.send('<pre>' + JSON.stringify(listings.sort((a, b) => a.code.localeCompare(b.code)), null, 2) + '</pre>');
    //res.body = JSON.stringify(listings);
    res.json(listings);
  });
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};