var StudyRooms = (function () {
    var pub = {},
        haveFlashed = false,
        originalColor;

    $(window).on("load", function () {
        /* Make book icons click through */
        $("[id^=Floor]").children(":first-child").find("[id^=study_areas]").children().each(function () {
            d3.select(this).style("pointer-events", "none");
        })
    });

    pub.availability = function () {
        Display.displayFloor(5);

        $.each(Data.studyRoomsJSON, function (index, element) {
            if (element.available != "true") {
                flashRoom("room" + index, "#990000");
            } else
                flashRoom("room" + index, "#38f000");
        });

        if (!haveFlashed)
            haveFlashed = true;
    };

    function flashRoom(id, color) {
        var cycleDuration = 1.3;
        if (haveFlashed == false) {
            originalColor = d3.select("#" + id).attr("fill");

            d3.select("#" + id).transition()
                .attr("fill", color)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", originalColor)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", color)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", originalColor)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", color)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", originalColor)
                .duration(cycleDuration / 2 * 1000)
                .delay(20 * 1000)

        } else {
            d3.select("#" + id).transition()
                .attr("fill", originalColor)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", color)
                .duration(cycleDuration / 2 * 1000)
                .transition()
                .attr("fill", originalColor)
                .duration(cycleDuration / 2 * 1000)
                .delay(20 * 1000)
        }


    }

    return pub;
}());
