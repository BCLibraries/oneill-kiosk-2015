var People = (function () {
    var pub = {},
        peopleListID = "people-modal-window",
        isPeopleListDisplayed = "false",
        sortedPeopleList = [],
        peopleFinderFade = .3 * 1000,
        previousHash = 999,
        scroll = false;

    pub.initialize = function () {
        initializeList();
    };

    /* People finder */
    function initializeList() {
        var listWidth = 800,
            listHeight = 600;

        d3.select("#" + peopleListID)
            .style("z-index", "1500")
            .style("top", $(".swiper-container").height() / 2 - listHeight / 2 + "px")
            .style("left", $(".swiper-container").width() / 2 - listWidth / 2 + "px")
            .style("display", "none");

        /* Letter side bar CLEAN THIS UP */
        var height, width, offset, division;
        $(window).on("load", function () {
            height = 588;

            width = 71;
            division = height / 26;

            d3.select("#" + peopleListID).append("div").attr("id", "lbar")
                .style("height", height + "px")
                .style("width", width + "px")
                .style("position", "fixed")
                .style("top", 185 + "px")
                .style("left", 569 + "px")
                .style("background-color", "rgba(255,255,255,0)");

            offset = 185;
            var down = false, bartimeout, scrollTimeout;
            $("#lbar, #people-modal-window").on("vmousemove vmouseup", function (e) {
                if (e.target.id == "lbar") {
                    if (scroll == false) {
                        if (e.type == "vmouseup") {
                            clearTimeout(bartimeout);
                            //$("#alpha").children(":first-child").children().css("font-size", "18px");
                            down = true;
                            setTimeout(function () {
                                down = false;
                            }, 100)
                        } else {
                            if (down == false) {
                                clearTimeout(bartimeout);
                                //$("#alpha").children(":first-child").children().css("font-size", "18px");

                                var position = parseInt(e.pageY) - offset;

                                var num = Math.round(position / division) - 1;

                                //console.log(num + " " + previousHash)
                                //console.log(num + " pos: " + position + " div: " + division + " offset"  + offset)
                                if (num < 0)
                                    num = 0;
                                else if (num > 25)
                                    num = 25;

                                // Maybe switch font-size change into if statement; wouldn't work if moving within range
                                //$("#alpha").children(":first-child").children().eq(num).css("font-size", "41px");
                                var href = $("#alpha").children(":first-child").children().eq(num).children(":first-child").attr("href");
                                if (typeof href != "undefined") {
                                    if (href.length > 2 && num != previousHash) {
                                        location.hash = href;
                                        location.hash = "#_";
                                        previousHash = num;
                                    }
                                }
                                //console.log("num: " + num + " prev: " + previousHash)
                                bartimeout = setTimeout(function () {
                                    //$("#alpha").children(":first-child").children().css("font-size", "18px");
                                }, .5 * 1000)
                            }
                        }
                    }
                } else {
                    //$("#alpha").children(":first-child").children().css("font-size", "18px");
                    $("#lbar").css("pointer-events", "none");
                    scroll = true;
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(function () {
                        $("#lbar").css("pointer-events", "auto");
                        scroll = false;
                    }, 500);
                }

            });
        });

        /*$("#people-modal-window").on("scroll", function(e) {
         scroll = true;
         clearTimeout(scrollTimeout);
         scrollTimeout = setTimeout(function() {
         scroll = false;
         }, 50);
         })*/

        /* People list */
        d3.select("#" + peopleListID).append("ul")
            .attr("id", "peopleUnorderedList");

        $.each(Data.roomsPeopleJSON, function (index, e) {
            $.each(e.people, function (index, element) {
                element.room = e.id;
                element.floor = e.floor;
                sortedPeopleList.push(element);
            })
        });

        /* Sort list by name */
        sortedPeopleList.sort(function (a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        /* Initialize list */
        var letter = -1;
        $.each(sortedPeopleList, function (index, element) {
            var lastName = String(element.name.substr(0, element.name.indexOf(',')).replace(/\W/g, ''));

            var num = lastName.charAt(0).charCodeAt(0) - 65;

            if (num > letter) {
                $("#alpha").children(":first-child").children().eq(num).children(":first-child").attr("href", "#" + lastName)
                    .attr("target", "_self");
                letter = num;
            }
            d3.select("#peopleUnorderedList").append("li")
                .attr("id", lastName)
                .append("div")
                .attr("class", "person-name")
                .style("width", "150px")
                .style("font-size", "24px")
                .append("class", "name")
                .text(element.name);
            /*	d3.select("#" + lastName).append("div")
             .attr("class", "person-image")
             .append("img")
             .attr("src", "Images/People/no_pic.jpg")
             .attr("height", "90")
             .attr("width", "90")*/

            d3.select("#" + lastName).append("div")
                .attr("class", "person-number")
                .append("div")
                .text(element.phone);

            d3.select("#" + lastName).append("div")
                .attr("class", "person-info")
                .style("font-size", "22px")
                .append("div")
                .attr("class", "name")
                .text(element.title);

            d3.select("#" + lastName).on("click", function () {
                Data.addStateEvent({"type": "person-select", "target": $(this).children(".person-name").text()});

                var floor = element.floor;
                if (typeof floor == 'undefined')
                    floor = 5;
                var svgID = "#room" + element.room;

                var originalColor = "#b1d4dd";

                /* Room exceptions */
                if (element.room == "503") {
                    originalColor = "#4D4D4D";
                    /* Original color is black-ish */
                }

                /* Displays floor */
                Display.displayFloor(floor);

                /* Flashes room */
                Helper.flasher(originalColor, svgID);

                /* Close list display */
                pub.hideList();
                setTimeout(function () {
                    Display.hideTrans();
                    $("#transparent").unbind();
                }, .35 * 1000);

                /* Open popup */
                setTimeout(function () {
                    $("#Floor" + floor).find(svgID).click();
                }, .45 * 1000);
            })
        })
    }
    pub.showList = function () {
        if (isPeopleListDisplayed == "false") {
            $("#" + peopleListID).fadeIn(peopleFinderFade);
            isPeopleListDisplayed = "true";
        }
    };

    pub.hideList = function () {
        if (isPeopleListDisplayed == "true") {
            $("#" + peopleListID).fadeOut(peopleFinderFade);
            isPeopleListDisplayed = "false";
        }
    };

    return pub;
}());
