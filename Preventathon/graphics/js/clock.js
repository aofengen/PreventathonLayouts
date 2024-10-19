'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	let speedcontrolBundle = 'nodecg-speedcontrol';
    
    let time     = $('.clock');
    const timeRep     = nodecg.Replicant('currentTime');
    
    timeRep.on('change', (newVal) => {
        time.text(newVal);
    });
});