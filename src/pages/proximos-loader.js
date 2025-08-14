document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('proximos-eventos-grid'); // Dê um ID para o grid nesta página

    fetch('/data/eventos.json')
        .then(response => response.json())
        .then(eventos => {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas o dia

            // 1. Filtra para pegar apenas eventos futuros
            const eventosFuturos = eventos.filter(evento => new Date(evento.date) >= hoje);

            // 2. Ordena os eventos futuros do mais próximo para o mais distante
            eventosFuturos.sort((a, b) => new Date(a.date) - new Date(b.date));

            // 3. Renderiza os cards
            let cardsHTML = '';
            if (eventosFuturos.length > 0) {
                eventosFuturos.forEach(evento => {
                    // Seu código para criar o card HTML vai aqui
                    cardsHTML += `
                        <div class="news-card"> 
                            <img src="${evento.image}" alt="${evento.title}">
                            <div class="card-content">
                                <h3>${evento.title}</h3>
                                <p>${evento.summary}</p>
                                <span class="event-date">Data: ${new Date(evento.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</span>
                            </div>
                        </div>
                    `;
                });
            } else {
                cardsHTML = '<p>Nenhum evento programado no momento. Volte em breve!</p>';
            }

            gridContainer.innerHTML = cardsHTML;
        });
});