import { backend } from 'declarations/backend';

let fraction = { numerator: 1n, denominator: 4n };
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
const sliderMarkers = document.getElementById('slider-markers');

function createSliderMarkers() {
    for (let i = 0; i <= 4; i++) {
        const marker = document.createElement('div');
        marker.className = 'slider-marker';
        marker.style.left = `${i * 25}%`;
        marker.textContent = (i * 0.25).toFixed(2);
        sliderMarkers.appendChild(marker);
    }
}

async function generateFraction() {
    try {
        const rawFraction = await backend.generateFraction();
        fraction = {
            numerator: BigInt(rawFraction.numerator),
            denominator: BigInt(rawFraction.denominator)
        };
        fractionDisplay.textContent = `Where does ${fraction.numerator}/${fraction.denominator} go on the line?`;
    } catch (error) {
        console.error("Error generating fraction:", error);
        fractionDisplay.textContent = "Error generating fraction. Please try again.";
    }
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
    try {
        const actualValue = Number(fraction.numerator) / Number(fraction.denominator);
        const scoreResult = await backend.calculateScore(fraction, parseFloat(userGuess));
        score = typeof scoreResult === 'bigint' ? Number(scoreResult) : scoreResult;
        
        userGuessElement.textContent = `Your guess: ${userGuess.toFixed(2)}`;
        correctAnswerElement.textContent = `Correct answer: ${actualValue.toFixed(2)}`;
        scoreElement.textContent = `Score: ${score}`;
        resultDiv.style.display = 'block';
        
        await backend.addScore(BigInt(score), fraction, parseFloat(userGuess));
        updateHighScores();
        animateFractionVisualization();
    } catch (error) {
        console.error("Error checking guess:", error);
        scoreElement.textContent = "Error calculating score. Please try again.";
    }
}

function animateFractionVisualization() {
    clearInterval(animationInterval);
    animationStep = 0;
    animationInterval = setInterval(() => {
        animationStep++;
        renderFractionVisual();
        if (animationStep >= Number(fraction.denominator) + Number(fraction.numerator)) {
            clearInterval(animationInterval);
        }
    }, 333);
}

function renderFractionVisual() {
    const ticksContainer = document.getElementById('fraction-ticks');
    const fillsContainer = document.getElementById('fraction-fills');
    ticksContainer.innerHTML = '';
    fillsContainer.innerHTML = '';

    const denominatorNumber = Number(fraction.denominator);
    const numeratorNumber = Number(fraction.numerator);

    for (let i = 0; i <= denominatorNumber; i++) {
        if (i <= animationStep) {
            const tick = document.createElement('div');
            tick.className = 'fraction-tick';
            tick.style.left = `${(i / denominatorNumber) * 100}%`;
            ticksContainer.appendChild(tick);
        }
    }

    for (let i = 0; i < numeratorNumber; i++) {
        if (i + denominatorNumber < animationStep) {
            const fill = document.createElement('div');
            fill.className = 'fraction-fill';
            fill.style.left = `${(i / denominatorNumber) * 100}%`;
            fill.style.width = `${(1 / denominatorNumber) * 100}%`;
            fillsContainer.appendChild(fill);
        }
    }

    document.getElementById('user-guess-line').style.left = `${userGuess * 100}%`;
}

async function updateHighScores() {
    try {
        const highScores = await backend.getHighScores();
        highScoresList.innerHTML = '';
        highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. Score: ${Number(score.value)}, Fraction: ${Number(score.fraction.numerator)}/${Number(score.fraction.denominator)}, Guess: ${Number(score.guess).toFixed(2)}`;
            highScoresList.appendChild(li);
        });
    } catch (error) {
        console.error("Error updating high scores:", error);
        highScoresList.innerHTML = '<li>Error fetching high scores</li>';
    }
}

guessSlider.addEventListener('input', function(event) {
    userGuess = parseFloat(event.target.value);
    document.getElementById('user-guess-line').style.left = `${userGuess * 100}%`;
});

checkGuessButton.addEventListener('click', checkGuess);
newFractionButton.addEventListener('click', startNewRound);

createSliderMarkers();
startNewRound();
updateHighScores();
