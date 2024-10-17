//Replicants
const comms0NameRep     = nodecg.Replicant('comm0Names');
const comms1NameRep     = nodecg.Replicant('comm1Names');
const comms2NameRep     = nodecg.Replicant('comm2Names');
const comms3NameRep     = nodecg.Replicant('comm3Names');
const comms0PronounsRep = nodecg.Replicant('comm0Pronouns');
const comms1PronounsRep = nodecg.Replicant('comm1Pronouns');
const comms2PronounsRep = nodecg.Replicant('comm2Pronouns');
const comms3PronounsRep = nodecg.Replicant('comm3Pronouns');
const hasComm1Rep       = nodecg.Replicant('hasComm1');
const hasComm2Rep       = nodecg.Replicant('hasComm2');
const hasComm3Rep       = nodecg.Replicant('hasComm3');

function updateComms() {
    let comm0name     = document.getElementById('comm0-name').value;
    let comm1name     = document.getElementById('comm1-name').value;
    let comm2name     = document.getElementById('comm2-name').value;
    let comm3name     = document.getElementById('comm3-name').value;
    let comm0pronouns = document.getElementById('comm0-pronouns').value;
    let comm1pronouns = document.getElementById('comm1-pronouns').value;
    let comm2pronouns = document.getElementById('comm2-pronouns').value;
    let comm3pronouns = document.getElementById('comm3-pronouns').value;
    let hascomm1      = document.getElementById('comm1-vis').checked;
    let hascomm2      = document.getElementById('comm2-vis').checked;
    let hascomm3      = document.getElementById('comm3-vis').checked;
    
    comms0NameRep.value = comm0name;
    comms1NameRep.value = comm1name;
    comms2NameRep.value = comm2name;
    comms3NameRep.value = comm3name;
    comms0PronounsRep.value = comm0pronouns;
    comms1PronounsRep.value = comm1pronouns;
    comms2PronounsRep.value = comm2pronouns;
    comms3PronounsRep.value = comm3pronouns;
    hasComm1Rep.value = hascomm1;
    hasComm2Rep.value = hascomm2;
    hasComm3Rep.value = hascomm3;
}