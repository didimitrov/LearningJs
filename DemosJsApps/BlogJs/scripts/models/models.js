var app = app || {};

app.models = (function () {
    function Models(requester) {
        this.user = app._models.user.get(requester);
        this.post = app._models.post.get(requester);
        this.comment = app._models.comment.get(requester)
    }

    return {
        get: function (requester) {
            return new Models(requester)
        }
    }
}());