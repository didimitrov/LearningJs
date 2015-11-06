var app = app || {};

app.manager =(function () {
    function Manager(requester){
        this._requester = requester;
        this.posts = {
            posts:[]
        };
            this.newestPostsRepo = {
            posts: []
        };
    }

    Manager.prototype.register = function (username, password) {
        var defer = Q.defer();
        var _this = this;

        var userData={
            'username': username,
            'password': password
        }

        this._requester.post('users',userData);
        
        return defer.promise;
    }
    
    Manager.prototype.login = function (username, password) {
        var defer = Q.defer;
        this._requester.get('login?username=' + username + '&password=' + password)
            .then(function (data) {
                localStorage['logged-in']= data.sessionToken;
                localStorage['username'] = data.username;
                defer.resolve(data)
            }, function (error) {
                defer.reject(error)
            })
        return defer.promise;
    }

    //Manager.prototype.getNewestPosts = function () {
    //    var defer = Q.defer();
    //    var _this = this;
    //    this.newestPostsRepo.posts.length = 0;
    //
    //    this._requester.get('classes/Post') //?include=author,headerImage&order=-createdAt
    //        .then(function (data) {
    //            var tempRepo = _.sortBy(data.results, function(post) {
    //                return post.createdAt;
    //            });
    //
    //            var iterationLength = tempRepo.length - 5 >= 0 ? tempRepo.length - 5 : 0;
    //
    //            for (var index = tempRepo.length; index > iterationLength; index--) {
    //                var id = tempRepo[index - 1].objectId;
    //                var title = tempRepo[index - 1].title;
    //                var content = tempRepo[index - 1].content;
    //                var author = tempRepo[index - 1].author;
    //                var dateCreated = tempRepo[index - 1].createdAt;
    //                var viewsCount = tempRepo[index - 1].viewsCount;
    //                var voteCount = tempRepo[index - 1].voteCount;
    //                var commentsCount = tempRepo[index - 1].commentsCount;
    //                var img = tempRepo[index - 1].img;
    //                var tags = tempRepo[index - 1].tags;
    //                var post = new Post(id, title, content, author, dateCreated, viewsCount, voteCount, commentsCount, null, img, tags);
    //                _this.newestPostsRepo.posts.push(post);
    //            }
    //            defer.resolve(_this.newestPostsRepo);
    //        }, function (error) {
    //            defer.reject(error);
    //        });
    //    return defer.promise;
    //};
    Manager.prototype.getNewestPosts = function () {
        var defer = Q.defer();
        var _this = this;
        this.newestPostsRepo['posts'].length = 0;

        this._requester.get('classes/Post?include=author,headerImage&order=-createdAt')
            .then(function (data) {
                data['results'].forEach(function (dataPost) {
                    var post = {
                        'objectId': dataPost.objectId,
                        'title': dataPost.title,
                        'content': dataPost.content,
                        'headerImage': dataPost.headerImage,
                        'contentSummary': dataPost.contentSummary,
                        'tags': dataPost.tags,
                        'visitsCount': dataPost.visitsCount,
                        'author': dataPost.author.username,
                        'authorId': dataPost.author.objectId,
                        'createdAt': new Date(dataPost.createdAt).toLocaleString()
                    };

                    //if(dataPost.headerImage){
                    //    post.image = dataPost.headerImage.url;
                    //}
                    _this.newestPostsRepo['posts'].push(post);
                });

                defer.resolve(_this.newestPostsRepo);
            }, function (error) {
                defer.reject(error);
            });

        return defer.promise;
    };
    Manager.prototype.newPost = function(title, content, author, picUrl, tags) {
        var defer = Q.defer();
        var errors = [];
        if(!title || title.length == 0) {
            errors.push('no title');
        }
        if(!content || content.length == 0) {
            errors.push('no content');
        }
        if(!author || author.length == 0) {
            errors.push('no author');
        }
        if(!picUrl || picUrl.length == 0) {
            errors.push('no picture url');
        }
        if(!tags || tags.length == 0) {
            errors.push('no tags');
        }

        if(errors.length > 0) {
            defer.reject(errors);
        }

        var data = {
            'title': title,
            'content': content,
            'author': author,
            'voteCount': 0,
            'viewsCount' : 0,
            'img': picUrl,
            'tags': tags
        };

        this._requester.post('classes/Post', data).then(function(data) {
            defer.resolve(data);
        }, function(error) {
            defer.reject(error);
        });

        return defer.promise;
    }
    //Manager.prototype.getPosts = function (start, length) {
    //    var defer = Q.defer();
    //    var _this = this;
    //    this.posts.posts.length = 0;
    //
    //    this._requester.get('classes/Post/')
    //        .then(function (data) {
    //            if (!start) {
    //                start = 0;
    //                length = data.result.length;
    //            }
    //            var iterationStart = start >= data.result.length ? 0 : start;
    //            var iterationLength = length >= data.result.length ? data.result.length : length;
    //
    //            for (var index = iterationStart; index < iterationLength; index++) {
    //                if (!data.result[index]) {
    //                    break;
    //                }
    //
    //                var id = data.result[index].objectId;
    //                var title = data.result[index].title;
    //                var content = data.result[index].content;
    //                var author = data.result[index].author;
    //                var dateCreated = data.result[index].createdAt;
    //                var viewsCount = data.result[index].viewsCount;
    //                var voteCount = data.result[index].voteCount;
    //                var commentsCount = data.result[index].commentsCount;
    //                var img = data.result[index].img;
    //                var tags = data.result[index].tags;
    //                var post = new Post(id, title, content, author, dateCreated, viewsCount, voteCount, commentsCount, null, img, tags);
    //                _this.posts.posts.push(post);
    //            }
    //            defer.resolve(_this.posts);
    //        }, function (error) {
    //            defer.reject(error);
    //        });
    //
    //    return defer.promise;
    //};


    return{
        get: function (requester) {
            return new Manager(requester)
        }
    }
}());
