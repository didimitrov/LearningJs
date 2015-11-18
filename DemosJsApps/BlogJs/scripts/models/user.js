var app = app || {};

app._models = app._models || {};

app._models.user = (function () {
    function User(requester){
        this._requester = requester;
        this._users = {
            users : []
        };
    }

    User.prototype.register = function (data) {
        var defer = Q.defer;
        this._requester.post('users', data)
            .then(function (data) {
                defer.resolve(data)
            },function error(err){
                defer.reject(err)
            }
        );
        return defer.promise;
    };

    User.prototype.login = function (username, password) {
        var defer = Q.defer();
        this._requester.get('login?username=' + username + '&password=' + password)
            .then(function (data) {
                defer.resolve(data);
            }, function (error) {
                defer.reject(error);
            });
        return defer.promise;
    };

    User.prototype.logout = function () {
        var defer = Q.defer();
        this._requester.post('logout')
            .then(function (data) {
                defer.resolve(data);
            }, function (error) {
                defer.reject(error);
            });
        return defer.promise;
    }

    User.prototype.getUsers = function () {
        var defer = Q.defer();
        var _this = this;
        this.users['users'].length = 0;

        this._requester.get('users')
            .then(function (data) {
                data['results'].forEach(function (dataUser) {
                    var user = {
                        'objectId': dataUser.objectId,
                        'username': dataUser.username,
                        'password': dataUser.password,
                        'email': dataUser.email
                    };
                    _this.users['users'].push(user);
                });

                defer.resolve(_this.users);
            }, function (error) {
                defer.reject(error);
            });

        return defer.promise;
    };

    User.prototype.isAdmin= function(id){
        var defer = Q.defer();
        var data = {
            id: id
        };

        //this._requester.post('functions/isAdmin', data)
        //    .then(function(role){
        //        defer.resolve(role);
        //    }, function(error){
        //        defer.reject(error);
        //    });
        //
        //return defer.promise;
       // return '  //todo: fix this
    }

    return {
        get: function (requester) {
            return new User(requester)
        }
    }
})();