// Pega os elementos do HTML
const form = document.querySelector('#form-disciplina');
const listaContainer = document.querySelector('#lista-disciplinas');
const resumoContainer = document.querySelector('#resumo-estudos');
const buscaInput = document.querySelector('#busca-nome');

// Recupera os dados salvos no navegador
let disciplinas = JSON.parse(localStorage.getItem('minhasDisciplinas')) || [];

function atualizarSistema() {
    // Atualiza o storage e limpa a lista antes de redesenhar
    localStorage.setItem('minhasDisciplinas', JSON.stringify(disciplinas));
    listaContainer.innerHTML = '';

    const textoBusca = buscaInput.value.toLowerCase();
    const filtradas = disciplinas.filter(d => d.nome.toLowerCase().includes(textoBusca));

    if (filtradas.length === 0) {
        listaContainer.innerHTML = '<p id="mensagem-vazia">Nenhum registro encontrado.</p>';
        resumoContainer.innerHTML = 'Você ainda não possui horas registradas.';
        return;
    }

    // Variáveis para somar os totais
    let somaConcluidas = 0;
    let somaTotais = 0;
    
    // Cria os cards dinamicamente
    filtradas.forEach((disc, index) => {
        const total = parseInt(disc.cargaTotal) || 0;
        const concluido = parseInt(disc.cargaConcluida) || 0;
        const porcentagem = total > 0 ? Math.round((concluido / total) * 100) : 0;

        const div = document.createElement('div');
        div.className = 'item-disciplina';
        div.innerHTML = `
            <div style="flex: 1;">
                <strong style="font-size: 1.1rem; color: #003366;">${disc.nome}</strong> - ${disc.area}
                <br><small>Prof: ${disc.professor} | ${concluido}h de ${total}h concluídas</small>
                <div class="barra-progresso-bg">
                    <div class="barra-progresso-fill" style="width: ${porcentagem}%"></div>
                </div>
                <small>Progresso: ${porcentagem}%</small>
            </div>
            <div class="acoes" style="margin-left: 15px;">
                <button onclick="editarDisciplina(${index})" class="btn-editar">Editar</button>
                <button onclick="excluirDisciplina(${index})" class="btn-excluir">Excluir</button>
            </div>
        `;
        listaContainer.appendChild(div);

        // Acumula os valores para o cálculo final
        somaTotais += total; 
        somaConcluidas += concluido;
    });

    // ATUALIZAÇÃO: Frase com os números usando a classe de cor branca
    resumoContainer.innerHTML = `Você concluiu <span class="numero-branco">${somaConcluidas} horas</span> do total de <span class="numero-branco">${somaTotais} horas</span> dos cursos registrados.`;
}

// Salva o cadastro no formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const novaDisciplina = {
        nome: document.querySelector('#nome').value,
        professor: document.querySelector('#professor').value,
        cargaTotal: document.querySelector('#carga-horaria').value,
        cargaConcluida: document.querySelector('#horas-concluidas').value,
        area: document.querySelector('#area').value
    };

    disciplinas.push(novaDisciplina);
    form.reset();
    atualizarSistema();
});

// Função para editar matéria existente
function editarDisciplina(index) {
    const disc = disciplinas[index];
    document.querySelector('#nome').value = disc.nome;
    document.querySelector('#professor').value = disc.professor;
    document.querySelector('#carga-horaria').value = disc.cargaTotal;
    document.querySelector('#horas-concluidas').value = disc.cargaConcluida;
    document.querySelector('#area').value = disc.area;

    disciplinas.splice(index, 1);
    atualizarSistema();
    window.location.href = '#secao-cadastro';
}

// Função para apagar matéria
function excluirDisciplina(index) {
    if(confirm("Tem certeza que deseja excluir esta disciplina?")) {
        disciplinas.splice(index, 1);
        atualizarSistema();
    }
}

// Roda o sistema ao carregar a página
atualizarSistema();