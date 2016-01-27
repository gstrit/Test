module.exports = require('cqrs-domain').defineEvent({
  name: 'playerDeleted'
},
function (data, aggregate) {
  aggregate.destroy();
});