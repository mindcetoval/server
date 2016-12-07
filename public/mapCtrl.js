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
        [-36.125, 5.875],
        [-55.875, 4.375],
        [-70.875, 27.5],
        [-65.875, 53.125],
        [-79.875, 86],
        [-44, 83.875],
        [-32.5, 116],
        [-26, 70.875]
    ];

    var polyOptions = {
        color: 'yellow',
        weight: 5,
        dashArray: '5, 15',
        fill: false,
        opacity: 0.6
    };

    var circleOptions = {
        color: 'yellow',
        weight: 3,
        opacity: 0.6
    };

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
                new L.LatLng(place[0], place[1]),
                new L.LatLng(place[0] - height, place[1] + width));

            var overlay = new L.ImageOverlay("images/markers/" + count + ".png", bounds, {
                opacity: 1.0,
                interactive: true,
                attribution: count
            });

            L.circleMarker(new L.LatLng(place[0], place[1]), circleOptions).addTo(map);

            map.addLayer(overlay);
            count++;
        });

        var polyline = L.polyline(places, polyOptions).addTo(map);

        map.on('click', function (ev) {
            console.log(JSON.stringify(ev.latlng)); // ev is an event object (MouseEvent in this case)
        });
    })();
}]);