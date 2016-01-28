module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'playerCreated',
  id: 'payload.id'
}, function (data, vm) { 
  vm.set('email', data.firstname);
});