// Game Variables
let username = '';
const creatures = [
    { name: 'Creature 1', greeting: 'Welcome!', question: 'What is 2 + 2?', answer: '4' },
    { name: 'Creature 2', greeting: 'Hello!', question: 'What color is the sky?', answer: 'blue' },
    { name: 'Creature 3', greeting: 'Hi there!', question: 'What is the capital of France?', answer: 'paris' },
    // Add more creatures as needed
];

let collectedCreatures = 0;
let score = 0;

// HTML Elements
const registrationContainer = document.getElementById('registration');
const usernameInput = document.getElementById('username');
const registerButton = document.getElementById('register');
const gameContainer = document.getElementById('game');
const scanButton = document.getElementById('scanQR');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const dialogueContainer = document.getElementById('dialogueContainer');
const creatureGreetingText = document.getElementById('creatureGreeting');
const questionText = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submitAnswer');
const resultContainer = document.getElementById('result');
const creatureCountText = document.getElementById('creatureCount');
const scoreText = document.getElementById('score');
const restartButton = document.getElementById('restart');

// Event Listeners
registerButton.addEventListener('click', registerUser);
scanButton.addEventListener('click', startCamera);
submitButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', restartGame);

// Function to Register the User
function registerUser() {
    username = usernameInput.value.trim();
    if (username) {
        registrationContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        alert(`Welcome, ${username}! Let’s start collecting creatures.`);
    } else {
        alert('Please enter a valid username.');
    }
}

// Function to Start the Camera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(scanQRCode);
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
        });
}

// Function to Scan QR Code
function scanQRCode() {
    const context = canvas.getContext('2d');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        handleQRCodeData(code.data);
    } else {
        requestAnimationFrame(scanQRCode);
    }
}

// Function to Handle QR Code Data
function handleQRCodeData(data) {
    const randomCreature = creatures[Math.floor(Math.random() * creatures.length)];
    creatureGreetingText.innerText = `${randomCreature.greeting} ${username}! You scanned: ${randomCreature.name}`;
    questionText.innerText = randomCreature.question;
    dialogueContainer.classList.remove('hidden');
    scanButton.classList.add('hidden');
}

// Function to Check the Answer
function checkAnswer() {
    const currentCreature = creatures.find(creature => creature.question === questionText.innerText);
    
    if (answerInput.value.trim().toLowerCase() === currentCreature.answer.toLowerCase()) {
        collectedCreatures++;
        score += 10; // Increment score for correct answer
        alert(`Correct! You collected ${currentCreature.name}`);
    } else {
        alert('Incorrect answer. Try again!');
    }

    // Reset input and hide question
    answerInput.value = '';
    dialogueContainer.classList.add('hidden');
    scanButton.classList.remove('hidden');

    // Check if all creatures have been collected
    if (collectedCreatures >= creatures.length) {
        endGame();
    }
}

// Function to End the Game and Show Results
function endGame() {
    scanButton.classList.add('hidden');
    dialogueContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    creatureCountText.innerText = `Creatures Collected: ${collectedCreatures}`;
    scoreText.innerText = `Score: ${score}`;
}

// Function to Restart the Game
function restartGame() {
    collectedCreatures = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    registrationContainer.classList.remove('hidden');
    usernameInput.value = '';
    gameContainer.classList.add('hidden');
}
