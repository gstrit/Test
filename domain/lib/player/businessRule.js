var _ = require('lodash');
var viewmodel = require('viewmodel');

module.exports = require('cqrs-domain').defineBusinessRule({
  name: 'checkForError'
}, function (changed, previous, events, command, callback) {
  
  viewmodel.read({
        type: 'mongodb',
        host: 'localhost',                         
        port: 27017,                                
        dbName: 'readmodel',                        
        timeout: 10000                             
    }, function(err, repository)
    {
        var playerRepo = repository.extend({
            collectionName: 'playerEmail'
        });           
        
        playerRepo.find({email: changed.attributes.firstname }, function(err, players) {
            if(players.length > 0)
                return callback(new Error());
            else
                callback(null);
        });
    }
  );  
});