var app = app || {};

app.controller = (function () {
    function Controller(model){
        this.model = model;
    }

    Controller.prototype.loadInitialView = function () {
        $('#center').empty();
        $('#leftSide').empty();
        $('#rightSide').empty();

        if (localStorage['logged-in']) {
            $('#hiUserName').html('Hello, <span>'+localStorage['username']+'</span>')
            $('#loginButton').html('<p>Logout</p>');
            $('#registerButton').remove();
        }else {
            $('#loginButton').html('<p>Login</p>');
            $('#hiUserName').text('');
        }
    }
    
    Controller.prototype.getRegisterPage= function (selector) {
       this.loadInitialView();
        app.registerView.get(selector);

    }
    Controller.prototype.getLoginPage = function (selector) {
        var _this = this;
        if (localStorage['logged-in']) {
            app.model.logout().then(function(data) {
                var splitted = window.location.href.split('#');
                window.location.replace(splitted[0] + '#/');
               // window.location.replace('#/');
                _this.loadInitialView();
                console.log('success', 'Success', 'You have logged out successfully');
            });
        } else {
            app.loginView.load(selector);
        }

        this.loadInitialView();
    };
    //Controller.prototype.getAllPostPage = function (selector) {
    //    this.loadInitialView();
    //    this.model.getPosts()
    //        .then(function(data){
    //            app.allPostsView.load(selector, data);
    //        }, function(error){
    //            console.error(error);
    //        });
    //}

    Controller.prototype.getHomePage = function (selector) {
        this.loadInitialView();
        this.model.getNewestPosts()
            .then(function (data) {
                app.homeView.load(selector, data, "newPosts");
            }, function (error) {
                console.error(error);
            });
    }

    Controller.prototype.getAboutPage = function (selector) {
        $(selector).empty();
        app.aboutView.load(selector);
    };

    Controller.prototype.getSinglePostPage = function (selector, id) {
        this.loadInitialView();
        var _this = this;
        this.model.getPost(id)
            .then(function (data) {
                if (localStorage['logged-in']) {
                    data["logged-in"] = true;
                }
                app.postView.load(selector, data);
                _this.model.viewPage(id).then(function(viewPageData) {

                }, function(error) {
                    console.log(error);
                });
            }, function(error) {
                console.log('error', 'Error', 'There was an error loading this post. ' +
                    'Please try again later.');
            });
    };

    Controller.prototype.getAdminCreatePostPage = function (selector) {
        //this.model.isValidAdmin()
        //    .then(function (data) {
                app.adminCreatePostPage.load(selector);
            }, function (error) {
                var splitted = window.location.href.split('#');
                window.location.replace(splitted[0] + '#/');
                console.log('error', 'Forbidden', 'You do not have permissions to access this page.');
          //  });
    };

    return {
        get: function (model) {
            return new Controller(model);
        }
    }
}())