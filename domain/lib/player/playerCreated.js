module.exports = require('cqrs-domain').defineEvent({
  name: 'playerCreated'
},
function (data, aggregate) {
    aggregate.set(data);
});