module.exports = (nodecg) => {
  require('./rainwave_replicant')(nodecg);
  require('./fix_speedcontrol')(nodecg); 
};