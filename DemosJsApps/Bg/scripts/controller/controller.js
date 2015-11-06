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


    return {
        get: function (model) {
            return new Controller(model);
        }
    }
}())