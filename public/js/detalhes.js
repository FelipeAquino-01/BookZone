const API_URL = "http://localhost:3000";

const detalhesLivro = document.getElementById("detalhes-livro");

async function fetchLivroPorId(id) {
  try {
    const resposta = await fetch(`${API_URL}/livros/${id}`);

    if (!resposta.ok) {
      return null;
    }

    const livro = await resposta.json();
    return livro;
  } catch (erro) {
    console.log("Erro ao buscar livro:", erro);
    return null;
  }
}

function renderDetalhes(livro) {
  const fotosHTML = livro.fotos.map((foto) => {
    return `
      <div class="col-12 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img 
            src="${foto.imagem}" 
            class="card-img-top" 
            alt="${foto.titulo}"
          >

          <div class="card-body text-center">
            <h6 class="fw-bold">${foto.titulo}</h6>
          </div>
        </div>
      </div>
    `;
  }).join("");

  detalhesLivro.innerHTML = `
    <main>
      <section class="container my-5">
        <div class="row align-items-center shadow rounded p-4 bg-white">

          <div class="col-12 col-md-4 text-center mb-4 mb-md-0">
            <img 
              src="${livro.imagem}" 
              class="img-fluid rounded shadow detalhes-img"
              alt="${livro.titulo}"
            >
          </div>

          <div class="col-12 col-md-8">
            <span class="badge bg-dark mb-3">
              ${livro.categoria}
            </span>

            <h1 class="mb-3 fw-bold">
              ${livro.titulo}
            </h1>

            <h5 class="text-secondary mb-3">
              ${livro.autor}
            </h5>

            <p class="fs-5">
              <strong>Valor estimado:</strong> ${livro.valor}
            </p>

            <p class="lead">
              ${livro.descricaoCompleta}
            </p>

            <hr>

            <h5>Tags:</h5>

            <div class="mb-4">
              ${livro.tags.map(tag => `<span class="badge bg-secondary me-2">${tag}</span>`).join("")}
            </div>

            <div class="d-flex gap-3 mt-4">
              <a href="index.html" class="btn btn-dark">
                ← Voltar
              </a>

              <button class="btn btn-outline-dark">
                Favoritar
              </button>
            </div>
          </div>

        </div>
      </section>

      <section class="container my-5">
        <h2 class="text-center mb-4">Fotos Vinculadas ao Livro</h2>

        <div class="row g-4">
          ${fotosHTML}
        </div>
      </section>
    </main>
  `;
}

async function initDetalhes() {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");

  if (!id) {
    detalhesLivro.innerHTML = `
      <div class="container my-5">
        <div class="alert alert-warning">
          Nenhum livro foi selecionado.
        </div>

        <a href="index.html" class="btn btn-dark">Voltar</a>
      </div>
    `;
    return;
  }

  const livro = await fetchLivroPorId(id);

  if (!livro) {
    detalhesLivro.innerHTML = `
      <div class="container my-5">
        <div class="alert alert-danger">
          Livro não encontrado.
        </div>

        <a href="index.html" class="btn btn-dark">Voltar</a>
      </div>
    `;
    return;
  }

  renderDetalhes(livro);
}

initDetalhes();