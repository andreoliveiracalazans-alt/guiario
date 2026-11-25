/* =========================================================================
   GUIA RIO — LÓGICA DA PÁGINA
   Filtros, busca, favoritos (salvos no navegador), roteiros, agenda e
   pop-up de cada lugar com carrossel de fotos e vídeos da pasta "midia".
   ========================================================================= */
{
  const G = window.GUIA;
  const CFG = Object.assign({ pasta: "midia", max: 10, imagens: ["jpeg", "jpg", "png", "webp"], videos: ["mp4", "webm", "mov"], modoEdicao: true }, G.MIDIA || {});
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const reduzMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rolarPara = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" }); };

  /* nome da pasta de mídia: campo "m" do lugar ou o nome sem acentos, em minúsculas e com hífens */
  const slugify = s => norm(String(s).split(" — ")[0].replace(/\(.*?\)/g, " ")).replace(/&/g, " e ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const PUB = Object.fromEntries(G.PUBLICOS.map(p => [p.k, p]));
  const CAT = Object.fromEntries(G.CATEGORIAS.map(c => [c.k, c]));
  const ZON = Object.fromEntries(G.ZONAS.map(z => [z.k, z]));
  const LUG = G.LUGARES.map((l, i) => ({
    ...l, id: i, pasta: l.m || slugify(l.n),
    busca: norm([l.n, l.b, l.d, l.t, l.pr, l.h, l.ir, CAT[l.c] && CAT[l.c].nome, ZON[l.z] && ZON[l.z].nome, (l.p || []).map(k => PUB[k] ? PUB[k].nome : "").join(" ")].join(" "))
  }));

  const PASSO = 24;
  const PRECO_CURTO = ["Grátis", "$", "$$", "$$$"];
  const st = { pub: "", cat: "", zona: "", preco: "", q: "", fav: false, limite: PASSO };

  /* ---------- ícones ---------- */
  const IC = {
    estrela: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>`,
    foto: `<svg viewBox="0 0 24 24" aria-hidden="true" class="ic"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-5 4 4 3-3 4 4"/></svg>`,
    play: `<svg viewBox="0 0 24 24" aria-hidden="true" class="ic-play"><path d="M8 5.5v13l11-6.5z"/></svg>`
  };

  /* ---------- favoritos ---------- */
  const CHAVE = "guiaRio.favoritos";
  let favs = new Set();
  try { const raw = localStorage.getItem(CHAVE); if (raw) favs = new Set(JSON.parse(raw)); } catch (e) { favs = new Set(); }
  const salvarFav = () => { try { localStorage.setItem(CHAVE, JSON.stringify([...favs])); } catch (e) { /* navegador sem armazenamento */ } };

  let tempoToast;
  const toast = msg => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(tempoToast);
    tempoToast = setTimeout(() => t.classList.remove("on"), 2800);
  };

  /* ---------- cena do topo ---------- */
  const desenharCena = () => {
    let s = 11;
    const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
    const cidade = document.getElementById("cidade");
    if (cidade) {
      let html = "";
      [[205, 420], [575, 812]].forEach(([ini, fim]) => {
        let x = ini;
        while (x < fim) {
          const w = 9 + Math.round(rnd() * 10);
          const meio = 1 - Math.abs((x - (ini + fim) / 2) / ((fim - ini) / 2));
          const h = 8 + Math.round(rnd() * 12 + meio * 16);
          const y = 322 - h;
          html += `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${rnd() > .5 ? "predio" : "predio2"}"/>`;
          for (let yy = y + 4; yy < 316; yy += 6) {
            for (let xx = x + 2; xx < x + w - 3; xx += 5) {
              if (rnd() > .58) html += `<rect x="${xx}" y="${yy}" width="2" height="2" class="janela"/>`;
            }
          }
          x += w + 1 + Math.round(rnd() * 3);
        }
      });
      cidade.innerHTML = html;
    }
    const estrelas = document.getElementById("estrelas");
    if (estrelas) {
      let html = "";
      for (let i = 0; i < 46; i++) html += `<circle cx="${Math.round(rnd() * 1200)}" cy="${Math.round(10 + rnd() * 160)}" r="${(0.6 + rnd() * 1.4).toFixed(1)}"/>`;
      estrelas.innerHTML = html;
    }
  };
  const cenaSvg = document.querySelector(".cena");
  const ajustarCena = () => { if (cenaSvg) cenaSvg.setAttribute("viewBox", window.innerWidth < 600 ? "420 0 780 430" : "0 0 1200 430"); };

  /* ---------- mídia: descobre quais arquivos existem em midia/<pasta>/ ---------- */
  const urlMidia = (pasta, n, ext) => `${CFG.pasta}/${encodeURIComponent(pasta)}/${n}.${ext}`;
  const testaImg = url => new Promise(ok => {
    const i = new Image();
    i.onload = () => ok(i.naturalWidth > 0);
    i.onerror = () => ok(false);
    i.src = url;
  });
  const testaVid = url => new Promise(ok => {
    const v = document.createElement("video");
    let feito = false, relogio = 0;
    const fim = r => {
      if (feito) return;
      feito = true;
      clearTimeout(relogio);
      v.removeAttribute("src");
      try { v.load(); } catch (e) { /* ignora */ }
      ok(r);
    };
    relogio = setTimeout(() => fim(false), 12000);
    v.preload = "metadata";
    v.muted = true;
    v.addEventListener("loadedmetadata", () => fim(true));
    v.addEventListener("error", () => fim(false));
    v.src = url;
  });
  const sondaPosicao = async (pasta, n) => {
    for (const ext of CFG.imagens) { const u = urlMidia(pasta, n, ext); if (await testaImg(u)) return { tipo: "img", url: u }; }
    for (const ext of CFG.videos) { const u = urlMidia(pasta, n, ext); if (await testaVid(u)) return { tipo: "video", url: u }; }
    return null;
  };
  const cacheMidia = new Map();
  const carregarMidias = pasta => {
    if (!cacheMidia.has(pasta)) {
      cacheMidia.set(pasta, Promise.all(Array.from({ length: CFG.max }, (_, i) => sondaPosicao(pasta, i + 1))).then(r => r.filter(Boolean)));
    }
    return cacheMidia.get(pasta);
  };
  const cacheCapa = new Map();
  const capaDe = pasta => {
    if (!cacheCapa.has(pasta)) {
      cacheCapa.set(pasta, (async () => {
        for (const ext of CFG.imagens) { const u = urlMidia(pasta, 1, ext); if (await testaImg(u)) return u; }
        return null;
      })());
    }
    return cacheCapa.get(pasta);
  };
  const carregarCapas = () => {
    document.querySelectorAll("#grade .card-capa:not([data-vista])").forEach(box => {
      box.dataset.vista = "1";
      capaDe(box.dataset.pasta).then(u => {
        if (!u || !box.isConnected) return;
        const img = document.createElement("img");
        img.src = u; img.alt = ""; img.decoding = "async";
        box.appendChild(img);
        box.classList.add("tem");
      });
    });
  };

  /* ---------- números do topo ---------- */
  const renderNumeros = () => {
    const nums = [
      [LUG.length, "lugares no guia"],
      [LUG.filter(l => l.v === 0).length, "programas grátis"],
      [G.PUBLICOS.length, "perfis de viajante"],
      [G.ROTEIROS.length, "roteiros prontos"]
    ];
    $("#numeros").innerHTML = nums.map(([n, t]) => `<div><dt>${esc(t)}</dt><dd>${n}</dd></div>`).join("");
  };

  /* ---------- perfis ---------- */
  const contaPub = k => LUG.filter(l => l.p.includes(k)).length;
  const renderPerfis = () => {
    $("#perfis").innerHTML = G.PUBLICOS.map(p => `
      <button type="button" class="perfil" data-pub="${esc(p.k)}" aria-pressed="${st.pub === p.k}">
        <span class="perfil-nome">${esc(p.nome)}</span>
        <span class="perfil-desc">${esc(p.desc)}</span>
        <span class="perfil-qtd">${contaPub(p.k)} lugares</span>
      </button>`).join("");
  };

  /* ---------- filtros ---------- */
  const montarSelects = () => {
    $("#fPublico").innerHTML = `<option value="">Todos os perfis</option>` + G.PUBLICOS.map(p => `<option value="${esc(p.k)}">${esc(p.nome)}</option>`).join("");
    $("#fZona").innerHTML = `<option value="">Todas as regiões</option>` + G.ZONAS.map(z => `<option value="${esc(z.k)}">${esc(z.nome)}</option>`).join("");
    $("#fPreco").innerHTML = `<option value="">Qualquer preço</option><option value="0">Só grátis</option><option value="1">Até $ (≈ R$ 50)</option><option value="2">Até $$ (≈ R$ 150)</option>`;
  };

  const renderCats = () => {
    const conta = k => LUG.filter(l => l.c === k).length;
    $("#cats").innerHTML = `<button type="button" class="chip" data-cat="" aria-pressed="${st.cat === ""}">Tudo <small>${LUG.length}</small></button>` +
      G.CATEGORIAS.map(c => `<button type="button" class="chip" data-cat="${esc(c.k)}" aria-pressed="${st.cat === c.k}" style="--c:${esc(c.cor)}"><i></i>${esc(c.nome)} <small>${conta(c.k)}</small></button>`).join("");
  };

  const filtrados = () => {
    const termos = norm(st.q).trim().split(/\s+/).filter(Boolean);
    return LUG.filter(l =>
      (!st.pub || l.p.includes(st.pub)) &&
      (!st.cat || l.c === st.cat) &&
      (!st.zona || l.z === st.zona) &&
      (st.preco === "" || l.v <= Number(st.preco)) &&
      (!st.fav || favs.has(l.n)) &&
      termos.every(t => l.busca.includes(t))
    );
  };

  const linkMapa = l => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(l.q ? `${l.q}, RJ` : `${l.n.split(" — ")[0]}, ${l.b}, Rio de Janeiro`);
  const botaoFav = l => {
    const on = favs.has(l.n);
    return `<button type="button" class="fav" data-fav="${esc(l.n)}" aria-pressed="${on}" aria-label="${on ? "Remover dos favoritos" : "Salvar nos favoritos"}: ${esc(l.n)}">${IC.estrela}<span>${on ? "Salvo" : "Salvar"}</span></button>`;
  };
  const tagsDe = l => (l.p || []).filter(k => PUB[k]).map(k => `<li>${esc(PUB[k].nome)}</li>`).join("");

  const card = l => {
    const c = CAT[l.c] || { nome: "", cor: "#888" };
    const z = ZON[l.z] || { nome: "" };
    return `<article class="card" data-id="${l.id}">
      <div class="card-capa" data-pasta="${esc(l.pasta)}"></div>
      <div class="card-topo">
        <span class="cat" style="--c:${esc(c.cor)}">${esc(c.nome)}</span>
        <span class="preco" title="${esc(G.PRECOS[l.v])}">${PRECO_CURTO[l.v]}</span>
      </div>
      <h3><button type="button" class="abrir" data-abrir="${l.id}">${esc(l.n)}</button></h3>
      <p class="local">${esc(l.b)} · ${esc(z.nome)}</p>
      <p class="desc">${esc(l.d)}</p>
      ${l.pr ? `<p class="info"><strong>Preço:</strong> ${esc(l.pr)}</p>` : ""}
      ${l.h ? `<p class="info"><strong>Quando:</strong> ${esc(l.h)}</p>` : ""}
      ${l.ir ? `<p class="info"><strong>Como chegar:</strong> ${esc(l.ir)}</p>` : ""}
      <p class="card-dica"><strong>Dica:</strong> ${esc(l.t)}</p>
      <ul class="tags" aria-label="Indicado para">${tagsDe(l)}</ul>
      <div class="card-rodape">
        <button type="button" class="btn btn-forte btn-midia" data-abrir="${l.id}">${IC.foto}Fotos e vídeos</button>
        <a class="btn btn-chip" href="${esc(linkMapa(l))}" target="_blank" rel="noopener">Mapa</a>
        ${botaoFav(l)}
      </div>
    </article>`;
  };

  /* cards em colunas que seguem a ordem da lista (linha a linha) */
  let nColunas = 0;
  const colunas = () => {
    const w = $("#grade").clientWidth || window.innerWidth;
    return Math.max(1, Math.min(3, Math.floor((w + 16) / 328)));
  };

  const temFiltro = () => st.pub || st.cat || st.zona || st.preco !== "" || st.q.trim() || st.fav;

  const atualizarFavUI = () => {
    $("#favCount").textContent = favs.size;
    $("#favQtd").textContent = favs.size;
    $("#favBarra").hidden = favs.size === 0;
    $("#soFav").setAttribute("aria-pressed", String(st.fav));
  };

  const render = () => {
    const lista = filtrados();
    const mostrar = lista.slice(0, st.limite);
    const n = colunas();
    nColunas = n;
    $("#grade").style.setProperty("--n", n);
    $("#grade").innerHTML = mostrar.length
      ? Array.from({ length: n }, (_, c) => `<div class="col">${mostrar.filter((_, i) => i % n === c).map(card).join("")}</div>`).join("")
      : `<div class="vazio"><p><strong>${st.fav && favs.size === 0 ? "Você ainda não salvou nenhum lugar." : "Nenhum lugar com esses filtros."}</strong></p>
         <p>${st.fav && favs.size === 0 ? "Toque em “Salvar” nos cards para montar sua lista." : "Tente outra região, outro preço ou uma busca mais curta."}</p>
         <button type="button" class="btn btn-forte" data-acao="limpar">Limpar filtros</button></div>`;
    const btnMais = $("#verMais");
    const resto = lista.length - st.limite;
    btnMais.hidden = resto <= 0;
    if (resto > 0) btnMais.textContent = `Mostrar mais (${resto} ${resto === 1 ? "restante" : "restantes"})`;

    $("#contagem").textContent = `${lista.length} ${lista.length === 1 ? "lugar" : "lugares"}${temFiltro() ? " com os filtros escolhidos" : " no guia"}`;

    const dp = $("#dicaPerfil");
    if (st.pub && PUB[st.pub]) {
      dp.hidden = false;
      dp.innerHTML = `<strong>Dica para o perfil ${esc(PUB[st.pub].nome)}</strong><p>${esc(PUB[st.pub].dica)}</p>`;
    } else { dp.hidden = true; dp.innerHTML = ""; }

    document.querySelectorAll("#cats .chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.cat === st.cat)));
    document.querySelectorAll("#perfis .perfil").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.pub === st.pub)));
    $("#fPublico").value = st.pub;
    $("#fZona").value = st.zona;
    $("#fPreco").value = st.preco;
    if ($("#busca").value !== st.q) $("#busca").value = st.q;
    atualizarFavUI();
    carregarCapas();
  };

  const limpar = () => {
    Object.assign(st, { pub: "", cat: "", zona: "", preco: "", q: "", fav: false, limite: PASSO });
    render();
  };

  const escolherCat = k => {
    Object.assign(st, { pub: "", zona: "", preco: "", q: "", fav: false, cat: k, limite: PASSO });
    render();
    const box = $("#cats"), chip = $('#cats .chip[aria-pressed="true"]');
    if (box && chip) box.scrollLeft = chip.offsetLeft - box.offsetLeft - (box.clientWidth - chip.offsetWidth) / 2;
    rolarPara("explorar");
  };

  /* ---------- bate-volta ---------- */
  const renderBateVolta = () => {
    const el = $("#bvGrade");
    if (!el) return;
    el.innerHTML = LUG.filter(l => l.c === "batevolta").map(l => `
      <button type="button" class="bv" data-abrir="${l.id}">
        <span class="bv-nome">${esc(l.n)}</span>
        <span class="bv-local">${esc(l.b)}</span>
        ${l.dist ? `<span class="bv-dist">${esc(l.dist)}</span>` : ""}
      </button>`).join("");
  };

  const escolherPerfil = k => {
    st.pub = k; st.limite = PASSO;
    render();
    rolarPara("explorar");
  };

  const alternarFav = nome => {
    if (favs.has(nome)) { favs.delete(nome); toast("Removido dos favoritos"); }
    else { favs.add(nome); toast("Salvo nos favoritos"); }
    salvarFav();
    const on = favs.has(nome);
    document.querySelectorAll(".fav").forEach(b => {
      if (b.dataset.fav !== nome) return;
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("aria-label", `${on ? "Remover dos favoritos" : "Salvar nos favoritos"}: ${nome}`);
      b.querySelector("span").textContent = on ? "Salvo" : "Salvar";
    });
    if (st.fav) render(); else atualizarFavUI();
  };

  /* ---------- pop-up do lugar com carrossel ---------- */
  const dlg = $("#modal");
  const trilho = $("#mTrilho");
  let mAtual = null, mItens = [], mIdx = 0, mToken = 0, mFocoAnterior = null;

  const infoHTML = l => `
    <p class="desc">${esc(l.d)}</p>
    ${l.pr ? `<p class="info"><strong>Preço:</strong> ${esc(l.pr)}</p>` : ""}
    ${l.h ? `<p class="info"><strong>Quando:</strong> ${esc(l.h)}</p>` : ""}
    ${l.ir ? `<p class="info"><strong>Como chegar:</strong> ${esc(l.ir)}</p>` : ""}
    <p class="card-dica"><strong>Dica:</strong> ${esc(l.t)}</p>
    <ul class="tags" aria-label="Indicado para">${tagsDe(l)}</ul>
    <div class="m-acoes">
      <a class="btn btn-forte" href="${esc(linkMapa(l))}" target="_blank" rel="noopener">Ver no mapa</a>
      ${botaoFav(l)}
    </div>
    ${CFG.modoEdicao ? `<p class="m-pasta">Pasta de mídia deste lugar: <code>${esc(CFG.pasta)}/${esc(l.pasta)}/</code></p>` : ""}`;

  const atualizarSetas = () => {
    const n = mItens.length;
    $("#mAnt").hidden = n < 2;
    $("#mProx").hidden = n < 2;
    $("#mAnt").disabled = mIdx <= 0;
    $("#mProx").disabled = mIdx >= n - 1;
  };

  const atualizarIndice = () => {
    const n = mItens.length;
    $("#mContador").textContent = n ? `${mIdx + 1} / ${n}` : "";
    document.querySelectorAll("#mMinis .m-mini").forEach((b, i) => b.setAttribute("aria-current", String(i === mIdx)));
    trilho.querySelectorAll("video").forEach(v => { if (Number(v.closest(".m-slide").dataset.i) !== mIdx && !v.paused) v.pause(); });
    const mini = document.querySelector(`#mMinis .m-mini[data-ir="${mIdx}"]`);
    if (mini) mini.scrollIntoView({ block: "nearest", inline: "nearest" });
    atualizarSetas();
  };

  const irPara = i => {
    const n = mItens.length;
    if (!n) return;
    mIdx = Math.max(0, Math.min(n - 1, i));
    trilho.scrollTo({ left: mIdx * trilho.clientWidth, behavior: reduzMovimento ? "auto" : "smooth" });
    atualizarIndice();
  };

  const montarCarrossel = () => {
    if (!mItens.length) {
      trilho.innerHTML = `<div class="m-slide m-aviso">${CFG.modoEdicao
        ? `<p><strong>Ainda não há fotos ou vídeos deste lugar.</strong></p>
           <p>Coloque até ${CFG.max} arquivos na pasta</p>
           <code>${esc(CFG.pasta)}/${esc(mAtual.pasta)}/</code>
           <p>com os nomes 1.jpeg, 2.jpeg, 3.mp4… O carrossel mostra só os que existirem.</p>`
        : `<p><strong>Fotos em breve.</strong></p>`}</div>`;
      $("#mMinis").innerHTML = "";
      $("#mContador").textContent = "";
      atualizarSetas();
      return;
    }
    trilho.innerHTML = mItens.map((m, i) => `<figure class="m-slide" data-i="${i}">${m.tipo === "video"
      ? `<video src="${esc(m.url)}" controls playsinline preload="metadata" aria-label="Vídeo ${i + 1} de ${esc(mAtual.n)}"></video>`
      : `<img src="${esc(m.url)}" alt="${esc(mAtual.n)}, foto ${i + 1}"${i > 1 ? ' loading="lazy"' : ""}>`}</figure>`).join("");
    $("#mMinis").innerHTML = mItens.length > 1 ? mItens.map((m, i) => `<button type="button" class="m-mini" data-ir="${i}" aria-label="${m.tipo === "video" ? "Vídeo" : "Foto"} ${i + 1}">${m.tipo === "video"
      ? `<span class="m-mini-video">${IC.play}</span>`
      : `<img src="${esc(m.url)}" alt="" loading="lazy">`}</button>`).join("") : "";
    mIdx = 0;
    trilho.scrollLeft = 0;
    atualizarIndice();
  };

  const abrirModal = id => {
    const l = LUG[id];
    if (!l) return;
    mAtual = l; mItens = []; mIdx = 0;
    const token = ++mToken;
    const c = CAT[l.c] || { nome: "", cor: "#888" };
    $("#mCat").innerHTML = `<span class="cat" style="--c:${esc(c.cor)}">${esc(c.nome)}</span>`;
    $("#mTitulo").textContent = l.n;
    $("#mLocal").textContent = `${l.b} · ${ZON[l.z] ? ZON[l.z].nome : ""}`;
    trilho.innerHTML = `<div class="m-slide m-aviso"><p>Carregando fotos e vídeos…</p></div>`;
    $("#mMinis").innerHTML = "";
    $("#mContador").textContent = "";
    atualizarSetas();
    $("#mInfo").innerHTML = infoHTML(l);
    if (!dlg.open) {
      mFocoAnterior = document.activeElement;
      dlg.appendChild($("#toast"));
      document.body.classList.add("modal-aberto");
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    }
    $("#mCaixa").scrollTop = 0;
    trilho.scrollLeft = 0;
    carregarMidias(l.pasta).then(itens => {
      if (token !== mToken || !dlg.open) return;
      mItens = itens;
      montarCarrossel();
    });
  };

  const aoFechar = () => {
    trilho.querySelectorAll("video").forEach(v => v.pause());
    document.body.appendChild($("#toast"));
    document.body.classList.remove("modal-aberto");
    mToken++;
    if (mFocoAnterior && mFocoAnterior.isConnected) mFocoAnterior.focus({ preventScroll: true });
  };
  const fecharModal = () => {
    if (typeof dlg.close === "function" && dlg.open) dlg.close();
    else { dlg.removeAttribute("open"); aoFechar(); }
  };

  /* ---------- roteiros ---------- */
  const ROT_PUB = { "1dia": "classico", "3dias": "classico", centro: "historico", estudante: "estudante", noite: "curticao", natureza: "natureza", familia: "familia", casal: "casal" };
  let rotAtual = G.ROTEIROS[0].k;

  const renderAbas = () => {
    $("#abasRoteiro").innerHTML = G.ROTEIROS.map(r =>
      `<button type="button" role="tab" class="aba" id="aba-${esc(r.k)}" data-rot="${esc(r.k)}" aria-controls="roteiro" aria-selected="${r.k === rotAtual}" tabindex="${r.k === rotAtual ? 0 : -1}">${esc(r.nome)}</button>`
    ).join("");
  };

  const renderRoteiro = () => {
    const r = G.ROTEIROS.find(x => x.k === rotAtual) || G.ROTEIROS[0];
    const pk = ROT_PUB[r.k];
    const passos = r.passos.map(p => p.dia
      ? `<li class="dia">${esc(p.dia)}</li>`
      : `<li class="passo"><span class="hora">${esc(p.h)}</span><div><strong>${esc(p.t)}</strong><p>${esc(p.d)}</p></div></li>`).join("");
    $("#roteiro").setAttribute("aria-labelledby", "aba-" + r.k);
    $("#roteiro").innerHTML = `
      <div class="rot-principal">
        <h3>${esc(r.nome)}</h3>
        <p class="rot-meta"><span>${esc(r.dur)}</span><span>${esc(r.para)}</span></p>
        <p class="rot-resumo">${esc(r.resumo)}</p>
        <ol class="passos">${passos}</ol>
      </div>
      <aside class="rot-lado">
        <div class="painel">
          <h4>Dica do roteiro</h4>
          <p>${esc(r.dica)}</p>
          ${pk && PUB[pk] ? `<button type="button" class="btn btn-forte" data-verpub="${esc(pk)}">Ver lugares: ${esc(PUB[pk].nome)}</button>` : ""}
        </div>
      </aside>`;
  };

  const escolherRoteiro = (k, focar) => {
    rotAtual = k;
    renderAbas();
    renderRoteiro();
    if (focar) { const b = document.getElementById("aba-" + k); if (b) { b.focus(); b.scrollIntoView({ block: "nearest", inline: "nearest" }); } }
  };

  /* ---------- agenda ---------- */
  const renderAgenda = () => {
    const mesAtual = new Date().getMonth();
    $("#meses").innerHTML = G.AGENDA.map((m, i) => `
      <article class="mes${m.destaque ? " mes-destaque" : ""}${i === mesAtual ? " mes-agora" : ""}">
        <h3>${esc(m.m)}${i === mesAtual ? ' <span class="agora">agora</span>' : ""}</h3>
        <ul>${m.itens.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      </article>`).join("");
  };

  /* ---------- tabelas empilháveis no celular ---------- */
  const rotularTabelas = () => {
    document.querySelectorAll("table.stack").forEach(t => {
      if (!t.tHead || !t.tBodies[0]) return;
      const cab = [...t.tHead.rows[0].cells].map(c => c.textContent.trim());
      [...t.tBodies[0].rows].forEach(r => [...r.cells].forEach((c, i) => { c.dataset.l = cab[i] || ""; }));
    });
  };

  /* ---------- link direto para um perfil: #para-estudante ---------- */
  const aplicarHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.indexOf("para-") === 0 && PUB[h.slice(5)]) escolherPerfil(h.slice(5));
    else if (h.indexOf("cat-") === 0 && CAT[h.slice(4)]) escolherCat(h.slice(4));
  };

  /* ---------- eventos ---------- */
  const ligar = () => {
    $("#perfis").addEventListener("click", e => {
      const b = e.target.closest(".perfil");
      if (!b) return;
      const k = b.dataset.pub;
      if (st.pub === k) { st.pub = ""; render(); rolarPara("explorar"); return; }
      if (location.hash === "#para-" + k) escolherPerfil(k); else location.hash = "para-" + k;
    });

    $("#cats").addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      st.cat = st.cat === b.dataset.cat ? "" : b.dataset.cat;
      st.limite = PASSO;
      render();
    });

    $("#fPublico").addEventListener("change", e => { st.pub = e.target.value; st.limite = PASSO; render(); });
    $("#fZona").addEventListener("change", e => { st.zona = e.target.value; st.limite = PASSO; render(); });
    $("#fPreco").addEventListener("change", e => { st.preco = e.target.value; st.limite = PASSO; render(); });

    let tempoBusca;
    $("#busca").addEventListener("input", e => {
      clearTimeout(tempoBusca);
      const v = e.target.value;
      tempoBusca = setTimeout(() => { st.q = v; st.limite = PASSO; render(); }, 160);
    });

    $("#soFav").addEventListener("click", () => { st.fav = !st.fav; st.limite = PASSO; render(); });
    $("#limpar").addEventListener("click", limpar);
    $("#verMais").addEventListener("click", () => { st.limite += PASSO; render(); });

    $("#grade").addEventListener("click", e => {
      if (e.target.closest("[data-acao=limpar]")) { limpar(); return; }
      const f = e.target.closest(".fav");
      if (f) { alternarFav(f.dataset.fav); return; }
      if (e.target.closest("a")) return;
      const ab = e.target.closest("[data-abrir]");
      if (ab) { abrirModal(Number(ab.dataset.abrir)); return; }
      const c = e.target.closest(".card");
      if (c && !String(window.getSelection ? window.getSelection() : "")) abrirModal(Number(c.dataset.id));
    });

    $("#favNav").addEventListener("click", () => {
      if (favs.size === 0) { toast("Toque em “Salvar” nos cards para montar sua lista."); rolarPara("explorar"); return; }
      st.fav = true; st.limite = PASSO; render(); rolarPara("explorar");
    });

    $("#copiarFav").addEventListener("click", () => {
      const linhas = LUG.filter(l => favs.has(l.n)).map(l => `• ${l.n} — ${l.b} (${ZON[l.z] ? ZON[l.z].nome : ""})`);
      const texto = "Meu roteiro no Rio\n" + linhas.join("\n");
      const mostrarTexto = () => {
        let ta = $("#favBarra textarea");
        if (!ta) { ta = document.createElement("textarea"); ta.readOnly = true; ta.setAttribute("aria-label", "Sua lista de favoritos"); $("#favBarra").appendChild(ta); }
        ta.value = texto; ta.focus(); ta.select();
        toast("Selecione o texto abaixo e copie.");
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(() => toast("Lista copiada!"), mostrarTexto);
        else mostrarTexto();
      } catch (err) { mostrarTexto(); }
    });

    let confirmar = null;
    $("#limparFav").addEventListener("click", e => {
      const b = e.currentTarget;
      if (!confirmar) {
        b.textContent = "Toque de novo para apagar";
        confirmar = setTimeout(() => { b.textContent = "Apagar favoritos"; confirmar = null; }, 3500);
        return;
      }
      clearTimeout(confirmar); confirmar = null;
      b.textContent = "Apagar favoritos";
      favs.clear(); salvarFav(); st.fav = false;
      const ta = $("#favBarra textarea"); if (ta) ta.remove();
      render(); toast("Favoritos apagados");
    });

    /* pop-up */
    $("#mFechar").addEventListener("click", fecharModal);
    dlg.addEventListener("close", aoFechar);
    dlg.addEventListener("click", e => { if (e.target === dlg) fecharModal(); });
    dlg.addEventListener("keydown", e => {
      if (e.target.tagName === "VIDEO" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); irPara(mIdx + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); irPara(mIdx - 1); }
    });
    $("#mAnt").addEventListener("click", () => irPara(mIdx - 1));
    $("#mProx").addEventListener("click", () => irPara(mIdx + 1));
    $("#mMinis").addEventListener("click", e => { const b = e.target.closest("[data-ir]"); if (b) irPara(Number(b.dataset.ir)); });
    $("#mInfo").addEventListener("click", e => { const f = e.target.closest(".fav"); if (f) alternarFav(f.dataset.fav); });
    let quadro = 0;
    trilho.addEventListener("scroll", () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        if (!mItens.length || !trilho.clientWidth) return;
        const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
        if (i !== mIdx) { mIdx = i; atualizarIndice(); }
      });
    });

    /* roteiros */
    $("#abasRoteiro").addEventListener("click", e => {
      const b = e.target.closest(".aba");
      if (b) escolherRoteiro(b.dataset.rot, false);
    });
    $("#abasRoteiro").addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const i = G.ROTEIROS.findIndex(r => r.k === rotAtual);
      const n = (i + (e.key === "ArrowRight" ? 1 : -1) + G.ROTEIROS.length) % G.ROTEIROS.length;
      e.preventDefault();
      escolherRoteiro(G.ROTEIROS[n].k, true);
    });
    $("#roteiro").addEventListener("click", e => {
      const b = e.target.closest("[data-verpub]");
      if (b) escolherPerfil(b.dataset.verpub);
    });

    /* bate-volta */
    $("#bvGrade").addEventListener("click", e => {
      const b = e.target.closest("[data-abrir]");
      if (b) abrirModal(Number(b.dataset.abrir));
    });
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#cat-"]');
      if (!a) return;
      const k = decodeURIComponent(a.getAttribute("href").slice(5));
      if (!CAT[k]) return;
      e.preventDefault();
      escolherCat(k);
    });

    window.addEventListener("hashchange", aplicarHash);
    let tempoResize;
    window.addEventListener("resize", () => {
      ajustarCena();
      clearTimeout(tempoResize);
      tempoResize = setTimeout(() => { if (colunas() !== nColunas) render(); }, 150);
    });
  };

  /* ---------- início ---------- */
  ajustarCena();
  desenharCena();
  renderNumeros();
  renderPerfis();
  montarSelects();
  renderCats();
  renderAbas();
  renderRoteiro();
  renderAgenda();
  renderBateVolta();
  rotularTabelas();
  $("#atualizado").textContent = G.ATUALIZADO;
  $("#atualizado2").textContent = G.ATUALIZADO;
  ligar();
  render();
  aplicarHash();
}
