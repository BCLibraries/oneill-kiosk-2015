var Helper = ( function () {
    var pub = {}, isHalo = false;

    /* Find the center of an SVG element */
    pub.midPoint = function (element) {
        var $e = $(element);
        /* Change boundingclientrect */
        return [$e.offset().top + element.getBoundingClientRect().height / 2,
            $e.offset().left + element.getBoundingClientRect().width / 2]
    };

    /* Find the center of an SVG element (SPECIFICALLY FOR COMPUTER AVAILABILITY SVG BECAUSE DUPLICATE IDs) */
    pub.availMidPoint = function (element) {
        var $e = $("#cAvail").find("#" + element.id);
        /* Change boundingclientrect */
        return [$e.offset().top + element.getBoundingClientRect().height / 2,
            $e.offset().left + element.getBoundingClientRect().width / 2]
    };

    /* Find midpoint from svgpointlist */
    pub.svgMidPoint = function (svgPointList) {
        var maxX = svgPointList.getItem(0).x, minX = svgPointList.getItem(0).x, maxY = svgPointList.getItem(0).y, minY = svgPointList.getItem(0).y;
        for (var i = 1; i < svgPointList.numberOfItems; i++) {
            if (svgPointList.getItem(i).x > maxX)
                maxX = svgPointList.getItem(i).x;
            else if (svgPointList.getItem(i).x < minX)
                minX = svgPointList.getItem(i).x;
            if (svgPointList.getItem(i).y > maxY)
                maxY = svgPointList.getItem(i).y;
            else if (svgPointList.getItem(i).y < minY)
                minY = svgPointList.getItem(i).y
        }
        return [(maxX + minX) / 2, (maxY + minY) / 2]
    };

    pub.flasher = function (originalColor, element) {
        var cycleTime = 3;
        d3.select(element).transition()
            .attr("fill", "#990000")
            .duration(cycleTime / 5 * 1000)
            .transition()
            .attr("fill", originalColor)
            .duration(cycleTime / 5 * 1000)
            .transition()
            .attr("fill", "#990000")
            .duration(cycleTime / 5 * 1000)
            .transition()
            .attr("fill", originalColor)
            .duration(cycleTime / 5 * 1000)
            .transition()
            .attr("fill", "#990000")
            .duration(cycleTime / 5 * 1000)
            .transition()
            .attr("fill", originalColor)
            .delay((cycleTime + 2) * 1000);

        // .each("end", function() { console.log("hello")}) at end, do this
    };

    /* Was used for generating rects behind stacks */
    /*pub.findRect = function(element) {
     var minx = 999999, miny = 999999, maxx = 0, maxy = 0;

     $(element).find("*").each(function() {
     if (parseInt($(this).attr("x")) < minx)
     minx = parseInt($(this).attr("x"));
     if (parseInt($(this).attr("y")) < miny)
     miny = parseInt($(this).attr("y"));
     if (parseInt($(this).attr("x")) + parseInt($(this).attr("width")) > maxx)
     maxx = parseInt($(this).attr("x")) + parseInt($(this).attr("width"));
     if (parseInt($(this).attr("y")) + parseInt($(this).attr("height")) > maxy)
     maxy = parseInt($(this).attr("y")) + parseInt($(this).attr("height"));
     })

     return [minx, miny, maxy-miny, maxx-minx];
     }*/

    pub.halo = function (element, floor) {
        var cycleTime = 1.5 * 1000, numberOfFlashes = 3;
        var centerPoints = Helper.midPoint(element);
        var radius = "30";
        var halo = function () {
            d3.select(floor).insert("circle", "#" + $(element).parent()[0].id).attr("id", "circ")
                .attr("r", radius)
                .attr("cx", centerPoints[1] + 129)
                .attr("cy", centerPoints[0] + 1)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", "2")
                .attr("stroke-opacity", "0")
                .transition().attr("r", "3").attr("stroke-opacity", ".8").duration(cycleTime / 2)
                .transition().attr("r", radius).attr("stroke-opacity", "0").duration(cycleTime / 2)
                .remove();
        };

        halo();
        var count = 2;
        var timeoutID = setInterval(function () {
            if (count <= numberOfFlashes) {
                halo();
                count++;
            } else {
                clearInterval(timeoutID);
                pub.setIsHalo(false);
            }
        }, cycleTime);
    };

    pub.getIsHalo = function () {
        return isHalo;
    };

    pub.setIsHalo = function (boolean) {
        isHalo = boolean;
    };

    return pub;
}());
