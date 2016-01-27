module.exports = require('cqrs-domain').defineEvent({
  name: 'playerCreated'
},
function (data, aggregate) {
    aggregate.set(data);
    //aggregate.get('players').push(data);
});