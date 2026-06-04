const API_URL = "http://localhost:3000";

const graficoCategorias = document.getElementById("graficoCategorias");
const graficoAutores = document.getElementById("graficoAutores");
const resumoDashboard = document.getElementById("resumo-dashboard");

async function fetchLivros() {
  try {
    const resposta = await fetch(`${API_URL}/livros`);
    const livros = await resposta.json();
    return livros;
  } catch (erro) {
    console.log("Erro ao buscar livros:", erro);
    return [];
  }
}

async function fetchAutores() {
  try {
    const resposta = await fetch(`${API_URL}/autores`);
    const autores = await resposta.json();
    return autores;
  } catch (erro) {
    console.log("Erro ao buscar autores:", erro);
    return [];
  }
}

function contarPorCategoria(livros) {
  const categorias = {};

  livros.forEach((livro) => {
    if (categorias[livro.categoria]) {
      categorias[livro.categoria]++;
    } else {
      categorias[livro.categoria] = 1;
    }
  });

  return categorias;
}

function contarPorAutor(livros) {
  const autores = {};

  livros.forEach((livro) => {
    if (autores[livro.autor]) {
      autores[livro.autor]++;
    } else {
      autores[livro.autor] = 1;
    }
  });

  return autores;
}

function criarGraficoCategorias(dadosCategorias) {
  const nomesCategorias = Object.keys(dadosCategorias);
  const quantidades = Object.values(dadosCategorias);

  new Chart(graficoCategorias, {
    type: "pie",
    data: {
      labels: nomesCategorias,
      datasets: [
        {
          label: "Quantidade de livros",
          data: quantidades,
          backgroundColor: [
            "#111111",
            "#555555",
            "#8B0000",
            "#B8860B",
            "#2F4F4F"
          ],
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        },
        title: {
          display: true,
          text: "Distribuição de livros por categoria"
        }
      }
    }
  });
}

function criarGraficoAutores(dadosAutores) {
  const nomesAutores = Object.keys(dadosAutores);
  const quantidades = Object.values(dadosAutores);

  new Chart(graficoAutores, {
    type: "bar",
    data: {
      labels: nomesAutores,
      datasets: [
        {
          label: "Quantidade de livros",
          data: quantidades,
          backgroundColor: "#8B0000",
          borderColor: "#111111",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: "Quantidade de livros por autor"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function renderResumo(livros, autores) {
  const categoriasUnicas = [];

  livros.forEach((livro) => {
    if (!categoriasUnicas.includes(livro.categoria)) {
      categoriasUnicas.push(livro.categoria);
    }
  });

  const livrosDestaque = livros.filter((livro) => livro.destaque === true);

  resumoDashboard.innerHTML = `
    <div class="col-12 col-md-3 mb-3">
      <div class="dashboard-info bg-dark text-white rounded p-3 h-100">
        <h4>${livros.length}</h4>
        <p>Total de Livros</p>
      </div>
    </div>

    <div class="col-12 col-md-3 mb-3">
      <div class="dashboard-info bg-dark text-white rounded p-3 h-100">
        <h4>${autores.length}</h4>
        <p>Total de Autores</p>
      </div>
    </div>

    <div class="col-12 col-md-3 mb-3">
      <div class="dashboard-info bg-dark text-white rounded p-3 h-100">
        <h4>${categoriasUnicas.length}</h4>
        <p>Categorias</p>
      </div>
    </div>

    <div class="col-12 col-md-3 mb-3">
      <div class="dashboard-info bg-dark text-white rounded p-3 h-100">
        <h4>${livrosDestaque.length}</h4>
        <p>Livros em Destaque</p>
      </div>
    </div>
  `;
}

async function initDashboard() {
  const livros = await fetchLivros();
  const autores = await fetchAutores();

  const dadosCategorias = contarPorCategoria(livros);
  const dadosAutores = contarPorAutor(livros);

  criarGraficoCategorias(dadosCategorias);
  criarGraficoAutores(dadosAutores);
  renderResumo(livros, autores);
}

initDashboard();