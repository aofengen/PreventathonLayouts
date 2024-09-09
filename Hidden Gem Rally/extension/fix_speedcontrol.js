const https = require('https');
let nodecg;

module.exports = (_nodecg) => {
  nodecg = _nodecg;
  let runsToModify = [];
  let runs = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol').value;
  runs.forEach(run => fixRun(run, runsToModify));
  runsToModify.forEach(run => {
    nodecg.log.info(`Fixing player pronouns for ${run.id} (${run.game})`);
    nodecg.sendMessageToBundle('modifyRun', 'nodecg-speedcontrol', {
      runData: run,
      updateTwitch: false
    });
  });
};

function fixRun(run, runsToModify) {
  nodecg.log.info(`Checking player pronouns for ${run.id} (${run.game})`);
  let copy = JSON.parse(JSON.stringify(run));
  let change = false;
  
  const regex = /(.*)\s+\(([^\)]+)\)/g;
  for (let team of copy.teams) {
    for (let player of team.players) {
      let name = player.name.trim();
      nodecg.log.trace(name);

      let match = regex.exec(name);
      if (!match) continue;
      change = true;
      player.name = match[1];
      player.pronouns = match[2];
    }
  }
  
  if (!change) return;
  runsToModify.push(copy);
}