module.exports = require('cqrs-domain').defineCommand({
  name: 'createPlayer'
}, function (data, aggregate) {
  aggregate.apply('playerCreated', data);
});