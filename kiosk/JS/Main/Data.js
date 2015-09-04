var Data = ( function () {
    /* Private properties */
    var pub = {},
        computerJSON_URL = "http://libstaff.bc.edu/labstats/?callback=?",
        roomsJSON_Path = "JSON/rooms.json",
        stacksJSON_Path = "JSON/stacks.json",
        studyRoomsJSON_URL = "http://arc.bc.edu/rooms/?callback=?",
        hoursJSON_URL = "https://api3.libcal.com/api_hours_today.php?iid=609&format=json&weeks=1&lid=0&callback=?",
        eventsJSON_URL = "http://libstaff.bc.edu/libcal/?callback=?",
        subjectsJSON_Path = "JSON/subjects.json",
        campusJSON_Path = "JSON/CampusMap.json";

    /* Public properties */
    pub.compJSON = null;
    // JSON for computer availability
    pub.roomsPeopleJSON = null;
    // JSON for room information
    pub.studyRoomsJSON = null;
    // JSON for study room availability
    pub.statsJSON = {
        "stateEvents": [/* Empty */]
    };
    // JSON to be sent to server for tracking usage statistics
    pub.hoursJSON = null;
    // JSON for library hours
    pub.eventsJSON = null;
    // JSON for library events
    pub.stacksJSON = null;
    // JSON for stack categories
    pub.subjectsJSON = null;
    // JSON for subjects
    pub.campusLocationsJSON = null;
    // JSON for lat/long, information regarding campus locations for google maps

    ( function eventsJSONInterval() {
        var minutes = 60;
        /* Initial load */
        retrieveEvents();

        setInterval(function () {
            var d = new Date();
            var n = d.getHours();
            if (n == 12)
                retrieveEvents();
        }, minutes * 60000)
    }());

    function retrieveEvents() {
        $.getJSON(eventsJSON_URL, function (data) {
            pub.eventsJSON = data;
        })
    }

    pub.shouldWePostHeatMap = function () {
        var totalLengthLimit = 200;
        if (Heatmap.mapsLength() >= totalLengthLimit) {
            postHeatMap();
            Heatmap.resetTargetData();
        }
    };

    function postHeatMap() {
        var data = Heatmap.heatMapTargetData();

        $.ajax({
            type: "POST",
            url: "http://libstaff.bc.edu/kiosk-stats/heatmap",
            data: JSON.stringify(data)
        });
    }

    pub.addStateEvent = function (stateEvent) {
        stateEvent["timestamp"] = Math.floor(+new Date / 1000);
        pub.statsJSON["stateEvents"].push(stateEvent);
        shouldWePostStats();
    };

    function shouldWePostStats() {
        var totalLengthLimit = 10;

        if (pub.statsJSON["stateEvents"].length >= totalLengthLimit) {
            postStats();
            pub.statsJSON = {"stateEvents": []};
        }
    }

    function postStats() {
        $.ajax({
            type: "POST",
            url: "http://libstaff.bc.edu/kiosk-stats/",
            data: JSON.stringify(pub.statsJSON)
        });
    }

    ( function compJSONInterval() {
        var seconds = 30;
        /* Initial load */
        retrieveComputerJSON();

        /* Every N seconds */
        setInterval(retrieveComputerJSON, seconds * 1000)
    }());

    function retrieveComputerJSON() {
        $.getJSON(computerJSON_URL, function (data) {
            pub.compJSON = data;
        })
    }

    ( function hoursJSONInterval() {
        var minutes = 60;
        /* Initial load */
        retrieveHoursJSON();

        setInterval(function () {
            var d = new Date();
            var n = d.getHours();
            if (n == 12)
                retrieveHoursJSON();
        }, minutes * 60000)
    }());

    function retrieveHoursJSON() {
        $.getJSON(hoursJSON_URL, function (data) {
            console.log(data)
            pub.hoursJSON = data;
        })
    }

    /* Synchronous ajax calls at startup */

    ( function subjectsJSON() {
        $.ajax({
            'async': false,
            'url': subjectsJSON_Path,
            'dataType': "json",
            'success': function (data) {
                pub.subjectsJSON = data;
            }
        });
    }());

    ( function stacksJSON() {
        $.ajax({
            'async': false,
            'url': stacksJSON_Path,
            'dataType': "json",
            'success': function (data) {
                pub.stacksJSON = data;
            }
        });
    }());

    ( function campusLocsJSON() {
        $.ajax({
            'async': false,
            'url': campusJSON_Path,
            'dataType': "json",
            'success': function (data) {
                pub.campusLocationsJSON = data;
            }
        });
    }());

    /* Occurs synchronously */
    ( function roomJSON() {
        $.ajax({
            'async': false,
            'url': roomsJSON_Path,
            'dataType': "json",
            'success': function (data) {
                pub.roomsPeopleJSON = data;

                /* Sort by id */
                pub.roomsPeopleJSON.sort(function (a, b) {
                    if (a.id < b.id) return -1;
                    if (a.id > b.id) return 1;
                    return 0;
                });

                /* Added 3 in rooms.json to sort, remove rather than have to change Room.js exceptions */
                replaceByValue(pub.roomsPeopleJSON, "id", "3circ-desk", "circ-desk");
                replaceByValue(pub.roomsPeopleJSON, "id", "3ref-desk", "ref-desk")
            }
        });
    }());

    ( function studyRoomJSONInterval() {
        var minutes = 3;
        /* Initial load */
        retrieveStudyRoomJSON();

        /* Every N minutes */
        setInterval(retrieveComputerJSON, minutes * 60 * 1000)
    }());

    function retrieveStudyRoomJSON() {
        $.getJSON(studyRoomsJSON_URL, function (data) {
            pub.studyRoomsJSON = data;
        })
    }

    /* Replace a value function */
    function replaceByValue(json, field, oldvalue, newvalue) {
        for (var k = 0; k < json.length; ++k) {
            if (oldvalue == json[k][field]) {
                json[k][field] = newvalue;
            }
        }
        return json;
    }

    /* Internet connection test */
    var firstTimeout, intConnect;
    ( function internetConnect() {
        firstTimeout = setTimeout(function () {
            if (pub.eventsJSON == null) {
                intConnect = setInterval(function () {
                    retrieveEvents();
                    if (pub.eventsJSON != null) {
                        location.reload(true);
                    }
                }, 1 * 1000);
            }
        }, 5 * 1000)
    }());

    return pub;
}());
