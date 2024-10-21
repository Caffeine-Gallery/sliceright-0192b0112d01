import { backend } from 'declarations/backend';

let fraction = { numerator: 1, denominator: 4 };
let userGuess = 0.5;
let score = null;
let animationStep = 0;
let animationInterval;

const guessSlider = document.getElementById('guess-slider');
const fractionDisplay = document.getElementById('fraction-display');
const resultDiv = document.getElementById('result');
const userGuessElement = document.getElementById('user-guess');
const correctAnswerElement = document.getElementById('correct-answer');
const scoreElement = document.getElementById('score');
const checkGuessButton = document.getElementById('check-guess');
const newFractionButton = document.getElementById('new-fraction');
const highScoresList = document.getElementById('high-scores-list');

async function generateFraction() {
    fraction = await backend.generateFraction();
    fractionDisplay.textContent = `Where does ${fraction.numerator}/${fraction.denominator} go on the line?`;
}

async function startNewRound() {
    await generateFraction();
    userGuess = 0.5;
    score = null;
    animationStep = 0;
    guessSlider.value = 0.5;
    resultDiv.style.display = 'none';
    clearInterval(animationInterval);
    renderFractionVisual();
}

async function checkGuess() {
    const actualValue = fraction.numerator / fraction.denominator;
    score = await backend.calculateScore(fraction, userGuess);
    
    userGuessElement.textContent = `Your guess: ${userGuess.toFixed(2)}`;
    correctAnswerElement.textContent = `Correct answer: ${actualValue.toFixed(2)}`;
    scoreElement.textContent = `Score: ${score}`;
    resultDiv.style.display = 'block';
    
    await backend.addScore(score, fraction, userGuess);
    updateHighScores();
    animateFractionVisualization();
}

function animateFractionVisualization() {
    clearInterval(animationInterval);
    animationStep = 0;
    animationInterval = setInterval(() => {
        animationStep++;
        renderFractionVisual();
        if (animationStep >= fraction.denominator + fraction.numerator) {
            clearInterval(animationInterval);
        }
    }, 333);
}

function renderFractionVisual() {
    const ticksContainer = document.getElementById('fraction-ticks');
    const fillsContainer = document.getElementById('fraction-fills');
    ticksContainer.innerHTML = '';
    fillsContainer.innerHTML = '';

    for (let i = 0; i <= fraction.denominator; i++) {
        if (i <= animationStep) {
            const tick = document.createElement('div');
            tick.className = 'fraction-tick';
            tick.style.left = `${(i / fraction.denominator) * 100}%`;
            ticksContainer.appendChild(tick);
        }
    }

    for (let i = 0; i < fraction.numerator; i++) {
        if (i + fraction.denominator < animationStep) {
            const fill = document.createElement('div');
            fill.className = 'fraction-fill';
            fill.style.left = `${(i / fraction.denominator) * 100}%`;
            fill.style.width = `${(1 / fraction.denominator) * 100}%`;
            fillsContainer.appendChild(fill);
        }
    }

    document.getElementById('user-guess-line').style.left = `${userGuess * 100}%`;
}

async function updateHighScores() {
    const highScores = await backend.getHighScores();
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. Score: ${score.value}, Fraction: ${score.fraction.numerator}/${score.fraction.denominator}, Guess: ${score.guess.toFixed(2)}`;
        highScoresList.appendChild(li);
    });
}

guessSlider.addEventListener('input', function(event) {
    userGuess = parseFloat(event.target.value);
});

checkGuessButton.addEventListener('click', checkGuess);
newFractionButton.addEventListener('click', startNewRound);

startNewRound();
updateHighScores();
