'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	let speedcontrolBundle = 'nodecg-speedcontrol';
    
    let bidName     = $('#incentiveName');
    let bidTotal    = $('#incentiveTotal');
    
    const milestoneRep     = nodecg.Replicant('milestones');
    
    milestoneRep.on('change', (newVal) => {
        bidName.text(newVal.name);
        bidTotal.text(newVal.amount);
    });
});