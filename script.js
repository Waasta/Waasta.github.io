document.addEventListener("DOMContentLoaded", function() {
    const questionsContainer = document.getElementById("questions-container");
    const paginationContainer = document.getElementById("pagination");
    const submitButton = document.getElementById("submit-button");
    const resultElement = document.getElementById("result");

    const questionsPerPage = 10;
    let currentPage = 1;
    let quizData = [];
    let userAnswers = new Array(30).fill(null);

    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            quizData = data;
            renderQuestions(currentPage);
            renderPagination();
        })
        .catch(error => console.error("Error fetching JSON data:", error));

    function renderQuestions(page) {
        questionsContainer.innerHTML = "";

        const startIndex = (page - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;

        for (let i = startIndex; i < endIndex && i < quizData.length; i++) {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            const questionText = document.createElement("p");
            questionText.textContent = `Question ${i + 1}: ${quizData[i].question}`;
            questionDiv.appendChild(questionText);

            const labelYes = document.createElement("label");
            labelYes.innerHTML = `<input type="radio" name="q${i}" value="yes"> Yes`;
            questionDiv.appendChild(labelYes);

            const labelNo = document.createElement("label");
            labelNo.innerHTML = `<input type="radio" name="q${i}" value="no"> No`;
            questionDiv.appendChild(labelNo);

            questionsContainer.appendChild(questionDiv);

            // Set user's answer for the current question if available
            const userAnswer = userAnswers[i];
            const radioButtonYes = questionDiv.querySelector(`input[value="yes"]`);
            const radioButtonNo = questionDiv.querySelector(`input[value="no"]`);
            if (userAnswer === "yes") {
                radioButtonYes.checked = true;
            } else if (userAnswer === "no") {
                radioButtonNo.checked = true;
            }

            // Attach event listener to store user's answers
            radioButtonYes.addEventListener("change", () => {
                userAnswers[i] = "yes";
            });
            radioButtonNo.addEventListener("change", () => {
                userAnswers[i] = "no";
            });
        }
    }

    function renderPagination() {
        const totalPages = Math.ceil(quizData.length / questionsPerPage);
        paginationContainer.innerHTML = "";

        for (let page = 1; page <= totalPages; page++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = page;
            pageButton.addEventListener("click", () => {
                currentPage = page;
                renderQuestions(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    submitButton.addEventListener("click", function() {
        let correctAnswers = 0;
        for (let i = 0; i < quizData.length; i++) {
            if (userAnswers[i] === quizData[i].correctAnswer) {
                correctAnswers++;
            }
        }

        resultElement.textContent = `You answered ${correctAnswers} questions correctly out of ${quizData.length}.`;
    });
});
