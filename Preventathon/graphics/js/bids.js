'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	let speedcontrolBundle = 'nodecg-speedcontrol';

    let milestone = true;
    let incentive, bidwar = false;
    
    let bidName     = $('#incentiveName');
    let bidTotal    = $('#incentiveTotal');
    let bidProgress = $('.progress-bar');
    let bidOptions  = $('.bidOptions');
    let attribution = $('#attribution');

    let milestoneName, milestoneTotal, milestoneProgress;
    let incentiveName, incentiveTotal, incentiveProgress;
    let bidWarName, randomBidWarId, gameNames, gameName;
    
    const milestoneRep     = nodecg.Replicant('milestones');
    const gameRep          = nodecg.Replicant('gameNames');
    const incentiveRep     = nodecg.Replicant('incentives');
    const parentRep        = nodecg.Replicant('parentBids');
    const childRep         = nodecg.Replicant('childBids');
    const totalRep         = nodecg.Replicant('donationTotal')
    
    milestoneRep.on('change', (newVal) => {
        let activeMilestone = false;
        if (newVal != null) {
            if (newVal.length == undefined) {
                if (newVal.amount > totalRep.value) {
                    activeMilestone = true;
                    milestoneName = newVal.name;
                    milestoneTotal = `$${totalRep.value} / $${Math.round(newVal.amount)} CAD`;
                    milestoneProgress = Math.round((totalRep.value/newVal.amount) * 100);
                }
            } else {
                for (let i = 0; i < newVal.length; i++) {
                    if (newVal[i].amount > totalRep.value) {
                        activeMilestone = true;
                        milestoneName = newVal[i].name;
                        milestoneTotal = `$${totalRep.value} / $${Math.round(newVal[i].amount)} CAD`;
                        milestoneProgress = Math.round((totalRep.value/newVal[i].amount) * 100);
                        break;
                    }
                }
            }
        } 

        if (!activeMilestone) {
            milestoneName = "No Active Milestones!"
            milestoneTotal = "";
            milestoneProgress = 0;
        } 

    });

    gameRep.on('change', (newVal) => {
        gameNames = Array.from(newVal);
    });

    incentiveRep.on('change', (newVal) => {
        if (newVal.length != null) {
            let newIncentives = Array.from(newVal);
            for (let i = newIncentives.length - 1 ; i >= 0 ; i--) {
                if (newIncentives[i].state != 'OPENED') {
                    newIncentives.splice(i, 1);
                }
            }
            let random = randomNumber(newIncentives.length);
            let randomIncentive = newIncentives[random];
            for (let i = 0; i < gameNames.length; i++) { 
                let temp = gameNames[i].split(',');
                let temp2 = temp[0].split(':');
                let temp3 = temp[1].split(':');
                if (temp2[1].trimStart() == randomIncentive.speedrun) {
                    gameName = temp3[1].trimStart();
                    break;
                }
            }
       
            incentiveName = `${gameName} - ${randomIncentive.name}`;
            incentiveTotal = `$${randomIncentive.total} / $${randomIncentive.goal} CAD`;
            incentiveProgress = Math.round((randomIncentive.total/randomIncentive.goal) * 100);
        } else {
            incentiveName = "No Active Incentives!"
            incentiveTotal = "";
            incentiveProgress = 0;
        }
    });

    parentRep.on('change', (newVal) => {
        if (newVal.length > 0) {
            let newBidWars = Array.from(newVal);
            for (let i = newBidWars.length - 1 ; i >= 0 ; i--) {
                if (newBidWars[i].state != 'OPENED') {
                    newBidWars.splice(i, 1);
                }
            }            
            let random = randomNumber(newBidWars.length);
            let randomBidWar = newBidWars[random];
            randomBidWarId = randomBidWar.id;
            for (let i = 0; i < gameNames.length; i++) { 
                let temp = gameNames[i].split(',');
                let temp2 = temp[0].split(':');
                let temp3 = temp[1].split(':');
                if (temp2[1].trimStart() == randomBidWar.speedrun) {
                    gameName = temp3[1].trimStart();
                    break;
                }
            }
            
            bidWarName = `${gameName} - ${randomBidWar.name}`;
        } else {
            bidWarName = "No Active Bidwars!";
        }
    });

    childRep.on('change', (newVal) => {
        if (bidWarName == "No Active Bidwars!") {
            //do nothing
        } else {
            let children = Array.from(newVal);

            for (let i = children.length - 1; i > 0; i--) {
                if (children[i].parent != randomBidWarId) {
                    children.splice(i, 1);
                }
            }
            children.sort(function(a,b){return b.total - a.total});

            $('#option1').text("");
            $('#option2').text("");
            $('#option3').text("");
            $('#otherOptions').text("");

            for (let i = 0; i < 4; i++) {
                if (i == 3 || i == newVal.length) {
                    if (children.length - 3 > 0) {
                        $('#otherOptions').text(`${children.length - 3} more options!`);
                    } else {
                        $('#otherOptions').text("");
                    }
                    break;
                }
                let option = $(`#option${i+1}`);
                option.text(`${children[i].name}:  $${children[i].total} CAD`);
            }
        }
    })

    setInterval(() => {
        if (milestone) {
            incentive = true;
            milestone = false;

            bidName.removeAttr('style');
            bidTotal.removeAttr('style');
            if (milestoneName != "No Active Milestones!") {
                bidProgress.removeAttr('style');
                attribution.removeAttr('style');
            }
            bidOptions.css('display', 'none');

            bidName.text(milestoneName);
            bidTotal.text(milestoneTotal);
            bidProgress.attr('value', milestoneProgress);
        } else {
            if (incentive) {
                bidwar = true;
                incentive = false;

                bidName.removeAttr('style');
                bidTotal.removeAttr('style');
                if (incentiveName == "No Active Incentives!") {
                    bidProgress.css('display', 'none');
                    attribution.css('display', 'none');
                } else {
                    bidProgress.removeAttr('style');
                    attribution.removeAttr('style');
                }
                bidOptions.css('display', 'none');

                bidName.text(incentiveName);
                bidTotal.text(incentiveTotal);
                bidProgress.attr('value', incentiveProgress);
            } else { //bidwar = true
                milestone = true;
                bidwar = false;

                bidTotal.css('display', 'none');
                bidProgress.css('display', 'none');
                attribution.css('display', 'none');

                bidName.text(bidWarName);
                if (bidWarName != "No Active Bidwars") {
                    bidOptions.removeAttr('style');
                }
            }
        }
    }, 10000);

    function randomNumber(max) {
        return Math.floor(Math.random() * max);
    }
});