var About = (function () {
    var pub = {},
        id = "about",
        isDisplayed = "false",
        fadeTime = .3 * 1000;

    pub.initialize = function () {
        var width = 800,
            height = 600; // From CSS, for now... Add them here

        /* Initial div */
        d3.select("body").insert("div", ":first-child")
            .attr("id", id)
            .style("position", "absolute")
            .style("height", height + "px")
            .style("width", width + "px")
            .style("top", 1080 / 2 - height / 2 + "px")
            .style("left", 1920 / 2 - width / 2 + "px")
            .style("background", "#210000")
            .style("z-index", "996")
            .style("display", "none")
            .style("padding", "10px");

        /* Image */
        d3.select("#" + id).append("img")
            .attr("src", "Images/ONeill.jpg")
            .style("width", 800 - 160 + "px")
            .style("height", 450 - 120 + "px")
            .style("margin", "20px auto")
            .style("border", "5px solid #b29e6c");

        /* Header */
        d3.select("#" + id).append("h1")
            .text("Welcome to O'Neill Library!")
            .style("color", "white")
            .style("font-size", "25px")
            .style("text-transform", "uppercase")
            .style("padding", "5px 10px 10px 10px")
            .style("font-weight", "normal");

        /* Text */
        d3.select("#" + id).append("p")
            .text("O'Neill Library provides a wide range of services to an equally wide range of patrons: everyone from undergraduates, graduate students, faculty, and staff, to alumni and guests from other Jesuit and local institutions and the local community. We will do everything in our power to satisfy every patron's needs. On the 3rd floor, go to the circulation desk about borrowing materials, to the technology assistance desk for questions about workstations, printing, and network connections, and to the reference desk for general and research questions.")
            .style("color", "white")
            .style("font-size", "16px")
            .style("margin", "0 auto")
            .style("width", "720px");
    };

    pub.display = function () {
        if (isDisplayed == "false") {
            $("#" + id).fadeIn(fadeTime);
            isDisplayed = "true";
        } else
            throw "About is already displayed";
    };

    pub.hide = function () {
        if (isDisplayed == "true") {
            $("#" + id).hide();
            isDisplayed = "false";
        } else
            throw "About is already hidden";
    };

    return pub;
}());
