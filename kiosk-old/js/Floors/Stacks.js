var Stacks = ( function () {
    var pub = {},
        listID = "callnumbermodul",
        isListToggled = "false",
        fadeTime = .3 * 1000;

    $(window).on("load", function () {
        popUps();

        $("#Floor1").find("#stacks").children().css("pointer-events", "none");

        /* Exceptions and id set */
        var exceptions = [];
        $("#" + listID).children("[id^=column]").children().children().each(function () {
            var text = $(this).text().replace(/\W/g, '').toLowerCase();
            $(this).attr("id", "stack" + text);

            if ($("[id^=Floor]").find("#stacks__" + text).length == 0)
                exceptions.push(text);
        });
        if (exceptions.length > 0)
            Data.addStateEvent({
                "type": "StackNotFoundException",
                "target": exceptions + ""
            })
    });

    pub.initialize = function () {
        initializeList();
    };

    function initializeList() {
        var listHeight = 672,
            listWidth = 1000;

        d3.select("#" + listID).style("top", $(".swiper-container").height() / 2 - listHeight / 2 - 8 + "px")
            .style("left", $(".swiper-container").width() / 2 - listWidth / 2 + "px")
            .style("display", "none");

        $("#" + listID).children("[id^=column]").children().children().on("click", function () {
            var text = $(this).text().replace(/\W/g, '').toLowerCase();

            Display.displayFloor($("[id^=Floor]").find("#stacks__" + text).parent().parent().parent()[0].id.replace(/\D/g, ''));
            $("#transparent").click();

            $("[id^=Floor]").find("#stacks__" + text).find("*").each(function () {
                Helper.flasher("#0071BC", this);
            });

            setTimeout(function () {
                $("[id^=Floor]").find("#stacks__" + text).click();
            }, .45 * 1000)

        });
    }
    pub.showList = function () {
        if (isListToggled == "false") {
            $("#" + listID).fadeIn(fadeTime);
            isListToggled = "true";
        } else
            throw "Stacks list is already displayed";
    };

    pub.hideList = function () {
        if (isListToggled == "true") {
            $("#" + listID).fadeOut(fadeTime);
            isListToggled = "false";
        } else
            throw "Stacks list is already hidden";
    };

    /* Pop-ups */
    function popUps() {
        var divID = "popup_stacks";

        $("#" + listID).children("[id^=column]").children().children().each(function () {
            var writtenText = $(this).text().replace(/\s/g, "");

            /* Text exception */
            if (writtenText == "CurrentPeriodicals")
                writtenText = "Current Periodicals";

            var text = $(this).text().replace(/\W/g, '').toLowerCase();

            $("[id^=Floor]").find("#stacks__" + text).on("click", function () {
                var centerPoint = Helper.midPoint(this);

                /* Exceptions */
                if (writtenText == "QC-QH") {
                    centerPoint[0] += 33;
                    centerPoint[1] += 37;
                }
                if (writtenText == "Current Periodicals") {
                    centerPoint[0] -= 70;
                    centerPoint[1] += 50;
                }

                var category = (findCategory(text) + "").replaceAll(",", ", ");
                d3.select("body").insert("div", ":first-child")
                    .attr("id", divID)
                    .style("display", "none")
                    .style("position", "absolute")
                    .style("top", centerPoint[0] - 65 + "px")
                    .style("left", centerPoint[1] + 20 + "px")
                    .style("z-index", "998")
                    .append("p")
                    .style("font-size", "15px")
                    .html("<strong>" + writtenText + " </strong></br>" + category);


                /* Display pop-up */
                $("#" + divID).fadeIn(.2 * 1000);
                Display.showInvis();

                $("#invisible").one("vmousedown", function () {
                    turnOffPopUp();
                    Display.hideInvis();
                });
            });
        });
    }

    String.prototype.replaceAll = function (str1, str2, ignore) {
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), ( ignore ? "gi" : "g")), ( typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
    };

    function turnOffPopUp(toggleID) {
        $("#popup_stacks").animate({width: 'toggle'}, .15 * 1000);
        setTimeout(function () {
            d3.select("#popup_stacks").remove()
        }, .25 * 1000);
    }

    function findCategory(stackName) {
        var category = "Ask at Reference Desk";
        $.each(Data.stacksJSON, function (index, element) {
            //console.log(element["range"] + " " + stackName)
            if (element["range"] == stackName)
                category = element["subclasses"]
        });

        return category;
    }

    return pub;
}());
