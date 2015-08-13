var Animation = ( function () {
    var pub = {};

    ( function youAreHereInterval() {
        $(document).ready(function () {
            setInterval(youAreHere, 2 * 1000);
        })
    }());

    function youAreHere() {
        if (Floors.endFloor() == 3) {
            var $star, starPoints, radius;

            $star = $("#star");
            starPoints = Helper.midPoint($star[0]);
            radius = "40";
/*
            d3.select("#_x33__floor").insert("circle", "#" + $star.parent()[0].id).attr("id", "circ")
                .attr("r", radius)
                .attr("cx", starPoints[1] + 130)
                .attr("cy", starPoints[0] + 1)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "0")
                .transition().attr("r", "3").attr("stroke-opacity", ".7").duration(1 * 1000)
                .transition().attr("r", radius).attr("stroke-opacity", "0").duration(1 * 1000)
                .remove();*/
        }
    }

    return pub;
}());
