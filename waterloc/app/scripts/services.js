'use strict';

/* exported ServiceModule */
/* The above comment disables the JSHint warning of ServiceModule being defined but not used. */

var ServiceModule = (function() {

    var UWaterlooService = function() {
        this.key = 'fd2bc452154992349cf2b7186118715e';
        this.urlPrefix = 'https://api.uwaterloo.ca/v2';
    };


    _.extend(UWaterlooService.prototype, {
        queryBuildings: function() {
            var that = this;
            var result;
            return new Promise(function(resolve,reject){
                var request = new XMLHttpRequest();
                var url = that.urlPrefix + '/buildings/list.json?key=' + that.key;
                request.open('GET', url);
                request.onload = function(){
                    if (this.status === 200){
                        result = JSON.parse(this.responseText);
                        resolve(result);
                    }
                };
                request.onerror = function(e){
                    reject(e);
                };

                request.send();
            });
        },

        getBuilding: function(buildingCode) {
            var that = this;
            var result;
            return new Promise(function(resolve,reject){
                var request = new XMLHttpRequest();
                var url = that.urlPrefix + '/buildings/'+ buildingCode +'.json?key=' + that.key;
                request.open('GET', url);
                request.onload = function(){
                    if (this.status === 200){
                        result = JSON.parse(this.responseText);
                        resolve(result);
                    }
                };
                request.onerror = function(e){
                    reject(e);
                };

                request.send();
            });
        }
    });

    var GoogleMapService = function() {
        this.markers = {};
        this.map = null;
    };

    _.extend(GoogleMapService.prototype, {
        initialize: function() {
            var that = this;
            google.maps.event.addDomListener(window, 'load', function(){
                that.map = new google.maps.Map(document.getElementById('container'),{
                    zoom: 15, center:{lat: 43.47273,lng: -80.541218}});
            });
        },

        addMarker: function(lat, lng, code) {
            var p = new google.maps.LatLng(lat,lng);
            var m = new google.maps.Marker({
                position: p,
                map: this.map,
                title: code
            });
            this.markers[code] = m;
        },

        removeMarker: function(code){
            this.markers[code].setMap(null);
            this.markers[code] = null;
        },
    });


    return {
        UWaterlooService: UWaterlooService,
        GoogleMapService: GoogleMapService
    };

})();




