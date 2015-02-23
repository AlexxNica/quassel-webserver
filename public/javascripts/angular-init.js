angular.module('quassel', ['ngSocket', 'ngSanitize', 'er', 'ui.bootstrap', 'dragAndDrop', 'cgNotify'])
.config(["$socketProvider", function ($socketProvider) {
    $socketProvider.setOptions({
        timeout: 6000,
        reconnectionAttempts: 5,
        path: location.pathname + 'socket.io'
    });
}])
.factory('$networks', function(){
    var networks = null;
    return {
        get: function() {
            return networks;
        },
        set: function(obj) {
            networks = obj;
        }
    };
})
.factory('$reviver', [function(){
    var NetworkCollection = require('network').NetworkCollection;
    var Network = require('network').Network;
    var IRCMessage = require('message').IRCMessage;
    var IRCBufferCollection = require('buffer').IRCBufferCollection;
    var IRCBuffer = require('buffer').IRCBuffer;
    var IRCUser = require('user');
    var HashMap = require('serialized-hashmap');
    var Reviver = require('serializer').Reviver;
    var reviver = new Reviver(NetworkCollection, Network, IRCBufferCollection, IRCBuffer, IRCUser, HashMap, IRCMessage);
    
    return reviver;
}])
.factory('$favico', [function() {
    var num = 0;
    var favico = new Favico({
        animation: 'pop',
        type: 'rectangle',
        bgColor: '#f0ad4e',
        textColor: '#fff'
    });

    var more = function() {
        num = num + 1;
        favico.badge(num);
    };
    
    var less = function() {
        num = (num-1 < 0) ? 0 : (num - 1);
        favico.badge(num);
    };
    
    var reset = function() {
        favico.reset();
    };

    return {
        more: more,
        less: less,
        reset: reset
    };
}])
.factory('$alert', ['notify', function(notify) {
    
    notify.config({startTop: 2, verticalSpacing: 4, duration: 8000});
    
    function info(message, options) {
        options = options || {};
        options.message = message;
        options.classes = ["alert-info"];
        notify(options);
    }
    
    function warn(message, options) {
        options = options || {};
        options.message = message;
        options.classes = ["alert-warning"];
        notify(options);
    }
    
    function error(message, options) {
        options = options || {};
        options.message = message;
        options.classes = ["alert-danger"];
        notify(options);
    }
    
    return {
        info: info,
        warn: warn,
        error: error
    };
}])
.run([function(){
    console.log('AngularJS loaded');
}]);