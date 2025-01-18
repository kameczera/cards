import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://kemkswfsmnhkdlmzzxfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbWtzd2ZzbW5oa2RsbXp6eGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMDM2MzAsImV4cCI6MjA1Mjc3OTYzMH0.iAsGp_wPABOg16xp-PaZpPhNcgKs112rzoOECCH3Yb8';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const { data: cards, error } = await supabase.from('cards').select('*');

    if (error) {
        console.error('Erro ao buscar cartas:', error);
        return;
    }

    const shuffledCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5); // Get 5 random cards
    let currentQuestionIndex = 0;
    let score = 0;

    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');
    const submitButton = document.getElementById('submit-quiz');

    function showQuestion(index) {
        quizForm.innerHTML = ''; // Clear existing question

        if (index >= shuffledCards.length) {
            resultDiv.textContent = `Você acertou ${score} de ${shuffledCards.length} perguntas.`;
            submitButton.style.display = 'none';
            return;
        }

        const card = shuffledCards[index];
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const isWordQuestion = Math.random() > 0.5;

        let questionText;
        let correctAnswer;
        let wrongAnswers;

        if (isWordQuestion) {
            questionText = `Qual é a definição de "${card.word}"?`;
            correctAnswer = card.meaning;
            wrongAnswers = cards
                .filter(c => c.id !== card.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map(c => c.meaning);
        } else {
            const exampleText = card.example.replace(/\*(.*?)\*/, '_____');
            questionText = `Qual palavra corresponde a este exemplo: "${exampleText}"?`;
            correctAnswer = card.word;
            wrongAnswers = cards
                .filter(c => c.id !== card.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map(c => c.word);
        }

        const answers = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

        const questionTextElement = document.createElement('p');
        questionTextElement.textContent = questionText;
        questionDiv.appendChild(questionTextElement);

        answers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.classList.add('answer-button');
            answerButton.textContent = answer;
            answerButton.addEventListener('click', () => {
                if (answer === correctAnswer) {
                    score++;
                }
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            });

            questionDiv.appendChild(answerButton);
        });

        quizForm.appendChild(questionDiv);
    }

    submitButton.addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    });

    showQuestion(currentQuestionIndex); // Show the first question
});