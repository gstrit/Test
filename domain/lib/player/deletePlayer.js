module.exports = require('cqrs-domain').defineCommand({
  name: 'deletePlayer'
}, function (data, aggregate) {
  aggregate.apply('playerDeleted', data);
});