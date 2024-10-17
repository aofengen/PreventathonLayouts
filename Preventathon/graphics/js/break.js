nodecg.Replicant('nowPlaying').on('change', (song) => {
  setTimeout(() => {
    $('#songTitle').text(song.title);
    $('#songArtists').text(`by ${song.artists} (ocremix.org)`);
  }, 5000);
});

nodecg.Replicant('commentary').on('change', (value) => {
  $('#host').text(value.host.name);
  let pronounElement = $('#hostPronouns');
  if (value.host.pronouns) {
    pronounElement.text(value.host.pronouns);
    pronounElement.show();
  } else {
    pronounElement.hide();
  }
});

async function initSchedule() {
  const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
  const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
  await NodeCG.waitForReplicants(runDataArray, runDataActiveRun);
  runDataActiveRun.on('change', (run) => {
    let runs = runDataArray.value;
    let index = findIndexOfRun(run, runs);
    console.log(index);
    let nextRuns = runs.slice(index, index+3);
    $('.clearOnReload').text('');
    for (let i = 0; i < nextRuns.length; i++) {
      let nextRun = nextRuns[i];
      setText($(`#game${i}`), nextRun.game);
      if (i === 0) {
        setText(
          $(`#categoryAndEstimate${i}`),
          `${nextRun.category}`
        );
      } else {
        setText($(`#category${i}`), nextRun.category);
      }
      
      setText(
        $(`#players${i}`),
        'by ' + nextRun.teams.flatMap((t) => t.players).map((p) => p.name).join(', ')
      );
    }
  });
}

function setText(elem, text) {
  elem.text(text);
  textFit(elem, {
    multiLine: true,
    alignHoriz: true,
    alignVert: true,
    maxFontSize: 200
  });
}

function findIndexOfRun(run, runs) {
  for (let i = 0; i < runs.length; i++) {
    if (run.id === runs[i].id) return i;
  }
}

initSchedule();

let renderedPolls = {};
let renderedChallenges = {};
let currentPolls = nodecg.Replicant('donationpolls', 'nodecg-tiltify');
let currentChallenges = nodecg.Replicant('challenges', 'nodecg-tiltify');

let lastRenderedPollChart = undefined;
$('#pollCanvas').hide();
function renderPoll(poll) {
  if (!poll) {
    poll = getTiltifyCandidate(currentPolls, renderedPolls);
  }
  if (!poll) return false;
  
  let labels = [];
  let data = [];
  for (const option of poll.options) {
    labels.push(`${option.name} ($${Math.floor(option.totalAmountRaised)})`);
    data.push(option.totalAmountRaised);
  }
  if (lastRenderedPollChart) {
    lastRenderedPollChart.destroy();
    lastRenderedPollChart = undefined;
  }
  const ctx = $('#pollCanvas')[0].getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 206, 86, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          color: 'white',
          text: poll.name,
          font: {
            family: 'TT_BLUESCREENS_DEMIBOLD',
            size: 60
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            borderColor: 'white',
            borderWidth: '2',
            color: 'rgba(255, 255, 255, 0.5)'
          },
          ticks: {
            color: 'white',
            textStrokeColor: 'black',
            textStrokeWidth: 1,
            font: {
              family: 'TT_BLUESCREENS_DEMIBOLD',
              size: 30
            }
          }
        },
        y: {
          grid: {
            borderColor: 'white',
            borderWidth: '2',
            color: 'rgba(255, 255, 255, 0.5)'
          },
          ticks: {
            color: 'white',
            textStrokeColor: 'black',
            textStrokeWidth: 1,
            font: {
              family: 'TT_BLUESCREENS_DEMIBOLD',
              size: 30
            }
          },
          beginAtZero: true
        }
      }
    }
  });
  setTimeout(async () => {
    await $('#challengeCanvas').fadeOut(1000).promise();
    await $('#pollCanvas').fadeIn(1000).promise();
  });
  
  lastRenderedPollChart = myChart;
  return true;
}

let lastRenderedChallengeChart = undefined;
$('#challengeCanvas').hide();
function renderChallenge(challenge) {
  if (!challenge) {
    challenge = getTiltifyCandidate(currentChallenges, renderedChallenges);
  }
  if (!challenge) return false;
  
  let raised = challenge.totalAmountRaised;
  let required = challenge.amount;
  let remaining = required - raised;
  
  if (lastRenderedChallengeChart) {
    lastRenderedChallengeChart.destroy();
    lastRenderedChallengeChart = undefined;
  }
  
  const ctx = $('#challengeCanvas')[0].getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        `Raised $${Math.floor(raised)}`,
        `Remaining $${Math.floor(remaining)}`,
      ],
      datasets: [{
        data: [raised, remaining],
        backgroundColor: [
          'rgba(75, 192, 75, 0.8)',
          'rgba(192, 75, 75, 0.8)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          position: 'top',
          color: 'white',
          text: challenge.name,
          font: {
            family: 'TT_BLUESCREENS_DEMIBOLD',
            size: 60
          }
        },
        legend: {
          display: true,
          position: 'left',
          labels: {
            color: 'white',
            font: {
              family: 'TT_BLUESCREENS_DEMIBOLD',
              size: 30
            }
          }
        }
      },
    }
  });
  setTimeout(async () => {
    await $('#pollCanvas').fadeOut(1000).promise();
    await $('#challengeCanvas').fadeIn(1000).promise();
  });
  
  lastRenderedChallengeChart = myChart;
  return true;
}

function getTiltifyCandidate(replicant, rendered) {
  let list = [];
  for (const entry of replicant.value) {
    if (!entry.active) continue;
    if (entry.endsAt && Date.now() > entry.endsAt) continue;
    if (entry.amount && entry.totalAmountRaised >= entry.amount) continue;
    list.push(entry);
  }
  
  shuffleArray(list);
  let candidates = [];
  for (const entry of list) {
    if (rendered[entry.id]) continue;
    candidates.push(entry);
  }
  
  if (candidates.length === 0) {
    Object.keys(rendered).forEach(key => delete rendered[key]);
    return list[0];
  }
  
  rendered[candidates[0].id] = true;
  return candidates[0];
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

NodeCG.waitForReplicants(currentPolls, currentChallenges).then(async () => {
  let lastWasPoll = false;
  while (true) {
    try {
      let result;
      if (lastWasPoll) {
        result = renderChallenge();
      } else {
        result = renderPoll();
      }
      
      lastWasPoll = !lastWasPoll;
      
      if (result) {
        await sleep(20000);
      } else {
        await sleep(500);
      }
    } catch (error) {
      console.log(error);
      await sleep(500);
    }
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}