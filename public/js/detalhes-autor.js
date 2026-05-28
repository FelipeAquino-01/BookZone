const API_URL = "http://localhost:3000";

const detalhesAutor = document.getElementById("detalhes-autor");

async function fetchAutorPorId(id) {
  try {
    const resposta = await fetch(`${API_URL}/autores/${id}`);

    if (!resposta.ok) {
      return null;
    }

    const autor = await resposta.json();
    return autor;
  } catch (erro) {
    console.log("Erro ao buscar autor:", erro);
    return null;
  }
}

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

function criarCardLivroAutor(livro) {
  return `
    <div class="col-12 col-md-6 col-lg-4">
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

          <a href="detalhes.html?id=${livro.id}" class="btn btn-dark mt-auto">
            Ver detalhes do livro
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderDetalhesAutor(autor, livrosDoAutor) {
  const livrosHTML = livrosDoAutor.map(criarCardLivroAutor).join("");

  detalhesAutor.innerHTML = `
    <main>
      <section class="container my-5">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">

            <div class="card border-0 shadow-lg text-center p-4 detalhe-card">

              <img
                src="${autor.imagem}"
                class="rounded-circle mx-auto shadow mb-4 autor-detalhe-img"
                alt="${autor.nome}"
              >

              <h1 class="fw-bold">${autor.nome}</h1>

              <p class="text-muted fs-5">${autor.descricao}</p>

              <span class="badge bg-dark mx-auto mb-4">
                ${autor.nacionalidade}
              </span>

              <p class="lead">
                ${autor.biografia}
              </p>

              <a href="index.html#autores" class="btn btn-dark mt-3">
                ← Voltar para autores
              </a>

            </div>

          </div>
        </div>
      </section>

      <section class="container my-5">
        <h2 class="text-center mb-4">Livros deste Autor</h2>

        <div class="row g-4">
          ${
            livrosDoAutor.length > 0
              ? livrosHTML
              : `<p class="text-center">Nenhum livro encontrado para este autor.</p>`
          }
        </div>
      </section>
    </main>
  `;
}

async function initDetalhesAutor() {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");

  if (!id) {
    detalhesAutor.innerHTML = `
      <div class="container my-5">
        <div class="alert alert-warning">
          Nenhum autor foi selecionado.
        </div>

        <a href="index.html" class="btn btn-dark">Voltar</a>
      </div>
    `;
    return;
  }

  const autor = await fetchAutorPorId(id);

  if (!autor) {
    detalhesAutor.innerHTML = `
      <div class="container my-5">
        <div class="alert alert-danger">
          Autor não encontrado.
        </div>

        <a href="index.html" class="btn btn-dark">Voltar</a>
      </div>
    `;
    return;
  }

  const livros = await fetchLivros();

  const livrosDoAutor = livros.filter((livro) => {
    return livro.autor === autor.nome;
  });

  renderDetalhesAutor(autor, livrosDoAutor);
}

initDetalhesAutor();