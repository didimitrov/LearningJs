var app = app || {};

app.postView = (function() {
    function PostView(selector, data) {
        $.get('templates/post.html', function(template) {
            $("#leftSide").empty();
            $('#rightSide').empty();
            $('#center').empty();

            var output = Mustache.render(template, data);
            $(selector).html(output);

            $('#voteUp').on('click', function() {
                var location = window.location.href.split('/');
                var id = location[location.length - 1];

                app.model.vote(id, 'up')
                    .then(function(data) {
                        $('#rateCount').text(data.result.voteCount);
                    }, function(error) {
                        if (localStorage['logged-in']) {
                            console.log('error', 'Error', 'You already voted for this post');
                        } else {
                            console.log('error', 'Error', 'You must be logged in in order to vote for this post.');
                        }
                    });
            });

            $('#voteDown').on('click', function() {
                var location = window.location.href.split('/');
                var id = location[location.length - 1];

                app.model.vote(id, 'down')
                    .then(function(data) {
                        $('#rateCount').text(data.result.voteCount);
                    }, function() {
                        if (localStorage['logged-in']) {
                            console.log('error', 'Error', 'You already voted for this post');
                        } else {
                            console.log('error', 'Error', 'You must be logged in in order to vote for this post.');
                        }
                    });
            });

            if (localStorage["logged-in"]) {
                $('#commentSend').click(function () {
                    app.model.currentUserInfo().then(function (successData) {
                        var splitted = window.location.href.split('/');
                        var content = $('#commentContent').val();
                        app.model.postComment(splitted[splitted.length - 1], successData.username, content)
                            .then(function (data) {
                                var splitted = window.location.href.split('#');
                                window.location.replace(splitted[0] + '#' + splitted[1]);
                                console.log('success', 'Comment posted successfully!',
                                    'Your comment has been posted successfully');
                            }, function (error) {
                                console.log('error', 'Error',
                                    'An error ocurred while trying to post your comment.' +
                                    ' Please try again later.');
                            });
                    }, function (error) {
                        console.log('error', 'Error', 'An error ocurred while trying to post your comment.' +
                            ' Please try again later.');
                    });
                });
            }
        });
    }

    return {
        load: function (selector, data) {
            return new PostView(selector, data);
        }
    }
}());