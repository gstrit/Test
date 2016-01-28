module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'playerDeleted',
  id: 'payload.id'
}, function (data, vm) { 
  vm.destroy();
});