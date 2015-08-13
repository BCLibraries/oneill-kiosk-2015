var Heatmap = ( function () {
    var pub = {},
        currentHeatMap = 1,
        numberOfMaps = 14,
        heatmaps = new Array(numberOfMaps),
        heatmapsTarget = new Array(numberOfMaps),
        isDisplayed = false,
        element = "page",
        count = 0;

    pub.switchMaps = function (mapNum) {
        currentHeatMap = mapNum;
    };

    pub.heatMapTargetData = function () {
        count = 0;
        return heatmapsTarget;
    };

    pub.mapsLength = function () {
        return count;
    };

    pub.resetHeatData = function () {
        for (var i = 1; i <= numberOfMaps; i++) {
            heatmaps[i] = h337.create({
                "element": document.getElementById(element),
                "radius": 20,
                "visible": false,
                "opacity": 40,
                "height": 1080,
                "width": 1920
            });
        }
    };

    pub.resetTargetData = function () {
        for (var i = 1; i <= numberOfMaps; i++) {
            heatmapsTarget[i - 1] = {
                "MapID": i,
                data: []
            };
        }
    };

    /* Initialize HeatMap */
    $(window).on("load", function () {
        pub.resetTargetData();
        pub.resetHeatData();

        (function () {
            var letsgo = function () {
                if (isDisplayed == false) {
                    heatmaps[currentHeatMap].toggleDisplay();
                    isDisplayed = true;
                } else {
                    heatmaps[currentHeatMap].toggleDisplay();
                    isDisplayed = false;
                }
            };

            $(document).keydown(function (event) {
                if (event.keyCode == 72) {
                    letsgo();
                } else if (event.keyCode == 80) {
                    var data = heatmaps[currentHeatMap].store.exportDataSet();
                    console.log(data)
                }
            });

            $("#page").on("vmousemove vmousedown", function (e) {
                if (isDisplayed == false) {
                    count++;
                    heatmaps[currentHeatMap].store.addDataPoint(e.pageX, e.pageY);

                    heatmapsTarget[currentHeatMap - 1].data.push({
                        "x": e.pageX,
                        "y": e.pageY,
                        "event-type": e.type,
                        "timestamp": Math.floor(+new Date)
                    });
                    Data.shouldWePostHeatMap();
                }
            })

        })();
    });

    return pub;
}());

