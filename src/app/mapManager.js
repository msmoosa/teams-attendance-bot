
module.exports = {
    apiKey: 'AIzaSyAigIP1uFVRZYSxwStIZ6JjoWJtGE0pCK8',
    getMapUrl: function (locations) {
        if (!locations || locations.length === 0) {
            return 'https://i.imgur.com/2FjmDkz.png';
        }

        return 'https://maps.googleapis.com/maps/api/staticmap?center=' + this.getPair(locations[0]) + '&zoom=13&size=800x600' +
            '&markers=' + locations.reduce((markers, location) => markers + '|' + this.getPair(location), '') +
            '&key=AIzaSyAigIP1uFVRZYSxwStIZ6JjoWJtGE0pCK8';
    },
    getPair: function (location) {
        return location.lat + ',' + location.lng;
    }
}