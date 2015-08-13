var Display = (function () {
    var pub = {},
        isBackgroundOn = false,
        isInvisibleOn = false,
        isTouchStartOn = false,
        transparentID = "transparent";

    pub.initialize = function () {
        FloorManager.initialize();

        Campus.initialize();

        Buses.initialize();

        About.initialize();
    };

    /* Floors */
    pub.displayFloor = function (desiredFloor) {
        FloorManager.goToFloor(desiredFloor);
    };

    /* Room Finder */
    pub.roomFinder = function () {
        FloorManager.showRoomFinder();
        Heatmap.switchMaps(6);
        Display.showTrans();

        $("#" + transparentID).one("click", function (e) {
            FloorManager.hideRoomFinder();
            Heatmap.switchMaps(Floors.endFloor());
            setTimeout(Display.hideTrans(), .4 * 1000);
        })
    };

    /* People Finder */
    pub.peopleFinder = function () {
        FloorManager.showPeopleFinder();
        Heatmap.switchMaps(7);
        Display.showTrans();

        $("#" + transparentID).one("click", function (e) {
            FloorManager.hidePeopleFinder();
            Heatmap.switchMaps(Floors.endFloor());
            setTimeout(Display.hideTrans(), .4 * 1000);
        })
    };

    /* Stacks Finder */
    pub.stacksFinder = function () {
        FloorManager.showStacksFinder();
        Heatmap.switchMaps(9);
        Display.showTrans();

        $("#" + transparentID).one("click", function (e) {
            FloorManager.hideStacksFinder();
            Heatmap.switchMaps(Floors.endFloor());
            setTimeout(Display.hideTrans(), .4 * 1000);
        })
    };

    /* Subjects */
    pub.subjects = function () {
        FloorManager.showSubjects();
        Heatmap.switchMaps(14);
        Display.showTrans();

        $("#" + transparentID).one("click", function (e) {
            FloorManager.hideSubjects();
            Heatmap.switchMaps(Floors.endFloor());
            setTimeout(Display.hideTrans(), .4 * 1000);
        })
    };

    /* Computer Availability */
    pub.computerAvailability = function () {
        FloorManager.showCompAvailability();
        Heatmap.switchMaps(8);
        Display.showTrans();

        $("#" + transparentID).one("click", function () {
            FloorManager.hideCompAvailability();
            Heatmap.switchMaps(Floors.endFloor());
            setTimeout(Display.hideTrans(), .4 * 1000);
        })
    };

    /* About */
    pub.about = function () {
        About.display();
        Heatmap.switchMaps(12);
        Display.showTrans();
        Display.showInvis();

        $("#invisible").one("click", function () {
            About.hide();
            Display.hideTrans();
            Heatmap.switchMaps(Floors.endFloor());
            setTimeout(Display.hideInvis(), .4 * 1000);
        })
    };

    /* Campus Map */
    pub.toggleCampus = function () {
        Campus.show();
        Heatmap.switchMaps(10);
        pub.showTrans();

        $("#" + transparentID).one("click", function () {
            Campus.hide();
            Heatmap.switchMaps(Floors.endFloor());
            pub.hideTrans();
        })
    };

    /* bus */
    pub.toggleBuses = function () {
        Buses.show();
        Heatmap.switchMaps(11);
        pub.showInvis();
        pub.showTrans();

        $("#invisible").one("click", function () {
            Buses.hide();
            Heatmap.switchMaps(Floors.endFloor());
            pub.hideInvis();
            pub.hideTrans();
        })
    };

    /* Study Rooms */
    pub.studyRooms = function () {
        FloorManager.studyRooms();
    };

    /* Background divs */
    pub.toggleBackground = function () {
        if (isBackgroundOn == false) {
            $("#" + transparentID).show();
            isBackgroundOn = true;
        } else {
            $("#" + transparentID).fadeOut(.3 * 1000);
            isBackgroundOn = false;
        }
    };

    pub.showTrans = function () {
        if (isBackgroundOn)
            Data.addStateEvent({
                "type": "TransparentBackgroundAlreadyDisplayedException",
                "target": "transparent"
            });
        $("#" + transparentID).show();
        isBackgroundOn = true;
    };

    pub.hideTrans = function () {
        if (!isBackgroundOn)
            Data.addStateEvent({
                "type": "TransparentBackgroundAlreadyHiddenException",
                "target": "transparent"
            });
        $("#" + transparentID).fadeOut(.3 * 1000);
        isBackgroundOn = false;
    };

    pub.toggleInvisible = function () {
        if (isInvisibleOn == false) {
            $("#invisible").show();
            isInvisibleOn = true;
        } else {
            $("#invisible").fadeOut(.3 * 1000);
            isInvisibleOn = false;
        }
    };

    pub.showInvis = function () {
        if (isInvisibleOn)
            Data.addStateEvent({
                "type": "InvisibleBackgroundAlreadyDisplayedException",
                "target": "invisible"
            });
        $("#invisible").show();
        isInvisibleOn = true;
    };

    pub.hideInvis = function () {
        if (!isInvisibleOn)
            Data.addStateEvent({
                "type": "InvisibleBackgroundAlreadyHiddenException",
                "target": "invisible"
            });
        $("#invisible").fadeOut(.3 * 1000);
        isInvisibleOn = false;
    };

    /*	pub.toggleTouchStart = function() {
     if (isTouchStartOn == false) {
     $("#touchToStart").show();
     isTouchStartOn = true;
     } else {
     $("#touchToStart").fadeOut(.3 * 1000);
     isTouchStartOn = false;
     }
     };*/

    pub.showTouch = function () {
        if (isTouchStartOn)
            Data.addStateEvent({
                "type": "TouchStartAlreadyDisplayedException",
                "target": "touchToStart"
            });
        $("#touchToStart").show();
        isTouchStartOn = true;
    };

    pub.hideTouch = function () {
        if (!isTouchStartOn)
            Data.addStateEvent({
                "type": "TouchStartAlreadyHiddenException",
                "target": "touchToStart"
            });
        $("#touchToStart").fadeOut(.3 * 1000);
        isTouchStartOn = false;
    };

    (function backgroundInitialize() {
        /* Transparent div */
        d3.select("body").append("div")
            .attr("id", transparentID)
            .style("height", "1080px")
            .style("width", "1920px")
            .style("top", "0px")
            .style("left", "0px")
            .style("z-index", "995")
            .style("position", "absolute")
            .style("background-color", "rgba(136,136,136,0.5)")
            .style("display", "none");
    }());

    (function invisibleInitialize() {
        /* Invisible div */
        d3.select("body").append("div")
            .attr("id", "invisible")
            .style("height", "1080px")
            .style("width", "1920px")
            .style("top", "0px")
            .style("left", "0px")
            .style("z-index", "1000")
            .style("position", "absolute")
            .style("display", "none");
    }());

    (function touchToStart() {
        /* Touch to start */
        d3.select("body").append("div")
            .attr("id", "touchToStart")
            .style("height", "240px")
            .style("width", "660px")
            .style("top", "420px")
            .style("left", "630px")
            .style("z-index", "997")
            .style("position", "absolute")
            .style("display", "none")
            .style("background-color", "rgba(117, 19, 20, .9)")
            .style("-webkit-border-radius", "13px")
            .style("box-shadow", "7px 7px 2px rgba(50, 50, 50, 0.3)")
            .style("border", "3px solid #b29e6c")
            .append("p")
            .text("TOUCH TO START")
            .style("position", "absolute")
            .style("top", "39%")
            .style("left", "18.8%")
            .style("font-size", "45px")
            .style("color", "rgba(255, 255, 255, 0.95)")
        ;
    }());

    /* TIMEOUT */
    var isInactiveDisplayed = false;
    var timeoutTime = 150 * 1000;
    /* Inactive state, do in display.js... */
    var activityTimeout = setTimeout(inActive, timeoutTime);
    pub.isInactive = false;

    function resetActive() {
        if (isInactiveDisplayed) {
            pub.hideTrans(); // Close transparent background
            pub.hideTouch(); // Close touch to start
            Floors.stopAutoPlay(); // Stop autoplay
            setTimeout(function () {
                pub.displayFloor(3); // Display 3rd floor
            }, 50);
            isInactiveDisplayed = false;
            pub.isInactive = true;
        }
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(inActive, timeoutTime);
    }

    function inActive() {
        /* Simulates click to close elements */
        $(document.elementFromPoint(5, 5)).click();
        $(document.elementFromPoint(5, 5)).mousedown();
        //$(document.elementFromPoint(5,5)).mousemove();
        Floors.startAutoPlay();

        setTimeout(function () {
            pub.showTrans();
            pub.showTouch();
        }, .32 * 1000); // Wait until background has closed before trying to reopen

        isInactiveDisplayed = true;
        pub.isInactive = true;
    }

    $(document).bind("vmousemove vmousedown", resetActive);

    return pub;
}());
