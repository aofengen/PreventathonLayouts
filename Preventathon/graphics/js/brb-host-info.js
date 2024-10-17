'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
    
    var comms0name     = $('.comms0name');
    var comms0pronouns = $('.comms0pronouns');
    
    const comms0NameRep     = nodecg.Replicant('comm0Names');
    const comms0PronounsRep = nodecg.Replicant('comm0Pronouns');
    
    comms0NameRep.on('change', (newVal) => {
        comms0name.text(newVal);
    });
    comms0PronounsRep.on('change', (newVal) => {
        comms0pronouns.text(newVal);
    });
});