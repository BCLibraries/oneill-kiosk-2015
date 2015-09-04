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
            var originalColor = "#ffff00";
            Display.displayFloor(3);
            $("[id^=Floor]").find("[id^=here]").each(function () {
                Helper.flasher(originalColor, this);
            })
        });
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
            var originalColor = "#000000";
            $("[id^=Floor]").find("[id^=printers]").each(function () {
                Helper.flasher(originalColor, this);
            })
        });
    }

    function copierHalo() {
        $("#copier").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Copier"});
            var originalColor = "#000000";
            $("[id^=Floor]").find("[id^=copymachine]").each(function () {
                Helper.flasher(originalColor, this);
            })
        });
    }
    
    function scannerHalo() {
        $("#scanner").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Scanner"});
            var originalColor = "#000000";
            $("[id^=Floor]").find("[id^=scanner]").each(function () {
                Helper.flasher(originalColor, this);
            })
        });
    }

    function vendingHalo() {
        $("#vend").on("click", function () {
            Data.addStateEvent({"type": "legend-select", "target": "Vending Machine"});
            var originalColor = "#666666";
            Display.displayFloor(1);
            $("[id^=Floor]").find("[id^=vending]").each(function () {
                Helper.flasher(originalColor, this);
            })
        });
    }

    return pub;
}());
