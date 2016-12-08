app.controller('mapCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.users = [];
    $scope.currModalUser = "";
    $scope.data = [];
    $scope.avatarsMarkers = [];
    $scope.currChosenUser = null;

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

        $scope.users.forEach(function (curruser) {
            if ((curruser.user.nickname !== "gazu") && (curruser.user.nickname !== "kfirstar")) {
                $scope.avatarsMarkers.push({
                    user: curruser.user,
                    marker: L.animatedMarker([mapData[curruser.user.currLesID].location],
                                    { icon: new avatarIcon({ iconUrl: 'images/' + curruser.user.avatar }) })
                            .on('click', function() {
                                buildNodeLinesForUser(curruser.user, curruser.lessons);
                            })
                            .addTo(map)
                });
            } else if (curruser.user.nickname !== "kfirstar") {
                var guyLocation = _.clone(mapData[curruser.user.currLesID].location);
                guyLocation[1] -= 5;
                //guyLocation[0] -= 5;
                $scope.avatarsMarkers.push({
                    user: curruser.user,
                    marker: L.animatedMarker([guyLocation],
                                    { icon: new avatarIcon({ iconUrl: 'images/' + curruser.user.avatar }) })
                           .on('click', function() {
                                buildNodeLinesForUser(curruser.user, curruser.lessons);
                            })
                            .addTo(map)
                });
            } else {
                var kfirLocation = _.clone(mapData[curruser.user.currLesID].location);
                kfirLocation[1] += 5;
                //kfirLocation[0] -= 5;
                $scope.avatarsMarkers.push({
                    user: curruser.user,
                    marker: L.animatedMarker([kfirLocation],
                                    { icon: new avatarIcon({ iconUrl: 'images/' + curruser.user.avatar }) })
                            .on('click', function() {
                                buildNodeLinesForUser(curruser.user, curruser.lessons);
                            })
                            .addTo(map)
                });
            }
        });

       //buildNodeLinesForUser($scope.users[1].user.nickname, $scope.users[1].lessons);

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

            L.circleMarker(new L.LatLng(place[0], place[1]), circleOptions)
                            .on('click', function () { moveMarker(place); })
                            .addTo(map);

            map.addLayer(overlay);
            count++;
        });

        // build all lines between knowledge points
        /*for (kpName in mapData) {
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
            //wholePolyline = [];
        }*/

        map.on('click', function (ev) {
            clearMap();
            console.log(JSON.stringify(ev.latlng)); // ev is an event object (MouseEvent in this case)
        });
    };

    function moveMarker(place) {
        var markerToMove = null;
        var index = 0;
        if ($scope.currChosenUser === null) return;
        $scope.avatarsMarkers.forEach(function (currmarker) {
            if (currmarker.user.id == $scope.currChosenUser.id) {
                markerToMove = currmarker;
            }
            else {
                index++;
            }
        });

        var line = findPolyline(place);
        $scope.avatarsMarkers[index].marker.setLine(line.getLatLngs());
    }

    function findPolyline(place) {
        var nextPolys = [];
        var currPoly = currPolylines.pop();
        var selectedPoly;

        while (currPoly !== "END PAST STUDIES") {
            nextPolys.push(currPoly);
            var currPoly = currPolylines.pop();
        }

        for (i in nextPolys) {
            var currPolyArr = nextPolys[i].getLatLngs();
            if ((currPolyArr[0][0].lat === place[0] && currPolyArr[0][0].lng === place[1]) ||
                (currPolyArr[0][1].lat === place[0] && currPolyArr[0][1].lng === place[1])) {
                selectedPoly=nextPolys[i];
                break;
            }
        }

        nextPolys.push(currPoly);
        currPoly = nextPolys.pop();
        while (currPoly) {
            currPolylines.push(currPoly);
            currPoly = nextPolys.pop();
        }

        if (selectedPoly !== undefined) return selectedPoly;
    }

    var currPolylines = [];

    function clearMap() {
        while (currPolylines.length) {
            var currPoly = currPolylines.pop();
            if (currPoly !== "END PAST STUDIES") {
                map.removeLayer(currPoly);
            }
        }
    }

    function buildNodeLinesForUser(chosenUser, userLessons) {
        $scope.currChosenUser = chosenUser;
        var username = chosenUser.nickname;
        clearMap();

        var listNode = buildUserLessonsLinkedList(userLessons);
        var lastNode = undefined;

        while (listNode) {
            var smallPolyline = [];
            var wholePolyline = [];
            if (listNode.leadsTo) {
                smallPolyline.push(mapData[listNode.lesID].location);
                smallPolyline.push(mapData[listNode.leadsTo.lesID].location)
                wholePolyline.push(smallPolyline);
                var poly = L.polyline(wholePolyline, polyOptions);
                poly.addTo(map);
                currPolylines.push(poly);
            }
            L.popup({ autoClose: false }).setLatLng([mapData[listNode.lesID].location[0],
                                                     mapData[listNode.lesID].location[1]])
                                         .setContent(listNode.lesID + ' - ' + listNode.name)
                                         .openOn(map);
            lastNode = listNode;
            listNode = listNode.leadsTo;
        }

        if (lastNode.lesID === 12) {
            L.popup({ autoClose: false }).setLatLng([mapData[lastNode.lesID].location[0],
                                                     mapData[lastNode.lesID].location[1]])
                                         .setContent(lastNode.lesID + ' - ' + lastNode.name)
                                         .openOn(map);
        } else {
            currPolylines.push("END PAST STUDIES");
            polyOptions.color = "red";
            polyOptions.opacity -= 0.30;
            polyOptions.weight = 7;
            nodesToGoTo = _.clone(_.find($scope.data, function(part) { return part.lesID === lastNode.lesID; }).leadsTo);
            for (i in nodesToGoTo) {
                if ((username !== "kfirstar" && username !== "gazu") ||
                    ((username === "kfirstar") && (nodesToGoTo[i].lesID !== 8)) ||
                    ((username === "gazu") && (nodesToGoTo[i].lesID !== 10))) {
                    var smallPolyline = [];
                    var wholePolyline = [];
                    smallPolyline.push(mapData[lastNode.lesID].location);
                    smallPolyline.push(mapData[nodesToGoTo[i].lesID].location)
                    wholePolyline.push(smallPolyline);
                    var poly = L.polyline(wholePolyline, polyOptions);
                    poly.addTo(map);
                    currPolylines.push(poly);
                    L.popup({ autoClose: false }).setLatLng([mapData[nodesToGoTo[i].lesID].location[0],
                                                            mapData[nodesToGoTo[i].lesID].location[1]])
                                                .setContent(nodesToGoTo[i].lesID + ' - ' + nodesToGoTo[i].name)
                                                .openOn(map);
                }
            }
            polyOptions.color = "yellow";
            polyOptions.opacity += 0.30;
            polyOptions.weight = 5;
        }
    }

    function buildUserLessonsLinkedList(userLessons) {
        var node = userLessons[0];
        var firstNode = node;

        for (var i = 1; i < userLessons.length; i++) {
            node.leadsTo = _.clone(_.find($scope.data, function (part) { return part.lesID === userLessons[i].lesID; }));
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