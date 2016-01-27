module.exports = require('cqrs-domain').defineEvent({
  name: 'playerChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});