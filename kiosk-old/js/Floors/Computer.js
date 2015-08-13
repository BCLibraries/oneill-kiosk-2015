var Computer = ( function () {
    var pub = {},
        isCompAvailDisplayed = false;

    /* Initialize and call computer availability every 30 seconds */
    $(window).on("load", function () {
        availability();
        popUps();
        setInterval(availability, 30 * 1000);
    });

    pub.initialize = function () {
        compSVGInit();
    };

    /* Computer availability */
    function availability() {
        var exceptionList = [];
        $.each(Data.compJSON, function (index, element) {
            // Have an if animation is taking place if else, changing the boolean with settimeout
            var name = element.HostName.substring(0, 14).toLowerCase();
            if (d3.select("#" + name).length > 0) {
                var animationDuration = .3 * 1000;

                if (element.ClientState != "Available") {
                    d3.selectAll("#" + name).transition().attr("fill", "#990000").duration(animationDuration)
                } else
                    d3.selectAll("#" + name).transition().attr("fill", "#38f000").duration(animationDuration)
            } else {
                exceptionList.push(name);
            }
        });
        if (exceptionList.length > 0)
            Data.addStateEvent({
                "type": "ComputerIdNotFoundInSVGException",
                "target": exceptionList + ""
            })
    }
    /* Pop ups */
    function popUps() {
        var toggleID,
            divID = "popup_comp",
            windowsPath = "Images/icon_pc.png",
            macPath = "Images/icon_mac.png",
            exceptionList = [];

        /* If id exists in SVG not found in JSON */
        $("[id^=Floor], #cAvail").find("[id^=computers]").children().each(function (i, e) {
            var info = Data.compJSON[this.id];

            if (typeof info == "undefined")
                info = Data.compJSON[this.id.toUpperCase()];

            if (typeof info == "undefined" && this.id != "")
                exceptionList.push(this.id);
        });

        if (exceptionList.length > 0)
            Data.addStateEvent({
                "type": "ComputersNotFoundInJSONException",
                "target": exceptionList + ""
            });
        /*********/

        $("[id^=Floor], #cAvail").find("[id^=computers]").children().on("click", function () {
            /* Send data */
            Data.addStateEvent({
                "type": "computer-selected",
                "target": this.id
            });

            if ($(this).parent().parent()[0].id == "computer_availability")
                var centerPoint = Helper.availMidPoint(this);
            else
                var centerPoint = Helper.midPoint(this);

            var info = Data.compJSON[this.id];

            if (typeof info == "undefined")
                info = Data.compJSON[this.id.toUpperCase()];

            /* BEGIN POP-UP CREATION */
            /* Initial div container */
            d3.select("body").insert("div", ":first-child")
                .attr("id", divID).style("position", "absolute")
                .style("top", centerPoint[0] + 18 + "px")
                .style("left", centerPoint[1] - 103 + "px")
                .style("display", "none")
                .style("text-align", "left")
                .style("z-index", "998");

            /* Icon Image */
            var icon;
            if (typeof info !== 'undefined' && info.OperatingSystem == "Macintosh")
                icon = macPath;
            else
                icon = windowsPath;

            d3.select("#" + divID).append("img")
                .attr("src", icon);

            /* Status */
            var statusID, statusText;

            if (typeof info !== 'undefined' && info.ClientState !== "Available") {
                statusID = "unavailable";
                statusText = "UNAVAILABLE";
            } else {
                statusID = "available";
                statusText = "AVAILABLE";
            }

            d3.select("#" + divID).append("h1")
                .append("span")
                .attr("id", statusID)
                .text(statusText);

            /* Software List */
            var softwareList = "Microsoft Word, Microsoft Excel, BC UIS, and many more!";

            if (this.id == "wd01onb300onei") // B1
                softwareList = "Bloomberg L.P.";
            else if (this.id == "wd02onb300onei") // B2
                softwareList = "Datastream Advance, Morningstar, SDC Platinum, and many more!";
            else if (this.id == "wd03onb300onei") // B3
                softwareList = "AHA restricted data, Lisrel, ArcGIS, SPSS, MATLAB, Mathematica, Google Earth, and many more!";
            else if (this.id == "wd04onb300onei") // B4
                softwareList = "ArcGIS, SPSS, MATLAB, Mathematica, Google Earth, and many more!";

            d3.select("#" + divID).append("p")
                .attr("id", "software")
                .html("<strong>Software: </strong>" + softwareList);
            /* END POP-UP CREATION */

            /* Display pop-up */
            $("#" + divID).fadeIn(.2 * 1000);
            Display.showInvis();
            $("#invisible").one("vmousedown", function () {
                turnOffPopUp("#" + divID);
                Display.hideInvis();
            });
        })
    }

    function turnOffPopUp(toggleID) {
        $(toggleID).slideToggle(.2 * 1000);
        setTimeout(function () {
            d3.select(toggleID).remove()
        }, .25 * 1000);
    }

    /* Computer Availability Large Screen */
    function compSVGInit() {
        var width = "1820px",
            height = "928px",
            id = "cAvail";

        d3.select("body").append("div")
            .style("width", width)
            .style("height", height)
            .style("top", "50px")
            .style("left", "40px")
            .attr("id", id)
            .style("position", "absolute")
            .style("z-index", "997")
            .style("display", "none")
            .style("overflow", "hidden")
            .style("border", "5px solid rgb(51,51,51)")
            .style("box-shadow", "rgba(50,50,50,.3) 8px 8px 2px");

        d3.select("#" + id).append("img").attr("src", "Images/CampusMap/button_x.png").attr("id", "comp_close").style("position", "absolute");

        $("#comp_close").on("vmousedown", function () {
            $("#transparent").click();
        });

        d3.xml("Displays/compavail.svg", "image/svg+xml", function (xml) {
            $("#" + id).append(xml.documentElement);
        });
    }

    pub.showAvail = function () {
        var fadeTime = .3 * 1000;

        if (isCompAvailDisplayed == false) {
            $("#cAvail").fadeIn(fadeTime);
            isCompAvailDisplayed = true;
        } else
            throw "Computer Availability is already displayed."
    };

    pub.hideAvail = function () {
        var fadeTime = .3 * 1000;

        if (isCompAvailDisplayed == true) {
            $("#cAvail").fadeOut(fadeTime);
            isCompAvailDisplayed = false;
        } else
            throw "Computer Availability is already hidden."
    };

    return pub;
}());