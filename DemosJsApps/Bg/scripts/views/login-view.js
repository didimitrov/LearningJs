var app = app || {};

app.loginView = (function() {
    function LoginView(selector, data) {
        $(selector).empty();
        $('#rightSide').empty();
        $('#leftSide').empty();

        $.get('templates/login.html', function(template) {
            var output = Mustache.render(template);
            $(selector).html(output);
            $('#loginUserButton').click(function () {
                var username = $('#username').val();
                var password = $('#password').val();
                if (username.length < 4) {
                    console.log('error', 'Invalid username', 'The username cannot be' +
                        ' less than 4 characters long');
                } else if (password.length < 4) {
                    console.log('error', 'Invalid password', 'The password cannot be' +
                        ' less than 4 characters long');
                } else {
                    app.model.login(username, password)
                        .then(function (data) {
                            var splitted = window.location.href.split('#');
                            window.location.replace(splitted[0] + '#/');
                            console.log('success', 'Success', 'You have logged in successfully');
                        }, function (error) {
                            $('#username').val('');
                            $('#password').val('');
                            console.log('error', 'Invalid Login', 'The username or password is incorrect');
                        });

                }
            });
        });
    }

    // Sample solution using mustache - not necessary, can do it with DOM Manipulation as well.
    // Should do a Parse.com Login validation. Set a token in the local storage or as a cookie

    return {
        load: function (selector, data) {
            return new LoginView(selector, data);
        }
    }
}());