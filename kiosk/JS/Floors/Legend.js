var Legend = (function () {
    var pub = {};

    pub.initialize = function () {
        goToYouAreHere();
        compLegend();
        shelfLegend();

        elevatorFlash();
        studyArea();
        bathroomFlash();

        printerHalo();
        vendingHalo();
    };

    function compLegend() {
        $("#comp_guest, #comp_unav, #comp_av").on("click", function () {
            $("#computerAvailability").click();
        });
    }

    function shelfLegend() {
        $("#shelf").on("click", function () {
            $("#stackFinder").click();
        });
    }

    function goToYouAreHere() {
        $("#here").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "You are here."});
            Display.displayFloor(3);
        })
    }

    function elevatorFlash() {
        $("#el").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Elevators"});
            var originalColor = "#A4E2F7";
            $("[id^=Floor]").find("[id^=elevator]").each(function () {
                Helper.flasher(originalColor, this);
            })
        })
    }

    function studyArea() {
        $("#study").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Study Rooms"});
            var originalColor = "#668FAD";
            $("[id^=Floor]").find("[id^=study_areas]").children().children(":first-child").each(function () {
                Helper.flasher(originalColor, this);
            })
        })
    }

    function bathroomFlash() {
        $("#bath").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Bathrooms"});
            var originalColor = "#29ABE2";
            $("[id^=Floor]").find("[id^=bathroom]").each(function () {
                Helper.flasher(originalColor, this);
            })
        })
    }

    function printerHalo() {
        $("#print").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Printer"});

            if (Helper.getIsHalo() == false)
                $("[id^=Floor]").find("[id^=printers]").children(":not(:last-child):not(:nth-last-child(2))").each(function () {
                    Helper.halo(this, $(this).parent().parent()[0]);
                });

            Helper.setIsHalo(true);
        });
    }

    function vendingHalo() {
        $("#vend").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Vending Machine"});
            var originalColor = "#FFFFFF";
            Display.displayFloor(1);
            $("[id^=Floor]").find("[id^=vending]").children().children(":first-child").next().each(function () {
                Helper.flasher(originalColor, this);
            })
        });
    }

    return pub;
}());
