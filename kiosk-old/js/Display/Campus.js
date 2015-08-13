var Campus;
Campus = ( function () {
    var pub = {},
        width = "1820px",
        height = "980px",
        id = "campus",
        isCurrentlyDisplayed = false,
        fadeTime = .3 * 1000,
        map, center, defaultZoom, zoom,
        mapType = "",
        minZoom = 17,
        maxZoom = 20,
        isPathOpen = false,
        pathDisplayed,
        paths = {
            Bapst: {path: null, zoom: null, center: null},
            SWL: {path: null, zoom: null, center: null},
            TML: {path: null, zoom: null, center: null},
            SWL: {path: null, zoom: null, center: null},
            ERC: {path: null, zoom: null, center: null},
            Burns: {path: null, zoom: null, center: null}
        },
        labelText = [];

    pub.initialize = function () {
        /* Pop-up div */
        d3.select("#" + id).style("width", width)
            .style("height", height)
            .style("top", "40px")
            .style("left", "38px")
            .style("position", "absolute")
            .style("z-index", "1500")
            .style("background", "white")
            .style("display", "none")
            .style("overflow", "hidden")
            .style("border", "5px solid rgb(51,51,51)")
            .style("box-shadow", "rgba(50,50,50,.3) 8px 8px 2px");

        /* Map */
        d3.select("#" + id).append("div")
            .attr("id", "map-canvas")
            .style("height", "100%")
            .style("width", "79.1%");

        /* Initialize Google Campus Map */
        google.maps.event.addDomListener(window, 'load', googleMapInit);
        /* Div over map */
        d3.select("#" + id).append("div")
            .attr("id", "map-div")
            .style("height", "100%")
            .style("width", "79.1%")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0)")
            .style("top", "0px")
            .style("left", "0px");

        /* Control panel */
        d3.select("#mapcontrol")
            .style("position", "absolute")
            .style("height", "100%")
            .style("width", "20%")
            .style("top", "0px")
            .style("left", "79.7%")
            .style("background", "rgba(110, 0, 0, .80)");

        /* Directions */
        $("#oneill").on("click", function () {
            pub.centerONeill();
            $(this).css("color", "rgb(153, 0, 0)");
        });
        $("#bapst").on("click", function () {
            pub.showPath("Bapst");
            clearDirectionColors();
            $(this).css("color", "rgb(153, 0, 0)");
            pathDisplayed = this.id;
        });
        $("#burns").on("click", function () {
            pub.showPath("Burns");
            clearDirectionColors();
            $(this).css("color", "rgb(153, 0, 0)");
            pathDisplayed = this.id;
        });
        $("#swl").on("click", function () {
            pub.showPath("SWL");
            clearDirectionColors();
            $(this).css("color", "rgb(153, 0, 0)");
            pathDisplayed = this.id;
        });
        $("#tml").on("click", function () {
            pub.showPath("TML");
            clearDirectionColors();
            $(this).css("color", "rgb(153, 0, 0)");
            pathDisplayed = this.id;
        });
        $("#erc").on("click", function () {
            pub.showPath("ERC");
            clearDirectionColors();
            $(this).css("color", "rgb(153, 0, 0)");
            pathDisplayed = this.id;
        });

        /* Zoom in and out */
        $("#magnify_in").on("click", function () {
            zoom = (zoom >= maxZoom) ? zoom : ++zoom;
            map.setZoom(zoom);
        });

        $("#magnify_out").on("click", function () {
            zoom = (zoom <= minZoom) ? zoom : --zoom;
            map.setZoom(zoom);
        });

        /* Pan control */
        var panAmount = 17;
        var time = 30;

        $("#arrow_up").on("vmousedown", function () {
            var timeoutid = setInterval(function () {
                map.panBy(0, -panAmount)
            }, time);

            $(document).one("vmousemove vmouseup", function () {
                clearInterval(timeoutid);
            })
        });

        $("#arrow_down").on("vmousedown", function () {
            var timeoutid = setInterval(function () {
                map.panBy(0, panAmount)
            }, time);

            $(document).one("vmousemove vmouseup", function () {
                clearInterval(timeoutid);
            })
        });

        $("#arrow_left").on("vmousedown", function () {
            var timeoutid = setInterval(function () {
                map.panBy(-panAmount, 0)
            }, time);

            $(document).one("vmousemove vmouseup", function () {
                clearInterval(timeoutid);
            })
        });

        $("#arrow_right").on("vmousedown", function () {
            var timeoutid = setInterval(function () {
                map.panBy(panAmount, 0)
            }, time);

            $(document).one("vmousemove vmouseup", function () {
                clearInterval(timeoutid);
            })
        });

        /* Map switch */
        $("#roadmap").on("click", function () {
            if (mapType == "SATELLITE")
                roadMap();
        });

        $("#satmap").on("click", function () {
            if (mapType == "ROADMAP")
                satellite();
        });

        /* Close */
        $("#button_close").on("click", function () {
            $("#transparent").click();
        })


    };

    function googleMapInit() {
        google.maps.visualRefresh = true;

        center = new google.maps.LatLng(42.33614, -71.169542);
        zoom = 17;
        defaultZoom = 17;
        var mapOptions = {
            center: center,
            zoom: zoom,
            //mapTypeId : google.maps.MapTypeId.ROADMAP,
            minZoom: minZoom,
            maxZoom: maxZoom,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        var styles = [/*{
         stylers : [{
         hue : "#990000"
         }, {
         saturation : 20
         }]
         }, */{
            featureType: "road",
            elementType: "geometry",
            stylers: [{
                lightness: 100
            }, {
                visibility: "simplified"
            }]
        }, {
            featureType: "all",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "road",
            elementType: "labels",
            stylers: [{
                visibility: "on"
            }]
        },];

        var styledMap = new google.maps.StyledMapType(styles,
            {name: "Styled Map"});

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        map.mapTypes.set('map_style', styledMap);
        //map.setMapTypeId('map_style');

        map.setCenter(center);
        var ne = new google.maps.LatLng(42.343751, -71.162699);
        var sw = new google.maps.LatLng(42.332662, -71.17443);
        var allowedBounds = new google.maps.LatLngBounds(sw, ne);
        map.fitBounds(allowedBounds);

        /* Marker and path set up */
        markerNPaths();

        var lastValidCenter = map.getCenter();

        google.maps.event.addListener(map, 'bounds_changed', function () {
            if (allowedBounds.contains(map.getCenter())) {
                lastValidCenter = map.getCenter();
                return;
            }
            map.setCenter(lastValidCenter);
        });

        /* Campus labels */
        var fontSize = 13, fontColor = "#000000", strokeColor = "#ffffff", strokeWeight = "4", align = "center";
        $.each(Data.campusLocationsJSON, function (index, element) {
            labelText.push(new MapLabel({
                text: element["name"],
                position: new google.maps.LatLng(parseFloat(element["lat"]), parseFloat(element["long"])),
                map: map,
                fontSize: fontSize,
                fontColor: fontColor,
                fontFamily: "sans-serif",
                strokeColor: strokeColor,
                strokeWeight: strokeWeight,
                align: align
            }));
        });
    }

    function markerNPaths() {
        /* Marker icons */
        var libraryIconPath = "Images/CampusMap/marker_lib.png",
            herePath = "Images/CampusMap/marker_here.png";

        var libraryIcon = {
            url: libraryIconPath,
            size: new google.maps.Size(80, 80),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(40, 80),
            scaledSize: new google.maps.Size(80, 80)
        };

        var youreHere = {
            url: herePath,
            size: new google.maps.Size(80, 80),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(40, 80),
            scaledSize: new google.maps.Size(80, 80)
        };

        /* Library markers */
        var libraryLatLong = [new google.maps.LatLng(42.33625832688736, -71.16943895816803), new google.maps.LatLng(42.33651607767622, -71.17131650447845), new google.maps.LatLng(42.33690864992482, -71.17146670818329), new google.maps.LatLng(42.34294855674382, -71.16369903087616), new google.maps.LatLng(42.334124799616696, -71.16976886987686), new google.maps.LatLng(42.33384719708328, -71.16804957389832)];
        $(libraryLatLong).each(function (index, element) {
            var iconMarker, libraryMarker;
            if (index == 0) {
                iconMarker = new google.maps.Marker({
                    position: element,
                    map: map,
                    icon: youreHere
                });
            } else {
                libraryMarker = new google.maps.Marker({
                    position: element,
                    map: map,
                    icon: libraryIcon
                });
            }
        });

        /* Marker paths */
        var pathList = {"Bapst": null, "Burns": null, "TML": null, "SWL": null, "ERC": null};
        pathList["Bapst"] = [new google.maps.LatLng(42.336177036034826, -71.16955295205116), new google.maps.LatLng(42.336100701845936, -71.16995930671692), new google.maps.LatLng(42.33607294393609, -71.17011353373528), new google.maps.LatLng(42.336058073622205, -71.17023423314095), new google.maps.LatLng(42.336055099559005, -71.17066875100136), new google.maps.LatLng(42.33607294393609, -71.17066875100136), new google.maps.LatLng(42.33642883906598, -71.17080420255661), new google.maps.LatLng(42.33631879928269, -71.17122262716293), new google.maps.LatLng(42.33640603804562, -71.17126688361168)];
        pathList["Burns"] = [new google.maps.LatLng(42.33618694955907, -71.16956233978271), new google.maps.LatLng(42.33607591799845, -71.17010951042175), new google.maps.LatLng(42.336056090913424, -71.17023825645447), new google.maps.LatLng(42.336060056330936, -71.17066204547882), new google.maps.LatLng(42.33609177966196, -71.17067813873291), new google.maps.LatLng(42.33709703277397, -71.17106437683105), new google.maps.LatLng(42.33704095420329, -71.17137283086777), new google.maps.LatLng(42.337004503105554, -71.17135673761368)];
        pathList["TML"] = [new google.maps.LatLng(42.336177036034826, -71.16955697536469), new google.maps.LatLng(42.33607393529022, -71.17011487483978), new google.maps.LatLng(42.336058073622205, -71.17022752761841), new google.maps.LatLng(42.336058073622205, -71.17067009210587), new google.maps.LatLng(42.336083848830704, -71.17066740989685), new google.maps.LatLng(42.33743009311196, -71.17118775844574), new google.maps.LatLng(42.33753913961966, -71.17124676704407), new google.maps.LatLng(42.33766008188885, -71.17109388113022), new google.maps.LatLng(42.33781483406189, -71.17120519280434), new google.maps.LatLng(42.337830255484015, -71.17121323943138), new google.maps.LatLng(42.337928391718094, -71.17112204432487), new google.maps.LatLng(42.33850599044964, -71.17050781846046), new google.maps.LatLng(42.33868263366251, -71.17023289203644), new google.maps.LatLng(42.33893638217138, -71.16980239748955), new google.maps.LatLng(42.3392097564909, -71.16919219493866), new google.maps.LatLng(42.339314900143506, -71.1688381433487), new google.maps.LatLng(42.33946350287264, -71.16834729909897), new google.maps.LatLng(42.339658368183386, -71.16753995418549), new google.maps.LatLng(42.33978173583775, -71.16684526205063), new google.maps.LatLng(42.33981958722859, -71.16648986935616), new google.maps.LatLng(42.33985183098803, -71.16623103618622), new google.maps.LatLng(42.33988407473093, -71.16600304841995), new google.maps.LatLng(42.340189688516524, -71.1660473048687), new google.maps.LatLng(42.340238754811644, -71.16556853055954), new google.maps.LatLng(42.3403032418841, -71.16466462612152), new google.maps.LatLng(42.34032006458776, -71.16393640637398), new google.maps.LatLng(42.34031445702037, -71.16362661123276), new google.maps.LatLng(42.340307447560434, -71.16354882717133), new google.maps.LatLng(42.34144997921443, -71.16334900259972), new google.maps.LatLng(42.34162661415712, -71.1633449792862), new google.maps.LatLng(42.34158175453614, -71.163579672575), new google.maps.LatLng(42.3415382967478, -71.16413354873657), new google.maps.LatLng(42.3421635252616, -71.16424888372421), new google.maps.LatLng(42.342349971126154, -71.1642837524414), new google.maps.LatLng(42.342697628103686, -71.16417914628983), new google.maps.LatLng(42.34289949256334, -71.16409465670586), new google.maps.LatLng(42.34288126871512, -71.16398468613625), new google.maps.LatLng(42.34284154572239, -71.16384377338903)];
        pathList["SWL"] = [new google.maps.LatLng(42.33616331805682, -71.16954892873764), new google.maps.LatLng(42.33610723865347, -71.16958916187286), new google.maps.LatLng(42.33551679180333, -71.16939336061478), new google.maps.LatLng(42.33554363787339, -71.16925120353699), new google.maps.LatLng(42.33537259385155, -71.1692351102829), new google.maps.LatLng(42.33504452450777, -71.16933971643448), new google.maps.LatLng(42.33489310731036, -71.1692726612091), new google.maps.LatLng(42.334730473618194, -71.16931557655334), new google.maps.LatLng(42.33460990009216, -71.16940677165985), new google.maps.LatLng(42.33449493442182, -71.16948187351227), new google.maps.LatLng(42.33438557663794, -71.16946309804916), new google.maps.LatLng(42.33425098218134, -71.16940408945084), new google.maps.LatLng(42.33396429832576, -71.16930410834789), new google.maps.LatLng(42.333910763384374, -71.16961894530624)];
        pathList["ERC"] = [new google.maps.LatLng(42.336135278361404, -71.16955697536469), new google.maps.LatLng(42.336073590987496, -71.16958379745483), new google.maps.LatLng(42.33554644186989, -71.16934776306152), new google.maps.LatLng(42.335563265846126, -71.16926193237305), new google.maps.LatLng(42.335350161814176, -71.16921365261078), new google.maps.LatLng(42.335024896373135, -71.1693423986435), new google.maps.LatLng(42.33475010184473, -71.16926193237305), new google.maps.LatLng(42.33453699505733, -71.16942286491394), new google.maps.LatLng(42.3344304413928, -71.16948187351227), new google.maps.LatLng(42.33412199555681, -71.16936385631561), new google.maps.LatLng(42.3339257110554, -71.16924583911896), new google.maps.LatLng(42.33407152245781, -71.16864502429962), new google.maps.LatLng(42.33395935987057, -71.16816759109497), new google.maps.LatLng(42.33392290698664, -71.16803616285324), new google.maps.LatLng(42.33383598079356, -71.16804152727127)];

        var strokeOpacity = .9, strokeWeight = 10, strokeColor = "#990000";

        for (var library in paths) {
            paths[library].path = new google.maps.Polyline({
                path: pathList[library],
                strokeColor: strokeColor,
                strokeOpacity: strokeOpacity,
                strokeWeight: strokeWeight
            })
        }

        paths.Bapst.center = new google.maps.LatLng(42.33628300230521, -71.17036275595854);
        paths.Burns.center = new google.maps.LatLng(42.336521338757926, -71.17036275595854);
        paths.TML.center = new google.maps.LatLng(42.33968551016072, -71.16753570765684);
        paths.SWL.center = new google.maps.LatLng(42.33516363819151, -71.16954199999998);
        paths.ERC.center = new google.maps.LatLng(42.3351108381913, -71.1692228171272);

        paths.Bapst.zoom = 19;
        paths.Burns.zoom = 19;
        paths.TML.zoom = 17;
        paths.SWL.zoom = 19;
        paths.ERC.zoom = 19;
    }

    pub.centerONeill = function () {
        pub.goBackToDefault();
        satellite();

        zoom = 18;
        map.setZoom(zoom);
        map.setCenter(new google.maps.LatLng(42.33625832688736, -71.16943895816803)); // O'Neill
    };

    var pathTimeout;
    pub.showPath = function (libraryName) {
        pub.goBackToDefault(true);

        satellite();
        paths[libraryName].path.setMap(map);
        isPathOpen = true;

        /* Animate symbols */
        animateArrow(libraryName);

        zoom = paths[libraryName].zoom;
        map.setZoom(zoom);
        map.setCenter(paths[libraryName].center);

        pathTOut();
    };

    /* Path timeout */
    $("#" + id).on("vmousedown", function () {
        clearTimeout(pathTimeout);
        if (isPathOpen) {
            pathTOut();
        }
    });

    function pathTOut() {
        var time = 60 * 1000;

        pathTimeout = setTimeout(function () {
            clearPaths();
        }, time);
    }

    function animateArrow(library) {
        var count = 0, icons = [];
        var percentSpaced = 20;
        var intervalTime = 45;

        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: "#000000",
            strokeOpacity: .95,
            strokeWeight: 4,
            fillColor: "#FFFFFF",
            fillOpacity: .7
        };

        /* Number of icons */
        for (var i = 0; i < 100 / percentSpaced; i++) {
            icons.push({icon: lineSymbol});
        }

        paths[library].path.set("icons", icons);

        /* Animation */
        var offsetId = window.setInterval(function () {
            count = (count + 1) % 200;

            var icons = paths[library].path.get('icons');
            for (var i = 0; i < icons.length; i++) {
                icons[i].offset = ((count / 2) + (i * percentSpaced)) % 100 + '%';
            }
            paths[library].path.set("icons", icons);
        }, intervalTime);
    }

    pub.show = function () {
        if (typeof google == "undefined") { // won't work anymore now that it's been downloaded
            location.reload(true);
        }

        if (isCurrentlyDisplayed == false) {
            $("#" + id).fadeIn(fadeTime);
            isCurrentlyDisplayed = true;
            pub.goBackToDefault();
        } else
            throw "Campus is already displayed";
    };

    pub.hide = function () {
        if (isCurrentlyDisplayed == true) {
            $("#" + id).fadeOut(fadeTime);
            isCurrentlyDisplayed = false;
        } else
            throw "Campus is already hidden";
    };

    pub.goBackToDefault = function (isPath) {
        clearTimeout(pathTimeout);

        clearPaths();

        if (isPath != true) {
            google.maps.event.trigger(map, 'resize');
            map.panTo(center);
            map.setZoom(defaultZoom);
            zoom = defaultZoom;
            roadMap();
        }
    };

    function clearPaths() {
        for (var path in paths) {
            paths[path].path.setMap(null);
        }
        isPathOpen = false;
        clearDirectionColors();
        pathDisplayed = "";
    }

    function clearDirectionColors() {
        $("#bapst, #burns, #erc, #swl, #tml, #oneill").css("color", "white");
    }

    function roadMap() {
        if (mapType != "ROADMAP") {
            //map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            map.setMapTypeId('map_style');
            mapType = "ROADMAP";
            $("#roadmap").addClass("active");
            $("#satmap").removeClass("active");

            /* Labels */
            $.each(labelText, function (index, element) {
                element.set("fontColor", "#000000");
                element.set("strokeColor", "#ffffff")
            });
        }
    }

    function satellite() {
        if (mapType != "SATELLITE") {
            map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
            mapType = "SATELLITE";
            $("#satmap").addClass("active");
            $("#roadmap").removeClass("active");

            /* Labels */
            $.each(labelText, function (index, element) {
                element.set("fontColor", "#ffffff");
                element.set("strokeColor", "#000000")
            });
        }
    }

    /* Campus move by touch ability */
    var mouseIsDown = false;
    var oldX = 0;
    var oldY = 0;
    var newX = 0;
    var newY = 0;
    var toid;
    $("#campus").on("vmousemove vmousedown", function (e) {
        clearTimeout(toid);
        if (e.target.id == "map-div") {
            if (e.type == "vmousedown") { // resets all values
                oldX = 0;
                oldY = 0;
                newX = 0;
                newY = 0;
                mouseIsDown = true;
            }

            if (mouseIsDown) {
                if (newX != 0 && newY != 0) {
                    oldX = newX;
                    oldY = newY;

                    newX = e.pageX;
                    newY = e.pageY;

                    map.panBy(-(newX - oldX), -(newY - oldY));
                } else {
                    newX = e.pageX;
                    newY = e.pageY;
                }

            }

            toid = setTimeout(function () {
                mouseIsDown = false;
            }, 100);
        }
    });

    return pub;
}());
