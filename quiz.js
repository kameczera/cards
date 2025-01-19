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

    const shuffledCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5); // Obtem 5 cartas aleatórias
    let currentQuestionIndex = 0;
    let score = 0;

    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Próxima';
    nextButton.style.display = 'none';
    nextButton.addEventListener('click', showNextQuestion);

    document.body.appendChild(nextButton); // Garante que o botão é sempre anexado ao DOM

    function showQuestion(index) {
        quizForm.innerHTML = ''; // Limpa a pergunta anterior
        nextButton.style.display = 'none'; // Oculta o botão Próxima
        resultDiv.textContent = ''; // Limpa resultados anteriores

        if (index >= shuffledCards.length) {
            resultDiv.textContent = `Você acertou ${score} de ${shuffledCards.length} perguntas.`;
            nextButton.style.display = 'none'; // Oculta o botão após o fim do quiz
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
                handleAnswerClick(answer, correctAnswer);
            });

            questionDiv.appendChild(answerButton);
        });

        quizForm.appendChild(questionDiv);
    }

    function handleAnswerClick(selectedAnswer, correctAnswer) {
        quizForm.innerHTML = ''; // Remove os botões de resposta

        // Exibe o feedback da resposta
        const feedbackDiv = document.createElement('div');
        feedbackDiv.innerHTML = `
            <p>Você escolheu: <strong>${selectedAnswer}</strong></p>
            <p>Resposta correta: <strong>${correctAnswer}</strong></p>
        `;
        quizForm.appendChild(feedbackDiv);

        // Atualiza a pontuação se a resposta estiver correta
        if (selectedAnswer === correctAnswer) {
            score++;
        }

        // Exibe o botão "Próxima"
        nextButton.style.display = 'block';
    }

    function showNextQuestion() {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }

    showQuestion(currentQuestionIndex); // Exibe a primeira pergunta
});
