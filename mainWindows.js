import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://kemkswfsmnhkdlmzzxfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlbWtzd2ZzbW5oa2RsbXp6eGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMDM2MzAsImV4cCI6MjA1Mjc3OTYzMH0.iAsGp_wPABOg16xp-PaZpPhNcgKs112rzoOECCH3Yb8';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('add-card-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const word = document.getElementById('word').value;
    const meaning = document.getElementById('meaning').value;
    const example = document.getElementById('example').value;


    const { data, error } = await supabase
        .from('cards')
        .insert([
            { word: word, meaning: meaning, example: example },
        ])
        .select()

    if (error) {
        console.error('Erro ao adicionar carta:', error);
        return;
    }

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card');

    const cardWord = document.createElement('h3');
    cardWord.textContent = word;
    cardContainer.appendChild(cardWord);

    const cardMeaning = document.createElement('p');
    cardMeaning.textContent = meaning;
    cardContainer.appendChild(cardMeaning);

    const cardExample = document.createElement('p');
    cardExample.textContent = example;
    cardContainer.appendChild(cardExample);

    document.querySelector('.content').appendChild(cardContainer);

    document.getElementById('add-card-form').reset();
    fetchData();
});

async function fetchData() {
    const { data, error } = await supabase
        .from('cards')
        .select('*');

    if (error) {
        console.error('Erro ao buscar dados:', error);
        return;
    }

    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = ''; // Clear existing cards

    data.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');

        const cardWord = document.createElement('h3');
        cardWord.textContent = card.word;
        cardContainer.appendChild(cardWord);

        const cardMeaning = document.createElement('p');
        cardMeaning.textContent = card.meaning;
        cardContainer.appendChild(cardMeaning);

        const cardExample = document.createElement('p');
        cardExample.textContent = card.example;
        cardContainer.appendChild(cardExample);

        cardsContainer.appendChild(cardContainer);
    });
}