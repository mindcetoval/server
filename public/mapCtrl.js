app.controller('mapCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.users = [];

    $http.get('/users').success(function (data) {
        $scope.users = data;
    }).error(function (err) {
        console.log(err);
    });
    var layer;
    var map;

    var height = 7;
    var width = 7;

    var places = [
        { "lat": -36.125, "lng": 5.875 },
        { "lat": -55.875, "lng": 4.375 },
        { "lat": -70.875, "lng": 27.5 },
        { "lat": -65.875, "lng": 53.125 },
        { "lat": -79.875, "lng": 86 },
        { "lat": -44, "lng": 83.875 },
        { "lat": -32.5, "lng": 116.5 },
        { "lat": -26, "lng": 70.875 }
    ];

    (function init() {
        var mapMinZoom = 0;
        var mapMaxZoom = 4;
        map = L.map('map', {
            maxZoom: mapMaxZoom,
            minZoom: mapMinZoom,
            crs: L.CRS.Simple
        }).setView([0, 0], mapMaxZoom);

        var mapBounds = new L.LatLngBounds(
            map.unproject([0, 1792], mapMaxZoom),
            map.unproject([2304, 0], mapMaxZoom));

        map.fitBounds(mapBounds);
        layer = L.tileLayer('eso/{z}/{x}/{y}.png', {
            minZoom: mapMinZoom, maxZoom: mapMaxZoom,
            bounds: mapBounds,
            noWrap: true,
            tms: false
        }).addTo(map);

        var count = 1;
        places.forEach(function (place) {
            var bounds = new L.LatLngBounds(
                new L.LatLng(place.lat, place.lng),
                new L.LatLng(place.lat - height, place.lng + width));

            var overlay = new L.ImageOverlay("images/markers/" + count + ".png", bounds, {
                opacity: 1.0,
                interactive: true,
                attribution: count
            });

            map.addLayer(overlay);
            count++;
        })

        map.on('click', function (ev) {
            console.log(JSON.stringify(ev.latlng)); // ev is an event object (MouseEvent in this case)
        });
    })();
}]);