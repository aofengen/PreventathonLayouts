// Util functions taken from https://github.com/nicnacnic/speedcontrol-layouts/blob/main/graphics/js/layouts/intermission.js

let runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
let runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadFromSpeedControl);

function getNextRuns(runData, amount) {
	let nextRuns = [];
	let indexOfCurrentRun = findIndexInRunDataArray(runData);
	for (let i = 1; i <= amount; i++) {
		if (!runDataArray.value[indexOfCurrentRun + i]) {
			break;
		}
		nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
	}
	return nextRuns;
}

function findIndexInRunDataArray(run) {
	let indexOfRun = -1;
	if (run) {
		for (let i = 0; i < runDataArray.value.length; i++) {
			if (run.id === runDataArray.value[i].id) {
				indexOfRun = i; break;
			}
		}
	}
	return indexOfRun;
}

function loadFromSpeedControl() {
	runDataActiveRun.on('change', (newVal, oldVal) => {
		refreshNextRunsData(newVal);
	});

	runDataArray.on('change', (newVal, oldVal) => {
		refreshNextRunsData(runDataActiveRun.value);
	});

}

function refreshNextRunsData(currentRun) {
	let nextRuns = getNextRuns(currentRun, 2);
    console.log(nextRuns);

    let upNextGameElement = $('.title');
    let upNextCategoryElement = $('.category');
    let upNextEstimateElement = $('.estimate');
    let upNextRunnerElement = $('.runnername');
    let upNextRunner2Element = $('.runner2name');
    if(typeof currentRun.game !== 'undefined') {
        upNextGameElement.html(currentRun.game);
    } else {
        upNextGameElement.html("");
    }
    if(typeof currentRun.category !== 'undefined') {
        upNextCategoryElement.html(currentRun.category);
    } else {
        upNextCategoryElement.html("");
    }
    if(typeof currentRun.estimate !== 'undefined' && currentRun.estimate !== '0') {
        upNextEstimateElement.html(`EST: ${currentRun.estimate}`);
    } else {
        upNextEstimateElement.html("");
    }
    if(typeof currentRun.teams[0] !== 'undefined') {
        upNextRunnerElement.html(currentRun.teams[0].players[0].name);
    } else {
        upNextRunnerElement.html("");
    }
    if(typeof currentRun.teams[1] !== 'undefined') {
        upNextRunner2Element.html(currentRun.teams[1].players[0].name);
    } else {
        upNextRunner2Element.html("");
    }

	let i = 0;
	for (let run of nextRuns) {
		if (i >= 2)
			break;

        let onDeckGameElement = $('.next' + (i + 1) + 'title');
        let onDeckCategoryElement = $('.next' + (i + 1) + 'category');
        let onDeckEstimateElement = $('.next' + (i + 1) + 'estimate');
        let onDeckRunnerElement = $('.next' + (i + 1) + 'runnername');
        let onDeckRunner2Element = $('.next' + (i + 1) + 'runner2name');
        if(typeof run.game !== 'undefined') {
            onDeckGameElement.html(run.game);
        } else {
            onDeckGameElement.html("");
        }
        if(typeof run.category !== 'undefined') {
            onDeckCategoryElement.html(run.category);
        } else {
            onDeckCategoryElement.html("");
        }
        if(typeof run.estimate !== 'undefined' && run.estimate !== 0) {
            onDeckEstimateElement.html(`EST: ${run.estimate}`);
        } else {
            onDeckEstimateElement.html("");
        }
        if(typeof run.teams[0] !== 'undefined') {
            onDeckRunnerElement.html(run.teams[0].players[0].name);
        } else {
            onDeckRunnerElement.html("");
        }
        if(typeof run.teams[1] !== 'undefined') {
            onDeckRunner2Element.html(run.teams[1].players[0].name);
        } else {
            onDeckRunner2Element.html("");
        }
        
        i++;
    }
}