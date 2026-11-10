const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const st = $('#stage');

const LETTER = `아빠 안녕~~ 하나밖에 없는 딸랑이 안서현이얌.

오늘이 아빠 생일이지? 어떻게 빼빼로 데이가 아빠생일 일 줄이야 하지만 이번 아빠 생일에는 내가 옆에 없네. 내가 바쁜 몸이라서 히히. 이번 아빠 생일은 엄마처럼 꽃 말고 내가 열심히 지피티랑 다른 것들이랑 싸우면서 만들었어. 어때? 감동적이지 상상도 못했지? 아빠 아프지 말고 너무 무리하지 말고 아빠랑은 생각보다 대화를 많이 한거 같아 약간 저녁먹고 남은 시간이나 엄마 씻는거 기다리면서 침대에서 논거랑 아빠랑은 이런저런 대화 진짜 많이 했던거 같아. 약간 아빠랑 대화하는 느낌이 아니라 친구랑 대화하는 느낌이랄까. 얼마전에 느꼈는데 그 약간 밤에 그냥 식탁위에서 모여서 시덥잖은 주전부리랑 시덥잖은 대화하는 그 분위기가 요즘 너무 좋아. 그래서 빨리 어른 돼서 내가 좋아하는 사람들이랑 그렇게 하고 싶어. 물론 아빠도 포함이고 우리 약속 안 잊었지? 내가 20살 되면 막창먹으면서 같이 술먹어야지. 진짜 곧이야.

난 아빠같이 나 사랑해주는 사람아니면 안만날거야. 평생 결혼 못하겠지? 나 평생 옆에 살아도 돼? 난 진짜 어른돼서 가정 꾸리면 이만큼 못할거 같아. 그중에 가장 큰 역할을 한게 아빠 아닐까? 진짜 부족함없이 가지고 싶은거 먹고 싶은거 다 하고 다 먹고 살아가지고 내 자식들한테는 더 크게 돌려줘야 되니깐 그게 좀 어려울 듯.... 그리고 나는 나같은 딸 못키워. 너무 힘들어.우리 더 감동적인 얘기는 20살되서 막창에 술먹으면서 하자. 상똥씨 생일 축하해~~ 사랑해!`;

function spark(layer, x, y, ch = '✦', c = '#FFE56B') {
  const e = document.createElement('span');
  e.className = 'sp'; e.textContent = ch;
  e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.color = c;
  layer.append(e); setTimeout(() => e.remove(), 1400);
}
function burst(layer, cx, cy, n, r) {
  for (let i = 0; i < n; i++)
    spark(layer, cx + rnd(-r, r), cy + rnd(-r, r), Math.random() < .35 ? '♥' : '✦', ['#FFE56B', '#fff', '#A8DDF3'][i % 3]);
}
async function type(el, text, d) {
  for (const ch of text) { el.textContent += ch; await wait(d); }
}

let ambT, heartT;

/* 1장: 케이크가 순서대로 */
async function scene1() {
  const amb = $('#amb');
  ambT = setInterval(() => spark(amb, rnd(0, st.clientWidth), rnd(0, st.clientHeight), '✦', '#fff'), 700);
  await wait(600);
  for (const [id, d] of [['#l1c', 1300], ['#l2c', 1300], ['#cream', 1400], ['#cherry', 1900]]) {
    $(id).classList.add('go');
    await wait(d); // 앞 애니메이션이 끝난 뒤에만 다음 요소 시작
  }
}

/* 2장: 문구 타이핑 */
async function scene2() {
  await wait(800);
  await type($('#l1'), '아빠,', 200);
  await wait(250);
  await type($('#l2'), '생일 축하해!', 150);
  $('#title').classList.add('pop');
  const W = st.clientWidth, H = st.clientHeight, deco = $('#deco');
  burst(deco, W / 2, H * .5, 14, W * .38);
  heartT = setInterval(() => {
    const h = document.createElement('span');
    h.className = 'fh'; h.textContent = '♥';
    h.style.left = rnd(10, 88) + '%'; h.style.fontSize = rnd(4, 7) + 'cqw';
    deco.append(h); setTimeout(() => h.remove(), 3500);
  }, 450);
  await wait(3800);
}

/* 3장: 모두 사라지고 핑크 배경만 */
async function scene3() {
  $('#title').classList.add('fade');
  $('#deco').classList.add('fade');
  $('#amb').classList.add('fade');
  clearInterval(ambT); clearInterval(heartT);
  await wait(1700);
  $('#cake').classList.add('fade');
  await wait(1700);
  $('#s12').hidden = true;
  await wait(1000); // 아무것도 없는 상태
}

/* 4장: 비둘기와 편지 */
async function scene4() {
  const s4 = $('#s4'); s4.hidden = false;
  const W = st.clientWidth, H = st.clientHeight, pg = $('#pigeon');
  const pw = pg.offsetWidth, ph = pw * .625, wrap = $('#envWrap'), trail = $('#trail');
  const dur = 5600, x0 = -pw, x1 = W + pw * .2;
  let dropped = false, dropP = null, lastT = 0;
  const t0 = performance.now();

  await new Promise(done => {
    (function frame(now) {
      const t = Math.min((now - t0) / dur, 1);
      const x = x0 + (x1 - x0) * t;
      const y = H * .2 + Math.sin(t * Math.PI * 5) * H * .028 + t * H * .03;
      pg.style.transform = `translate(${x}px,${y}px) rotate(${Math.cos(t * Math.PI * 5) * 4}deg)`;
      if (now - lastT > 110) { lastT = now; spark(trail, x + pw * .1, y + ph * .6, '✦', '#fff'); }
      if (!dropped && x + pw * .84 >= W / 2) {
        dropped = true;
        dropP = dropEnv(x + pw * .84, y + ph * .52);
      }
      t < 1 ? requestAnimationFrame(frame) : done();
    })(t0);
  });
  pg.hidden = true;
  await dropP;
  $('#hint').classList.add('show');
  $('#env').classList.add('pulse');
  await new Promise(r => $('#env').addEventListener('click', r, { once: true })); // 클릭(터치·마우스·키보드) 전까지 대기
  await openEnv();
}

async function dropEnv(sx, sy) {
  const W = st.clientWidth, H = st.clientHeight, wrap = $('#envWrap');
  $('#mini').style.display = 'none';
  const dx = W / 2 - sx, dy = H * .68 - sy;
  wrap.style.left = sx + 'px'; wrap.style.top = sy + 'px'; wrap.style.visibility = 'visible';
  const T = (a, b, r) => ({ transform: `translate(${dx * a}px,${dy * b}px) rotate(${r}deg)` });
  const k = [T(0, 0, -10), T(.3, .4, 25), T(.7, .75, -14), T(1, 1, 0), T(1, 1 - .05, 0), T(1, 1, 0)];
  const a = wrap.animate(k, { duration: 2800, offset: undefined, fill: 'forwards', easing: 'ease-in-out' });
  await a.finished;
  wrap.style.left = '50%'; wrap.style.top = '68%';
  a.cancel();
}

async function openEnv() {
  const env = $('#env'), wrap = $('#envWrap'), fx = $('#fx');
  env.classList.remove('pulse');
  $('#hint').classList.add('gone');
  wrap.style.top = '50%';
  env.classList.add('big');
  const cx = st.clientWidth / 2, cy = st.clientHeight * .5;
  burst(fx, cx, cy, 12, st.clientWidth * .34);
  await wait(1000);
  env.classList.add('open');           // 덮개 열림
  await wait(900);
  burst(fx, cx, cy - 10, 8, st.clientWidth * .3);
  env.classList.add('rise');           // 편지지 상승
  await wait(2000);
}

/* 5장: 편지 */
async function scene5() {
  const s5 = $('#s5'); s5.hidden = false;
  void s5.offsetWidth;
  s5.classList.add('on');
  await wait(1200);
  $('#s4').hidden = true;
  $('#sheetWrap').classList.add('up');
  await wait(1700);
  $('#top').classList.add('show');
  await wait(900);
  $('#to').classList.add('show');
  await wait(900);

  const body = $('#body'), node = document.createTextNode('');
  body.append(node);
  for (const ch of LETTER) {
    node.data += ch;
    body.scrollTop = body.scrollHeight; // 타이핑 중 자동 따라가기
    await wait(ch === '\n' ? 800 : ch === '.' || ch === '?' || ch === '!' ? 380 : ch === ',' || ch === ' ' ? 130 : 105);
  }
  await wait(500);
  $('#from').classList.add('show');     // 서명 + 하트 그리기
  const hl = $('#hearts');
  setInterval(() => {
    const h = document.createElement('span');
    h.className = 'fh2'; h.textContent = Math.random() < .3 ? '✦' : '♥';
    h.style.left = (Math.random() < .5 ? rnd(0, 6) : rnd(90, 97)) + '%';
    h.style.top = rnd(35, 92) + '%'; h.style.fontSize = rnd(4, 7) + 'cqw';
    hl.append(h); setTimeout(() => h.remove(), 4600);
  }, 800);
  // 이후 자동 스크롤 없음: 자유롭게 읽기
}

(async function main() {
  await scene1();
  await scene2();
  await scene3();
  await scene4();
  await scene5();
})();
