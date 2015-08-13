var Floors = ( function () {
    var pub = {},
        theSwiper,
        endSlide = 2;
    /* 3 */

    pub.initialize = function () {
        sliderInit();

        for (var floor = 1; floor <= 5; floor++) {
            appendFloorSVG(floor);
        }
    };

    pub.goToFloor = function (desiredFloor) {
        theSwiper.swipeTo(desiredFloor - 1);
    };

    pub.currentFloor = function () {
        return (theSwiper.activeIndex + 1);
    };

    /* Floor on slider animation end, necessary for animations */
    pub.endFloor = function () {
        return (endSlide + 1)
    };

    pub.previousFloor = function () {
        return (theSwiper.previousIndex + 1);
    };

    pub.startAutoPlay = function () {
        theSwiper.startAutoPlay();
    };

    pub.stopAutoPlay = function () {
        theSwiper.stopAutoPlay();
    };

    function sliderInit() {
        $(function () {
            theSwiper = $('.swiper-container').swiper({
                mode: 'horizontal',
                autoPlay: 10 * 1000, // Autoplay length between slides
                initialSlide: 2, // 3rd floor, index begins at 0
                followFinger: true,
                moveStartThreshold: 10,
                onSlideChangeStart: function () {
                    Menu.highlightFloorLink(pub.currentFloor())
                },
                onSlideChangeEnd: function () {
                    endSlide = theSwiper.activeIndex;
                    if (Display.isInactive == false)
                        Data.addStateEvent({"type": "floor-change", "target": endSlide + 1});
                    Heatmap.switchMaps(endSlide + 1);
                }
            });
            theSwiper.stopAutoPlay();
            Menu.highlightFloorLink(3);
            Heatmap.switchMaps(endSlide + 1);
        })
    }

    function appendFloorSVG(desiredFloor) {
        console.log("Appending "+desiredFloor);
        d3.xml("Displays/ONeillFloor" + desiredFloor + ".svg", "image/svg+xml", function (xml) {
            $("#Floor" + desiredFloor).append(xml.documentElement);
            $("#Floor" + desiredFloor).children(":first-child").css("position", "absolute")
                .css("left", (1920 * (desiredFloor - 1)) - 130);
        });
    }

    return pub;
}());
