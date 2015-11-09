var app = app || {};

(function() {
    app.model = app.manager.get(app.requester.get('https://api.parse.com/1/'));

    var controller = app.controller.get(app.model);
    controller.loadInitialView();

    app.router = Sammy(function () {
        var selector = '#center';
        var leftBox = '#leftSide';
        var rightBox = '#rightSide';
        var lastEditPostId = '';


        this.get('#/about', function () {
            controller.getAboutPage(selector)
        })

        this.get('#/', function () {
            controller.getHomePage(leftBox);
            //controller.getNewestPostView(rightBox);
            //controller.getTagsView(rightBox);
        });

        this.get('#/login', function () {
            controller.getLoginPage(selector);
        });

        this.get('#/register', function () {
            controller.getRegisterPage(selector);
        });

        this.get('#/Post/:id', function (data) {
            // Controller - Get Post page
            var id = data['params'].id;
            controller.getSinglePostPage(selector, id);

        });
        //
        //this.get('#/AllPosts', function (data) {
        //    controller.getAllPostsPage(selector);
        //});
        //
        //this.get('#/search', function () {
        //
        //});
        //
        ///* ADMIN VIEWS */
        //this.get('#/Admin', function (data) {
        //    controller.getAdminPage('#center');
        //});
        //
        //this.get('#/EditPost/:id', function(data) {
        //    var id = data['params'].id;
        //    lastEditPostId =  id;
        //    controller.getAdminEditPostPage(selector, id);
        //});
        //
        //this.get('#/DeletePost/:id', function(data) {
        //    var id = data['params'].id;
        //    controller.adminDeletePost("#center", id);
        //});
        //
        //this.get('#/DeleteComment/:id', function (data) {
        //    var id = data['params'].id;
        //    controller.adminDeleteComment("#center", id, lastEditPostId);
        //});
        //
        this.get('#/Create', function () {
            controller.getAdminCreatePostPage(selector);
        });
    });

    app.router.run('#/');
}());