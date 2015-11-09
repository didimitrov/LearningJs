var app = app || {};

app.adminCreatePostPage = (function() {
    function AdminCreatePostPage(selector) {
        $.get('templates/createPostPage.html', function(template) {
            $("#leftSide").empty();
            $('#rightSide').empty();
            $('#center').empty();

            var output = Mustache.render(template);
            $(selector).html(output);

//var user = app.model.getUserById(sessionStorage['userId'])

            $('#addPost').on('click', function() {
                var postTitle = $('#titleField').val();
                var postText = $('#contentField').val();
                var author = user ;//localStorage['username']
                var picUrl = $('#pictureField').val();
                var tags = $('#tagsField').val();
                if(tags) {
                    tags = tags.split(/[, ]+/);
                }

                app.model.newPost(postTitle, postText, author, picUrl, tags)
                    .then(function(data) {
                        window.location = '#/Post/' + data.objectId;
                    }, function(error){
                        var errorsOutput = error.join(', ');
                        poppy.pop('error', 'Error', 'An error/s ocurred while trying to post your article: ' +
                            errorsOutput);
                    });
            });
        });
    };

    return {
        load: function(selector) {
            return AdminCreatePostPage(selector);
        }
    }
})();
