module.exports = require('cqrs-domain').defineCommand({
  name: 'changePlayer'
}, function (data, aggregate) {
  aggregate.apply('playerChanged', data);
});