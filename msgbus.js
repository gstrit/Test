// the hub encapsulates functionality to send or receive messages from redis.

var simplebus = require('simplebus')
  , colors = require('./colors')
  , cmd = simplebus.createBus()
  , evt = simplebus.createBus()
  , evtSubscriptions = []
  , cmdSubscriptions = [];

module.exports = {

    emitCommand: function(command) {
        console.log(colors.blue('\nhub -- publishing command ' + command.command + ' to bus:'));
        console.log(command);
        cmd.post(JSON.stringify(command));
    },

    onCommand: function(callback) {
        if (cmdSubscriptions.length === 0) {
            // subscribe to __commands channel__
            cmd.subscribe(null, function (message) { 
                var command = JSON.parse(message);
                console.log(colors.green('\nhub -- received command ' + command.command + ' from bus:'));
                console.log(command);
                
                cmdSubscriptions.forEach(function(subscriber){
                    subscriber(command);
                });
             });
        }
        cmdSubscriptions.push(callback);
        console.log(colors.blue('hub -- command subscribers: ' + cmdSubscriptions.length));
    },

    emitEvent: function(event) {
        console.log(colors.blue('\nhub -- publishing event ' + event.event + ' to bus:'));
        console.log(event);
        evt.post(JSON.stringify(event));
    },

    onEvent: function(callback) {
        if (evtSubscriptions.length === 0) {
            // subscribe to __events channel__
            evt.subscribe(null, function (message) { 
                var event = JSON.parse(message);
                
                console.log(colors.green('\nhub -- received event ' + event.event + ' from bus:'));
                console.log(event);
                
                evtSubscriptions.forEach(function(subscriber){
                    subscriber(event);
                });                
             });
        }
        evtSubscriptions.push(callback);
        console.log(colors.blue('hub -- event subscribers: ' + evtSubscriptions.length));
    }
};
