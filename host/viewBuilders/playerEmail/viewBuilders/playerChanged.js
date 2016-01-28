module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'playerChanged',
  id: 'payload.id'
}, function (data, vm) { 
  vm.set('email', data.email);
});