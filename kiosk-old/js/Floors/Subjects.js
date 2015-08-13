var Subjects = (function () {
    var pub = {},
        id = "subjectbox",
        isOpen = "false",
        fadeTime = .3 * 1000,
        rightDisplay = "";

    pub.initialize = function () {
        var height = 600, width = 1200;

        $("#" + id).css("top", $(".swiper-container").height() / 2 - height / 2 + "px")
            .css("left", $(".swiper-container").width() / 2 - width / 2 + "px")
            .css("display", "none")
            .css("z-index", "999");

        /* Left-side */
        var count = 0;
        $.each(Data.subjectsJSON, function (key, value) {
            d3.select("#subjectlist").append("li")
                .append("h2")
                .text(key);

            $.each(value, function (key, value) {
                count++;

                d3.select("#subjectlist").append("li")
                    .attr("id", "subEntry" + count)
                    .text(key);

                $("#subEntry" + count).on("mousedown", function () {
                    if (rightDisplay != $(this).text().removeNonAlpha()) {
                        rightDisplay = $(this).text().removeNonAlpha();

                        var rightid = "subjectright";
                        $("#" + rightid).hide();

                        /* Remove all children */
                        $("#" + rightid).children().remove();

                        /* Stack information */
                        var location = "UNKNOWN";
                        var display = "Ask Subject Specialist";
                        if (typeof value["stack"]["location"] != "undefined") {
                            location = value["stack"]["location"];
                            display = value["stack"]["display"];
                        } else if (typeof value["stack"]["library"] != "undefined") {
                            location = value["stack"]["library"];
                            display = value["stack"]["message"];
                        }

                        d3.select("#" + rightid).append("p")
                            .html("You can locate more information about <strong>" + key + "</strong> in")
                            .append("div")
                            .attr("id", "subjectstacks")
                            .text(display);

                        /* Stack click */
                        $("#subjectstacks").on("mousedown", function () {
                            if (typeof value["stack"]["location"] != "undefined")
                                $("#callnumbermodul").children("[id^=column]").find("#stack" + location).click();
                            else if (typeof value["stack"]["library"] != "undefined") {
                                if (location.indexOf("bapst") !== -1) {
                                    $("#campusMap").click();
                                    $("#bapst").click();
                                } else if (location.indexOf("burns") !== -1) {
                                    $("#campusMap").click();
                                    $("#burns").click();
                                } else if (location.indexOf("erc") !== -1) {
                                    $("#campusMap").click();
                                    $("#erc").click();
                                } else if (location.indexOf("tml") !== -1) {
                                    $("#campusMap").click();
                                    $("#tml").click();
                                } else if (location.indexOf("swl") !== -1) {
                                    $("#campusMap").click();
                                    $("#swl").click();
                                }
                            }
                        });

                        /* Location text */
                        d3.select("#" + rightid).append("p")
                            .text("Click to see specialist's location.");

                        /* Specialist list */
                        d3.select("#" + rightid).append("div")
                            .attr("id", "specialiststhemselves")
                            .append("ul")
                            .attr("id", "specList");

                        /* Specialist list loop */
                        var i = 0;
                        $.each(value["specialists"], function (key, value) {
                            i++;
                            d3.select("#specList").append("li")
                                .attr("id", "subject" + i);

                            /* People click */
                            var lastName = value["name"].split(' ').pop();
                            $("#specialiststhemselves").find("#subject" + i).on("mousedown", function () {
                                $("#transparent").click();
                                $("#people-modal-window").find("#" + lastName).click();
                            });

                            /* Extension */
                            var number = value["extension"];
                            d3.select("#subject" + i).append("div")
                                .attr("id", "spec_number")
                                .text(number);

                            /* Name */
                            var name = value["name"];
                            d3.select("#subject" + i).append("div")
                                .attr("id", "spec_name")
                                .text(name);

                            /* Speciality */
                            var specialty = value["subject"];
                            d3.select("#subject" + i).append("div")
                                .attr("id", "spec_sub")
                                .text(specialty);
                        });

                        $("#" + rightid).fadeIn(fadeTime);
                    }
                });
            });
        });
    };

    pub.show = function () {
        if (isOpen == "false") {
            $("#subjectright").children().remove();
            d3.select("#subjectright").append("p").text("Search for information by subject").style("font-size", "27px").style("padding-top", "254px");
            $("#" + id).fadeIn(fadeTime);

            isOpen = "true";
        } else
            throw "Subjects list is already displayed";
    };

    pub.hide = function () {
        if (isOpen == "true") {
            $("#" + id).fadeOut(fadeTime);
            isOpen = "false";
            rightDisplay = "";
        } else
            throw "Subjects list is already hidden";
    };

    String.prototype.removeNonAlpha = function () {
        return this.replace(/\W/g, '');
    };

    return pub;
}());
