'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	let speedcontrolBundle = 'nodecg-speedcontrol';
    
    let total = $('#eventTotal');
    const totalRep = nodecg.Replicant('donationTotal');
    
    totalRep.on('change', (newVal) => {
        total.text(`$${newVal} raised for Little Warriors!`);
    });
});