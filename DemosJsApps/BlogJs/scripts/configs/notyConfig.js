var Noty = (function() {
    function display(type, text, time) {
        var n = noty({
            text: text,
            type: type,
            dismissQueue: true,
            layout: 'TopCenter',
            theme: 'bootstrapTheme',
            maxVisible: 10,
            timeout: time,
            animation: {
                open: 'animated bounceInLeft', // Animate.css class names
                close: 'animated bounceOutLeft', // Animate.css class names
                easing: 'swing', // unavailable - no need
                speed: 500 // unavailable - no need
            }
        });
    }

    function success(text) {
        display('success', text, 3000);
    }

    function error(text) {
        display('error', text, 3000);
    }

    return {
        success: success,
        error: error
    }
}());