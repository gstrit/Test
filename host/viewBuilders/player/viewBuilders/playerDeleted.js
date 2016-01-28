module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'playerDeleted',
  id: 'payload.id'
}, 'delete');