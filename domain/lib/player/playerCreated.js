module.exports = require('cqrs-domain').defineEvent({
  name: 'playerCreated'
},
function (data, aggregate) {
    aggregate.get('players').push(data);
});