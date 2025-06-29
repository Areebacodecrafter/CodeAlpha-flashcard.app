let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentIndex = 0;
let showingAnswer = false;

const cardText = document.getElementById('card-text');
const showAnswerBtn = document.getElementById('show-answer');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const cardForm = document.getElementById('card-form');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const cardList = document.getElementById('card-list');
const themeToggle = document.getElementById('theme-toggle');

function renderCard() {
  if (flashcards.length === 0) {
    cardText.textContent = 'No flashcards available. Please add some.';
    return;
  }
  const card = flashcards[currentIndex];
  cardText.textContent = showingAnswer ? card.answer : card.question;
}

function updateCardList() {
  cardList.innerHTML = '';
  flashcards.forEach((card, index) => {
    const li = document.createElement('li');
    li.textContent = `${card.question}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      flashcards.splice(index, 1);
      if (currentIndex >= flashcards.length) currentIndex = flashcards.length - 1;
      saveFlashcards();
      renderCard();
      updateCardList();
    };

    li.appendChild(deleteBtn);
    cardList.appendChild(li);
  });
}

function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

showAnswerBtn.onclick = () => {
  showingAnswer = !showingAnswer;
  renderCard();
};

nextBtn.onclick = () => {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % flashcards.length;
  showingAnswer = false;
  renderCard();
};

prevBtn.onclick = () => {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  showingAnswer = false;
  renderCard();
};

cardForm.onsubmit = (e) => {
  e.preventDefault();
  flashcards.push({
    question: questionInput.value,
    answer: answerInput.value
  });
  questionInput.value = '';
  answerInput.value = '';
  saveFlashcards();
  updateCardList();
  renderCard();
};

// Tabs
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Theme toggle
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

themeToggle.onclick = () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
};

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark');

renderCard();
updateCardList();
