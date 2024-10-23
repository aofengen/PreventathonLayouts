$('.twitchNameplate').hide();

function cycleNameplates() {
  let nameplates = $('.nameplate').toArray();
  for (const nameplate of nameplates) {
    let twitchNameplate = $(nameplate).children('.twitchNameplate').first();
    let runnerNameplate = $(nameplate).children('.runnerNameplate').first();
    let runnerShown = runnerNameplate.is(":visible");
    if (runnerShown) {
      let twitch = $(twitchNameplate).children('.twitchText').first().text();
      if (!twitch) {
        continue;
      }
      twitchNameplate.fadeIn(1000);
      runnerNameplate.fadeOut(1000);
      continue;
    } else {
      twitchNameplate.fadeOut(1000);
      runnerNameplate.fadeIn(1000);
      continue;
    }
  }
}

setInterval(cycleNameplates, 20000);

const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
runDataActiveRun.on('change', (run) => {
const players = run.teams.flatMap((t) => t.players);
  const nameplateCount = $('.nameplate').toArray().length;
  for (let i = 0; i < players.length && i < nameplateCount; i++) {
    const player = players[i];
    $(`#twitch${i}`).text(player.social.twitch ?? '');
    $(`#runner${i}`).text(player.name);
    if (player.pronouns) {
      $(`.pronouns${i}`).text(player.pronouns ?? '');
      $(`.pronouns${i}`).show();
    } else {
      $(`.pronouns${i}`).hide();
    }
  }
  $('#game').text(run.game);
  textFitDelayed($('#game'), {
    multiLine: true,
    alignHoriz: true,
    alignVert: true,
    maxFontSize: 160
  });
  $('#category').text(run.category);
  let systemAndYear = [];
  if (run.system) systemAndYear.push(run.system);
  if (run.release) systemAndYear.push(run.release);
  $('#systemAndYear').text(systemAndYear.join(', '));
  $('#estimate').text(`EST ${run.estimate}`);
});

const timer = nodecg.Replicant('timer', 'nodecg-speedcontrol');
timer.on('change', (timer) => {
  let time = timer.time.substring(1);
  $('#timer').text(time);
});

function textFitDelayed(element, options) {
  for (let i = 0; i <= 1000; i += 500) {
    setInterval(() => {
      textFit(element, options);
    }, 500)
  }
}

let comms0name     = $('.comms0name');
let comms1name     = $('.comms1name');
let comms2name     = $('.comms2name');
let comms3name     = $('.comms3name');
let comms0pronouns = $('.comms0p');
let comms1pronouns = $('.comms1p');
let comms2pronouns = $('.comms2p');
let comms3pronouns = $('.comms3p');

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

comms0NameRep.on('change', (newVal) => {
    comms0name.text(newVal);
});
comms1NameRep.on('change', (newVal) => {
    comms1name.text(newVal);
});
comms2NameRep.on('change', (newVal) => {
    comms2name.text(newVal);
});
comms3NameRep.on('change', (newVal) => {
    comms3name.text(newVal);
});
comms0PronounsRep.on('change', (newVal) => {
    comms0pronouns.text(newVal);
});
comms1PronounsRep.on('change', (newVal) => {
    comms1pronouns.text(newVal);
});
comms2PronounsRep.on('change', (newVal) => {
    comms2pronouns.text(newVal);
});
comms3PronounsRep.on('change', (newVal) => {
    comms3pronouns.text(newVal);
});
hasComm1Rep.on('change', (newVal) => {
  if(newVal) {
    $('.comm1Nameplate').show();
  } else {
    $('.comm1Nameplate').hide();
  }
});
hasComm2Rep.on('change', (newVal) => {
  if(newVal) {
    $('.comm2Nameplate').show();
  } else {
    $('.comm2Nameplate').hide();
  }
});
hasComm3Rep.on('change', (newVal) => {
  if(newVal) {
    $('.comm3Nameplate').show();
  } else {
    $('.comm3Nameplate').hide();
  }
});