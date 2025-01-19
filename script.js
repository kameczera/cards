document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.createElement('button');
    menuButton.id = 'menu-toggle';
    menuButton.textContent = '☰';

    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.classList.add('sidebar');

    const link1 = document.createElement('a');
    link1.href = './train.html';
    link1.textContent = 'Treine os cartões';

    const link2 = document.createElement('a');
    link2.href = './index.html';
    link2.textContent = 'Crie cartas';

    const link3 = document.createElement('a');
    link3.href = '#';
    link3.textContent = 'Link 3';

    sidebar.appendChild(link1);
    sidebar.appendChild(link2);
    sidebar.appendChild(link3);

    document.body.insertBefore(menuButton, document.body.firstChild);
    document.body.insertBefore(sidebar, document.body.firstChild);

    document.getElementById('menu-toggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
        this.classList.toggle('active');
    });
});

