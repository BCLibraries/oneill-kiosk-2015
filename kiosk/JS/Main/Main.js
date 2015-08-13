var main = (function () {

    (function initialize() {
        $.mobile.loadingMessage = false; // stops jQuery mobile loading message because jQuery mobile css has not been included

        disableRightClick(); // Disable right click

        Display.initialize(); // Init display
    }());

    /* Disable right click */
    function disableRightClick() {
        $(document).ready(function () {
            $(document).bind("contextmenu", function (e) {
                return false;
            });
        });
    }

}());
