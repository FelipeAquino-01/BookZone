const API_URL = "http://localhost:3000";

const containerDestaques = document.getElementById("lista-destaques");
const containerLivros = document.getElementById("lista-livros");
const containerAutores = document.getElementById("lista-autores");

const campoPesquisa = document.getElementById("campo-pesquisa");
const filtroOrdenacao = document.getElementById("filtro-ordenacao");

let listaLivros = [];

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

function renderDestaques(livros) {
  containerDestaques.innerHTML = "";

  const livrosDestaque = livros.filter((livro) => livro.destaque === true);

  if (livrosDestaque.length === 0) {
    containerDestaques.innerHTML = `
      <div class="carousel-item active">
        <div class="bg-white shadow rounded p-5 text-center">
          <h3>Nenhum livro em destaque encontrado.</h3>
        </div>
      </div>
    `;
    return;
  }

  livrosDestaque.forEach((livro, index) => {
    const item = document.createElement("div");

    if (index === 0) {
      item.classList.add("carousel-item", "active");
    } else {
      item.classList.add("carousel-item");
    }

    item.innerHTML = `
      <div class="row align-items-center bg-white shadow rounded p-4">
        <div class="col-12 col-md-5 text-center mb-4 mb-md-0">
          <img 
            src="${livro.imagem}" 
            class="img-fluid destaque-img" 
            alt="${livro.titulo}"
          >
        </div>

        <div class="col-12 col-md-7">
          <span class="badge bg-dark mb-2">${livro.categoria}</span>

          <h3 class="fw-bold">${livro.titulo}</h3>

          <p>${livro.descricaoCurta}</p>

          <p><strong>Autor:</strong> ${livro.autor}</p>

          <p><strong>Valor estimado:</strong> ${livro.valor}</p>

          <a href="detalhes.html?id=${livro.id}" class="btn btn-dark">
            Ver detalhes
          </a>
        </div>
      </div>
    `;

    containerDestaques.appendChild(item);
  });
}

function createCardLivro(livro) {
  const coluna = document.createElement("div");
  coluna.classList.add("col-12", "col-md-6", "col-lg-4");

  coluna.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img 
        src="${livro.imagem}" 
        class="card-img-top" 
        alt="${livro.titulo}"
      >

      <div class="card-body text-center d-flex flex-column">
        <span class="badge bg-dark mb-2 align-self-center">
          ${livro.categoria}
        </span>

        <h5 class="card-title">${livro.titulo}</h5>

        <p class="card-text">${livro.descricaoCurta}</p>

        <p class="fw-bold">Valor estimado: ${livro.valor}</p>

        <a href="detalhes.html?id=${livro.id}" class="btn btn-dark mt-auto">
          Ver detalhes
        </a>
      </div>
    </div>
  `;

  return coluna;
}

function renderCards(livros) {
  containerLivros.innerHTML = "";

  if (livros.length === 0) {
    containerLivros.innerHTML = `
      <div class="col-12">
        <p class="text-center">Nenhum livro encontrado.</p>
      </div>
    `;
    return;
  }

  livros.forEach((livro) => {
    const card = createCardLivro(livro);
    containerLivros.appendChild(card);
  });
}

function createCardAutor(autor) {
  const coluna = document.createElement("div");
  coluna.classList.add("col-12", "col-md-6", "col-lg-4");

  coluna.innerHTML = `
    <div class="card author-card text-center h-100 shadow-sm">
      <div class="card-body d-flex flex-column">

        <img 
          src="${autor.imagem}" 
          class="rounded-circle mx-auto mb-3 shadow autor-img"
          alt="${autor.nome}"
        >

        <h4 class="card-title">${autor.nome}</h4>

        <p class="card-text text-muted">${autor.descricao}</p>

        <p>
          <strong>Nacionalidade:</strong> ${autor.nacionalidade}
        </p>

        <a href="detalhes-autor.html?id=${autor.id}" class="btn btn-dark mt-auto">
          Ver detalhes
        </a>

      </div>
    </div>
  `;

  return coluna;
}

function renderAutores(autores) {
  containerAutores.innerHTML = "";

  if (autores.length === 0) {
    containerAutores.innerHTML = `
      <div class="col-12">
        <p class="text-center">Nenhum autor encontrado.</p>
      </div>
    `;
    return;
  }

  autores.forEach((autor) => {
    const card = createCardAutor(autor);
    containerAutores.appendChild(card);
  });
}

function aplicarPesquisaEFiltro() {
  let livrosFiltrados = [...listaLivros];

  const textoPesquisa = campoPesquisa.value.toLowerCase();
  const tipoOrdenacao = filtroOrdenacao.value;

  if (textoPesquisa !== "") {
    livrosFiltrados = livrosFiltrados.filter((livro) => {
      return (
        livro.titulo.toLowerCase().includes(textoPesquisa) ||
        livro.autor.toLowerCase().includes(textoPesquisa) ||
        livro.categoria.toLowerCase().includes(textoPesquisa)
      );
    });
  }

  if (tipoOrdenacao === "titulo") {
    livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
    document.getElementById("livros").scrollIntoView({ behavior: "smooth" });
  }

  if (tipoOrdenacao === "autor") {
    livrosFiltrados.sort((a, b) => a.autor.localeCompare(b.autor));
    document.getElementById("autores").scrollIntoView({ behavior: "smooth" });
  }

  if (tipoOrdenacao === "categoria") {
    livrosFiltrados.sort((a, b) => a.categoria.localeCompare(b.categoria));
    document.getElementById("livros").scrollIntoView({ behavior: "smooth" });
  }

  renderCards(livrosFiltrados);
}

async function init() {
  listaLivros = await fetchLivros();

  renderDestaques(listaLivros);
  renderCards(listaLivros);

  const autores = await fetchAutores();
  renderAutores(autores);

  campoPesquisa.addEventListener("input", aplicarPesquisaEFiltro);
  filtroOrdenacao.addEventListener("change", aplicarPesquisaEFiltro);
}

init();