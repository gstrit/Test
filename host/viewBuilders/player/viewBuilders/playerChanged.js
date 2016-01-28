module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'playerChanged',
  id: 'payload.id'
}, 'update');