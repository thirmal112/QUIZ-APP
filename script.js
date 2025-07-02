// --- Image Carousel ---
const carouselImages = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80'
];
let carouselIndex = 0;
const carouselImage = document.getElementById('carousel-image');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselIndicators = document.getElementById('carousel-indicators');

function updateCarousel() {
  carouselImage.src = carouselImages[carouselIndex];
  // Update indicators
  carouselIndicators.innerHTML = carouselImages.map((_, i) =>
    `<span class="indicator${i === carouselIndex ? ' active' : ''}" data-idx="${i}"></span>`
  ).join('');
}

carouselPrev.addEventListener('click', () => {
  carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
  updateCarousel();
});
carouselNext.addEventListener('click', () => {
  carouselIndex = (carouselIndex + 1) % carouselImages.length;
  updateCarousel();
});
carouselIndicators.addEventListener('click', (e) => {
  if (e.target.classList.contains('indicator')) {
    carouselIndex = parseInt(e.target.dataset.idx);
    updateCarousel();
  }
});
updateCarousel();

// --- Programming Languages Quiz ---
const questions = [
  {
    question: "Which language is primarily used for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    answer: 1
  },
  {
    question: "What does 'HTML' stand for?",
    options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Text Markup Leveler"],
    answer: 1
  },
  {
    question: "Which of these is a Python web framework?",
    options: ["Django", "Laravel", "Spring", "Rails"],
    answer: 0
  },
  {
    question: "Which language is used for Android app development?",
    options: ["Swift", "Kotlin", "Ruby", "PHP"],
    answer: 1
  },
  {
    question: "What is the file extension for JavaScript files?",
    options: [".js", ".java", ".py", ".jsx"],
    answer: 0
  },
  {
    question: "Which of these is NOT a programming language?",
    options: ["Ruby", "HTML", "Go", "Rust"],
    answer: 1
  },
  {
    question: "Which company developed the Go programming language?",
    options: ["Microsoft", "Apple", "Google", "IBM"],
    answer: 2
  },
  {
    question: "What is the main language for iOS app development?",
    options: ["Kotlin", "Swift", "C#", "Java"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = Array(questions.length).fill(null);
let feedbackTimeout = null;
let timerInterval = null;
const TIME_PER_QUESTION = 15; // seconds
let timeLeft = TIME_PER_QUESTION;

const quizContainer = document.getElementById('quiz-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const resultDiv = document.getElementById('result');
const feedbackDiv = document.getElementById('feedback');
const timerDiv = document.getElementById('timer');
const reviewDiv = document.getElementById('review');

function showQuestion(index) {
  clearFeedback();
  resetTimer();
  const q = questions[index];
  quizContainer.innerHTML = `
    <div class="question">${q.question}</div>
    <div class="options">
      ${q.options.map((opt, i) => `
        <label class="quiz-option">
          <input type="radio" name="option" value="${i}" ${userAnswers[index] === i ? 'checked' : ''}>
          <i class="fa-solid fa-code"></i> ${opt}
        </label><br>
      `).join('')}
    </div>
  `;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === questions.length - 1 ? 'Submit' : 'Next';
  resultDiv.textContent = '';
  reviewDiv.innerHTML = '';
  startTimer();
}

quizContainer.addEventListener('change', (e) => {
  if (e.target.name === 'option') {
    userAnswers[currentQuestion] = parseInt(e.target.value);
    giveFeedback(parseInt(e.target.value) === questions[currentQuestion].answer);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion(currentQuestion);
  } else {
    // Submit
    clearInterval(timerInterval);
    score = userAnswers.reduce((acc, ans, i) => acc + (ans === questions[i].answer ? 1 : 0), 0);
    resultDiv.textContent = `You scored ${score} out of ${questions.length}!`;
    quizContainer.innerHTML = '';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    timerDiv.style.display = 'none';
    feedbackDiv.style.display = 'none';
    showReview();
  }
});

function giveFeedback(isCorrect) {
  clearTimeout(feedbackTimeout);
  feedbackDiv.style.display = 'block';
  feedbackDiv.innerHTML = `<span class="feedback ${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct!' : 'Incorrect.'}</span>`;
  feedbackTimeout = setTimeout(clearFeedback, 2000);
}

function clearFeedback() {
  feedbackDiv.innerHTML = '';
  feedbackDiv.style.display = 'none';
}

function startTimer() {
  timeLeft = TIME_PER_QUESTION;
  timerDiv.style.display = 'inline-block';
  timerDiv.textContent = `Time left: ${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDiv.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDiv.textContent = 'Time is up!';
      autoMoveNext();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerDiv.textContent = '';
}

function autoMoveNext() {
  if (userAnswers[currentQuestion] === null) {
    userAnswers[currentQuestion] = -1; // Mark as unanswered
  }
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      showQuestion(currentQuestion);
    } else {
      // Submit
      nextBtn.click();
    }
  }, 1200);
}

function showReview() {
  let html = `<h2>Review</h2><table class="review-table"><tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Explanation</th></tr>`;
  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const isCorrect = userAns === q.answer;
    html += `<tr>
      <td>${q.question}</td>
      <td class="${isCorrect ? 'correct' : 'incorrect'}">${userAns === -1 || userAns === null ? 'No answer' : q.options[userAns]}</td>
      <td>${q.options[q.answer]}</td>
      <td>${explanations[i]}</td>
    </tr>`;
  });
  html += '</table>';
  reviewDiv.innerHTML = html;
  retakeBtn.style.display = '';
}

// Initialize quiz
showQuestion(currentQuestion);

// --- API Fetch for Joke ---
const jokeDiv = document.getElementById('joke');
const newJokeBtn = document.getElementById('new-joke-btn');

function fetchJoke() {
  jokeDiv.textContent = 'Loading...';
  fetch('https://v2.jokeapi.dev/joke/Any?safe-mode')
    .then(res => res.json())
    .then(data => {
      if (data.type === 'single') {
        jokeDiv.textContent = data.joke;
      } else {
        jokeDiv.textContent = `${data.setup} ... ${data.delivery}`;
      }
    })
    .catch(() => {
      jokeDiv.textContent = 'Failed to load joke.';
    });
}

newJokeBtn.addEventListener('click', fetchJoke);
fetchJoke();

// --- Mobile Navigation ---
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', e => {
    nav.classList.remove('open');
    // Smooth scroll
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- Weather Section ---
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const geoBtn = document.getElementById('geo-btn');

const DEFAULT_CITY = 'Hyderabad';
const OPENWEATHER_API_KEY = 'abcd1234efgh5678ijkl9012mnop3456';

function displayWeather(data) {
  if (data.cod !== 200) {
    weatherResult.innerHTML = `<span style="color:#991b1b"><i class="fa-solid fa-triangle-exclamation"></i> City not found.</span>`;
    return;
  }
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherResult.innerHTML = `
    <img src="${iconUrl}" alt="Weather icon" />
    <div>
      <div><strong>${data.name}, ${data.sys.country}</strong></div>
      <div>${data.weather[0].main} (${data.weather[0].description})</div>
      <div><i class="fa-solid fa-temperature-half"></i> ${Math.round(data.main.temp)}&deg;C</div>
    </div>
  `;
}

function fetchWeather(city) {
  weatherResult.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        // If not found, try default city
        if (city !== DEFAULT_CITY) {
          fetchWeather(DEFAULT_CITY);
        } else {
          displayWeather(data);
        }
      } else {
        displayWeather(data);
      }
    })
    .catch(() => {
      weatherResult.innerHTML = `<span style="color:#991b1b"><i class="fa-solid fa-triangle-exclamation"></i> Error fetching weather.</span>`;
    });
}

weatherForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
});

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather(DEFAULT_CITY);
});

geoBtn.addEventListener('click', () => {
  weatherResult.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Getting location...';
  if (!navigator.geolocation) {
    weatherResult.innerHTML = `<span style="color:#991b1b"><i class="fa-solid fa-triangle-exclamation"></i> Geolocation not supported.</span>`;
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    weatherResult.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading weather...';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        displayWeather(data);
      })
      .catch(() => {
        weatherResult.innerHTML = `<span style="color:#991b1b"><i class="fa-solid fa-triangle-exclamation"></i> Error fetching weather.</span>`;
      });
  }, () => {
    weatherResult.innerHTML = `<span style="color:#991b1b"><i class="fa-solid fa-triangle-exclamation"></i> Location access denied.</span>`;
  });
});

// --- Dark Mode Toggle ---
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Optionally, save preference to localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});
// On load, set theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// --- Carousel Auto-Play ---
let carouselAutoPlay = setInterval(() => {
  carouselIndex = (carouselIndex + 1) % carouselImages.length;
  updateCarousel();
}, 4000);
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselAutoPlay));
carouselContainer.addEventListener('mouseleave', () => {
  carouselAutoPlay = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselImages.length;
    updateCarousel();
  }, 4000);
});

// --- Quiz Explanations & Retake ---
const explanations = [
  "JavaScript is the main language for web development.",
  "HTML stands for Hyper Text Markup Language.",
  "Django is a popular Python web framework.",
  "Kotlin is now the preferred language for Android app development.",
  "JavaScript files use the .js extension.",
  "HTML is a markup language, not a programming language.",
  "Go was developed by Google.",
  "Swift is the main language for iOS app development."
];
const retakeBtn = document.getElementById('retake-btn');
retakeBtn.addEventListener('click', () => {
  currentQuestion = 0;
  score = 0;
  userAnswers = Array(questions.length).fill(null);
  prevBtn.style.display = '';
  nextBtn.style.display = '';
  timerDiv.style.display = '';
  feedbackDiv.style.display = '';
  resultDiv.textContent = '';
  reviewDiv.innerHTML = '';
  retakeBtn.style.display = 'none';
  showQuestion(currentQuestion);
}); 