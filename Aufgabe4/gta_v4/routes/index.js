// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// GEÄNDERT AUS AUFGABE 3 ÜBERNOMMEN
const GeoTagExamples = require('../models/geotag-examples');
const geoTagStore = GeoTagExamples.geoTagStore;
const searchRadius = 0.02;
//ende
// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [],
    latitude: 49.01379,
    longitude: 8.390071 });
});

// GEÄNDERT: Route /tagging aus Aufgabe 3 übernommen

router.post('/tagging', (req, res) => {

  var geotag = new GeoTag(

    req.body.latitude,

    req.body.longitude,

    req.body.name,

    req.body.hashtag

  );

  geoTagStore.addGeoTag(geotag);

  var location = {

    latitude: req.body.latitude,

    longitude: req.body.longitude

  };

  var taglist = geoTagStore.getNearbyGeoTags(location, searchRadius);

  res.render('index', {

    taglist: taglist,

    latitude: req.body.latitude,

    longitude: req.body.longitude

  });

});

// GEÄNDERT ENDE

// GEÄNDERT: Route /discovery aus Aufgabe 3 übernommen

router.post('/discovery', (req, res) => {

  var location = {

    latitude: req.body.latitude,

    longitude: req.body.longitude

  };

  var taglist;

  if (req.body.searchterm !== '') {

    taglist = geoTagStore.searchNearbyGeoTags(location, searchRadius, req.body.searchterm);

  } else {

    taglist = geoTagStore.getNearbyGeoTags(location, searchRadius);

  }

  res.render('index', {

    taglist: taglist,

    latitude: req.body.latitude,

    longitude: req.body.longitude

  });

});

// GEÄNDERT ENDE
// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

// GEÄNDERT: REST GET /api/geotags
router.get('/api/geotags', (req, res) => {

  var taglist;
  var location = {
    latitude: req.query.latitude,
    longitude: req.query.longitude
  };

  if (req.query.searchterm !== undefined && req.query.searchterm !== '') {
    taglist = geoTagStore.searchNearbyGeoTags(location, searchRadius, req.query.searchterm);
  } else {
    taglist = geoTagStore.getNearbyGeoTags(location, searchRadius);
  }

  res.json(taglist);

});
/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

// GEÄNDERT: REST POST /api/geotags
router.post('/api/geotags', (req, res) => {

  var geotag = new GeoTag(
    req.body.latitude,
    req.body.longitude,
    req.body.name,
    req.body.hashtag
  );

  geotag = geoTagStore.addGeoTag(geotag);

  res.location('/api/geotags/' + geotag.id);
  res.status(201).json(geotag);

});
/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
// GEÄNDERT: REST GET /api/geotags/:id
router.get('/api/geotags/:id', (req, res) => {

  var geotag = geoTagStore.getGeoTagById(req.params.id);

  res.json(geotag);

});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
// GEÄNDERT: REST PUT /api/geotags/:id
router.put('/api/geotags/:id', (req, res) => {

  var geotag = new GeoTag(
    req.body.latitude,
    req.body.longitude,
    req.body.name,
    req.body.hashtag
  );

  geotag = geoTagStore.updateGeoTag(req.params.id, geotag);

  res.json(geotag);

});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
// GEÄNDERT: REST DELETE /api/geotags/:id
router.delete('/api/geotags/:id', (req, res) => {

  var geotag = geoTagStore.removeGeoTagById(req.params.id);

  res.json(geotag);

});
module.exports = router;
