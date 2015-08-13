var Menu = ( function () {
    var pub = {};

    /* Attach click event to floor links at the bottom of the menu */
    ( function attachEventsToFloorLinks() {
        $("#floors").children(":first-child").children().click(function (index) {
            Display.displayFloor($(this).index() + 1);
        });
    }());

    /* Display campus map */
    ( function campusButton() {
        $("#campusMap").click(function () {
            Data.addStateEvent({"type": "campus-select", "target": "Campus Map"});
            Display.toggleCampus();
        });
    }());

    /* Display bus map */
    ( function busButton() {
        $("#busMap").click(function () {
            Data.addStateEvent({"type": "bus-select", "target": "bus"});
            Display.toggleBuses();
        });
    }());

    /* Display room finder */
    ( function roomListButton() {
        $("#roomFinder").click(function () {
            Data.addStateEvent({"type": "room-finder-open", "target": "Room Finder"});
            Display.roomFinder();
        });
    }());

    /* Display people finder */
    ( function peopleListButton() {
        $("#peopleFinder").click(function () {
            Data.addStateEvent({"type": "people-finder-open", "target": "People Finder"});
            Display.peopleFinder();
        });
    }());

    /* Display subjects */
    ( function subjectsButton() {
        $("#subjects").click(function () {
            Data.addStateEvent({"type": "subjects-open", "target": "Subjects"});
            Display.subjects();
        });
    }());

    /* Display stacks finder */
    ( function stacksListButton() {
        $("#stackFinder").click(function () {
            Data.addStateEvent({"type": "stack-finder-open", "target": "Stack Finder"});
            Display.stacksFinder();
        });
    }());

    /* Computer availability */
    ( function computerAvailabilityButton() {
        $("#computerAvailability").click(function () {
            Data.addStateEvent({"type": "computer-availability-open", "target": "Computer Availability"});
            Display.computerAvailability();
        });
    }());

    /* Study room availability */
    ( function studyRoomAvailabilityButton() {
        $("#studyRooms").click(function () {
            Data.addStateEvent({"type": "study-rooms-select", "target": "Study Rooms"});
            Display.studyRooms();
        });
    }());

    /* About */
    ( function aboutButton() {
        $("#helpIcon").click(function () {
            Data.addStateEvent({"type": "about-select", "target": "Help Icon"});
            Display.about();
        });
    }());

    pub.highlightFloorLink = function (desiredFloor) {
        /* Remove previously highlighted floor link */
        removeFloorHighlights();
        /* Display current */
        $("#floors").children(":first-child").children().eq(desiredFloor - 1).children(":first-child").css("background", "#32758f")
    };

    function removeFloorHighlights() {
        for (var i = 1; i <= 5; i++) {
            $("#floors").children(":first-child").children().eq(i - 1).children(":first-child").css("background", "#05506d")
        }
    }

    return pub;
}());
