app.controller('mapCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.users = [];
    $scope.currModalUser = "";
    $http.get('/users').success(function (data) {
        $scope.users = data;
        buildLessonsLinkedList(data[0].lessons);
    }).error(function (err) {
        console.log(err);
    });

    $scope.setCurrModalUser = function (userNick) {
        $scope.currModalUser = _.find($scope.users, function(user) { return user.user.nickname === userNick; });
        // As pointed out in comments, 
        // it is superfluous to have to manually call the modal.
        // $('#addBookDialog').modal('show');
    };

    var layer;
    var map;

    var height = 7;
    var width = 7;

    var data = [
    {
    lesID: 1,
    lesson: "Lesson01 - Mavo.docx",
    name: "שיעור מבוא",
    leadsTo: [
    {
    lesID: 2,
    name: "טיפוס ADT - לימוד עצמי",
    lesson: "Lesson02 - ADT.docx",
    id: 77
    },
    {
    lesID: 3,
    name: "טיפוס ADT - שיעור פרונטלי",
    lesson: "Lesson02 - ADT.docx",
    id: 78
    }
    ]
    },
    {
    lesID: 2,
    lesson: "Lesson02 - ADT.docx",
    name: "טיפוס ADT - לימוד עצמי",
    leadsTo: [
    {
    lesID: 4,
    lesson: "Lesson03 - This.docx",
    name: "this - לימוד עצמי",
    id: 79
    },
    {
    lesID: 5,
    name: "this - MOOC",
    lesson: "Udemy",
    id: 80
    }
    ]
    },
    {
    lesID: 3,
    lesson: "Lesson02 - ADT.docx",
    name: "טיפוס ADT - שיעור פרונטלי",
    leadsTo: [
    {
    lesID: 4,
    lesson: "Lesson03 - This.docx",
    name: "this - לימוד עצמי",
    id: 79
    },
    {
    lesID: 5,
    name: "this - MOOC",
    lesson: "Udemy",
    id: 80
    }
    ]
    },
    {
    lesID: 4,
    lesson: "Lesson03 - This.docx",
    name: "this - לימוד עצמי",
    leadsTo: [
    {
    lesID: 6,
    lesson: "Lesson04 - Ctor Summary.docx",
    name: "Ctor",
    id: 81
    }
    ]
    },
    {
    lesID: 5,
    lesson: "Udemy",
    name: "this - MOOC",
    leadsTo: [
    {
    lesID: 6,
    lesson: "Lesson04 - Ctor Summary.docx",
    name: "Ctor",
    id: 81
    }
    ]
    },
    {
    lesID: 6,
    lesson: "Lesson04 - Ctor Summary.docx",
    name: "Ctor",
    leadsTo: [
    {
    lesID: 7,
    lesson: "Lesson05 - Basic Inhertiance.docx",
    name: "ירושה בסיסית",
    id: 82
    }
    ]
    },
    {
    lesID: 7,
    lesson: "Lesson05 - Basic Inhertiance.docx",
    name: "ירושה בסיסית",
    leadsTo: [
    {
    lesID: 8,
    lesson: "Lesson06 - Inhertiance.docx",
    name: "ירושה - לימוד עצמי",
    id: 83
    },
    {
    lesID: 9,
    lesson: "Lesson06 - Inhertiance.docx",
    name: "ירושה - כיתה הפוכה",
    id: 84
    },
    {
    lesID: 10,
    lesson: "Lesson06 - Inhertiance.docx",
    name: "ירושה - שיעור פרונטלי",
    id: 85
    }
    ]
    },
    {
    lesID: 8,
    lesson: "Lesson06 - Inhertiance.docx",
    name: "ירושה - לימוד עצמי",
    leadsTo: [
    {
    lesID: 11,
    lesson: "Lesson07 - Design Patterns.docx",
    name: "Design Patterns",
    id: 86
    }
    ]
    },
    {
    lesID: 9,
    lesson: "Lesson06 - Inhertiance.docx",
    name: "ירושה - כיתה הפוכה",
    leadsTo: [
    {
    lesID: 11,
    lesson: "Lesson07 - Design Patterns.docx",
    name: "Design Patterns",
    id: 86
    }
    ]
    },
    {
    lesID: 10,
    lesson: "Lesson06 - Inhertiance.docx",
    name: "ירושה - שיעור פרונטלי",
    leadsTo: [
    {
    lesID: 11,
    lesson: "Lesson07 - Design Patterns.docx",
    name: "Design Patterns",
    id: 86
    }
    ]
    },
    {
    lesID: 11,
    lesson: "Lesson07 - Design Patterns.docx",
    name: "Design Patterns",
    leadsTo: [
    {
    lesID: 12,
    lesson: "",
    name: "סיום מקצוע OOP",
    id: 87
    }
    ]
    },
    {
    lesID: 12,
    lesson: "",
    name: "סיום מקצוע OOP",
    leadsTo: [ ]
    }
    ];

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

    (function init() {

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

        var azul = new avatarIcon({ iconUrl: 'images/azul.png' });
        var kfir = new avatarIcon({ iconUrl: 'images/kfir.png' });
        var adir = new avatarIcon({ iconUrl: 'images/adir.png' });
        var ofer = new avatarIcon({ iconUrl: 'images/ofer.png' });

        L.marker(mapData[Object.keys(mapData)[0]].location, { icon: azul }).addTo(map).bindPopup("Shalom Lah");
        L.marker(mapData[Object.keys(mapData)[1]].location, { icon: kfir }).addTo(map).bindPopup("I`m Kfir");
        L.marker(mapData[Object.keys(mapData)[2]].location, { icon: adir }).addTo(map).bindPopup("I`m Adir");
        L.marker(mapData[Object.keys(mapData)[3]].location, { icon: ofer }).addTo(map).bindPopup("Leeee - Bemet ?");

        // Build the images on the places
        var count = 1;
        places.forEach(function(place) {
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

            kp.sons.forEach(function(son) {
                if (mapData[son.id]) {
                    smallPolyline.push(kp.location);
                    smallPolyline.push(mapData[son.id].location);
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

        map.on('click', function(ev) {
            console.log(JSON.stringify(ev.latlng)); // ev is an event object (MouseEvent in this case)
        });
    })();

    function buildNodeLines(lessonNodes, bFade) {
        
    }

    function buildLessonsLinkedList (userLessons) {
        var node = userLessons[0];
        var firstNode = node;

        for (var i = 1; i < userLessons.length; i++) {
            node.leadsTo = _.find($scope.data, function(part) { return part.lesID === userLessons[i].lesID; });
            node = node.leadsTo;
            delete node.leadsTo;
        }
        
        return firstNode;
    }

    function buildMapData() {
        var mapD = {};
        for (var count = 0; count < data.length; count++) {
            var curr = data[count];
            mapD[curr.id] = { 'name': curr.name, 'location': places[count], 'sons': curr.leadsTo };
        }

        return mapD;
    }
}]);