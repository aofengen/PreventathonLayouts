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
    let bidWarName, option1, option2, option3, randomBidWarId;
    
    const milestoneRep     = nodecg.Replicant('milestones');
    const incentiveRep     = nodecg.Replicant('incentives');
    const parentRep        = nodecg.Replicant('parentBids');
    const childRep         = nodecg.Replicant('childBids');
    const totalRep         = nodecg.Replicant('donationTotal')
    
    milestoneRep.on('change', (newVal) => {
        let activeMilestone = false;
        console.log(newVal);
        console.log(newVal.length)
        if (newVal != null) {
            console.log(newVal.length);
            if (newVal.length == undefined) {
                if (newVal.amount > totalRep.value) {
                    activeMilestone = true;
                    milestoneName = newVal.name;
                    milestoneTotal = `$${totalRep.value} / $${Math.round(newVal.amount)}`;
                    milestoneProgress = Math.round((totalRep.value/newVal.amount) * 100);
                }
            } else {
                for (let i = 0; i < newVal.length; i++) {
                    if (newVal[i].amount > totalRep.value) {
                        activeMilestone = true;
                        milestoneName = newVal[i].name;
                        milestoneTotal = `$${totalRep.value} / $${Math.round(newVal[i].amount)}`;
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

    incentiveRep.on('change', (newVal) => {
        if (newVal != null) {
            let random = randomNumber(newVal.length);
            let randomIncentive = newVal[random];
       
            incentiveName = randomIncentive.name;
            incentiveTotal = `$${randomIncentive.total} / $${randomIncentive.goal}`;
            incentiveProgress = Math.round((randomIncentive.total/randomIncentive.goal) * 100);
        }
    });

    parentRep.on('change', (newVal) => {
        let random = randomNumber(newVal.length);
        let randomBidWar = newVal[random];
        randomBidWarId = randomBidWar.id;
        
        bidWarName = randomBidWar.name;
    });

    childRep.on('change', (newVal) => {
        let children = Array.from(newVal);

        for (let i = children.length - 1; i > 0; i--) {
            if (children[i].parent != randomBidWarId) {
                children.pop(i);
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
            option.text(`${children[i].name}:  $${children[i].total}`);
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
                bidOptions.removeAttr('style');
            }
        }
    }, 10000);

    function randomNumber(max) {
        return Math.floor(Math.random() * max);
    }
});