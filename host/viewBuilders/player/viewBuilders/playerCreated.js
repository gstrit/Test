module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'playerCreated',
  id: 'payload.id'
}, 'create');