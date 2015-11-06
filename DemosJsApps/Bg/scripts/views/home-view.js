var app = app || {};

app.homeView = (function() {
    function HomeView(selector, data, type) {

        //if (type == "topPosts") {
        //    $(selector).empty();
        //    $('#rightSide').empty();
        //    $('#center').empty();
        //
        //    $("#leftSide").append($("<h1 id='topPost'>Top posts</h1>"));
        //    $.get('templates/largePost.html', function(template) {
        //        //var temp = Handlebars.compile(template);
        //        //var html = temp(data);
        //        //$(selector).append(html);
        //        var output = Mustache.render(template, data);
        //        $(selector).append(output);
        //    });
        //}

        if (type == "newPosts") {
            $("#leftSide").append($("<hr />"));
            $("#leftSide").append($("<h1 id='topPost'>Newest posts</h1>"));
            $.get('templates/searchResults.html', function(template) {
                var temp = Handlebars.compile(template);
                var html = temp(data);
                $(selector).append(html);
               // var output = Mustache.render(template, data);
               // $(selector).append(html);
            });
        }

        //if (type == "mostViewedPosts") {
        //    $("#leftSide").append($("<hr />"));
        //    $("#leftSide").append($("<h1 id='mostViewedPosts'>Most Viewed Posts</h1>"));
        //    $.get('templates/mediumPost.html', function(template) {
        //        var output = Mustache.render(template, data);
        //        $(selector).append(output);
        //    });
        //}
    }


    return {
        load: function (selector, data, type) {
            return new HomeView(selector, data,type);
        }
    }
}());