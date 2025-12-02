const choices = document.querySelectorAll('.choice-grid div');
const resultBox = document.querySelector('#result');
const resultTitle = document.querySelector('#result-title');
const resultText = document.querySelector('#result-text');
const restartBtn = document.querySelector('#restart');

let answers = {
    one: null,
    two: null,
    three: null
};

// ADD CLICK EVENTS
choices.forEach(choice => {
    choice.addEventListener('click', selectChoice);
});

function selectChoice(event) {
    const box = event.currentTarget;

    // Get attributes
    const qid = box.dataset.questionId;
    const cid = box.dataset.choiceId;

    // Update answer
    answers[qid] = cid;

    // Reset all choices of THIS question
    resetChoices(qid);

    // Apply selected style
    box.classList.add('selected');
    box.querySelector('.checkbox').src = "images/checked.png";

    // Dim other choices of same question
    dimOthers(qid, cid);

    // Check if quiz is complete
    checkCompletion();
}

// RESET CHECKBOXES IN SAME QUESTION
function resetChoices(questionId) {
    choices.forEach(ch => {
        if (ch.dataset.questionId === questionId) {
            ch.classList.remove('selected');
            ch.classList.remove('not-selected');
            ch.querySelector('.checkbox').src = "images/unchecked.png";
        }
    });
}

// DIM NON-SELECTED OPTIONS
function dimOthers(qid, correctCid) {
    choices.forEach(ch => {
        if (ch.dataset.questionId === qid && ch.dataset.choiceId !== correctCid) {
            ch.classList.add('not-selected');
        }
    });
}

// CHECK IF ALL 3 QUESTIONS ANSWERED
function checkCompletion() {
    if (answers.one && answers.two && answers.three) {
        showResult();
        lockQuiz();
    }
}

// SHOW RESULT USING constants.js LOGIC
function showResult() {
    let finalChoice = answers.one;

    if (answers.two === answers.three) {
        finalChoice = answers.two;
    }

    const result = RESULTS_MAP[finalChoice];

    resultTitle.textContent = result.title;
    resultText.textContent = result.contents;

    resultBox.classList.remove('hidden');
}

// DISABLE INTERACTION
function lockQuiz() {
    choices.forEach(ch => {
        ch.removeEventListener('click', selectChoice);
    });
}

// RESTART BUTTON
restartBtn.addEventListener('click', restartQuiz);

function restartQuiz() {
    // Reset answers
    answers = { one: null, two: null, three: null };

    // Hide result
    resultBox.classList.add('hidden');

    // Reset all choice visuals
    choices.forEach(ch => {
        ch.classList.remove('selected');
        ch.classList.remove('not-selected');
        ch.querySelector('.checkbox').src = "images/unchecked.png";
        ch.addEventListener('click', selectChoice);
    });
}