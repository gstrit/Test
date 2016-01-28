var _ = require('lodash');


module.exports = require('cqrs-domain').definePreCondition({
  name: 'createPlayer',
  version: 0,
  description: 'unique firstname'
}, function (data, agg) {
        
    
});