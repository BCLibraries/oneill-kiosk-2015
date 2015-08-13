var Room = (function () {
    var pub = {},
        roomListID = "room-modal-window",
        isRoomListDisplayed = "false",
        popUpID = "popup_room_down",
        roomFinderFade = .6 * 1000;

    $(window).on("load", function () {
        popUps();

        /* Error checking */
        var missingIds = [];
        $("[id^=Floor]").find("#rooms").children("[id^=room], #ref-desk, #circ-desk").each(function (i, e) {
            var element = findRoomInfo(this.id.replace("room", ""));
            if (typeof element == "undefined") {
                missingIds.push(e["id"]);
            }
        });
        if (missingIds.length > 0)
            Data.addStateEvent({
                "type": "RoomsNotFoundInJSONException",
                "target": missingIds + ""
            });

        var missingInSVG = [];
        $.each(Data.roomsPeopleJSON, function (index, element) {
            if ($("#room" + element.id).length == 0 && $("#" + element.id).length == 0)
                missingInSVG.push(element.id);
        });
        if (missingInSVG.length > 0)
            Data.addStateEvent({
                "type": "RoomsNotFoundInSVGException",
                "target": missingInSVG + ""
            })
    });

    pub.initialize = function () {
        initializeList();
    };

    /* Room finder */
    function initializeList() {
        var listWidth = 800,
            listHeight = 600; // From CSS, for now... Add them here

        /* Initial div */
        d3.select("body").insert("div", ":first-child")
            .attr("id", roomListID)
            .style("top", $(".swiper-container").height() / 2 - listHeight / 2 + "px")
            .style("left", $(".swiper-container").width() / 2 - listWidth / 2 + "px")
            .style("display", "none")
            .style("z-index", "999")
            .append("ul")
            .attr("id", "roomUnorderedList");

        $.each(Data.roomsPeopleJSON, function (index, element) {
            if (element.name.indexOf("Office") == -1) { // Ignore offices
                var idText = (element.id.indexOf("desk") == -1) ? element.id : "Desk";

                /* Room # */
                d3.select("#roomUnorderedList").append("li")
                    .attr("id", "oneill" + element.id)
                    .append("div")
                    .attr("class", "room-name")
                    .append("class", "name")
                    .text(idText);
                /* Room Name */
                var fontSize = "30px";

                if (element.name.length > 25)
                    fontSize = "24px";

                d3.select("#oneill" + element.id).append("div")
                    .attr("class", "room-info")
                    .append("div")
                    .attr("class", "name")
                    .text(element.name)
                    .style("font-size", fontSize);

                /* Room Image */
                var roomPic;
                if (typeof element.img != "undefined" && element.img != "") {
                    roomPic = element.img;
                    if (element.id == "circ-desk")
                        roomPic = "circ.jpg";
                    else if (element.id == "ref-desk")
                        roomPic = "reference.jpg";
                } else
                    roomPic = "room406.jpg";

                d3.select("#oneill" + element.id).append("div")
                    .attr("class", "room-image")
                    .append("img")
                    .attr("src", "http://libstaff.bc.edu/img/rooms/thumb" + roomPic)
                    .attr("height", "90")
                    .attr("width", "135")
                    .attr("id", "smallImg" + element.id);

                /* Display floor and room on click */
                $("#oneill" + element.id).on("click", function (event) {
                    Data.addStateEvent({"type": "room-finder-select", "target": element.id});
                    if (event.target.id.indexOf("smallImg") != -1) { // Display larger image
                        d3.select("body").append("img")
                            .style("position", "absolute")
                            .style("left", "295px")
                            .style("top", "40px")
                            .attr("id", "big" + this.id)
                            .style("z-index", "999")
                            .attr("src", "http://libstaff.bc.edu/img/rooms/" + roomPic)
                            .style("overflow", "hidden")
                            .style("border", "8px solid rgb(51,51,51)")
                            .style("box-shadow", "rgba(50,50,50,.3) 8px 8px 2px")
                            .style("display", "none");

                        $("#big" + this.id).fadeIn(.5 * 1000);
                        Display.showInvis();

                        $("#invisible").one("click", function () {
                            $("#" + "bigoneill" + element.id).fadeOut(.3 * 1000);
                            setTimeout(function () {
                                $("#" + "bigoneill" + element.id).remove();
                            }, .31 * 1000);
                            Display.hideInvis();
                        })
                    } else {

                        var floor = element.floor;
                        if (typeof floor == 'undefined')
                            floor = 5;

                        var svgID = "#room" + element.id;
                        var originalColor = "#b1d4dd";

                        /* Exceptions */
                        if (element.id == "circ-desk") {
                            svgID = "#circ-desk";
                        } else if (element.id == "503") {
                            originalColor = "#4D4D4D";
                        } else if (element.id == "ref-desk") {
                            svgID = "#ref-desk";
                        }

                        /* Go to floor */
                        Display.displayFloor(floor);

                        /* Flashes room */
                        Helper.flasher(originalColor, svgID);

                        pub.hideList();
                        /* Close list display */
                        setTimeout(function () {
                            Display.hideTrans();
                            $("#transparent").unbind();
                        }, .35 * 1000);

                        setTimeout(function () {
                            $("#Floor" + floor).find(svgID).click();
                        }, .60 * 1000);
                    }
                })
            }
        });
    }
    pub.showList = function () {
        if (isRoomListDisplayed == "false") {
            $("#" + roomListID).fadeIn(roomFinderFade);
            isRoomListDisplayed = "true";
        } else
            throw "Room is already displayed";
    };

    pub.hideList = function () {
        if (isRoomListDisplayed == "true") {
            $("#" + roomListID).hide();
            isRoomListDisplayed = "false";
        } else
            throw "Room is already hidden";
    };

    /* Pop-ups */
    function popUps() {
        var toggleID;

        /* Actual popups */
        $("[id^=Floor]").find("#rooms").children("[id^=room], #ref-desk, #circ-desk").on("click", function () {
            Data.addStateEvent({
                "type": "room-select",
                "target": this.id.replace("room", "")
            });

            popUpID = "popup_room_down";
            var element = findRoomInfo(this.id.replace("room", ""));
            var centerPoint = Helper.midPoint(this);

            if (centerPoint[0] - 210 < 0) {
                popUpID = "popup_room_up";
                centerPoint[0] = centerPoint[0] + 180;
            }

            if (centerPoint[1] - 125 < 0) {
                centerPoint[1] += 15;
            }

            /* Room Exceptions */
            if (typeof element == "undefined") { /* If not found in JSON */
                element = {
                    id: this.id.replace("room", "").toUpperCase(),
                    name: "Unknown",
                    people: ""
                };
            } else if (element.id == 410)
                centerPoint[0] += 90; // Center y value is off for room 410
            else if (element.id == 200)
                centerPoint[1] -= 60;

            /* BEGIN POP-UP CREATION */
            /* Initial div container */
            d3.select(".swiper-container").insert("div", ":first-child")
                .attr("id", popUpID).style("position", "absolute")
                .style("top", centerPoint[0] - 158 + "px")
                .style("left", centerPoint[1] - 135 + "px")
                .style("display", "none")
                .style("text-align", "left")
                .style("z-index", "5");

            /* Icon Image */
            var roomPic;
            if (typeof element.img != "undefined" && element.img != "") {
                roomPic = element.img;
                if (element.id == "circ-desk")
                    roomPic = "circ.jpg";
                else if (element.id == "ref-desk")
                    roomPic = "reference.jpg";
            } else
                roomPic = "room406.jpg";

            d3.select("#" + popUpID).append("img")
                .attr("src", "http://libstaff.bc.edu/img/rooms/thumb" + roomPic)
                .style("height", "90px")
                .style("width", "135px");

            /* Room # */
            var name = "Room " + element.id;

            if (element.id == "ref-desk")
                name = "Reference Desk";
            else if (element.id == "circ-desk")
                name = "Circulation Desk";

            d3.select("#" + popUpID).append("h1")
                .text(name)
                .style("padding", "11px 0px 0px 0px")
                .style("font-size", "18px");

            /* Room Name */
            var info = "<b>Room Name: </b>" + element.name;

            if (element.id == "ref-desk")
                info = "<b>Description: </b> Catering to all your reference needs.";
            else if (element.id == "circ-desk")
                info = "<b>Description: </b>Check out a book. Return a book. Technology loans. Ask us any questions that you may have.";

            d3.select("#" + popUpID).append("p")
                .html(info);

            /* People */
            var people = "<b>Staff: </b>";
            var limit = 6;
            $.each(element.people, function (index, e) {
                if (index < limit) // If more than four people, do not add their names.
                    people = people + e.name + "; ";
            });

            if (element.people.length > limit)
                people = people + " etc.";
            else if (element.people.length == 0)
                people = "";

            d3.select("#" + popUpID).append("p")
                .attr("id", "people")
                .html(people);

            /* END POP-UP CREATION */

            /* Display pop-up */
            $("#" + popUpID).fadeIn(.2 * 1000);
            var bottom = 1080 - centerPoint[0] - 140;

            if (popUpID == "popup_room_down") {
                d3.select("#" + popUpID).style("top", null)
                    .style("bottom", bottom + "px");
            }

            Display.showInvis();

            $("#invisible").one("vmousedown", function (e) {
                turnOffPopUp();
                Display.hideInvis();
            });
        })
    }

    function turnOffPopUp(toggleID) {
        $("#" + popUpID).slideUp(.2 * 1000);
        setTimeout(function () {
            d3.select("#" + popUpID).remove()
        }, .25 * 1000);
    }

    /* Find room info in JSON */
    function findRoomInfo(id) {
        var element;

        $.each(Data.roomsPeopleJSON, function (index, e) {
            if (e.id == id) {
                element = e;
            }
        });
        return element;
    }

    return pub;
}());
