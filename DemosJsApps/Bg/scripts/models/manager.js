var app = app || {};

app.manager =(function () {
    function Manager(requester){
        this._requester = requester;
        this.posts = {
            posts:[]
        }
    }

    Manager.prototype.register = function (username, password) {
        var defer = Q.defer();
        var _this=this;

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
    return{
        get: function (requester) {
            return new Manager(requester)
        }
    }
}());
