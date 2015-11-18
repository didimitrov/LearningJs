var app = app || {};

app.controller = (function () {
    function Controller(models) {
        this.models = models;
    }

    Controller.prototype.loadMenu = function (selector) {
        var _this = this;
        if (sessionStorage['logged-in']) {
            app.userMenuView.load(selector)
                .then(function () {
                    _this.attachLogoutEvents('#logout a');
                   // _this.attachSearchEvents('#search');
                });
        } else {
            app.menuView.load(selector)
                .then(function () {
                   // _this.attachSearchEvents('#search');
                });
       }
       // this.attachUpToTopEvents();
    };


    Controller.prototype.getRegisterPage = function (selector) {
        var _this = this;
        app.registerView.load(selector)
            .then(function () {
                    _this.attachRegisterEvents('#reg-btn');
                $('#login-btn').click(function () {
                    window.location.replace('#/login');
                })
            }, function (error) {
                Noty.error(JSON.parse(error.responseText).error);
            })
    };

    Controller.prototype.attachRegisterEvents = function (selector) {
        var _this = this;
        $(selector).click(function () {
            var userRegData = {
                username: $("input[id=reg-username]").val(),
                password: $("input[id=reg-password]").val(),
                passwordRepeat: $("input[id=repeat-password]").val(),
                email: $("input[id=reg-email]").val()
            };
            _this.models.user.register(userRegData)
                .then(function (data) {
                    Noty.success('Registration Successful');
                    sessionStorage['logged-in'] = data.sessionToken;
                    sessionStorage['id'] = data.objectId;
                    window.location.replace('#/blog');
                }, function (error) {
                    Noty.error(JSON.parse(error.responseText).error);
                })
        });
    };

    Controller.prototype.getLoginPage = function (selector) {
        var _this = this;
        $(selector).empty();
        app.loginView.load(selector)
            .then(function () {
                _this.attachLoginEvents('#login-btn');
                $('#register-btn').click(function () {
                    window.location.replace('#/register');
                })
            })
    };

    Controller.prototype.attachLoginEvents = function (selector) {
        var _this = this;
        $(selector).click(function () {
            var username = ($("input[id=login-username]").val());
            var password = ($("input[id=login-password]").val());

            _this.models.user.login(username, password)
                .then(function (data) {
                    sessionStorage['username'] = data.username;
                    sessionStorage['logged-in'] = data.sessionToken;
                    sessionStorage['id'] = data.objectId;
                    window.location.replace('#/blog');
                    Noty.success('Successfully logged in!');
                },
                function (errorData) {
                    Noty.error(JSON.parse(errorData.responseText).error);
                });
        });
    };
    Controller.prototype.attachLogoutEvents = function (selector) {
        var _this = this;
        $(selector).click(function () {
            _this.models.user.logout()
                .then(function () {
                    sessionStorage.clear();
                    window.location.replace('#/about');
                    _this.loadMenu('nav');
                    Noty.success('Goodbye!');
                },
                function (errorData) {
                    Noty.error(JSON.parse(errorData.responseText).error);
                });
        });
    };

    Controller.prototype.getBlogPage = function (selector, page) {
        $(selector).empty();
        var _this = this;
       // loadPosts()
        if(sessionStorage['logged-in']){
            //this.models.user.isAdmin(sessionStorage['id'])
            //    .then(function (data) {
            //        if (data.result){
            //            app.postArticle.load(selector)
            //                .then(function(){
            //                    loadPosts();
            //                    _this.attachBlogEvents('#postArticle');
            //                });
            //        } else {
            //            loadPosts();
            //        }
            //    }, function (error) {
            //        console.log(error.responseText);
            //    });
       // } else {

            app.postArticle.load(selector).then(function () {
               loadPosts();
                _this.attachBlogEvents('#postArticle');
            })

        }

        function loadPosts(){
            _this.models.post.getPosts('classes/Post?include=author&order=-createdAt')
                .then(function (data) {
                    $('<section id="posts">').appendTo(selector);
                    var postsCount = Object.keys(data.posts).length;
                    app.blogView.load('#posts', data);

                    _.each(data.posts, function (p) {
                        _this.models.comment.getPostCommentsCount(p.objectId)
                            .then(function (c) {
                                $('#article' + p.objectId + ' .comments-count').text(c.count);
                            }, function (error) {
                                Noty.error(JSON.parse(error.responseText).error);
                            });
                    });

                    _this.models.comment.getComment()
                        .then(function () {
                            if (postsCount > 0) {
                                $('<ul class="pagination" id="pagination"></ul>').insertBefore($('#posts'));
                                //$('#posts').pageMe({
                                //    pagerSelector: '#pagination',
                                //    showPrevNext: true,
                                //    hidePageNumbers: false,
                                //    perPage: 5
                                //});
                                $('#posts').fadeIn();
                            }
                        }, function (error) {
                            console.log(error.responseText);
                        });
                }, function (error) {
                    Noty.error(JSON.parse(error.responseText).error);
                });
        }
        Controller.prototype.attachCommentEvents = function (selector, commentsSelector) {
            var _this = this;

            $(selector).click(function(event){
                var id = event.target['id'];
                var data = {
                    author: {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": sessionStorage['id']
                    },
                    content: $('#content').val(),
                    'post': {
                        __type: "Pointer",
                        className: "Post",
                        objectId: id
                    }
                };

                $('#comment-form-toggle').trigger('click');

                // bad words censorship
                $.ajaxSetup({
                    async: false
                });
                var badWords = [];
                var currentWords = data.content.split(' ');
                $.getJSON('scripts/helpers/lang.json', function (data) {
                    $.each(data['words'], function (key, value) {
                        badWords.push(value);
                    });
                });
                for (var i = 0; i < badWords.length; i++) {
                    for (var j = 0; j < currentWords.length; j++) {
                        if (currentWords[j].toLowerCase() == badWords[i].toLowerCase()) {
                            currentWords[j] =  '****';
                        }
                    }
                }
                $.ajaxSetup({
                    async: true
                });
                data.content = currentWords.join(' ');
                // end of bad words censorship
                if(data.content.length >= 10) {
                    _this.models.comment.createComment(data)
                        .then(function () {
                            Noty.success('Comment posted successfully.');
                            _this.models.comment.getPostComments(id)
                                .then(function (commentsData) {
                                    $(commentsSelector).empty();
                                    $('#comment-form')[0].reset();
                                    app.commentView.load(commentsSelector, commentsData);
                                }, function (error) {
                                    Noty.error(JSON.parse(error.responseText).error);
                                });
                        }, function (error) {
                            var errorCode = JSON.parse(error.responseText).code;
                            if (errorCode === 119) {
                                Noty.error("Only users can leave a comment.");
                            } else {
                                console.log(error);
                                Noty.error(JSON.parse(error.responseText).error);
                            }
                        });
                } else {
                    Noty.error('Your comment is not long enough.');
                }

                return false;
            });
        };

        Controller.prototype.getPostPage = function (id, selector) {
            $(selector).empty();
            var _this = this;

            this.models.post.getPost(id)
                .then(function (data) {
                    _this.models.comment.getPostComments(id)
                        .then(function (comment) {
                            data.posts[0]['commentsCount'] = comment.comments.length;
                            data.comments = comment.comments;
                            data.logged = !!sessionStorage['logged-in'];
                            app.postView.load(selector, data)
                                .then(function(){
                                    _this.attachPostEvents('#comment-form-toggle', '#comment-form')
                                    app.commentView.load('.comments', data).
                                        then(function(){
                                            _this.attachCommentEvents('.postCommentButton', '.comments');
                                            _this.models.post.visitsIncrement(id)
                                                .then(function () {

                                                }, function (error) {
                                                    Noty.error(JSON.parse(error.responseText).error);
                                                });
                                        });
                                });

                        }, function (error) {
                            Noty.error(JSON.parse(error.responseText).error);
                        });

                }, function () {
                    var error = $('<div class="alert alert-danger" role="alert">...</div>');
                    error.text("Error showing this post or post does not exist.");
                    $(selector).append(error);
                });
        };



        Controller.prototype.attachPostEvents = function(selector, child){
            $(selector).on('click', function(e){
                e.stopPropagation();
                $(child).slideToggle(400);
                $('#content').val("");

                if ($(child).not(":hidden")) {
                    $('#content').focus();
                }
            });
        };

        Controller.prototype.attachBlogEvents = function (selector) {
            $(document).on('change', '.btn-file :file', function () {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                input.trigger('fileselect', [numFiles, label]);
            });

            $(document).ready(function () {
                $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

                    var input = $(this).parents('.input-group').find(':text'),
                        log = numFiles > 1 ? numFiles + ' files selected' : label;

                    if (input.length) {
                        input.val(log);
                    } else {
                        if (log) alert(log);
                    }
                });
            });

            var _this = this,
                file;

            $('#upload-file-button').bind("change", function (e) {
                var files = e.target.files || e.dataTransfer.files;
                file = files[0];
            });

            $(selector).click(function () {
                var uniqueTags =
                    _.uniq($("input[id=tags]").val().split(/\s+/))
                        .filter(function (tag) {
                            return tag !== "";
                        });

                var content = $("textarea[id=content]").val();

                var _data = {
                    title: $("input[id=title]").val(),
                    content: content,
                    contentSummary: content.length > 300 ? content.substring(0, 300) + '...'  : content,
                    visitsCount: 0,
                    tags: uniqueTags,
                    tags_lower: _.map(uniqueTags, function (tag) {
                        return _.isString(tag) ? tag.toLowerCase() : tag;
                    })
                };

                $('#post-form')[0].reset();

                if(file){
                    _this.models.post.uploadHeader(file, _data)
                        .then(function(headerPicture){
                            _data.headerImage = {
                                "__type": "Pointer",
                                "className": "HeaderPicture",
                                "objectId": headerPicture.objectId
                            };
                            createPost();
                        })
                } else{
                    createPost();
                }

                file = undefined;
               // createPost();

                function createPost(){
                    _this.models.post.createPost(_data)
                        .then(function () {
                            $('#posts').empty();
                            _this.models.post.getPosts('classes/Post?include=author,headerImage&order=-createdAt&limit=5&skip=0')
                                .then(function (data) {
                                    Noty.success('Article posted successfully');
                                    app.blogView.load('#posts', data);
                                   // _this.getSidebar('#sidebar', 'mostPopularTags', 'Post', 5);
                                    window.location.replace('#/blog');
                                }, function (error) {
                                    Noty.error(JSON.parse(error.responseText).error);
                                })
                        }, function (error) {
                            Noty.error(JSON.parse(error.responseText).error);
                        })
                }
            });
        };
    };

    return {
        get: function (models) {
            return new Controller(models);
        }
    }

})();