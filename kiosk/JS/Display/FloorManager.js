var FloorManager = (function () {
    var pub = {};

    pub.initialize = function () {
        /* Floor slider */
        Floors.initialize();

        /* Room features */
        Room.initialize();

        /* People features */
        People.initialize();

        /* Legend */
        Legend.initialize();

        /* Computer Availability */
        Computer.initialize();

        /* Stacks */
        Stacks.initialize();

        /* Events box */
        //EventsBox.initialize();

        /* Subjects */
        Subjects.initialize();
    };

    pub.goToFloor = function (desiredFloor) {
        Floors.goToFloor(desiredFloor)
    };

    /* Room Finder */
    pub.showRoomFinder = function () {
        Room.showList();
    };

    pub.hideRoomFinder = function () {
        Room.hideList();
    };
    /****************/

    /* People Finder */
    pub.showPeopleFinder = function () {
        People.showList();
    };

    pub.hidePeopleFinder = function () {
        People.hideList();
    };
    /****************/

    /* Stacks Finder */
    pub.showStacksFinder = function () {
        Stacks.showList();
    };

    pub.hideStacksFinder = function () {
        Stacks.hideList();
    };
    /****************/

    /* Computer Availability */
    pub.showCompAvailability = function () {
        Computer.showAvail();
    };

    pub.hideCompAvailability = function () {
        Computer.hideAvail();
    };
    /****************/

    /* Subjects */
    pub.showSubjects = function () {
        Subjects.show();
    };

    pub.hideSubjects = function () {
        Subjects.hide();
    };
    /****************/

    /* Study Rooms (5th floor) */
    pub.studyRooms = function () {
        StudyRooms.availability();
    };
    /****************/

    return pub;
}());