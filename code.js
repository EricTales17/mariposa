// Navegação entre páginas
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

/* -------------------------
   Tic Tac Toe
   ------------------------- */
const tttBoard = document.getElementById('ttt-board');
const tttCells = Array.from(document.querySelectorAll('#ttt-board .cell'));
const tttStatus = document.getElementById('ttt-status');
const tttPlayerEl = document.getElementById('ttt-player');
const tttReset = document.getElementById('ttt-reset');

let tttState = Array(9).fill(null);
let tttCurrent = 'X';
let tttActive = true;

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateTttStatus(){
  tttPlayerEl.textContent = tttCurrent;
}

function checkWin(){
  for(const combo of winCombos){
    const [a,b,c] = combo;
    if(tttState[a] && tttState[a] === tttState[b] && tttState[a] === tttState[c]){
      return tttState[a];
    }
  }
  if(!tttState.includes(null)) return 'draw';
  return null;
}

function handleTttClick(e){
  const idx = Number(e.target.dataset.index);
  if(!tttActive || tttState[idx]) return;
  tttState[idx] = tttCurrent;
  e.target.textContent = tttCurrent;
  const result = checkWin();
  if(result){
    tttActive = false;
    if(result === 'draw'){
      tttStatus.textContent = 'Empate!';
    } else {
      tttStatus.innerHTML = `Vencedor: <strong>${result}</strong>`;
    }
  } else {
    tttCurrent = tttCurrent === 'X' ? 'O' : 'X';
    updateTttStatus();
  }
}

tttCells.forEach(cell => cell.addEventListener('click', handleTttClick));
tttReset.addEventListener('click', ()=>{
  tttState = Array(9).fill(null);
  tttCurrent = 'X';
  tttActive = true;
  tttCells.forEach(c=>c.textContent = '');
  tttStatus.textContent = 'Vez de: ';
  updateTttStatus();
});

/* -------------------------
   Jogo da Memória
   ------------------------- */
const memBoard = document.getElementById('mem-board');
const memStart = document.getElementById('mem-start');
const memSize = document.getElementById('mem-size');
const memStatus = document.getElementById('mem-status');

let memCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

function shuffle(array){
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createMemoryBoard(pairs){
  memBoard.innerHTML = '';
  const icons = [
    '🍎','🍌','🍇','🍓','🍒','🍍','🥝','🍉','🍑','🍋','🍐','🥥'
  ];
  const chosen = icons.slice(0,pairs);
  const deck = shuffle([...chosen, ...chosen]);
  deck.forEach((val, idx)=>{
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.value = val;
    card.dataset.index = idx;
    card.textContent = val;
    card.style.color = 'transparent';
    card.addEventListener('click', onMemCardClick);
    memBoard.appendChild(card);
  });
  // adjust grid columns
  const cols = pairs <= 4 ? 4 : 4;
  memBoard.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  memStatus.textContent = `Pairs: ${pairs}. Boa sorte!`;
  matches = 0;
}

function onMemCardClick(e){
  const card = e.currentTarget;
  if(lockBoard || card.classList.contains('matched') || card === firstCard) return;
  revealCard(card);
  if(!firstCard){
    firstCard = card;
    return;
  }
  secondCard = card;
  lockBoard = true;
  if(firstCard.dataset.value === secondCard.dataset.value){
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches++;
    resetMemTurn();
    if(matches === (memBoard.children.length/2)){
      memStatus.textContent = 'Você venceu! Parabéns.';
    }
  } else {
    setTimeout(()=>{
      hideCard(firstCard);
      hideCard(secondCard);
      resetMemTurn();
    }, 800);
  }
}

function revealCard(card){
  card.style.color = '';
  card.classList.add('revealed');
}

function hideCard(card){
  card.style.color = 'transparent';
  card.classList.remove('revealed');
}

function resetMemTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

memStart.addEventListener('click', ()=>{
  const pairs = Number(memSize.value);
  createMemoryBoard(pairs);
});

/* Inicialização */
updateTttStatus();
