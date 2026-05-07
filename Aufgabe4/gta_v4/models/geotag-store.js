// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...


    //Teil 1 geändert
#geotags;
#nextId;    //geändert

    constructor() {
        this.#geotags = [];
        this.#nextId = 1; //geändert
    }

    addGeoTag(geotag) {
         geotag.id = this.#nextId;
        this.#nextId++;
        this.#geotags.push(geotag);
        return geotag;
    }

    removeGeoTag(name) {

        this.#geotags = this.#geotags.filter(function(geotag) {
         return geotag.name !== name;
        });

    }
    getGeoTagById(id) { //neu

        return this.#geotags.find(function(geotag) {
            return geotag.id == id;
        });
    }
updateGeoTag(id, geotag) { //neu

        var oldGeoTag = this.getGeoTagById(id);
        if (oldGeoTag !== undefined) {
            oldGeoTag.latitude = geotag.latitude;
            oldGeoTag.longitude = geotag.longitude;
            oldGeoTag.name = geotag.name;
            oldGeoTag.hashtag = geotag.hashtag;
        }
        return oldGeoTag;

    }

    removeGeoTagById(id) { //neu

        var geotag = this.getGeoTagById(id);
        this.#geotags = this.#geotags.filter(function(geotag) {
            return geotag.id != id;
        });
        return geotag;
    }

    getNearbyGeoTags(location, radius) {

        return this.#geotags.filter(function(geotag) {
            var distance = Math.sqrt(
                Math.pow(geotag.latitude - location.latitude, 2) +
                Math.pow(geotag.longitude - location.longitude, 2)

            );

            return distance <= radius;

        });

    }

    searchNearbyGeoTags(location, radius, keyword) {

        var nearbyGeoTags = this.getNearbyGeoTags(location, radius);
        return nearbyGeoTags.filter(function(geotag) {
        return geotag.name.includes(keyword) || geotag.hashtag.includes(keyword);

        });

    }
}
//Teil 1 geändert ende
module.exports = InMemoryGeoTagStore
