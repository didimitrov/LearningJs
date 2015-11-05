var app = app || {};

app.registerView = (function() {
    function RegisterView(selector, data) {
        $(selector).empty();
        $('#rightSide').empty();
        $('#leftSide').empty();

        if(!$("#register").length) {
            $.get('templates/register.html', function(template) {
                var output = Mustache.render(template);
                $(selector).append(output);
                $('#registerUserButton').click(function() {
                    var username = $('#username').val();
                    var password = $('#password').val();
                    var repeatPassword = $('#repeat-password').val();

                    if (username.length < 4) {
                        console.log('error', 'Invalid username', 'The username must be' +
                            ' at least 4 characters long.');
                    } else if (password.length < 4) {
                        console.log('error', 'Invalid password', 'The password must be ' +
                            'at least 4 characters long.');
                    } else if (password === repeatPassword) {
                        app.model.register(username, password)
                            .then(function(data) {
                                var splitted = window.location.href.split('#');
                                window.location.replace(splitted[0] + '#/');
                                console.log('success', 'Success', 'You have Registered successfully.' +
                                    ' You may now login with your account.');
                            }, function (error) {
                                console.log('error', 'Error', 'There was an error registering.' +
                                    ' Please try again later.');
                            });
                    } else {
                        console.log('error', 'Error', 'The password don\'t match');
                    }
                });
            });
        }
    }

    return {
        get: function (selector, data) {
            return new RegisterView(selector, data);
        }
    }
}());