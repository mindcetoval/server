app.controller('mapCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.users = [];
    $scope.currModalUser = "";
    $scope.data = [];
    $http.get('/users').success(function (data) {
        $scope.users = data;

        $http.get('/world').success(function (res) {
            $scope.data = res;
            init();
        }).error(function (err) {
            console.log(err);
        });
    }).error(function (err) {
        console.log(err);
    });

    $scope.setCurrModalUser = function (userNick) {
        $scope.currModalUser = _.find($scope.users, function (user) { return user.user.nickname === userNick; });
        // As pointed out in comments, 
        // it is superfluous to have to manually call the modal.
        // $('#addBookDialog').modal('show');
    };

    var layer;
    var map;

    var height = 7;
    var width = 7;

    // good places to put things on the map
    var places = [
        [-26, 70.875],
        [-55.875, 4.375],
        [-20.125, 103.375],
        [-79.875, 86],
        [-57.375, 30.25],
        [-70.875, 27.5],
        [-44, 83.875],
        [-36.125, 5.875],
        [-65.875, 53.125],
        [-32.5, 116],
        [-34.875, 49.875],
        [-34.875, 49.875]
    ];

    // definitions for colors and other things
    var polyOptions = {
        color: 'yellow',
        weight: 5,
        dashArray: '5, 15',
        fill: false,
        opacity: 1.0
    };

    var circleOptions = {
        color: 'yellow',
        weight: 3,
        opacity: 0.6
    };

    var mapData = {};

    function init() {

        // greate a map between the data from db id and content
        mapData = buildMapData();

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
            minZoom: mapMinZoom,
            maxZoom: mapMaxZoom,
            bounds: mapBounds,
            noWrap: true,
            tms: false
        }).addTo(map);

        // create the avatars
        var avatarIcon = L.Icon.extend({
            options: {
                iconSize: [50, 75],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76]
            }
        });

        var avatarsMarkers = [];

        $scope.users.forEach(function (curruser) {
            avatarsMarkers.push({
                user: curruser.user,
                marker: L.animatedMarker([mapData[curruser.user.currLesID].location], { icon: new avatarIcon({ iconUrl: 'images/' + curruser.user.avatar }) }).addTo(map)
            });
        });

        // Build the images on the places
        var count = 1;
        places.forEach(function (place) {
            var bounds = new L.LatLngBounds(
                new L.LatLng(place[0], place[1]),
                new L.LatLng(place[0] - height, place[1] + width));

            var overlay = new L.ImageOverlay("images/markers/" + count + ".png", bounds, {
                opacity: 1.0,
                interactive: true
            });

            L.circleMarker(new L.LatLng(place[0], place[1]), circleOptions).addTo(map);

            map.addLayer(overlay);
            count++;
        });

        // build all lines between knowledge points
        for (kpName in mapData) {
            var kp = mapData[kpName];
            var wholePolyline = [];
            var smallPolyline = [];

            kp.sons.forEach(function (son) {
                if (mapData[son.lesID]) {
                    smallPolyline.push(kp.location);
                    smallPolyline.push(mapData[son.lesID].location);
                    wholePolyline.push(smallPolyline);
                    smallPolyline = [];
                }
            });

            var polyline = L.polyline(wholePolyline, polyOptions).addTo(map);

            polyOptions.opacity -= 0.13;
            // L.marker(, { title: kp.name }).addTo(map);
            L.popup({ autoClose: false }).setLatLng([kp.location[0], kp.location[1]]).setContent(kpName + ' - ' + kp.name).openOn(map);
            wholePolyline = [];
        }


        var line = L.polyline([mapData[avatarsMarkers[0].user.currLesID].location, , findNextLocation(avatarsMarkers[0].user.currLesID)]);
        avatarsMarkers[0] = L.animatedMarker(line.getLatLngs());
            

        map.on('click', function (ev) {
            console.log(JSON.stringify(ev.latlng)); // ev is an event object (MouseEvent in this case)
        });
    };

    function buildNodeLines(lessonNodes, bFade) {

    }

    function findNextLocation(kpId) {
        return mapData[mapData[kpId].sons[0].lesID].location;
    }

    function buildLessonsLinkedList(userLessons) {
        var node = userLessons[0];
        var firstNode = node;

        debugger
        for (var i = 1; i < userLessons.length; i++) {
            node.leadsTo = _.find($scope.data, function (part) { return part.lesID === userLessons[i].lesID; });
            node = node.leadsTo;
            delete node.leadsTo;
        }

        return firstNode;
    }

    function buildMapData() {
        var mapD = {};
        for (var count = 0; count < $scope.data.length; count++) {
            var curr = $scope.data[count];
            mapD[curr.lesID] = { 'name': curr.name, 'location': places[count], 'sons': curr.leadsTo, 'lesID': curr.lesID };
        }

        return mapD;
    }
}]);