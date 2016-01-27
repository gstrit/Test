var _ = require('lodash');

module.exports = require('cqrs-domain').definePreCondition({
  name: 'createPlayer',
  version: 0,
  description: 'unique email address'
}, function (data, agg) {
  var found = _.find(agg.get('players'), function (player) {
    return player.firstname === data.firstname;
  });
  if (found) {
    throw new Error('email already used');
  }
});