var Buses = ( function () {
    var pub = {},
        width = "1820px",
        height = "980px",
        id = "bus-map",
        isCurrentlyDisplayed = false,
        fadeTime = .29 * 1000;

    pub.initialize = function () {
        d3.select("body").insert("iframe", ":first-child")
            .attr("id", id)
            .attr("src", "bus/index.html")
            .style("width", width)
            .style("height", height)
            .style("top", "40px")
            .style("left", "40px")
            .attr("id", id)
            .style("position", "absolute")
            .style("z-index", "997")
            .style("display", "none")
            .style("border", "5px solid rgb(51,51,51)")
            .style("box-shadow", "rgba(50,50,50,.3) 8px 8px 2px")
        ;
    };

    pub.show = function () {
        if (isCurrentlyDisplayed == false) {
            $("#" + id).fadeIn(fadeTime);
            isCurrentlyDisplayed = true;
        } else
            throw "Bus Map is already displayed";
    };

    pub.hide = function () {
        if (isCurrentlyDisplayed == true) {
            $("#" + id).fadeOut(fadeTime);
            isCurrentlyDisplayed = false;
        } else
            throw "Bus Map is already hidden";
    };

    return pub;
}());
