document.addEventListener("DOMContentLoaded", function() {
    const questionsContainer = document.getElementById("questions-container");
    const paginationContainer = document.getElementById("pagination");
    const submitButton = document.getElementById("submit-button");
    const resultElement = document.getElementById("result");

    const questionsPerPage = 10; // Now displaying 10 questions per page
    let currentPage = 1;
    let quizData = [];

    // Fetch JSON data
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
        const answers = document.querySelectorAll("input:checked");
        let correctAnswers = 0;

        // Check each selected answer
        answers.forEach((answer, index) => {
            if (answer.value === quizData[(currentPage - 1) * questionsPerPage + index].correctAnswer) {
                correctAnswers++;
            }
        });

        resultElement.textContent = `You answered ${correctAnswers} questions correctly out of ${questionsPerPage}.`;
    });
});
