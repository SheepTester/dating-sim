const TYPING_SPEED = 50;
const M_DASH = '—';

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
function typeAnimation(text, dashInterrupt = true) {
  let resolve;
  const promise = new Promise(res => resolve = res);
  const span = document.createElement('span');
  span.classList.add('typing-text');
  span.classList.add('typing');
  const typedText = document.createTextNode('');
  span.appendChild(typedText);
  const cursor = document.createElement('span');
  cursor.classList.add('typing-cursor');
  span.appendChild(cursor);
  const untypedText = document.createTextNode(' '.repeat(text.length));
  span.appendChild(untypedText);
  let progress = 0;
  let done = false;
  const intervalID = setInterval(() => {
    typedText.nodeValue += text[progress];
    untypedText.nodeValue = untypedText.nodeValue.slice(1);
    progress++;
    if (progress >= text.length) {
      clearInterval(intervalID);
      span.removeChild(cursor);
      resolve(true);
      done = true;
    }
  }, TYPING_SPEED);
  return {
    span, promise,
    stop() {
      if (done) return;
      if (progress < text.length - 1 && dashInterrupt) {
        typedText.nodeValue += M_DASH;
        untypedText.nodeValue = untypedText.nodeValue.slice(1);
      } else {
        typedText.nodeValue = text;
        untypedText.nodeValue = '';
      }
      clearInterval(intervalID);
      span.removeChild(cursor);
      resolve(false);
      done = true;
    }
  };
}

document.addEventListener('DOMContentLoaded', async e => {
  const titleView = document.getElementById('title');
  const {span, promise} = typeAnimation('Dating in the Juul Room');
  titleView.appendChild(span);
  /* skip intro?
  await promise;
  await delay(500);
  //*/
  const rapidIdentity = document.getElementById('rapididentity');
  rapidIdentity.classList.remove('hidden');
  const error = document.getElementById('error');
  let selectedMe, selectedSO;
  rapidIdentity.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
      if (e.target.dataset.person[1] === 'M') {
        if (selectedMe) selectedMe.classList.remove('selected-person');
        selectedMe = e.target;
      } else {
        if (selectedSO) selectedSO.classList.remove('selected-person');
        selectedSO = e.target;
      }
      e.target.classList.add('selected-person');
    }
  });
  /* skip character selection?
  await new Promise(res => {
    document.getElementById('start').addEventListener('click', e => {
      if (selectedMe && selectedSO) res();
      else {
        error.classList.remove('hidden');
      }
    });
  });
  const amFemale = selectedMe.dataset.person[0] === 'F';
  const soFemale = selectedSO.dataset.person[0] === 'F';
  /*/
  const amFemale = true;
  const soFemale = false;
  //*/
  const gameView = document.getElementById('game-wrapper');
  gameView.classList.remove('hidden');
  const log = document.getElementById('game-log');
  let onEnterKey = null;
  document.addEventListener('keydown', e => {
    if (e.keyCode === 13 && onEnterKey) onEnterKey();
  });
  function logSkippable(text) {
    const {span, promise, stop} = typeAnimation(text, false);
    span.classList.add('log-paragraph');
    log.appendChild(span);
    onEnterKey = () => {
      stop();
      onEnterKey = null;
    };
    promise.then(() => onEnterKey = null);
    return promise;
  }
  await logSkippable(`You were inspired by posts on Gunn Confessions to finally ask out the ${soFemale ? 'girl' : 'boy'} you liked since eighth grade. Surprisingly, ${soFemale ? 'she' : 'he'} accepted.`);
  await logSkippable(`You decided to meet in the gender-neutral Juul room at school. For some reason, the school had installed toilets and sinks in the Juul room, but they made great chairs and tables. You aren't alone; half of Madame Lizundia's class is there partying, but they ignore you.`);
  await logSkippable(`You face ${soFemale ? 'Selena' : 'Justin'} with packets of hot chocolate from the SEC between you two.`);
});
