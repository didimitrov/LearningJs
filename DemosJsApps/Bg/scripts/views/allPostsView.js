var app = app || {};

//app.allPostsView = (function() {
//    function AllPostsView(selector, data) {
//        $.get('templates/searchResults.html', function(template) {
//            $("#leftSide").empty();
//            $('#rightSide').empty();
//            $('#center').empty();
//
//            var output = Mustache.render(template, data);
//            $(selector).html(output);
//        });
//    }
//
//    return {
//        load: function(selector, data) {
//            return new AllPostsView(selector, data);
//        }
//    }


        //function AllPostsView(selector, data) {
        //    var defer = Q.defer();
        //    $.get('templates/searchResults.html', function(template) {
        //        var temp = Handlebars.compile(template);
        //        var html = temp(data);
        //        $(selector).append(html);
        //    }).success(function(_data) {
        //        defer.resolve(_data);
        //    }).error(function(error) {
        //        defer.reject(error);
        //    });
        //
        //    return defer.promise;
        //}
        //
        //return {
        //    load: function (selector, data) {
        //        return AllPostsView(selector, data);
        //    }
        //}
//})();