var EventsBox = (function () {
    var pub = {},
        id = "eventsbox",
        eventslistid = "eventslist",
        hourslistid = "hourslist";

    $(window).on("load", function () {
        hours();

        eventList();
        var minutes = 62;

        setInterval(function () {
            var d = new Date();
            var n = d.getHours();
            if (n == 12) {
                hours();
                eventList();
            }
        }, minutes * 60000)
    });

    pub.initialize = function () {

    };

    function hours() {
        var name, times, from, to;

        d3.select("#" + hourslistid).remove();
        d3.select("#hours").append("ul").attr("id", hourslistid);

        $.each(Data.hoursJSON["locations"], function (index, element) {
            if (element["name"].indexOf("Law") == -1 && element["name"].indexOf("Media") == -1 && element["times"]["status"] != "not-set") {
                name = element["name"];

                if (element["times"]["status"] != "closed") {
                    console.log(element["times"]);

                    if (element.times.status == "24hours") {
                        d3.select("#" + hourslistid).append("li").attr("id", "hours" + index)
                            .html("<strong>" + name + "</strong>: Open 24 hours");
                    } else {

                        times = element["times"]["hours"][0];
                        from = times["from"];
                        to = times["to"];
                        d3.select("#" + hourslistid).append("li").attr("id", "hours" + index)
                            .html("<strong>" + name + "</strong>: " + from + "-" + to);
                    }

                } else
                    d3.select("#" + hourslistid).append("li").attr("id", "hours" + index)
                        .html("<strong>" + name + "</strong>: Closed");

                $("#" + "hours" + index).on("click", function () {


                    if ($(this).text().indexOf("Bapst") !== -1) {
                        $("#campusMap").click();
                        $("#bapst").click();
                    } else if ($(this).text().indexOf("Burns") !== -1) {
                        $("#campusMap").click();
                        $("#burns").click();
                    } else if ($(this).text().indexOf("Educational") !== -1) {
                        $("#campusMap").click();
                        $("#erc").click();
                    } else if ($(this).text().indexOf("Theology") !== -1) {
                        $("#campusMap").click();
                        $("#tml").click();
                    } else if ($(this).text().indexOf("Social") !== -1) {
                        $("#campusMap").click();
                        $("#swl").click();
                    }
                });
            }
        })
    }

    function eventList() {
        /* Events */
        var count = 0; // used as id in list of events
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        d3.select("#" + eventslistid).remove();
        d3.select("#events").append("ul").attr("id", eventslistid);

        $.each(Data.eventsJSON, function (index, element) {
            var id = "event" + index;
            var loc = element["location"].toLowerCase();

            d3.select("#" + eventslistid).append("li").attr("id", id);

            /* Obtain information */
            var date = dayNames[element["date"]["weekday"] - 1] + " " + monthNames[element["date"]["month"] - 1] + " " + element["date"]["day"] + ", " + element["date"]["year"];
            var startTime = capitalizeFirstLetter(element["start_time"]);
            var imgSrc = element["image"];
            var title = element["title"];
            var info = element["description"];

            if (loc.indexOf("onl") != -1) {
                loc = loc.replace("onl", "");
                if (loc != "") {
                    var roomNum = loc;
                    loc = "O'Neill Library, Room " + loc;
                } else
                    loc = "O'Neill Library";
            } else if (loc.indexOf("burns") != -1) {
                loc = "Burns Library";
            } else if (loc.indexOf("bapst") != -1) {
                loc = "Bapst Library";
            } else if (loc.indexOf("sw") != -1) {
                loc = "Social Work Library";
            } else if (loc.indexOf("tml") != -1) {
                loc = "Theology and Ministry Library";
            } else if (loc.indexOf("erc") != -1) {
                loc = "Educational Resource Center";
            } else {
                Data.addStateEvent({
                    "type": "InvalidEventLocationException",
                    "target": element["location"]
                })
            }


            /* Append event to list */
            d3.select("#" + id).append("span").attr("id", "dates")
                .html("<strong>" + date + "</strong><br />" + startTime);

            d3.select("#" + id).append("span").attr("id", "info")
                .html("<img src='" + imgSrc + "' style='height:55px; width:55px;' id='smallImg" + index + "'/><h2>" + title + "</h2>" + info + "</p>");

            if (typeof imgSrc != "undefined" && imgSrc != "") {
                $("#" + id).on("click", function () {
                    var height = 800;
                    var width = 750;
                    Heatmap.switchMaps(13);
                    d3.select("body").append("div")
                        .attr("id", "divEvent" + index)
                        .style("display", "none")
                        .style("height", height + "px")
                        .style("width", width + "px")
                        .style("left", 1920 / 2 - width / 2 + "px")
                        .style("top", 1080 / 2 - height / 2 + "px")
                        .style("position", "absolute")
                        .style("z-index", "999")
                        .style("border", "8px solid rgb(51,51,51)")
                        .style("box-shadow", "rgba(50,50,50,.3) 8px 8px 2px")
                        .style("background", "rgba(117, 19, 20, .9)")
                        .style("overflow-y", "auto")
                        .append("img")
                        .attr("id", "big" + id)
                        .style("height", "490px")
                        .style("width", "700px")
                        .style("border", "5px rgb(178, 158, 108) solid")
                        .style("margin", "10px auto")
                        .attr("src", imgSrc);

                    d3.select("#divEvent" + index).append("div")
                        .attr("id", "text")
                        .style("font-size", "15px")
                        .style("color", "#fff")
                        .style("margin", "8px 8px 12px 8px")
                        .html("<p><h1 style='font-weight:normal;text-transform:uppercase;font-size:20px;margin:5px auto;'>" + element["title"] + "</h1>" + element["description"] + "</p>");

                    d3.select("#divEvent" + index).append("div")
                        .attr("id", "time")
                        .style("font-size", "18px")
                        .style("color", "#fff")
                        .html("<p><strong style='font-weight:normal;text-transform:uppercase;'>" + date + "</strong></p>");

                    d3.select("#divEvent" + index).append("div")
                        .attr("id", "location")
                        .style("font-size", "20px")
                        .style("color", "white")
                        .style("background", "none repeat scroll 0 0 #990000")
                        .style("font-weight", "normal")
                        .style("margin", "7px auto")
                        .style("padding", "10px")
                        .style("width", "50%")
                        .style("border", "1px #000 solid")
                        .html("<p><strong style='font-weight:normal; text-transform:uppercase;'>Location: " + loc + "</strong></p>")
                        .on("click", function () {
                            var library = "#oneill";
                            $("#transparent").click();
                            if (loc.indexOf("O'Neill") != -1) {
                                if (loc.indexOf("O'Neill Library, Room ") != -1) {
                                    var roomNum = loc.replace("O'Neill Library, Room ", "");
                                    if (roomNum != "") {
                                        Display.displayFloor(roomNum.charAt(0));
                                        setTimeout(function () {
                                            $("#room" + roomNum).click();
                                        }, .45 * 1000);
                                    }
                                } else {
                                    Display.displayFloor(3);
                                    Helper.flasher("#B1D4DD", $("#Floor3").find("#gallerythree")[0]);
                                }
                            } else {
                                if (loc.indexOf("Burns") != -1) {
                                    library = "#burns";
                                } else if (loc.indexOf("Bapst") != -1) {
                                    library = "#bapst";
                                } else if (loc.indexOf("Social") != -1) {
                                    library = "#swl";
                                } else if (loc.indexOf("Theology") != -1) {
                                    library = "#tml";
                                } else if (loc.indexOf("Educational") != -1) {
                                    library = "#erc";
                                } else {
                                    Data.addStateEvent({
                                        "type": "InvalidEventLocationException",
                                        "target": element["location"]
                                    })
                                }
                                setTimeout(function () {
                                    $("#campusMap").click();
                                    $(library).click();
                                }, .35 * 1000);
                            }
                        });

                    $("#divEvent" + index).fadeIn(.5 * 1000);
                    Display.toggleBackground();

                    $("#transparent").one("click", function () {
                        $("#divEvent" + index).fadeOut(.3 * 1000);
                        Heatmap.switchMaps(Floors.endFloor());
                        setTimeout(function () {
                            $("#divEvent" + index).remove();
                        }, .31 * 1000);
                        Display.toggleBackground();
                    })
                });
            }

            d3.select("#" + id).append("span").attr("id", "elocation")
                .html("Location:</br>" + loc);

        });

        /* Autoscroll */
        autoScroll();
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function countWords(string) {
        var words = string.split(' ');
        return words.length;
    }

    var timeDown = 45000;
    var timeUp = 1000;

    var timeout, timeoutTime = 30000;

    function autoScroll() {
        var $list, $listSH;
        $list = $("#" + id);
        console.log(id);
        $listSH = $list[0].scrollHeight - $list.outerHeight();

        function loop() {
            var t = $list.scrollTop();
            $list.stop().animate({scrollTop: !t ? $listSH : 0}, !t ? timeDown : timeUp, loop);
        }

        loop();

        $list.on('vmousedown', function (e) {
            clearTimeout(timeout);
            $list.stop();
            timeout = setTimeout(loop, timeoutTime);
        });
    }

    return pub;
}());
