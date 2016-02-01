var colors = require('../../colors');
var _ = require("lodash");

var requests = [];

exports.actions = function(app, options, repository) {

    var playerRepo = repository.extend({
        collectionName: 'player'
    });

    var msgbus = require('../../msgbus');    

    app.get('/', function(req, res) {
        res.render('index');
    });
        
    app.get('/allPlayers.json', function(req, res) { 
        playerRepo.find(function(err, players) {
            if (err) res.json({});
            
            res.setHeader('Cache-Control', 'max-age=1');
            res.json(players);
        });
    });
    
    app.post('/command', function(req, res)
    {
        var data = req.body.command;
        
        var timeout = setTimeout(function()
        {
            removeCommand(data.id);
            res.sendStatus(408);
        },10000);
        
        requests.push({res: res, timeout: timeout, commandId: data.id});
        
        console.log(colors.magenta('\n -- sends command ' + data.command + ':'));
        console.log(data);
        
        msgbus.emitCommand(data);
    });
    
    msgbus.onEvent(function(event) {  
        
        var request = _.find(requests, { 'commandId': event.commandId });
        
        if(request != undefined)
        {
            removeCommand(event.commandId);
            
            clearTimeout(request.timeout);
            
            console.log(colors.magenta('\nsocket.io -- publish event ' + event.event + ' to browser'));
            request.res.json(event);
        }
    });
};

function removeCommand(commandId)
{
    _.remove(requests, function(req) {
        return req.commandId = commandId;
    });
}