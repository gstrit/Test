exports.actions = function(app, options, repository) {

    var playerRepo = repository.extend({
        collectionName: 'player'
    });

    // this is only a little hack for this sample when it should work with inMemory DB
    if (options.repository.type === 'inmemory') {
        playerRepo = require('../viewBuilders/collection').repository;
    }

    app.get('/', function(req, res) {
        res.render('index');
    });
        
    app.get('/allPlayers.json', function(req, res) { 
        playerRepo.find(function(err, players) {
            if (err) res.json({});
                
            res.json(players);
        });
    });
};