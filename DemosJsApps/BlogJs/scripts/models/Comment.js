var app = app || {};

app._models = app._models || {};

app._models.comment = (function () {
    function Comment(requester){
        this._requester = requester;
        this._comments ={
            comments: []
        }
    }

    Comment.prototype.createComment = function (data) {
        var defer = Q.defer;
        this._requester.post('classes/Comment', data)
            .then(function (data) {
            defer.resolve(data);
        }, function(error){
                defer.reject(error)
            });
        return defer.promise;
    }

    Comment.prototype.getComment= function () {
        var defer = Q.defer;
        var _this = this;
        this._requester.get('classes/Comment?include=post&order=createdAt')
            .then(function (data) {
                data['results'].forEach(function (comment) {
                    var comment ={
                            'objectId':comment.objectId,
                            'content': comment.content,
                            'author': comment.author,
                            'post': {
                                __type: "Pointer",
                                className: "Post",
                                objectId: comment.postId  //author.objectId
                            }
                    };
            _this._comments['comments'].push(comment)
                })
                defer.resolve(data);
            }, function (error) {
                defer.reject(error)
            })
        return defer.promise;
    };


    Comment.prototype.getPostComments= function (postId) {
        var defer = Q.defer;
        var _this = this;

        this._comments['comments'].length = 0;
        var where = {
            'post':{
                '__type': 'Pointer',
                'className': 'Post',
                'objectId': postId
            }
        };

        this._requester.get('classes/Comment?order=-createdAt&include=post,author&where='+JSON.stringify(where))
            .then(function(data){
                data['results'].forEach(function (commentData) {
                    commentData['createdAt'] = commentData['createdAt'];
                    _this._comments['comments'].push(commentData);
                })
                defer.resolve(_this._comments);
            }, function (error) {
                defer.reject(error);
            });

        return defer.promise;

    };
    return{
        get: function (requester) {
            return new Comment(requester)
        }
    }

}());