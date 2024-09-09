(async function cycleLogo() {
  while (true) {
    let showGlitchedDuration = 600;
    await sleep(10000);
    $('.leftlogo').toggle();
    await sleep(showGlitchedDuration);
    $('.leftlogo').toggle();
    await sleep(showGlitchedDuration);
    $('.leftlogo').toggle();
    await sleep(showGlitchedDuration / 2);
    $('.leftlogo').toggle();
  }
})();

$('.omnibarContainer').hide();

let shownPollId;
let shownChallengeId;
let shownPolls = {};
let shownChallenges = {};
let pollsReplicant = nodecg.Replicant('donationpolls', 'nodecg-tiltify');
let challengesReplicant = nodecg.Replicant('challenges', 'nodecg-tiltify');
let commentaryReplicant = nodecg.Replicant('commentary');

async function animateOmnibar() {
  await NodeCG.waitForReplicants(pollsReplicant, challengesReplicant);
  cycleIncentives();
  pollsReplicant.on('change', (value) => updateIncentiveDOM(value, null));
  challengesReplicant.on('change', (value) => updateIncentiveDOM(null, value));
  commentaryReplicant.on('change', updateCommentaryDOM);
  
  setInterval(() => {
    updateIncentiveDOM();
  }, 5000)
  
  while (true) {
    await animateOmnibarIteration();
  }
};

animateOmnibar();

function updateCommentaryDOM(value) {
  if (value.host) {
    $('#host').text(value.host.name);
    if (value.host.pronouns) {
      $('#hostPronouns').text(value.host.pronouns);
      $('#hostPronouns').show();
    } else {
      $('#hostPronouns').hide();
    }
  }
  
  if (!value.commentators) return;
  for (let i = 0; i < 2; i++) {
    let commentator = value.commentators[i];
    let containerElement = $(`#comm${i}Container`);
    if (!commentator) {
      containerElement.hide();
      continue;
    } else {
      containerElement.show();
    }
    $(`#comm${i}`).text(commentator.name);
    let pronounElement = $(`#comm${i}Pronouns`);
    if (commentator.pronouns) {
      pronounElement.text(commentator.pronouns);
      pronounElement.show();
    } else {
      pronounElement.hide();
    }
  }
}

function updateIncentiveDOM(polls, challenges) {
  if (!polls) polls = pollsReplicant.value;
  if (!challenges) challenges = challengesReplicant.value;
  
  let shownPoll = findById(shownPollId, polls);
  if (shownPoll) updatePollDOM(shownPoll);
  
  let shownChallenge = findById(shownChallengeId, challenges);
  if (shownChallenge) updateChallengeDOM(shownChallenge);
}

function updatePollDOM(poll) {
  $('#pollText').text(`BIDWAR: ${poll.name}`);
  let options = poll.options.slice();
  options.sort((a, b) => b.totalAmountRaised - a.totalAmountRaised);
  for (let i = 0; i < 6; i++) {
    let option = options[i];
    let elem = $(`#pollChoice${i}`);
    if (option) {
      elem.text(`${option.name} ($${Math.floor(option.totalAmountRaised)})`);
      elem.show();
    } else {
      elem.hide();
    }
  }
}

function updateChallengeDOM(challenge) {
  let remainingMillis = challenge.endsAt - Date.now();
  let remainingString = convertRemainingMillis(remainingMillis);
  $('#challengeText').text(`INCENTIVE: ${challenge.name}${remainingString}`);
  $('#challengeRaised').text(`Raised $${Math.floor(challenge.totalAmountRaised)}`);
  $('#challengeProgress')[0].value = challenge.totalAmountRaised / challenge.amount;
  $('#challengeNeeded').text(`out of $${Math.floor(challenge.amount)}`);
}

function cycleIncentives() {
  let pollCandidate = getTiltifyCandidate(pollsReplicant, shownPolls);
  if (pollCandidate) 
    shownPollId = pollCandidate.id;
  else
    shownPollId = undefined;
  
  let challengeCandidate = getTiltifyCandidate(challengesReplicant, shownChallenges);
  if (challengeCandidate) 
    shownChallengeId = challengeCandidate.id;
  else
    shownChallengeId = undefined;
  
  updateIncentiveDOM()
}

async function animateOmnibarIteration() {
  await standardShow('#intro0', 5000, true);
  await standardShow('#intro1', 7500, true);
  await standardShow('#intro2', 5000);
  await standardShow('#donate', 20000);
  if (commentaryReplicant.value.host) {
    await standardShow('#hostContainer', 10000);
  }
  
  if (commentaryReplicant.value.commentators.length) {
    await standardShow('#commentaryTopContainer', 15000);
  }
  
  await standardShow('#schedule', 10000);
  
  cycleIncentives();
  if (shownChallengeId) {
    await standardShow('#challenge', 10000);
  }
  
  if (shownPollId) {
    await standardShow('#poll', 10000);
  }
}





// UTILS

async function standardShow(element, duration, crossFade=false) {
  await $(element).fadeIn(750).promise();
  await sleep(duration);
  let fadeOut = $(element).fadeOut(750).promise();
  if (!crossFade) {
    await fadeOut;
    await sleep(500);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function findById(id, list) {
  if (!id) return undefined;
  for (const elem of list) {
    if (elem.id === id) return elem;
  }
}

const MILLIS_IN_SECOND = 1000;
const MILLIS_IN_MINUTE = MILLIS_IN_SECOND * 60;
const MILLIS_IN_HOUR = MILLIS_IN_MINUTE * 60;
const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24;

function convertRemainingMillis(remainingMillis) {
  if (remainingMillis > MILLIS_IN_DAY) {
    return '';
  } else if (remainingMillis >= 0) {
    let remainingHours = Math.floor(remainingMillis / MILLIS_IN_HOUR);
    remainingMillis -= remainingHours * MILLIS_IN_HOUR;
    remainingHours = remainingHours + 'h';
    
    let remainingMinutes = Math.floor(remainingMillis / MILLIS_IN_MINUTE);
    if (remainingMinutes < 10) remainingMinutes = `0${remainingMinutes}`;
    remainingMinutes = remainingMinutes + 'm';
    
    return ` (in ${remainingHours}${remainingMinutes})`;
  } else {
    return ' (ended)';
  }
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