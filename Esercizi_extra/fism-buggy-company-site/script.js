fetch("datas.json")
  .then(response => response.json())
  .then(data => {
    const contenitore = document.querySelector("#lista-prodotti");
    data.prodotti.forEach(prodotto => {
      contenitore.innerHTML += `
        <article class="card">
          <h3>${prodotto.nome}</h3>
          <p>${prodotto.descrizione}</p>
        </article>
      `;
    });
  });
