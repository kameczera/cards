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
        ]);

    if (error) {
        console.error('Erro ao adicionar carta:', error);
        return;
    }

    fetchData();
    document.getElementById('add-card-form').reset();
});

document.getElementById('search-card-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const searchWord = document.getElementById('search-word').value;
    fetchData(searchWord);
});

async function fetchData(searchWord = '') {
    let query = supabase.from('cards').select('*');
    if (searchWord) {
        query = query.ilike('word', `%${searchWord}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Erro ao buscar dados:', error);
        return;
    }

    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = ''; // Clear existing cards

    data.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const cardWord = document.createElement('h3');
        cardWord.textContent = card.word;
        cardContent.appendChild(cardWord);

        const cardMeaning = document.createElement('p');
        cardMeaning.textContent = card.meaning;
        cardContent.appendChild(cardMeaning);

        const cardExample = document.createElement('p');
        cardExample.textContent = card.example;
        cardContent.appendChild(cardExample);

        const cardButtons = document.createElement('div');
        cardButtons.classList.add('card-buttons');

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => enableEditMode(cardContainer, card));
        cardButtons.appendChild(editButton);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteCard(card.id));
        cardButtons.appendChild(deleteButton);

        cardContainer.appendChild(cardContent);
        cardContainer.appendChild(cardButtons);

        cardsContainer.appendChild(cardContainer);
    });
}

function enableEditMode(cardContainer, card) {
    const cardContent = cardContainer.querySelector('.card-content');
    cardContent.innerHTML = '';

    const wordInput = document.createElement('input');
    wordInput.type = 'text';
    wordInput.value = card.word;
    cardContent.appendChild(wordInput);

    const meaningInput = document.createElement('input');
    meaningInput.type = 'text';
    meaningInput.value = card.meaning;
    cardContent.appendChild(meaningInput);

    const exampleInput = document.createElement('input');
    exampleInput.type = 'text';
    exampleInput.value = card.example;
    cardContent.appendChild(exampleInput);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.addEventListener('click', () => saveCard(card.id, wordInput.value, meaningInput.value, exampleInput.value));
    cardContent.appendChild(saveButton);
}

async function saveCard(id, newWord, newMeaning, newExample) {
    const { data, error } = await supabase
        .from('cards')
        .update({ word: newWord, meaning: newMeaning, example: newExample })
        .eq('id', id);

    if (error) {
        console.error('Erro ao editar carta:', error);
        return;
    }

    fetchData();
}

async function deleteCard(id) {
    const { data, error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir carta:', error);
        return;
    }

    fetchData();
}

// Initial fetch to populate the cards on page load
fetchData();