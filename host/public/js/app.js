(function() {

    // Create Backbone Model and Collection
    // ------------------------------------

    // model
    var Player = Backbone.Model.extend({
        modelName: 'player', // so denormalizers can resolve events to model
        
        initialize: function() {
            // bind this model to get event updates - a lot of magic ;)
            // not more to do the model gets updated now
            this.bindCQRS(); 
        }
    });

    // collection
    var Players = Backbone.Collection.extend({
        model: Player,
        url: '/allPlayers.json'
    });

    var players = new Players();


    // Init Backbone.CQRS
    // ------------------

    // we just have to override eventNameAttr:
    Backbone.CQRS.hub.init({ eventNameAttr: 'event' });

    // override Backbone.sync with CQRS.sync which allows only GET method
    Backbone.sync = Backbone.CQRS.sync;


    // Wire up communication to/from server
    // ------------------------------------

    // create a socket.io connection
    var socket = io.connect('http://localhost:3000');
    
    // on receiving an event from the server via socket.io 
    // forward it to backbone.CQRS.hub
    socket.on('events', function(evt) {
        Backbone.CQRS.hub.emit('events', evt);
    });

    // forward commands to server via socket.io
    Backbone.CQRS.hub.on('commands', function(cmd) {
        socket.emit('commands', cmd);
    });



    // Create a few EventDenormalizers
    // -------------------------------

    // playerCreated event 
    var playerCreateHandler = new Backbone.CQRS.EventDenormalizer({
        methode: 'create',
        model: Player,
        collection: players,

        // bindings
        forModel: 'player',
        forEvent: 'playerCreated'
    });

    // playerChanged event
    var playerChangedHandler = new Backbone.CQRS.EventDenormalizer({
        forModel: 'player',
        forEvent: 'playerChanged'
    });

    // playerDeleted event 
    var playerDeletedHandler = new Backbone.CQRS.EventDenormalizer({
        methode: 'delete',

        // bindings
        forModel: 'player',
        forEvent: 'playerDeleted'
    });



    // Create Backbone Stuff
    // ---------------------

    // view templates
    var playerTemplate = _.template('<%= firstname %> <a class="deletePlayer" href="">delete</a> <a class="editPlayer" href="">edit</a>');
    var editPlayerTemplate = _.template('<input id="newText" type="text" value="<%= firstname %>"></input><button id="changePlayer">save</button>');

    // views
    var PlayerView = Backbone.View.extend({
        
        tagName: 'li',
        className: 'player',

        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },

        events: {
            'click .editPlayer' : 'uiEditPlayer',
            'click .deletePlayer' : 'uiDeletePlayer',
            'click #changePlayer' : 'uiChangePlayer'
        },

        // render edit input
        uiEditPlayer: function(e) {
            e.preventDefault();
            this.model.editMode = true;
            this.render();
        },

        // send deletePerson command with id
        uiDeletePlayer: function(e) {
            e.preventDefault();

            // CQRS command
            var cmd = new Backbone.CQRS.Command({
                id:_.uniqueId('msg'),
                command: 'deletePlayer',
                payload: { 
                    id: this.model.id
                }
            });

            // emit it
            cmd.emit();
        },

        // send changePlayer command with new name
        uiChangePlayer: function(e) {
            e.preventDefault();

            var playerText = this.$('#newText').val();

            this.$('#newText').val('');
            this.model.editMode = false;
            this.render();

            if (playerText) {

                // CQRS command
                var cmd = new Backbone.CQRS.Command({
                    id:_.uniqueId('msg'),
                    command: 'changePlayer',
                    payload: { 
                        id: this.model.id,
                        firstname: playerText 
                    }
                });

                // emit it
                cmd.emit();
            }
        },

        render: function() {
            if (this.model.editMode) {
                $(this.el).html(editPlayerTemplate(this.model.toJSON()));
            } else {
                $(this.el).html(playerTemplate(this.model.toJSON()));
            }
            return this;
        }, 

        remove: function() {
            $(this.el).fadeOut('slow');
        }

    });

    var IndexView =  Backbone.View.extend({

        el: '#index-view',

        initialize: function() {
            _.bindAll(this, 'addPlayer');

            this.collection = app.players;
            this.collection.bind('reset', this.render, this);
            this.collection.bind('add', this.addPlayer, this);
        },

        events: {
            'click #addPlayer' : 'uiAddPlayer'
        },

        // send createPerson command
        uiAddPlayer: function(e) {
            e.preventDefault();  

            var playerText = this.$('#newPlayerText').val();

            if (playerText) {

                // CQRS command
                var cmd = new Backbone.CQRS.Command({
                    id:_.uniqueId('msg'),
                    command: 'createPlayer',
                    payload: { firstname: playerText }
                });

                // emit it
                cmd.emit();
            }

            this.$('#newPlayerText').val('');
        },

        render: function() {
            this.collection.each(this.addPlayer);
        },

        addPlayer: function(player) {
            var view = new PlayerView({model: player});
            this.$('#players').append(view.render().el);
        }

    });


    // Bootstrap Backbone
    // ------------------

    var app = {};
    var init = function() {
        app.players = players;
        app.players.fetch();

        var indexView = new IndexView();
        indexView.render();
    };

    // kick things off
    $(init);

})();