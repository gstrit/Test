module.exports = require('cqrs-domain').defineAggregate({
  name: 'player',
  version: 0,
  defaultCommandPayload: 'payload',
  defaultEventPayload: 'payload'
},
{
  players: []
})
.defineSnapshotNeed(function (loadingTime, events, aggregate) {
  return events.length >= 2;
});