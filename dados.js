/* =========================================================================
   GUIA RIO — BASE DE DADOS
   Edite aqui para incluir, alterar ou remover lugares, roteiros e eventos.
   Preços e horários conferidos em novembro de 2026 — podem mudar.

   Campos de cada lugar:
   n  = nome                     b  = bairro
   z  = zona (ver ZONAS)         c  = categoria (ver CATEGORIAS)
   p  = públicos (ver PUBLICOS)  v  = faixa de preço (0 grátis · 1 $ · 2 $$ · 3 $$$)
   d  = descrição                t  = dica
   pr = preço detalhado (opc.)   h  = horário / quando ir (opc.)
   ir = como chegar (opc.)       dist = distância / tempo, mostrado na seção Bate-volta (opc.)
   q  = texto de busca do mapa, quando o nome não basta (opc.)
   m  = nome da pasta de mídia, quando não for o automático (opc.)
   ========================================================================= */

window.GUIA = {};

GUIA.ATUALIZADO = "novembro de 2026";

/* ---------------- FOTOS E VÍDEOS ----------------
   Cada lugar tem uma pasta dentro de "midia" (o nome aparece no pop-up do lugar).
   Coloque até 10 arquivos numerados: 1.jpeg, 2.jpeg, 3.mp4 ... 10.jpeg
   O carrossel mostra só os que existirem. O arquivo 1 (se for foto) vira a capa do card.
   modoEdicao: true  -> o pop-up mostra o nome da pasta quando ainda não há mídia
               false -> o visitante vê apenas "Fotos em breve" (use ao publicar) */
GUIA.MIDIA = {
  pasta: "midia",
  max: 10,
  imagens: ["jpeg", "jpg", "png", "webp"],
  videos: ["mp4", "webm", "mov"],
  modoEdicao: true
};

GUIA.PUBLICOS = [
  { k: "classico", nome: "Primeira vez no Rio", desc: "Os cartões-postais que ninguém deve perder.",
    dica: "Compre Cristo e Pão de Açúcar online, deixe um dia de folga para o caso de nuvens e agrupe por região: Zona Sul num dia, Centro e Porto no outro." },
  { k: "curticao", nome: "Curtição e noite", desc: "Samba, baladas, bares e festas de rua.",
    dica: "A noite carioca começa tarde: esquenta às 21h, casas cheias depois da meia-noite. Segunda é dia de Pedra do Sal; sexta e sábado, Lapa e Botafogo. Volte sempre de táxi ou aplicativo." },
  { k: "historico", nome: "Histórico e cultural", desc: "Colônia, Império, República e herança africana.",
    dica: "Pense em camadas: Colônia (Praça XV, São Bento), Império (Paço Imperial, Quinta da Boa Vista, Ilha Fiscal), República (Catete, Cinelândia) e a herança africana (Pequena África)." },
  { k: "estudante", nome: "Estudantes", desc: "Museus, ciência, grátis e meia-entrada.",
    dica: "Leve a carteira estudantil (CIE) para meia-entrada. Terça é o dia de ouro: Museu do Amanhã, MAR e Espaço Cultural da Marinha são gratuitos, e o CCBB é sempre grátis." },
  { k: "familia", nome: "Família e crianças", desc: "Aquário, bioparque, parques e praias calmas.",
    dica: "Prefira manhãs (menos calor e filas), praias de mar calmo como Leme, Leblon e Praia Vermelha, e atrações cobertas para dias de chuva: AquaRio, Museu do Amanhã e Planetário." },
  { k: "natureza", nome: "Natureza e trilhas", desc: "Mata Atlântica, picos, cachoeiras e praias selvagens.",
    dica: "Comece cedo, vá em grupo ou com guia, leve água, lanche, protetor e lanterna. Evite trilhas depois de chuva forte e avise alguém do seu roteiro." },
  { k: "casal", nome: "Casais", desc: "Pores do sol, mirantes e jantares com vista.",
    dica: "Reserve o fim de tarde: Arpoador, Pão de Açúcar, Mureta da Urca ou Mirante Dona Marta. Depois, jantar em Santa Teresa ou drink na orla." },
  { k: "gastro", nome: "Gastronomia", desc: "Botecos, lanchonetes, feijoada e comidinhas.",
    dica: "Boteco carioca é balcão, chope com colarinho e petisco para dividir. Vários bares tradicionais são tombados como patrimônio cultural da cidade." },
  { k: "gratis", nome: "Grátis e econômico", desc: "Muito Rio sem gastar quase nada.",
    dica: "Praias, mirantes, Aterro, Lagoa, Pedra do Sal, CCBB, IMS, Paço Imperial e o jardim do Museu da República não cobram. Ônibus, BRT e VLT custam R$ 5." },
  { k: "lgbt", nome: "LGBTQIA+", desc: "Praia, festas e espaços acolhedores.",
    dica: "Em Ipanema, a altura da Rua Farme de Amoedo é o ponto LGBTQIA+ mais conhecido da praia. À noite, Galeria Café e festas em Botafogo e Copacabana." },
  { k: "esporte", nome: "Esporte e adrenalina", desc: "Voo livre, surf, escalada, futebol e bike.",
    dica: "Contrate apenas instrutores e empresas credenciadas, confira o vento e o mar no dia e hidrate-se: o sol carioca cansa mais do que parece." },
  { k: "idoso", nome: "Melhor idade e acessível", desc: "Caminhos planos, elevadores e conforto.",
    dica: "Pessoas com 60+ têm meia-entrada. Prefira lugares com elevador e chão plano: Cristo (elevadores e escadas rolantes), Bondinho, Museu do Amanhã, CCBB, Aterro e Lagoa." }
];

GUIA.CATEGORIAS = [
  { k: "marco", nome: "Cartões-postais", cor: "#ff5b3a" },
  { k: "sol", nome: "Pôr e nascer do sol", cor: "#f28c1b" },
  { k: "praia", nome: "Praias", cor: "#0a84c6" },
  { k: "museu", nome: "Museus", cor: "#7a4cc2" },
  { k: "historia", nome: "História e arquitetura", cor: "#a0692a" },
  { k: "trilha", nome: "Trilhas", cor: "#1d8a4e" },
  { k: "parque", nome: "Parques e jardins", cor: "#4ea33a" },
  { k: "mirante", nome: "Mirantes", cor: "#e08a00" },
  { k: "samba", nome: "Samba e música ao vivo", cor: "#d1316b" },
  { k: "balada", nome: "Baladas e festas", cor: "#c2185b" },
  { k: "boteco", nome: "Bares e botecos", cor: "#b5651d" },
  { k: "lanche", nome: "Lanchonetes e comidinhas", cor: "#e0a100" },
  { k: "restaurante", nome: "Restaurantes", cor: "#8d3b2b" },
  { k: "compras", nome: "Compras e feiras", cor: "#00897b" },
  { k: "passeio", nome: "Passeios e experiências", cor: "#2b59c3" },
  { k: "batevolta", nome: "Bate-volta", cor: "#4f6d7a" }
];

GUIA.ZONAS = [
  { k: "sul", nome: "Zona Sul" },
  { k: "centro", nome: "Centro, Lapa e Porto" },
  { k: "norte", nome: "Zona Norte" },
  { k: "oeste", nome: "Barra e Zona Oeste" },
  { k: "floresta", nome: "Floresta e montanhas" },
  { k: "fora", nome: "Fora da capital (bate-volta)" }
];

GUIA.PRECOS = ["Grátis", "$ · até R$ 50", "$$ · R$ 50 a 150", "$$$ · acima de R$ 150"];

GUIA.LUGARES = [

/* ---------------- CARTÕES-POSTAIS ---------------- */
{ n: "Cristo Redentor", b: "Corcovado / Cosme Velho", z: "sul", c: "marco", p: ["classico","historico","familia","casal","idoso","estudante"], v: 2,
  d: "Estátua art déco de 30 m (38 m com o pedestal) no alto do Corcovado, a cerca de 700 m de altitude, inaugurada em 1931 e eleita uma das Novas Sete Maravilhas do Mundo em 2007. Sobe-se pelo Trem do Corcovado (cerca de 20 min pela Floresta da Tijuca), pelas vans oficiais ou a pé.",
  pr: "Trem R$ 134 · van de Copacabana/Largo do Machado R$ 132 · van das Paineiras R$ 87 · só acesso (a pé) R$ 58 — inteiras 2026; até 6 anos no colo não paga",
  h: "Diariamente; trens a cada 20 min",
  t: "Compre online com antecedência e vá no primeiro horário ou no fim da tarde. Olhe a previsão: com o Corcovado encoberto, não se vê nada. No topo há elevadores e escadas rolantes." },

{ n: "Bondinho do Pão de Açúcar", m: "pao-de-acucar", b: "Urca", z: "sul", c: "marco", p: ["classico","casal","familia","idoso","historico"], v: 3,
  d: "Teleférico em operação desde 1912, em dois trechos: Praia Vermelha → Morro da Urca (220 m) → Pão de Açúcar (396 m). Vista de 360° da Baía de Guanabara, de Copacabana, do Cristo e de Niterói.",
  pr: "Inteira ~R$ 205 · brasileiros ~R$ 160 · meia ~R$ 102 (out/2026). Há tarifa promocional para moradores do estado do RJ",
  h: "Diariamente, de manhã até a noite",
  t: "Suba uma hora antes do pôr do sol e fique até as luzes da cidade acenderem. Opção econômica: suba a pé o Morro da Urca pela trilha (grátis) e decida lá em cima se segue até o Pão de Açúcar." },

{ n: "Escadaria Selarón", b: "Lapa / Santa Teresa", z: "centro", c: "marco", p: ["classico","gratis","estudante","casal","historico"], v: 0,
  d: "São 215 degraus cobertos por mais de 2 mil azulejos de dezenas de países, obra que o artista chileno Jorge Selarón construiu de 1990 a 2013 ligando a Lapa a Santa Teresa.",
  t: "Chegue antes das 9h para fotos sem fila. Mantenha o celular seguro e combine com os Arcos da Lapa e o bondinho." },

{ n: "Arcos da Lapa", b: "Lapa", z: "centro", c: "marco", p: ["classico","historico","curticao","gratis"], v: 0,
  d: "O antigo Aqueduto da Carioca, concluído em 1750 para levar água ao Centro. Desde o fim do século XIX serve de viaduto para o bondinho de Santa Teresa e, à noite, é o coração da boemia carioca.",
  t: "De dia rende boas fotos; à noite, a região vira festa de rua — vá em grupo e volte de aplicativo." },

{ n: "Estádio do Maracanã", b: "Maracanã", z: "norte", c: "marco", p: ["esporte","classico","familia","estudante"], v: 2,
  d: "Inaugurado para a Copa de 1950, palco do 'Maracanaço' e da final da Copa de 2014. O tour passa por vestiários, túnel de acesso, tribuna e beira do gramado.",
  pr: "Tour R$ 94 · meia R$ 47 (2026)", h: "Tour diário das 9h às 17h em dias sem jogo",
  t: "Melhor ainda: assistir a um jogo na arquibancada. Flamengo e Fluminense mandam suas partidas ali. Metrô: estação Maracanã." },

{ n: "Lagoa Rodrigo de Freitas", b: "Lagoa", z: "sul", c: "marco", p: ["familia","casal","esporte","gratis","idoso"], v: 0,
  d: "Espelho d'água no meio da Zona Sul, cercado por 7,5 km de ciclovia e pista de caminhada, com quiosques, pedalinhos, quadras e vista para o Cristo e o Morro Dois Irmãos.",
  t: "Dê a volta de bicicleta compartilhada no fim da tarde e termine num quiosque com música ao vivo." },

{ n: "Boulevard Olímpico e Orla Conde", m: "boulevard-olimpico", b: "Centro / Porto", z: "centro", c: "marco", p: ["classico","gratis","familia","estudante","idoso"], v: 0,
  d: "Calçadão à beira da Baía na região portuária revitalizada, com o mural Etnias, de Eduardo Kobra, armazéns do porto, VLT e acesso a Museu do Amanhã, MAR, AquaRio e roda-gigante.",
  t: "Ande da Praça XV à Praça Mauá pela orla (cerca de 30 min) e volte de VLT." },

{ n: "Roda-gigante Yup Star", b: "Santo Cristo / Porto", z: "centro", c: "marco", p: ["familia","casal"], v: 2,
  d: "A maior roda-gigante da América Latina, com 88 m e 54 cabines climatizadas. A volta leva cerca de 20 minutos, com vista para o Cristo, o Museu do Amanhã, a Baía e a Ponte Rio–Niterói.",
  h: "Diariamente, durante o dia (confira o horário no site oficial)",
  t: "Compre online (costuma sair mais barato) e chegue de VLT. Moradores da cidade têm tarifa promocional." },

{ n: "Copacabana Palace", b: "Copacabana", z: "sul", c: "marco", p: ["casal","historico"], v: 3,
  d: "Hotel inaugurado em 1923, símbolo do glamour carioca, com fachada branca na Av. Atlântica e o famoso Baile do Copa no Carnaval.",
  t: "Não precisa se hospedar: reserve um almoço ou drink à beira da piscina para conhecer por dentro." },

{ n: "Sambódromo da Marquês de Sapucaí", m: "sambodromo", b: "Cidade Nova / Centro", z: "centro", c: "marco", p: ["curticao","historico","classico"], v: 2,
  d: "Passarela do Samba projetada por Oscar Niemeyer e inaugurada em 1984. Recebe os desfiles das escolas de samba e, em janeiro, os ensaios técnicos.",
  pr: "Carnaval 2027: arquibancadas R$ 250 por noite (meia R$ 125)", h: "Desfiles do Grupo Especial em 7, 8 e 9 de fevereiro de 2027",
  t: "Os ensaios técnicos de janeiro são a forma mais barata de sentir a Sapucaí. Compre ingressos só nos canais oficiais." },

{ n: "Cidade do Samba", b: "Gamboa", z: "centro", c: "marco", p: ["curticao","historico","estudante"], v: 1,
  d: "Complexo com os barracões das escolas do Grupo Especial, onde fantasias e carros alegóricos são construídos. Recebe eventos e shows ao longo do ano.",
  t: "Confira a programação nas redes oficiais antes de ir — o acesso varia conforme o evento." },

/* ---------------- PÔR E NASCER DO SOL ---------------- */
{ n: "Pôr do sol no Arpoador", m: "por-do-sol-arpoador", b: "Arpoador / Ipanema", z: "sul", c: "sol", p: ["casal","gratis","classico","esporte"], v: 0,
  d: "A pedra entre Ipanema e Copacabana é o palco do pôr do sol mais famoso do Rio: o sol desce atrás do Morro Dois Irmãos e a plateia aplaude. É também um dos berços do surf no Brasil.",
  t: "No verão, chegue 40 minutos antes do pôr do sol para garantir lugar na pedra." },

{ n: "Pôr do sol no Morro da Urca", m: "por-do-sol-morro-da-urca", b: "Urca", z: "sul", c: "sol", p: ["casal","classico","natureza","curticao"], v: 1,
  d: "O Morro da Urca (220 m), primeira parada do bondinho, é um dos melhores lugares para ver o sol se pôr atrás das montanhas da cidade, com o Cristo no horizonte e a Baía e Botafogo aos pés. Lá em cima há bares, restaurantes e eventos no fim de tarde.",
  pr: "Grátis subindo a pé pela trilha; de bondinho, com o ingresso do Parque Bondinho",
  t: "Suba pela trilha que sai da Pista Cláudio Coutinho cerca de uma hora antes do pôr do sol. Para descer de bondinho, confira valores e regras na bilheteria." },

{ n: "Pôr do sol no Vidigal", m: "por-do-sol-vidigal", b: "Vidigal", z: "sul", c: "sol", p: ["casal","curticao","gastro"], v: 2,
  d: "Do alto do Vidigal, bares em lajes têm vista das praias do Leblon, Ipanema e Arpoador, da Lagoa e das Ilhas Cagarras. Os mais conhecidos são o Mirante do Arvrão (hotel, bar e restaurante no topo do morro) e o Bar da Laje, com música ao vivo e feijoada aos sábados.",
  t: "Suba de mototáxi, van ou carro de aplicativo a partir da praça na entrada do Vidigal. Consumir ali ajuda a economia local; siga as orientações dos moradores." },

{ n: "Nascer do sol no Morro Dois Irmãos", m: "amanhecer-dois-irmaos", b: "Vidigal", z: "sul", c: "sol", p: ["natureza","casal","esporte","gratis"], v: 0,
  d: "Subir a trilha do Dois Irmãos de madrugada para ver o sol nascer sobre Ipanema, Leblon, Lagoa, Cristo e Pão de Açúcar — o céu muda de cor sobre a Zona Sul inteira. Há passeios guiados que saem antes do amanhecer.",
  t: "Comece a subir cerca de 1h30 antes do nascer do sol, com lanterna, agasalho leve e água. Vá em grupo ou com guia local." },

{ n: "Pôr do sol na Rocinha com guia morador", m: "por-do-sol-rocinha", b: "Rocinha / São Conrado", z: "sul", c: "sol", p: ["historico","estudante","casal"], v: 2,
  d: "Guias que moram na comunidade conduzem por vielas, projetos sociais e lajes com vista para São Conrado, a Pedra da Gávea e o mar, até mirantes como o do Laboriaux. A laje apelidada de 'Porta do Céu' viralizou com vídeos de drone e chega a ter filas de duas horas.",
  pr: "Tours a partir de cerca de R$ 120; vídeos de drone na 'Porta do Céu' de R$ 150 a 250",
  t: "O ponto de encontro costuma ser a saída A do Metrô São Conrado. Faça só com guia morador credenciado, não fotografe moradores sem permissão e guarde objetos de valor." },

{ n: "Veleiro ao pôr do sol na Baía de Guanabara", m: "escuna-por-do-sol", b: "Glória (saída da Marina da Glória)", z: "sul", c: "sol", p: ["casal","classico","curticao"], v: 3,
  d: "Cerca de 3 horas navegando no fim da tarde pela Baía de Guanabara, com o Pão de Açúcar, o Cristo, fortalezas históricas e Niterói ao redor, enquanto o sol se põe atrás da cidade. Muitos passeios incluem caipirinha, cerveja e petiscos; alguns fazem parada para banho.",
  h: "Saídas geralmente por volta das 15h, voltando depois do pôr do sol",
  t: "Reserve com operadora credenciada e leve um casaco leve: venta no mar depois que o sol se põe." },

/* ---------------- PRAIAS ---------------- */
{ n: "Praia de Copacabana", b: "Copacabana", z: "sul", c: "praia", p: ["classico","familia","curticao","esporte","idoso","gratis"], v: 0,
  d: "Quatro quilômetros de areia do Leme ao Forte, com o calçadão de ondas em pedra portuguesa redesenhado por Burle Marx na Av. Atlântica. Quiosques, futevôlei, Colônia de Pescadores no Posto 6 e o maior Réveillon do mundo.",
  t: "Os postos numerados servem de ponto de encontro. Leve só o essencial à areia e guarde o celular." },

{ n: "Praia de Ipanema", b: "Ipanema", z: "sul", c: "praia", p: ["classico","curticao","lgbt","casal","gratis","esporte"], v: 0,
  d: "A praia da Bossa Nova. Cada trecho tem sua turma: Posto 9 (jovem e alternativo), altura da Farme de Amoedo (ponto LGBTQIA+, com bandeira arco-íris) e trechos mais tranquilos rumo ao Leblon.",
  t: "Aplaudir o pôr do sol é tradição. Feche o dia com açaí numa casa de sucos." },

{ n: "Praia do Leblon", b: "Leblon", z: "sul", c: "praia", p: ["familia","casal","idoso","gratis"], v: 0,
  d: "Mais calma e familiar, com o Baixo Bebê (parquinho com estrutura para crianças, perto do Posto 12) e o Mirante do Leblon no fim da orla.",
  t: "Combine com almoço nos bares e restaurantes das ruas internas do bairro." },

{ n: "Praia do Leme", b: "Leme", z: "sul", c: "praia", p: ["familia","idoso","gratis"], v: 0,
  d: "Extensão tranquila de Copacabana aos pés do Morro do Leme. O Caminho dos Pescadores, sobre as pedras, é ótimo para ver o fim de tarde.",
  t: "Boa opção para quem quer menos agito e mar geralmente mais calmo." },

{ n: "Praia Vermelha", b: "Urca", z: "sul", c: "praia", p: ["familia","casal","gratis"], v: 0,
  d: "Pequena enseada de mar calmo entre o Morro da Babilônia e o Pão de Açúcar, de onde parte o bondinho. Areia grossa e avermelhada.",
  t: "Faça a Pista Cláudio Coutinho e depois dê um mergulho aqui." },

{ n: "Praia da Barra da Tijuca", b: "Barra da Tijuca", z: "oeste", c: "praia", p: ["familia","esporte","gratis"], v: 0,
  d: "Cerca de 18 km de areia larga, ciclovia e quiosques; mar mais aberto, bom para kitesurf e caminhadas longas. O trecho do Pepê é ponto de encontro de esportistas.",
  t: "Atenção às bandeiras vermelhas: o mar costuma ser mais forte que na Zona Sul." },

{ n: "Praia do Pepê", b: "Barra da Tijuca", z: "oeste", c: "praia", p: ["esporte","curticao","familia","gratis"], v: 0,
  d: "O trecho mais animado da Barra, perto do Jardim Oceânico, batizado em homenagem a Pepê, campeão de voo livre. Quiosques com sanduíche natural e açaí, kitesurf, vôlei e um pós-praia que continua nos bares da Olegário Maciel.",
  t: "Chegue de metrô (estação Jardim Oceânico) e caminhe até a areia." },

{ n: "Praia da Reserva", b: "Entre a Barra da Tijuca e o Recreio", z: "oeste", c: "praia", p: ["natureza","casal","esporte","gratis"], v: 0,
  d: "Trecho da orla entre a Barra e o Recreio que fica de frente para a restinga protegida de Marapendi: quase nenhum prédio na beira-mar, faixa de areia larga e bem menos gente que no Pepê. As ondas atraem surfistas e bodyboarders.",
  t: "Leve água e lanche, porque há poucos quiosques. O mar costuma ser forte: fique perto dos postos de guarda-vidas." },

{ n: "Prainha", b: "Recreio dos Bandeirantes", z: "oeste", c: "praia", p: ["natureza","esporte","casal"], v: 0,
  d: "Enseada cercada de Mata Atlântica num parque municipal no fim do Recreio, sem prédios à vista. Uma das praias preferidas dos surfistas.",
  t: "Vá cedo nos fins de semana (o estacionamento lota) e leve água e lanche." },

{ n: "Praia de Grumari", b: "Grumari", z: "oeste", c: "praia", p: ["natureza","casal","familia"], v: 0,
  d: "Praia selvagem numa Área de Proteção Ambiental, de areia avermelhada e mar forte, emoldurada por morros verdes e restinga.",
  t: "Pouca estrutura e sem transporte fácil: vá de carro ou aplicativo e combine com a Prainha." },

{ n: "Praia e Pedra do Pontal", b: "Recreio dos Bandeirantes", z: "oeste", c: "praia", p: ["familia","natureza","gratis"], v: 0,
  d: "No extremo do Recreio, a Pedra do Pontal se liga à areia por uma faixa que aparece na maré baixa; dá para atravessar a pé e subir a pedra.",
  t: "Consulte a tábua de marés antes de atravessar e não fique na pedra quando a maré subir." },

{ n: "Praia de São Conrado", b: "São Conrado", z: "sul", c: "praia", p: ["esporte","natureza"], v: 0,
  d: "Praia entre o Morro Dois Irmãos e a Pedra da Gávea onde pousam as asas-deltas e parapentes que decolam da Pedra Bonita.",
  t: "Ver os voos pousando no fim da manhã é um programa por si só." },

{ n: "Praia da Macumba", b: "Recreio dos Bandeirantes", z: "oeste", c: "praia", p: ["esporte","natureza"], v: 0,
  d: "Pico tradicional de surf no Recreio, com ondas constantes e escolinhas que alugam pranchas.",
  t: "Ótima para a primeira aula de surf com instrutor." },

/* ---------------- MUSEUS ---------------- */
{ n: "Museu do Amanhã", b: "Praça Mauá / Centro", z: "centro", c: "museu", p: ["estudante","familia","classico","idoso","gratis"], v: 1,
  d: "Museu de ciências projetado por Santiago Calatrava e aberto em 2015, sobre o futuro do planeta e da humanidade, com exposições interativas e painéis solares no teto. Ao redor, um jardim de esculturas gratuito.",
  pr: "R$ 40 · meia R$ 20 · grátis às terças e em feriados nacionais", h: "10h às 18h (última entrada às 17h); fechado às quartas — confira o calendário",
  t: "Reserve o ingresso gratuito de terça com antecedência: esgota rápido. Combine com o MAR, que também é grátis às terças." },

{ n: "MAR — Museu de Arte do Rio", b: "Praça Mauá / Centro", z: "centro", c: "museu", p: ["estudante","historico","gratis","casal"], v: 1,
  d: "Dois prédios unidos por uma cobertura ondulada: um palacete eclético e um antigo terminal rodoviário. Exposições sobre arte e história do Rio e terraço com vista para a Baía.",
  pr: "A partir de R$ 10 · grátis às terças", h: "Quinta a terça, das 11h às 18h",
  t: "Não deixe de subir ao terraço: a vista do Porto e do Mosteiro de São Bento é linda." },

{ n: "AquaRio", b: "Gamboa / Porto", z: "centro", c: "museu", p: ["familia","estudante","idoso"], v: 3,
  d: "O maior aquário marinho da América do Sul, com túnel submarino, tubarões, raias e tanques interativos, na região portuária.",
  t: "Há combos com BioParque e Cristo. Tudo a pé dali: Museu do Amanhã, roda-gigante e Boulevard." },

{ n: "CCBB Rio — Centro Cultural Banco do Brasil", b: "Centro", z: "centro", c: "museu", p: ["estudante","gratis","historico","idoso"], v: 0,
  d: "Prédio de 1906 com rotunda e cúpula, sede do Banco do Brasil por décadas e hoje um dos centros culturais mais visitados do país: exposições, cinema e teatro.",
  pr: "Entrada e exposições gratuitas", h: "Quarta a segunda, das 9h às 20h",
  t: "Exposições disputadas pedem retirada de senha ou agendamento — confira no site." },

{ n: "Museu Nacional (Quinta da Boa Vista)", b: "São Cristóvão", z: "norte", c: "museu", p: ["estudante","historico","familia","gratis"], v: 0,
  d: "Fundado por D. João VI em 1818, é a instituição científica mais antiga do Brasil, no Paço de São Cristóvão, antiga residência imperial. Atingido por um incêndio em 2018, está em reconstrução e abre exposições temporárias gratuitas enquanto as obras avançam; o Meteorito Bendegó resistiu ao fogo.",
  pr: "Exposições temporárias gratuitas, com ingresso retirado no Sympla",
  t: "Acompanhe as reaberturas pelo site e redes do museu; a reabertura completa do palácio está prevista para os próximos anos." },

{ n: "Museu Histórico Nacional", b: "Centro (Praça Marechal Âncora)", z: "centro", c: "museu", p: ["estudante","historico","idoso"], v: 1,
  d: "Um dos maiores acervos de história do Brasil, ocupando o antigo Arsenal de Guerra e a Fortaleza de Santiago, junto à Praça XV: carruagens, moedas, armaria e a trajetória do país.",
  t: "Combine com a Praça XV, o Paço Imperial e a Ilha Fiscal no mesmo dia." },

{ n: "Museu Nacional de Belas Artes", b: "Cinelândia / Centro", z: "centro", c: "museu", p: ["historico","estudante","gratis"], v: 0,
  d: "Grande acervo de arte brasileira do século XIX, com Victor Meirelles e Pedro Américo. Em reforma, reabriu parcialmente com galeria gratuita; a reabertura completa está prevista para o fim de 2026.",
  t: "Confira o que está aberto antes de ir e aproveite a Cinelândia ao redor." },

{ n: "Museu da República (Palácio do Catete)", b: "Catete", z: "sul", c: "museu", p: ["historico","estudante","gratis","idoso","familia"], v: 1,
  d: "Sede da Presidência de 1897 a 1960, onde morreu Getúlio Vargas em 1954. Salões decorados, objetos presidenciais e um jardim com lago e gruta aberto e gratuito.",
  h: "Museu de terça a domingo; jardim diariamente",
  t: "O jardim é um respiro no meio da cidade — ótimo para piquenique. Metrô Catete na porta." },

{ n: "MAM Rio — Museu de Arte Moderna", b: "Aterro do Flamengo", z: "centro", c: "museu", p: ["historico","estudante","casal"], v: 1,
  d: "Ícone da arquitetura modernista de Affonso Eduardo Reidy, com jardins de Burle Marx à beira da Baía. Arte moderna e contemporânea e a Cinemateca.",
  t: "Vá no fim da tarde e caminhe pelo Aterro até o Monumento aos Pracinhas." },

{ n: "IMS Rio — Instituto Moreira Salles", b: "Gávea", z: "sul", c: "museu", p: ["gratis","casal","estudante","historico"], v: 0,
  d: "Casa modernista dos anos 1950 com jardins de Burle Marx, exposições de fotografia, música e literatura, cinema e um café sob as árvores. Entrada gratuita.",
  t: "Programa perfeito para dia nublado — e um dos cafés mais bonitos da cidade." },

{ n: "Planetário da Gávea", b: "Gávea", z: "sul", c: "museu", p: ["familia","estudante"], v: 1,
  d: "Cúpulas de projeção com sessões sobre o céu e o Universo, o interativo Museu do Universo e observações com telescópio em noites programadas.",
  t: "Compre as sessões de cúpula com antecedência nos fins de semana." },

{ n: "Museu Casa do Pontal", b: "Barra da Tijuca", z: "oeste", c: "museu", p: ["familia","estudante","historico"], v: 1,
  d: "O maior museu de arte popular brasileira, com milhares de peças de artistas de todo o país — bonecos, cerâmicas e engenhocas que se movem. Sede na Barra.",
  t: "Crianças adoram as maquetes mecânicas. Reserve cerca de 2 horas." },

{ n: "Museu Bispo do Rosário Arte Contemporânea", b: "Taquara (Colônia Juliano Moreira)", z: "oeste", c: "museu", p: ["estudante","historico","gratis"], v: 0,
  d: "Guarda a obra de Arthur Bispo do Rosário, que viveu por décadas na antiga Colônia Juliano Moreira e criou ali bordados, mantos, estandartes e objetos hoje reconhecidos entre os mais importantes da arte contemporânea brasileira. O acervo tem cerca de 1.500 peças, e as exposições são gratuitas.",
  t: "Confira dias e horários nas redes do museu antes de ir. A Colônia é grande e arborizada: chegue de carro ou aplicativo." },

{ n: "Cidade das Artes Bibi Ferreira", b: "Barra da Tijuca (Av. das Américas, 5300)", z: "oeste", c: "historia", p: ["estudante","familia","casal","historico"], v: 1,
  d: "Complexo cultural inaugurado em 2013 no cruzamento das avenidas das Américas e Ayrton Senna, num prédio de concreto erguido a dez metros do chão. Recebe concertos, musicais, teatro, dança e exposições, muitas vezes com programação gratuita para crianças.",
  h: "Visita guiada com agendamento por e-mail, todos os dias das 10h às 17h (grupos de até 20 pessoas)",
  t: "Veja a programação no site oficial antes de ir: há eventos grátis e concertos com ingresso popular." },

{ n: "Museu do Samba", b: "Mangueira", z: "norte", c: "museu", p: ["historico","curticao","estudante"], v: 1,
  d: "Aos pés do Morro da Mangueira, guarda a memória dos sambistas e das escolas: fantasias, partituras, fotos e depoimentos.",
  pr: "A partir de R$ 10", h: "Terça a sábado, das 10h às 17h",
  t: "Junte com a visita a uma quadra de escola de samba em época de ensaios." },

{ n: "Museu Carmen Miranda", b: "Flamengo (Aterro)", z: "sul", c: "museu", p: ["gratis","historico","lgbt"], v: 0,
  d: "Figurinos, balangandãs, turbantes e sapatos plataforma da Pequena Notável, no Aterro do Flamengo.",
  pr: "Entrada gratuita", h: "Quarta a sexta, 11h às 17h; sábado, domingo e feriado, 12h às 17h" ,
  t: "Visita rápida e divertida — combine com um passeio pelo Aterro." },

{ n: "Museu da Vida — Fiocruz", b: "Manguinhos", z: "norte", c: "museu", p: ["estudante","familia","gratis","historico"], v: 0,
  d: "No campus da Fiocruz, o Castelo Mourisco (concluído em 1918) e espaços interativos de ciência e saúde pública. Arquitetura neomourisca única no Rio.",
  t: "Funciona em dias e horários específicos — confira a agenda e agende, principalmente para grupos escolares." },

{ n: "MAST — Museu de Astronomia", b: "São Cristóvão", z: "norte", c: "museu", p: ["estudante","familia","gratis"], v: 0,
  d: "Cúpulas e lunetas históricas do antigo Observatório Nacional e programas de observação do céu abertos ao público.",
  t: "As noites de observação dependem do tempo — confira a programação." },

{ n: "Casa de Rui Barbosa", b: "Botafogo", z: "sul", c: "museu", p: ["historico","estudante","idoso"], v: 1,
  d: "Casarão onde viveu o jurista Rui Barbosa, com biblioteca, mobiliário de época e um jardim aberto ao público na Rua São Clemente.",
  t: "O jardim é um oásis tranquilo em Botafogo." },

{ n: "Museu Chácara do Céu", b: "Santa Teresa", z: "centro", c: "museu", p: ["historico","casal"], v: 1,
  d: "Casa do colecionador Raymundo Ottoni de Castro Maya, com obras de modernistas brasileiros e europeus e aquarelas de Debret, num jardim com vista para a Baía.",
  t: "Fica colado ao Parque das Ruínas: faça os dois juntos." },

{ n: "Forte de Copacabana", b: "Copacabana", z: "sul", c: "museu", p: ["historico","familia","casal","idoso"], v: 1,
  d: "Forte de 1914 na ponta de Copacabana, hoje Museu Histórico do Exército, com canhões, vista da praia inteira e uma filial da Confeitaria Colombo.",
  t: "Café da manhã na Colombo do Forte com vista para o mar é programa clássico." },

{ n: "Espaço Cultural da Marinha e Museu Naval", m: "espaco-cultural-da-marinha", b: "Centro (Boulevard Olímpico)", z: "centro", c: "museu", p: ["historico","familia","estudante","gratis"], v: 1,
  d: "No Boulevard Olímpico, com submarino-museu e embarcações históricas; é o ponto de saída do Passeio Marítimo e da visita à Ilha Fiscal. O Museu Naval fica a poucos minutos, perto das barcas.",
  pr: "Grátis às terças (exceto feriados)",
  t: "Compre o passeio da Ilha Fiscal e aproveite o Espaço Cultural antes de embarcar." },

{ n: "Museu Aeroespacial", b: "Campo dos Afonsos", z: "oeste", c: "museu", p: ["familia","estudante","gratis"], v: 0,
  d: "No Campo dos Afonsos, berço da aviação militar brasileira, dezenas de aeronaves históricas — incluindo uma réplica do 14-Bis de Santos Dumont.",
  t: "Confira os dias de abertura antes de ir; fica longe da Zona Sul." },

{ n: "Santa Cruz histórica — Ponte dos Jesuítas e Hangar do Zeppelin", m: "santa-cruz-historica", b: "Santa Cruz", z: "oeste", c: "historia", p: ["historico","estudante","gratis"], v: 0,
  d: "O bairro foi fazenda dos jesuítas e, depois, fazenda imperial. A Ponte dos Jesuítas, do século XVIII, é tombada pelo IPHAN. Na Base Aérea fica o Hangar do Zeppelin, inaugurado em 1936 para receber os dirigíveis Graf Zeppelin e Hindenburg, um dos poucos hangares de dirigível ainda preservados no mundo.",
  h: "Ponte: visitação livre. Hangar: só nos eventos de portões abertos da Base Aérea",
  t: "Fica a cerca de 50 km do Centro. Vá de carro e emende com um almoço de frutos do mar em Pedra de Guaratiba." },

{ n: "Paço Imperial", b: "Praça XV / Centro", z: "centro", c: "museu", p: ["historico","gratis","estudante","idoso"], v: 0,
  d: "Construído em 1743 para os governadores, foi residência de D. João VI e palco do Dia do Fico (1822) e da assinatura da Lei Áurea (1888). Hoje é centro cultural com exposições.",
  t: "Comece aqui um roteiro a pé pelo Centro histórico." },

{ n: "Instituto Pretos Novos", b: "Gamboa", z: "centro", c: "museu", p: ["historico","estudante"], v: 1,
  d: "Memorial sobre o cemitério onde foram enterrados africanos escravizados recém-chegados ao Valongo, descoberto em 1996 durante uma obra numa casa da Gamboa.",
  t: "Essencial para entender a Pequena África. Muitos roteiros guiados da região passam por aqui." },

{ n: "Theatro Municipal", b: "Cinelândia / Centro", z: "centro", c: "museu", p: ["historico","casal","estudante","idoso","classico"], v: 1,
  d: "Inaugurado em 1909 e inspirado na Ópera de Paris, tem escadaria de mármore, vitrais, mosaicos e o Salão Assyrio. Recebe ópera, balé e concertos da OSB — há séries com ingressos a partir de R$ 10.",
  h: "Visitas guiadas em dias da semana e sábados (confira horários)",
  t: "Assistir a um espetáculo é a melhor forma de conhecer por dentro, e pode sair mais barato que muitas atrações." },

{ n: "Biblioteca Nacional", b: "Cinelândia / Centro", z: "centro", c: "museu", p: ["historico","estudante","gratis"], v: 0,
  d: "A maior biblioteca da América Latina, nascida da Real Biblioteca trazida por D. João VI, em prédio de 1910 na Cinelândia. Oferece visitas guiadas.",
  t: "Confira os horários das visitas guiadas e combine com o Theatro Municipal, na mesma praça." },

{ n: "Real Gabinete Português de Leitura", m: "real-gabinete", b: "Centro", z: "centro", c: "museu", p: ["historico","estudante","gratis","casal","classico"], v: 0,
  d: "Biblioteca de 1887 em estilo neomanuelino, com salão de leitura de estantes até o teto e o maior acervo de obras portuguesas fora de Portugal. Considerada uma das bibliotecas mais bonitas do mundo.",
  pr: "Entrada gratuita", h: "Dias úteis (confira o horário)",
  t: "Fica na Rua Luís de Camões, 30, a poucos passos da Praça Tiradentes. Fotos sem flash." },

{ n: "Academia Brasileira de Letras", b: "Centro", z: "centro", c: "museu", p: ["historico","estudante","gratis"], v: 0,
  d: "Funciona no Petit Trianon, réplica do palácio de Versalhes doada pela França em 1923. Promove palestras, visitas e concertos gratuitos.",
  t: "Acompanhe a agenda: há programação cultural gratuita frequente." },

/* ---------------- HISTÓRIA E ARQUITETURA ---------------- */
{ n: "Mosteiro de São Bento", b: "Centro", z: "centro", c: "historia", p: ["historico","idoso","gratis","estudante"], v: 0,
  d: "Mosteiro beneditino do século XVII, com uma das igrejas barrocas mais ricas do Brasil, inteiramente revestida de talha dourada.",
  t: "A missa de domingo de manhã com canto gregoriano é inesquecível (confira o horário). Roupas discretas." },

{ n: "Igreja da Candelária", b: "Centro", z: "centro", c: "historia", p: ["historico","gratis","idoso"], v: 0,
  d: "Uma das igrejas mais imponentes do Rio, erguida entre os séculos XVIII e XIX, com cúpula, mármores e grandes painéis, no início da Av. Presidente Vargas.",
  t: "Fica ao lado do CCBB e da Casa França-Brasil." },

{ n: "Catedral Metropolitana", b: "Centro / Lapa", z: "centro", c: "historia", p: ["historico","gratis","estudante"], v: 0,
  d: "Catedral em forma de cone, com 75 m de altura, construída de 1964 a 1979. Quatro vitrais de 64 m sobem do chão ao teto e tingem a nave de cor.",
  t: "Vá no fim da manhã, quando a luz atravessa os vitrais." },

{ n: "Convento de Santo Antônio e São Francisco da Penitência", m: "convento-santo-antonio", b: "Largo da Carioca", z: "centro", c: "historia", p: ["historico","idoso"], v: 1,
  d: "No alto do Largo da Carioca, o convento do século XVII e a Igreja da Ordem Terceira de São Francisco da Penitência, obra-prima do barroco brasileiro coberta de talha dourada.",
  t: "Suba pelo elevador ou pela ladeira a partir do Largo da Carioca." },

{ n: "Praça XV, Arco do Teles e Travessa do Comércio", m: "praca-xv", b: "Centro", z: "centro", c: "historia", p: ["historico","gratis","curticao","estudante"], v: 0,
  d: "Centro político do Brasil Colônia e Império. Pelo Arco do Teles (século XVIII) chega-se à Travessa do Comércio, cheia de bares no happy hour. Aos sábados há feira de antiguidades na praça.",
  t: "Ótimo ponto de partida: Paço Imperial, Antiga Sé, Ilha Fiscal e barcas estão ao redor." },

{ n: "Antiga Sé (N. Sra. do Carmo)", b: "Praça XV / Centro", z: "centro", c: "historia", p: ["historico","estudante"], v: 1,
  d: "Foi capela real de D. João VI e catedral do Rio; ali D. Pedro I foi coroado imperador em 1822. Interior barroco restaurado.",
  t: "Fica na Rua Primeiro de Março, junto à Praça XV." },

{ n: "Ilha Fiscal", b: "Baía de Guanabara (saída do Centro)", z: "centro", c: "historia", p: ["historico","casal","familia","estudante"], v: 2,
  d: "Castelinho neogótico de 1889 no meio da Baía, onde aconteceu o Último Baile do Império, seis dias antes da Proclamação da República. Visita guiada com travessia saindo do Espaço Cultural da Marinha.",
  h: "Quinta a domingo, saídas às 12h45, 14h15 e 15h30",
  t: "Compre antes no site indicado pela Marinha ou na bilheteria do Espaço Cultural e faça o check-in com antecedência. Depende do tempo." },

{ n: "Pequena África e Cais do Valongo", m: "pequena-africa", b: "Saúde / Gamboa", z: "centro", c: "historia", p: ["historico","estudante","gratis"], v: 0,
  d: "Região por onde chegaram centenas de milhares de africanos escravizados. O Cais do Valongo é Patrimônio Mundial da UNESCO desde 2017; perto ficam a Pedra do Sal, o Jardim Suspenso do Valongo e o Largo do Depósito.",
  t: "Faça com guia local: há roteiros afrocentrados a pé que contam histórias que não estão nas placas." },

{ n: "Morro da Conceição", b: "Saúde", z: "centro", c: "historia", p: ["historico","gratis","casal"], v: 0,
  d: "Um dos núcleos mais antigos da cidade, com ladeiras, casario colonial, ateliês de artistas e a Fortaleza da Conceição. Sobe-se a pé a partir da Pedra do Sal.",
  t: "Passeio tranquilo de dia; combine com a roda de samba da Pedra do Sal na segunda à noite." },

{ n: "Santa Teresa e o Bondinho", b: "Santa Teresa", z: "centro", c: "historia", p: ["historico","casal","classico","curticao"], v: 1,
  d: "Bairro boêmio no alto, de casarões, ateliês, bares e restaurantes em torno do Largo do Guimarães. O bondinho amarelo, elétrico desde 1896, sai do Centro e cruza os Arcos da Lapa.",
  t: "Suba de bondinho, desça a pé pela Escadaria Selarón. Fique nas ruas principais e movimentadas." },

{ n: "Parque das Ruínas", b: "Santa Teresa", z: "centro", c: "historia", p: ["gratis","casal","historico"], v: 0,
  d: "Ruínas do palacete de Laurinda Santos Lobo, mecenas da Belle Époque, transformadas em centro cultural com mirante para a Baía e o Centro. Entrada gratuita.",
  t: "Suba até a torre-mirante no fim da tarde." },

{ n: "Igreja da Glória do Outeiro", m: "igreja-da-gloria", b: "Glória", z: "sul", c: "historia", p: ["historico","casal","gratis"], v: 0,
  d: "Igrejinha barroca de 1739 no alto do Outeiro da Glória, com azulejos portugueses e vista para a Baía. Era a preferida da família imperial.",
  t: "Sobe-se por ladeira ou plano inclinado a partir da Rua do Russel." },

{ n: "Basílica de Nossa Senhora da Penha", m: "igreja-da-penha", b: "Penha", z: "norte", c: "historia", p: ["historico","gratis"], v: 0,
  d: "Santuário no alto de uma rocha, alcançado por 382 degraus esculpidos ou por plano inclinado, com vista ampla da Zona Norte. A Festa da Penha acontece em outubro.",
  t: "Vá de dia e aproveite para provar a culinária do bairro." },

{ n: "Fortaleza de São João", b: "Urca", z: "sul", c: "historia", p: ["historico","estudante","familia"], v: 1,
  d: "Marca o local onde Estácio de Sá fundou a cidade em 1565. Visitas guiadas pelo Exército contam a história da defesa da Baía.",
  t: "Combine com Praia Vermelha e Pista Cláudio Coutinho." },

{ n: "Sítio Roberto Burle Marx", b: "Barra de Guaratiba", z: "oeste", c: "historia", p: ["historico","natureza","estudante","casal"], v: 1,
  d: "Antiga casa e coleção botânica do paisagista Roberto Burle Marx, com milhares de espécies de plantas. Patrimônio Mundial da UNESCO desde 2021.",
  t: "Visitas guiadas com agendamento. Combine com a Pedra do Telégrafo e almoço de frutos do mar em Guaratiba." },

{ n: "Campo de Santana", b: "Centro", z: "centro", c: "historia", p: ["historico","gratis","familia"], v: 0,
  d: "Praça histórica onde foi proclamada a República em 1889, com árvores centenárias, lagos e cutias soltas pelo gramado.",
  t: "Fica perto da Central do Brasil; visite de dia." },

{ n: "Garota de Ipanema (antigo Bar Veloso)", b: "Ipanema", z: "sul", c: "historia", p: ["historico","classico","gastro"], v: 2,
  d: "O bar onde Tom Jobim e Vinicius de Moraes viam passar a moça que inspirou 'Garota de Ipanema' (1962). Hoje tem cardápio de petiscos e chope.",
  t: "Fica na Rua Vinicius de Moraes, a uma quadra da praia." },

/* ---------------- TRILHAS ---------------- */
{ n: "Morro Dois Irmãos", b: "Vidigal", z: "sul", c: "trilha", p: ["natureza","esporte","casal","gratis"], v: 0,
  d: "Trilha de cerca de 1,5 km e nível moderado a partir do alto do Vidigal (suba de mototáxi ou van). Em pouco mais de uma hora, vista de Ipanema, Leblon, Lagoa e Pedra da Gávea.",
  t: "Nascer ou pôr do sol são os melhores horários. Leve lanterna e água." },

{ n: "Pedra Bonita", b: "São Conrado / Alto da Boa Vista", z: "floresta", c: "trilha", p: ["natureza","familia","casal","esporte","gratis"], v: 0,
  d: "Trilha curta e acessível no Parque Nacional da Tijuca até a rampa de voo livre, a cerca de 700 m, com vista de São Conrado, Barra e Pedra da Gávea.",
  t: "Uma das melhores relações esforço-vista da cidade. Vá de carro ou aplicativo até o início." },

{ n: "Pedra da Gávea", b: "São Conrado / Barra", z: "floresta", c: "trilha", p: ["esporte","natureza"], v: 0,
  d: "Com 844 m, é um dos maiores monólitos à beira-mar do mundo. Trilha difícil, com trecho de escalaminhada (a Carrasqueira) que exige preparo, equipamento ou guia.",
  t: "Sem experiência em escalada, vá só com guia credenciado. Comece bem cedo." },

{ n: "Pedra do Telégrafo", b: "Barra de Guaratiba", z: "oeste", c: "trilha", p: ["natureza","casal","estudante","gratis"], v: 0,
  d: "Trilha de nível fácil a moderado (cerca de 1 hora) até a pedra famosa pela foto 'pendurado no abismo' — uma ilusão de ótica. Vista para a Restinga da Marambaia e praias selvagens.",
  t: "Chegue de madrugada ou muito cedo: a fila para a foto chega a horas nos fins de semana. Vá em grupo." },

{ n: "Parque Estadual da Pedra Branca — Pau da Fome", m: "pedra-branca", b: "Taquara (Jacarepaguá)", z: "oeste", c: "trilha", p: ["natureza","esporte","gratis"], v: 0,
  d: "A maior floresta urbana do país ocupa cerca de 10% do território carioca e guarda o Pico da Pedra Branca, com 1.024 m, o ponto mais alto da cidade. Da sede Pau da Fome saem trilhas para o pico (longa, mas suave, com cerca de 3 horas de subida), para a Pedra do Quilombo e para açudes e cachoeiras.",
  h: "Aberto todos os dias, das 8h às 17h",
  t: "Comece cedo e leve bastante água. Para o pico, vá com quem conhece a trilha ou com guia." },

{ n: "Pista Cláudio Coutinho e trilha do Morro da Urca", m: "trilha-claudio-coutinho", b: "Urca", z: "sul", c: "trilha", p: ["familia","idoso","natureza","gratis","esporte"], v: 0,
  d: "Caminhada plana de cerca de 1,2 km entre o mar e o Pão de Açúcar, com micos e vista da Baía. Dela sai a trilha (30–40 min) até o Morro da Urca.",
  h: "Pista aberta de manhã até o fim da tarde",
  t: "A pista é ótima para todas as idades; a trilha tem subida forte, mas curta." },

{ n: "Pico da Tijuca", b: "Alto da Boa Vista", z: "floresta", c: "trilha", p: ["natureza","esporte"], v: 0,
  d: "Ponto mais alto do Parque Nacional da Tijuca (1.021 m). Trilha de cerca de 3 km a partir do Bom Retiro, com degraus esculpidos na rocha no trecho final.",
  t: "Comece pela manhã e confira a previsão — no alto o tempo muda rápido." },

{ n: "Trilha Parque Lage → Cristo Redentor", m: "trilha-parque-lage-cristo", b: "Jardim Botânico", z: "floresta", c: "trilha", p: ["esporte","natureza"], v: 1,
  d: "Subida íngreme de cerca de 2 horas pela mata até o Corcovado, com trechos de correntes e pedras. Paga-se só o acesso ao monumento no topo.",
  pr: "Acesso ao monumento R$ 58 (2026)",
  t: "Comece cedo, em grupo, e desça de van oficial. Não é recomendada após chuva." },

{ n: "Trilha Transcarioca", b: "De Barra de Guaratiba à Urca", z: "floresta", c: "trilha", p: ["natureza","esporte"], v: 0,
  d: "A primeira trilha de longo curso do Brasil: cerca de 180 km cruzando a cidade de Barra de Guaratiba ao Pão de Açúcar, em trechos sinalizados com pegadas amarelas.",
  t: "Faça por trechos. Os mais famosos: Pedra do Telégrafo, Pedra Bonita, Pico da Tijuca e Morro da Urca." },

{ n: "Praias Selvagens de Guaratiba", m: "praias-selvagens", b: "Barra de Guaratiba", z: "oeste", c: "trilha", p: ["natureza","casal"], v: 0,
  d: "Trilhas a partir de Barra de Guaratiba levam a praias desertas como Perigoso, do Meio, Funda e do Inferno, dentro do Parque Estadual da Pedra Branca.",
  t: "Leve tudo (água, comida, lixo de volta). Sem estrutura e sem sinal de celular em alguns pontos." },

{ n: "Cachoeiras da Floresta da Tijuca", m: "cachoeiras-da-tijuca", b: "Alto da Boa Vista e Horto", z: "floresta", c: "trilha", p: ["natureza","familia","gratis","esporte"], v: 0,
  d: "A Cascatinha Taunay, com 35 m, é a maior do parque (só para contemplar, banho proibido). Seguindo a trilha, a cerca de 3 km da entrada, a Cachoeira das Almas é uma das poucas liberadas para banho. No Horto, perto do Jardim Botânico, a Cachoeira do Horto tem um poço entre duas pedras.",
  h: "Parque aberto diariamente, das 8h às 17h",
  t: "A água é gelada e o volume muda com as chuvas. Não entre em cachoeira depois de temporal (risco de cabeça d'água) e leve repelente." },

{ n: "Morro do Leme e Forte Duque de Caxias", m: "morro-do-leme", b: "Leme", z: "sul", c: "trilha", p: ["familia","natureza","historico"], v: 1,
  d: "Trilha curta e fácil por uma área de proteção ambiental até o forte, com vista de Copacabana inteira e do Pão de Açúcar. Acesso controlado pelo Exército.",
  t: "Boa trilha para iniciantes e crianças maiores." },

/* ---------------- PARQUES E JARDINS ---------------- */
{ n: "Floresta da Tijuca (Parque Nacional)", b: "Alto da Boa Vista", z: "floresta", c: "parque", p: ["natureza","familia","gratis","casal"], v: 0,
  d: "Uma das maiores florestas urbanas do mundo, replantada a partir de 1861 por ordem de D. Pedro II. Cascatinha Taunay, Capela Mayrink, Açude da Solidão, Mesa do Imperador e dezenas de trilhas.",
  t: "Vá de carro ou aplicativo até a Praça Afonso Viseu e comece pelo Centro de Visitantes." },

{ n: "Jardim Botânico", b: "Jardim Botânico", z: "sul", c: "parque", p: ["familia","natureza","casal","idoso","estudante"], v: 1,
  d: "Criado por D. João VI em 1808: aleia de palmeiras imperiais, orquidário, bromeliário, lago das vitórias-régias, Museu do Jardim Botânico e muitos micos e tucanos.",
  pr: "Residentes no Brasil ~R$ 40 · estrangeiros ~R$ 80 (meia para quem tem direito)", h: "8h às 17h (às quartas, das 11h às 17h)",
  t: "Chegue na abertura para ver os pássaros. Há passeio em carro elétrico para quem tem dificuldade de locomoção." },

{ n: "Parque Lage", b: "Jardim Botânico", z: "sul", c: "parque", p: ["gratis","casal","natureza","familia"], v: 0,
  d: "Jardins românticos aos pés do Corcovado, com grutas, lagos e a Escola de Artes Visuais. O palacete está em restauração desde 2025, mas jardins e trilhas seguem abertos.",
  pr: "Entrada gratuita",
  t: "Leve repelente. É também o início da trilha a pé para o Cristo." },

{ n: "Aterro do Flamengo", b: "Flamengo / Glória", z: "sul", c: "parque", p: ["esporte","familia","gratis","idoso"], v: 0,
  d: "Parque à beira da Baía, projeto de Reidy com paisagismo de Burle Marx, aberto em 1965: quadras, ciclovia, Marina da Glória, MAM e Monumento aos Pracinhas. Aos domingos e feriados a pista fecha para carros.",
  t: "Pedale do Aeroporto Santos Dumont até Botafogo com o Pão de Açúcar à frente." },

{ n: "Quinta da Boa Vista", b: "São Cristóvão", z: "norte", c: "parque", p: ["familia","gratis","historico"], v: 0,
  d: "Parque da antiga residência imperial, com lagos, gruta, alamedas e o Paço de São Cristóvão (Museu Nacional). Ao lado fica o BioParque.",
  t: "Piquenique clássico das famílias cariocas no fim de semana. Metrô São Cristóvão." },

{ n: "BioParque do Rio", b: "São Cristóvão", z: "norte", c: "parque", p: ["familia","estudante"], v: 2,
  d: "O antigo Zoológico do Rio, reaberto em 2021 como bioparque, com recintos de imersão e foco em conservação de espécies.",
  t: "O site oficial costuma ter promoções para crianças e combos com AquaRio e Cristo." },

{ n: "Parque Madureira", b: "Madureira", z: "norte", c: "parque", p: ["familia","gratis","esporte"], v: 0,
  d: "Grande parque da Zona Norte com praia artificial, pista de skate, ciclovia, quadras e espaços para shows. Muito movimentado nos fins de semana.",
  t: "Combine com uma visita à Portela ou ao Império Serrano em época de ensaios." },

{ n: "Parque Chico Mendes", b: "Recreio dos Bandeirantes", z: "oeste", c: "parque", p: ["familia","natureza","gratis"], v: 0,
  d: "Reserva com passarelas sobre lagoas onde é fácil ver jacarés-de-papo-amarelo, capivaras e aves da restinga.",
  t: "Ótimo para crianças. Leve repelente e água." },

{ n: "Bosque da Barra", b: "Barra da Tijuca (Av. das Américas, 6000)", z: "oeste", c: "parque", p: ["familia","natureza","gratis","esporte"], v: 0,
  d: "Parque natural municipal de cerca de 50 hectares, criado em 1983 para proteger a vegetação de restinga. Tem lagoa, trilhas, pista de caminhada, ciclovia e parquinho, e é comum ver jacarés, capivaras, aves e micos.",
  h: "Durante o dia, fechando no fim da tarde",
  t: "Bom para pedalar ou caminhar com crianças na sombra. De manhã cedo os bichos aparecem mais e o calor é menor." },

/* ---------------- MIRANTES ---------------- */
{ n: "Vista Chinesa", b: "Alto da Boa Vista", z: "floresta", c: "mirante", p: ["casal","natureza","gratis","classico"], v: 0,
  d: "Pagode de 1903 na Floresta da Tijuca, com uma das vistas mais bonitas da Lagoa, do Cristo, do Pão de Açúcar e da Zona Sul. A Mesa do Imperador fica perto.",
  t: "Vá de carro ou aplicativo, de dia, e emende com a Floresta da Tijuca." },

{ n: "Mirante Dona Marta", b: "Botafogo / Cosme Velho", z: "floresta", c: "mirante", p: ["casal","gratis","classico"], v: 0,
  d: "Mirante a 362 m no caminho do Corcovado, com vista frontal do Pão de Açúcar e da Enseada de Botafogo. Muitos consideram a melhor foto do Rio.",
  t: "Vá de táxi ou aplicativo durante o dia; evite à noite." },

{ n: "Mirante do Leblon", b: "Leblon", z: "sul", c: "mirante", p: ["casal","gratis","idoso"], v: 0,
  d: "No fim da Av. Delfim Moreira, sob o Dois Irmãos: vista de toda a orla Leblon–Ipanema–Arpoador. Lindo no pôr do sol.",
  t: "Tem quiosque com água de coco ao lado." },

{ n: "Mureta da Urca", b: "Urca", z: "sul", c: "mirante", p: ["casal","curticao","gratis","gastro"], v: 0,
  d: "Muro à beira da Baía de Guanabara onde cariocas sentam com chope e bolinho do Bar Urca para ver o sol se pôr sobre a cidade.",
  t: "Chegue antes das 17h no verão para garantir um lugar na mureta." },

{ n: "Mirante do Pedrão", b: "Laranjeiras (Santa Marta)", z: "sul", c: "mirante", p: ["casal","gratis","classico"], v: 0,
  d: "Na estrada que leva ao alto do Morro Santa Marta, na Rua Oswaldo Seabra, em Laranjeiras, tem uma das vistas mais bonitas da cidade: Baía de Guanabara, Enseada de Botafogo, Pão de Açúcar e Niterói.",
  pr: "Gratuito", h: "Aberto todos os dias; o fim de tarde é o horário mais disputado",
  t: "O acesso é só de carro ou moto (cerca de 6 minutos a partir da Rua das Laranjeiras). Vá de táxi ou aplicativo e acompanhe as redes oficiais do mirante." },

{ n: "Mirante do Pasmado", b: "Botafogo (Parque Yitzhak Rabin)", z: "sul", c: "mirante", p: ["casal","gratis","historico","classico"], v: 0,
  d: "Antiga pedreira no alto do Parque Yitzhak Rabin, quase na divisa com a Urca, com vista da Enseada de Botafogo, do Pão de Açúcar e do Corcovado. No mesmo parque fica o Memorial às Vítimas do Holocausto, de entrada gratuita.",
  pr: "Gratuito (o Memorial pede retirada de ingresso gratuito no Sympla)",
  t: "A luz é mais bonita no começo da manhã e no fim da tarde. Vá de táxi ou aplicativo — o acesso é escondido e pouco sinalizado." },

/* ---------------- SAMBA E MÚSICA AO VIVO ---------------- */
{ n: "Roda de Samba da Pedra do Sal", m: "pedra-do-sal", b: "Saúde (Pequena África)", z: "centro", c: "samba", p: ["curticao","historico","gratis","estudante","classico"], v: 0,
  d: "No berço do samba carioca, onde Tia Ciata, Donga e Pixinguinha se reuniam, acontece a roda mais famosa do Rio: gratuita, ao ar livre, nos degraus de pedra.",
  h: "Toda segunda, das 19h à meia-noite (em algumas temporadas também em outros dias)",
  t: "Leve dinheiro em espécie para as barracas, guarde o celular na multidão e volte de aplicativo." },

{ n: "Samba do Trabalhador", b: "Andaraí", z: "norte", c: "samba", p: ["curticao","historico"], v: 1,
  d: "Roda comandada por Moacyr Luz desde 2005 no Clube Renascença, às segundas à tarde. Samba de raiz e clima de quintal.",
  h: "Segundas; portas por volta das 16h30",
  t: "Chegue cedo para conseguir mesa e emende com a Pedra do Sal à noite." },

{ n: "Carioca da Gema", b: "Lapa", z: "centro", c: "samba", p: ["curticao","casal"], v: 1,
  d: "Casa de samba de referência na Av. Mem de Sá, 79, há mais de 25 anos, com música ao vivo em quase todas as noites.",
  pr: "Couvert em torno de R$ 25 a 40",
  t: "Chegue antes das 20h30 nas sextas e sábados para garantir mesa. Ingressos e mesas pelo Sympla." },

{ n: "Rio Scenarium", b: "Lapa (Rua do Lavradio)", z: "centro", c: "samba", p: ["curticao","casal","classico"], v: 1,
  d: "Casarão de três andares na Rua do Lavradio, 20, decorado com antiguidades, com samba, choro e gafieira. Aos sábados tem feijoada durante o dia.",
  pr: "Entrada em torno de R$ 30 a 60",
  t: "Compre só no Sympla oficial. Reserva de mesa não substitui o ingresso." },

{ n: "Beco do Rato", b: "Lapa", z: "centro", c: "samba", p: ["curticao","gratis","estudante"], v: 1,
  d: "Bar de samba de raiz na Rua Joaquim Silva, 11, com roda quase todas as noites e clima de quintal, geralmente sem couvert.",
  t: "Fica a minutos do Carioca da Gema: dá para fazer os dois." },

{ n: "Bip Bip", b: "Copacabana", z: "sul", c: "samba", p: ["curticao","historico","gastro"], v: 1,
  d: "Botequim minúsculo de Copacabana, famoso pelas rodas de samba e choro na calçada. Você pega a cerveja na geladeira e anota.",
  t: "Pague em dinheiro, respeite o silêncio durante as músicas e chegue cedo." },

{ n: "Circo Voador", b: "Lapa", z: "centro", c: "samba", p: ["curticao","estudante"], v: 2,
  d: "Lona sob os Arcos da Lapa, palco histórico do rock e da música brasileira desde os anos 1980, com shows nacionais e festas.",
  t: "Veja a agenda e compre antes: shows esgotam." },

{ n: "Fundição Progresso", b: "Lapa", z: "centro", c: "samba", p: ["curticao","estudante"], v: 2,
  d: "Antiga fábrica transformada em casa de shows e festas de grande porte, ao lado do Circo Voador.",
  t: "Confira a programação; muitos eventos vão até o amanhecer." },

{ n: "Blue Note Rio", b: "Copacabana", z: "sul", c: "samba", p: ["casal","curticao"], v: 2,
  d: "Clube de jazz na orla (Av. Atlântica, 1910), com shows de jazz, MPB e bossa nova e happy hour de piano bar.",
  t: "Reserve mesa para os shows da noite." },

{ n: "Ensaios das escolas de samba", m: "ensaios-escolas-de-samba", b: "Quadras de Mangueira, Salgueiro, Portela e outras", z: "norte", c: "samba", p: ["curticao","historico","classico"], v: 1,
  d: "Do segundo semestre ao Carnaval, as quadras abrem para ensaios com bateria completa, passistas e sambas-enredo do ano. Experiência popular e contagiante.",
  t: "Confira a agenda de cada escola nas redes oficiais e vá de táxi ou aplicativo." },

{ n: "Quadrilátero do Samba — Vila Isabel", m: "quadrilatero-do-samba", b: "Vila Isabel", z: "norte", c: "samba", p: ["curticao","historico","gastro"], v: 1,
  d: "O bairro de Noel Rosa e Martinho da Vila: em torno da esquina da Rua Torres Homem com a Visconde de Abaeté, bares de samba, pagode e comida de boteco formam o chamado Quadrilátero do Samba. Perto ficam o Boulevard 28 de Setembro, com calçadas que trazem partituras de sambas em pedra portuguesa, e a quadra da Unidos de Vila Isabel.",
  t: "Vá numa sexta ou sábado à noite e combine com um ensaio da Vila Isabel na temporada de Carnaval. Volte de táxi ou aplicativo." },

{ n: "Grandes casas de shows", b: "Aterro, Barra e Parque Olímpico", z: "oeste", c: "samba", p: ["curticao"], v: 3,
  d: "Para turnês nacionais e internacionais: Vivo Rio (Aterro do Flamengo), Qualistage e Farmasi Arena (Barra), além do Maracanã nos megashows.",
  t: "Pós-show na Barra: combine a volta pelo Metrô Linha 4 (Jardim Oceânico) ou aplicativo." },

/* ---------------- BALADAS E FESTAS ---------------- */
{ n: "Lapa à noite", b: "Lapa", z: "centro", c: "balada", p: ["curticao","estudante","gratis"], v: 1,
  d: "Às sextas e sábados, a Rua Joaquim Silva, os Arcos e a Av. Mem de Sá viram uma festa de rua, com ambulantes, música e casas de samba e forró lado a lado.",
  t: "Leve pouco dinheiro, ande em grupo pelas ruas movimentadas e volte de aplicativo." },

{ n: "Rua do Senado", b: "Centro (perto da Lapa)", z: "centro", c: "balada", p: ["curticao","gastro","historico","estudante"], v: 2,
  d: "Eleita pela revista Time Out a rua mais 'cool' do mundo em 2025: casarões, antiquários, bares centenários e restaurantes novos. Destaques: o Armazém Senado (1907), com rodas de samba nos fins de semana, a Destilaria Maravilha, que produz gin e cachaça num casarão e vira festa com DJs à noite, e restaurantes como Lilia e Labuta.",
  t: "Fica entre a Lapa, a Rua do Lavradio e a Praça Tiradentes: dá para emendar tudo a pé. Melhor de sexta a domingo." },

{ n: "Bares da Barra — Olegário Maciel", m: "bares-da-barra", b: "Barra da Tijuca (Jardim Oceânico)", z: "oeste", c: "balada", p: ["curticao","gastro","estudante"], v: 2,
  d: "A avenida de cerca de 750 m que liga o Jardim Oceânico à Praia do Pepê concentra a vida boêmia da Barra: bares de chope, pós-praia, roda de samba e casas de música eletrônica. Clássicos como o Bar do Oswaldo e o Bar do Elias dividem a rua com novidades.",
  t: "Fácil de chegar pelo metrô Jardim Oceânico. Fique nos trechos movimentados e volte de aplicativo." },

{ n: "Rua Farme de Amoedo", b: "Ipanema", z: "sul", c: "balada", p: ["lgbt","curticao","gastro"], v: 2,
  d: "Rua de bares e restaurantes que termina no trecho da praia com a bandeira arco-íris — o ponto LGBTQIA+ mais conhecido do Rio, cheio no fim de tarde e nos fins de semana.",
  t: "Emende a praia com um drink nos bares da rua ao entardecer." },

{ n: "Fosfobox", b: "Copacabana", z: "sul", c: "balada", p: ["curticao","lgbt","estudante"], v: 2,
  d: "Clube no subsolo da Rua Siqueira Campos, 143, referência em música eletrônica, indie e festas alternativas.",
  t: "Pertinho do Metrô Siqueira Campos. Confira as festas da semana nas redes." },

{ n: "Comuna", b: "Botafogo", z: "sul", c: "balada", p: ["curticao","estudante","lgbt"], v: 2,
  d: "Espaço multicultural na Rua Sorocaba, 585, com bar, galeria e festas que vão do techno à música brasileira.",
  t: "Ótimo para começar a noite em Botafogo." },

{ n: "Fonte (antiga Casa da Matriz)", b: "Botafogo", z: "sul", c: "balada", p: ["curticao","estudante"], v: 1,
  d: "A antiga Casa da Matriz, reaberta com novo nome: noites de indie, pop rock e emo, como a Indie Rock Club, com drinques baratos.",
  t: "Ingressos pelo link oficial nas redes; chegue cedo para pagar menos." },

{ n: "Galeria Café", b: "Ipanema", z: "sul", c: "balada", p: ["lgbt","curticao"], v: 2,
  d: "Balada LGBTQIA+ em dois andares, com pop, funk e música latina. A entrada varia conforme a festa da semana.",
  t: "Programação divulgada semanalmente nas redes sociais." },

{ n: "Quartinho Bar", b: "Botafogo", z: "sul", c: "balada", p: ["curticao","estudante","gratis"], v: 1,
  d: "Matinê de música brasileira às quintas, a partir das 19h; depois das 22h30 as portas se fecham e o lugar vira um 'inferninho' animado. Entrada gratuita.",
  t: "Vá cedo: lota rápido." },

{ n: "Bosque Bar", b: "Jockey Club / Gávea", z: "sul", c: "balada", p: ["curticao","casal"], v: 3,
  d: "Bar-balada no Jockey Club, com vista para o Cristo, mais de 40 drinques e festa de quinta a domingo até tarde. Perfil mais caro.",
  t: "Programação nas redes; vá arrumado." },

{ n: "Lapa 40°", b: "Lapa", z: "centro", c: "balada", p: ["curticao","estudante"], v: 1,
  d: "Casarão na Rua Riachuelo, 97, com mesas de sinuca e palcos de samba, pagode e outros ritmos para dançar.",
  t: "Boa opção para grupos com gostos diferentes." },

{ n: "Rua São Francisco da Prainha", b: "Saúde", z: "centro", c: "balada", p: ["curticao","gratis","estudante"], v: 1,
  d: "Rua aos pés da Pedra do Sal cheia de bares e barracas de caipirinha e drinques baratos — o esquenta perfeito, com música do pop ao funk.",
  t: "Vá com amigos e volte de aplicativo." },

{ n: "Baixo Gávea", b: "Gávea", z: "sul", c: "balada", p: ["curticao","estudante"], v: 2,
  d: "A Praça Santos Dumont e arredores são ponto de encontro universitário, com bares lotados na calçada, principalmente de quinta a sábado.",
  t: "Comece com um chope e termine na pizzaria do Leblon, ali perto." },

{ n: "Rua Arnaldo Quintela", b: "Botafogo", z: "sul", c: "balada", p: ["curticao","estudante","gastro"], v: 2,
  d: "Uma das ruas mais animadas do polo de bares de Botafogo, com mesas na calçada, cervejarias e botecos de público jovem. Ao redor, a Voluntários da Pátria e a Rua Nelson Mandela completam o circuito.",
  t: "A poucos minutos do metrô Botafogo; lota de quinta a sábado." },

/* ---------------- BARES E BOTECOS ---------------- */
{ n: "Bar Urca", b: "Urca", z: "sul", c: "boteco", p: ["gastro","casal","curticao","classico"], v: 2,
  d: "Desde 1939 na Urca, famoso pelo bolinho de bacalhau e pelo chope tomado na mureta em frente à Baía.",
  t: "Peça no balcão e atravesse a rua para a mureta no pôr do sol." },

{ n: "Bar do Omar", b: "Santo Cristo (Morro do Pinto)", z: "centro", c: "boteco", p: ["gastro","curticao","casal"], v: 1,
  d: "Boteco no alto do Morro do Pinto com vista premiada do Centro, do Porto e do Cristo. Coleciona prêmios por hambúrguer e petiscos, já esteve entre os melhores do Comida di Buteco e recebe rodas de samba concorridas. Entrada gratuita.",
  h: "Qui e sex, 17h13 à 0h13; sáb, 15h13 à 0h13; dom, 15h13 às 23h13",
  t: "Fica na Rua Sara, 114. Chegue antes do pôr do sol para pegar mesa na varanda e vá de táxi ou aplicativo." },

{ n: "Bar da Laje", b: "Vidigal", z: "sul", c: "boteco", p: ["curticao","casal","gastro"], v: 2,
  d: "Bar-restaurante no alto do Vidigal, aberto em 2014, com uma das vistas mais famosas do Rio: Ipanema, Leblon e o mar aberto. Serve feijoada, tem música ao vivo nos fins de semana, ganhou uma nova laje no topo e foi reconhecido por lei como ponto turístico oficial da cidade.",
  pr: "Em dias de show a entrada é cobrada (ingressos pelo Sympla)",
  t: "Suba de mototáxi ou de van a partir da entrada do Vidigal. Vá de dia para ver a paisagem com luz e respeite as regras da casa sobre fotos e drones." },

{ n: "Jobi", b: "Leblon", z: "sul", c: "boteco", p: ["gastro","curticao"], v: 2,
  d: "Botequim aberto em 1956, ponto da boemia do Leblon que vai até de madrugada; chope cremoso e petiscos clássicos.",
  t: "Fique no balcão: é onde o Jobi acontece." },

{ n: "Bracarense", b: "Leblon", z: "sul", c: "boteco", p: ["gastro"], v: 2,
  d: "Clássico do Leblon com balcão disputado e o famoso bolinho de aipim com camarão.",
  t: "Lota depois da praia nos fins de semana — chegue cedo." },

{ n: "Bar Luiz", b: "Centro (Rua da Carioca)", z: "centro", c: "boteco", p: ["gastro","historico"], v: 2,
  d: "Na Rua da Carioca desde 1887, com chope gelado e cozinha alemã: salsichão, kassler e salada de batata.",
  t: "Almoço no Centro com mais de um século de história." },

{ n: "Armazém Senado", b: "Centro / Lapa", z: "centro", c: "boteco", p: ["gastro","historico","curticao"], v: 1,
  d: "Armazém de 1907 na Av. Gomes Freire que virou bar sem perder as prateleiras antigas; tombado como patrimônio cultural carioca.",
  t: "Happy hour concorrido nas sextas." },

{ n: "Nova Capela", b: "Lapa", z: "centro", c: "boteco", p: ["gastro","curticao","historico"], v: 2,
  d: "Restaurante-boteco da Av. Mem de Sá, 96, aberto desde 1903, famoso pelo cabrito assado e pela cozinha que funciona até tarde.",
  t: "O fechamento natural de uma noite de samba na Lapa." },

{ n: "Bar do Momo", b: "Tijuca", z: "norte", c: "boteco", p: ["gastro"], v: 2,
  d: "Há mais de 50 anos na Tijuca, coleciona prêmios com petiscos criativos e é parada obrigatória da boemia da Zona Norte.",
  t: "Vá num sábado à tarde e prove os campeões de concurso." },

{ n: "Aconchego Carioca", b: "Praça da Bandeira", z: "norte", c: "boteco", p: ["gastro"], v: 2,
  d: "Criou o bolinho de feijoada, hoje copiado em todo o Brasil, e tem uma das maiores cartas de cervejas da cidade.",
  t: "Peça o bolinho de feijoada com couve — é obrigatório." },

{ n: "Velho Adonis", b: "Benfica", z: "norte", c: "boteco", p: ["gastro","historico"], v: 2,
  d: "Botequim de tradição portuguesa tombado como patrimônio carioca, com bolinho de bacalhau, empadas e pratos fartos.",
  t: "Combine com a Cadeg, ali perto, num sábado." },

{ n: "Bode Cheiroso", b: "Tijuca", z: "norte", c: "boteco", p: ["gastro"], v: 2,
  d: "Tradição na Tijuca: feijoada, rabada com agrião, pernil com maionese e a 'barra de cereal' de barriga de porco.",
  t: "Vá com fome e divida os pratos." },

{ n: "Cachambeer", b: "Cachambi", z: "norte", c: "boteco", p: ["gastro"], v: 2,
  d: "Fundado em 2002, pioneiro do polo da Rua Cachambi e reconhecido como patrimônio cultural carioca, famoso pela costela no bafo.",
  t: "A costela demora — peça logo ao chegar." },

{ n: "Bar Lagoa", b: "Lagoa", z: "sul", c: "boteco", p: ["gastro","historico","casal"], v: 2,
  d: "Bar art déco de 1934 à beira da Lagoa, com culinária alemã, chope e garçons de paletó.",
  t: "Mesas da varanda com vista para a Lagoa no fim de tarde." },

{ n: "Adega Pérola", b: "Copacabana", z: "sul", c: "boteco", p: ["gastro"], v: 2,
  d: "Balcão com dezenas de petiscos à vista — polvo, sardinha, berinjela, pimentões — servidos em porções para beliscar.",
  t: "Peça vários pratinhos e um vinho da casa." },

{ n: "Bafo da Prainha", b: "Saúde", z: "centro", c: "boteco", p: ["gastro","curticao"], v: 2,
  d: "No Largo de São Francisco da Prainha, bar com petiscos, samba e clima de rua na Pequena África.",
  t: "Esquenta ideal antes da Pedra do Sal na segunda." },

{ n: "Academia da Cachaça", b: "Leblon", z: "sul", c: "boteco", p: ["gastro","casal"], v: 2,
  d: "Centenas de rótulos de cachaça e uma das feijoadas mais tradicionais da cidade.",
  t: "Peça ajuda ao garçom para uma degustação de cachaças artesanais." },

{ n: "Belmonte", b: "Flamengo e outras unidades", z: "sul", c: "boteco", p: ["gastro","curticao"], v: 2,
  d: "Rede de botecos nascida no Flamengo, conhecida pelas empadas e pelo chope gelado.",
  t: "A unidade original do Flamengo tem o clima mais tradicional." },

{ n: "Pavão Azul", b: "Copacabana", z: "sul", c: "boteco", p: ["gastro"], v: 1,
  d: "Pé-sujo concorrido de Copacabana, famoso pelas pataniscas de bacalhau e mesas na calçada.",
  t: "Barato e honesto: ótimo para grupos." },

{ n: "Amarelinho da Cinelândia", b: "Cinelândia / Centro", z: "centro", c: "boteco", p: ["historico","curticao"], v: 2,
  d: "Bar tradicional com mesas na praça, de frente para o Theatro Municipal e a Câmara Municipal.",
  t: "Chope pós-espetáculo no Theatro." },

/* ---------------- LANCHONETES E COMIDINHAS ---------------- */
{ n: "Confeitaria Colombo", b: "Centro (Rua Gonçalves Dias)", z: "centro", c: "lanche", p: ["classico","historico","idoso","casal","gastro"], v: 2,
  d: "Confeitaria de 1894 com espelhos belgas, vitrais e doces portugueses — um dos cafés mais bonitos do mundo. Tem filial no Forte de Copacabana.",
  t: "Vá no meio da manhã, em dia de semana, para evitar fila. Peça pastel de nata." },

{ n: "Cervantes", b: "Copacabana", z: "sul", c: "lanche", p: ["curticao","gastro","estudante"], v: 1,
  d: "Clássico de Copacabana famoso pelo sanduíche de pernil com abacaxi; aberto até a madrugada.",
  t: "A saideira de quem sai da balada na Zona Sul." },

{ n: "Galeto Sat's", b: "Copacabana", z: "sul", c: "lanche", p: ["curticao","gastro"], v: 1,
  d: "Balcão que serve galeto na brasa, coraçãozinho e farofa até altas horas.",
  t: "Peça o coraçãozinho com o chope." },

{ n: "Biscoito Globo e mate na praia", m: "biscoito-globo-e-mate", b: "Todas as praias", z: "sul", c: "lanche", p: ["classico","estudante","familia","gratis"], v: 1,
  d: "O lanche oficial da praia carioca: biscoito de polvilho Globo (doce ou salgado) e mate gelado com limão vendido pelos ambulantes.",
  t: "Pague em dinheiro ou Pix e combine o preço antes." },

{ n: "Casas de suco", b: "Zona Sul", z: "sul", c: "lanche", p: ["familia","estudante","gastro"], v: 1,
  d: "Em cada esquina: sucos de frutas brasileiras, açaí na tigela e sanduíches naturais. Clássicos: Polis Sucos (Ipanema) e Bibi Sucos (Leblon).",
  t: "Prove sucos de caju, cajá, cupuaçu e graviola." },

{ n: "Bob's de Copacabana", b: "Copacabana", z: "sul", c: "lanche", p: ["estudante","familia"], v: 1,
  d: "A primeira rede de fast-food do Brasil nasceu em Copacabana, em 1952. O milk-shake de Ovomaltine é o clássico.",
  t: "Curiosidade histórica com preço de lanche." },

{ n: "Rotisseria Sírio Libanesa", b: "Largo do Machado", z: "sul", c: "lanche", p: ["estudante","gastro","gratis"], v: 1,
  d: "Esfirras, quibes e kaftas baratos e bem servidos, com fila de estudantes e trabalhadores.",
  t: "Um dos melhores custo-benefício da cidade." },

{ n: "Casa Paladino", b: "Centro", z: "centro", c: "lanche", p: ["historico","gastro","estudante"], v: 1,
  d: "Armazém-bar de 1906 com prateleiras antigas, omeletes e sanduíches baratos no almoço.",
  t: "Peça a omelete de bacalhau e um chope." },

{ n: "Pizzaria Guanabara", b: "Leblon", z: "sul", c: "lanche", p: ["curticao","estudante"], v: 2,
  d: "Aberta até de madrugada, é o ponto clássico de fim de noite no Leblon.",
  t: "Depois das 2h, a fila é parte da experiência." },

{ n: "Sorveterias da orla", b: "Zona Sul", z: "sul", c: "lanche", p: ["familia","estudante"], v: 1,
  d: "Para refrescar: Sorvete Itália (com seus cascões gigantes) e Mil Frutas (sabores de frutas brasileiras).",
  t: "Ótimo depois do pôr do sol no Arpoador." },

{ n: "Momo Gelato (Copacabana Palace)", m: "momo-gelato", b: "Copacabana", z: "sul", c: "lanche", p: ["familia","casal","gastro"], v: 1,
  d: "A maior unidade da gelateria carioca fica no próprio Copacabana Palace, com varanda, de 24 a 32 sabores de gelato por dia, tortas de gelato, waffles, cafés e drinques — inclusive com o espumante da casa. Há também lojas em Ipanema e na Rua Dias Ferreira, no Leblon.",
  t: "Um jeito gostoso e barato de sentir o clima do Copa sem se hospedar." },

{ n: "Kurtos Rio — Kürtős com sorvete", m: "kurtos", b: "Copacabana (Rua Rodolfo Dantas, 90, ao lado do Copacabana Palace)", z: "sul", c: "lanche", p: ["familia","casal","gastro","estudante"], v: 1,
  d: "Doceria que trouxe para o Rio o kürtőskalács, o \"chimney cake\" húngaro: uma massa doce enrolada num cilindro, assada girando e caramelizada no açúcar, que sai em forma de canudo crocante por fora e macio por dentro. Ali ele vira casquinha para o sorvete, com versões como Nutella, pistache, doce de leite e banoffee, além do clássico com açúcar e canela.",
  t: "Fica a uma quadra da praia: peça o kürtős com sorvete e coma andando até a areia, em frente ao Copacabana Palace." },

{ n: "Cadeg — Mercado de Benfica", b: "Benfica", z: "norte", c: "lanche", p: ["gastro","familia"], v: 2,
  d: "Mercado municipal com flores, bacalhau, queijos e vinhos portugueses. Aos sábados vira festa, com almoço português e música.",
  t: "Vá no sábado na hora do almoço." },

/* ---------------- RESTAURANTES ---------------- */
{ n: "Churrascarias de rodízio", m: "churrascarias", b: "Botafogo e Copacabana", z: "sul", c: "restaurante", p: ["gastro","familia"], v: 3,
  d: "Rodízio de carnes à moda gaúcha: Fogo de Chão (Botafogo, com vista para a enseada e o Pão de Açúcar) e a tradicional Churrascaria Palace (Copacabana).",
  t: "Vá com fome e use o cartão verde/vermelho para controlar os espetos." },

{ n: "Feijoada carioca", b: "Ipanema, Leblon e Lapa", z: "sul", c: "restaurante", p: ["gastro","classico"], v: 2,
  d: "Prato de sábado: Casa da Feijoada (Ipanema, serve todos os dias), Academia da Cachaça (Leblon) e as feijoadas com samba do Rio Scenarium.",
  t: "Acompanhe com caipirinha e laranja; a feijoada de 23 de abril (São Jorge) é tradição." },

{ n: "Aprazível", b: "Santa Teresa", z: "centro", c: "restaurante", p: ["casal","gastro"], v: 3,
  d: "Restaurante numa casa no alto de Santa Teresa, com cozinha brasileira contemporânea e mesas no jardim com vista para a Baía.",
  t: "Reserve para o pôr do sol." },

{ n: "Quiosques da orla", b: "Copacabana a Leblon", z: "sul", c: "restaurante", p: ["gastro","curticao","familia"], v: 2,
  d: "Os quiosques da Av. Atlântica e de Ipanema servem petiscos, água de coco e chope, muitos com música ao vivo à noite.",
  t: "Confira preços no cardápio antes de pedir." },

{ n: "Rua Dias Ferreira", b: "Leblon", z: "sul", c: "restaurante", p: ["gastro","casal","curticao"], v: 3,
  d: "A primeira rua aberta no Leblon virou a vitrine gastronômica do bairro: japoneses como o Sushi Leblon (citado pelo Guia Michelin), italianos, carnes, bares de vinho e a gelateria Momo, tudo em poucas quadras.",
  t: "À noite as calçadas lotam; reserve nos restaurantes mais concorridos." },

{ n: "Restaurantes do Leblon", b: "Leblon", z: "sul", c: "restaurante", p: ["gastro","casal","familia"], v: 3,
  d: "Um dos bairros com mais restaurantes por metro quadrado do Rio: além da Dias Ferreira, a Av. Ataulfo de Paiva e as ruas transversais reúnem alta gastronomia, botecos clássicos como Jobi e Bracarense, pizzarias de madrugada e o Shopping Leblon.",
  t: "Combine com o pôr do sol no Mirante do Leblon." },

{ n: "Restaurantes de Ipanema", b: "Ipanema", z: "sul", c: "restaurante", p: ["gastro","casal","lgbt"], v: 2,
  d: "Entre a praia e a Lagoa, Ipanema mistura casas de suco, botecos de esquina e restaurantes de todas as cozinhas. Clássicos: Casa da Feijoada, o bar Garota de Ipanema e as gelaterias e cafés das ruas internas.",
  t: "Depois da praia, as ruas perto da Praça General Osório e da Farme de Amoedo são as mais animadas." },

{ n: "Restaurantes do Jardim Botânico", b: "Jardim Botânico / Horto", z: "sul", c: "restaurante", p: ["gastro","casal","familia"], v: 3,
  d: "Casarões históricos viraram restaurantes charmosos, principalmente na Rua Pacheco Leão, colada ao Jardim Botânico: Casa Horto, Gonza e a padaria francesa La Bicyclette estão entre os endereços queridos do bairro.",
  t: "Almoce depois de visitar o Jardim Botânico — a Pacheco Leão fica ao lado do portão do Horto." },

{ n: "Restaurantes de Botafogo", b: "Botafogo", z: "sul", c: "restaurante", p: ["gastro","casal","estudante"], v: 2,
  d: "Botafogo virou um dos polos gastronômicos mais criativos do Rio, de botecos e cervejarias a restaurantes autorais premiados, como o Lasai, no Largo dos Leões. No Botafogo Praia Shopping, vários restaurantes têm vista direta para o Pão de Açúcar.",
  t: "Para comer com vista sem gastar muito, suba aos andares de restaurantes do Botafogo Praia Shopping." },

{ n: "Terra Brasilis", b: "Urca (Praia Vermelha)", z: "sul", c: "restaurante", p: ["gastro","casal","familia","classico"], v: 2,
  d: "Restaurante de cozinha brasileira no Círculo Militar da Praia Vermelha, na Praça General Tibúrcio, com janelões de frente para a enseada e o bondinho subindo o Pão de Açúcar. Tem um ambiente com bufê a quilo e salões à la carte.",
  t: "Ótimo para almoçar antes ou depois do bondinho. Peça mesa na janela; em dias cheios há fila." },

/* ---------------- COMPRAS E FEIRAS ---------------- */
{ n: "Saara", b: "Centro", z: "centro", c: "compras", p: ["estudante","gratis","curticao"], v: 1,
  d: "Centenas de lojas populares nas ruas estreitas entre a Uruguaiana e a Praça da República: fantasias de Carnaval, tecidos, artigos de festa e utilidades a preço baixo.",
  t: "Melhor nos dias úteis; no pré-Carnaval vira um formigueiro. Cuidado com bolsas." },

{ n: "Feira Hippie de Ipanema", b: "Ipanema (Praça General Osório)", z: "sul", c: "compras", p: ["familia","gratis","classico"], v: 1,
  d: "Aos domingos, desde 1968: artesanato, couro, quadros, moda e comidas típicas, como acarajé.",
  h: "Domingos, das 7h às 19h aprox.",
  t: "Metrô General Osório na porta." },

{ n: "Feira de São Cristóvão", b: "São Cristóvão", z: "norte", c: "compras", p: ["gastro","curticao","familia","historico"], v: 1,
  d: "Centro Luiz Gonzaga de Tradições Nordestinas: cerca de 700 barracas de comida e artesanato do Nordeste, forró ao vivo e karaokê à noite.",
  pr: "Entrada ~R$ 10", h: "Terça a quinta, 10h às 18h; sexta e sábado até de madrugada; domingo até 20h (confira)",
  t: "Prove baião de dois, carne de sol e tapioca. Nas noites de sábado, forró até tarde." },

{ n: "Feira do Rio Antigo", b: "Lapa (Rua do Lavradio)", z: "centro", c: "compras", p: ["historico","casal"], v: 1,
  d: "No primeiro sábado do mês, a Rua do Lavradio vira feira de antiguidades, móveis, discos e artes, com música nos bares.",
  t: "Confira a data do mês nas redes antes de ir." },

{ n: "Feira de Antiguidades da Praça XV", m: "feira-praca-xv", b: "Centro", z: "centro", c: "compras", p: ["historico"], v: 1,
  d: "Aos sábados, sob o viaduto e na praça, barracas de discos, louças, moedas e objetos antigos.",
  t: "Chegue cedo para os melhores achados." },

{ n: "Botafogo Praia Shopping", b: "Botafogo", z: "sul", c: "compras", p: ["familia","idoso","casal","gratis"], v: 2,
  d: "Shopping na Praia de Botafogo, aberto em 1999, cujos andares de alimentação têm uma das vistas mais bonitas do Pão de Açúcar e da Enseada de Botafogo — o terraço funciona como mirante gratuito.",
  t: "Vá no fim da tarde: o happy hour com vista é concorrido. Metrô Botafogo a 5 minutos." },

{ n: "Shopping Rio Sul", b: "Botafogo", z: "sul", c: "compras", p: ["familia","idoso"], v: 2,
  d: "Tradicional shopping de Botafogo, junto ao túnel para Copacabana, com centenas de lojas, cinemas e praça de alimentação. Fica perto do Pão de Açúcar.",
  t: "Bom refúgio em dia de chuva ou de calor forte." },

{ n: "Shopping Leblon", b: "Leblon", z: "sul", c: "compras", p: ["familia","casal"], v: 3,
  d: "Shopping sofisticado do Leblon, com grifes, livraria, cinemas e restaurantes, a poucos minutos da Lagoa.",
  t: "Combine com a Lagoa ou a Rua Dias Ferreira." },

{ n: "VillageMall", b: "Barra da Tijuca", z: "oeste", c: "compras", p: ["casal","familia"], v: 3,
  d: "Shopping de luxo da Barra, com grifes internacionais, restaurantes e cinema em ambiente amplo e tranquilo.",
  t: "Fica ao lado de outros shoppings da Av. das Américas — dá para fazer um circuito." },

{ n: "BarraShopping", b: "Barra da Tijuca", z: "oeste", c: "compras", p: ["familia","idoso","estudante"], v: 2,
  d: "O gigante da Barra, com centenas de lojas, cinemas, ampla praça de alimentação e atrações para crianças.",
  t: "Ótimo para dias de chuva com a família." },

/* ---------------- PASSEIOS E EXPERIÊNCIAS ---------------- */
{ n: "Ilha da Gigóia", b: "Barra da Tijuca (Jardim Oceânico)", z: "oeste", c: "passeio", p: ["casal","familia","gastro","natureza","gratis"], v: 1,
  d: "Ilha habitada no meio da Lagoa da Tijuca, sem carros, com ruelas, casas coloridas, pousadas e restaurantes à beira d'água com vista para a Pedra da Gávea — a 'Veneza carioca'. A travessia de barco leva poucos minutos.",
  pr: "Travessia de barco por poucos reais; até os restaurantes, combine o valor com o barqueiro",
  t: "Desça na estação Jardim Oceânico do metrô e procure os barqueiros no atracadouro ao lado. Dá para pagar um barqueiro para dar a volta na ilha." },

{ n: "Pedra de Guaratiba e o polo de frutos do mar", m: "pedra-de-guaratiba", b: "Pedra de Guaratiba e Barra de Guaratiba", z: "oeste", c: "passeio", p: ["gastro","casal","natureza","historico"], v: 2,
  d: "Vila de pescadores na Baía de Sepetiba, a cerca de 60 km do Centro, com barcos, casario simples e pôr do sol sobre a Restinga da Marambaia. Junto com Barra de Guaratiba forma um polo de restaurantes de peixes e frutos do mar, como o Bira, com mesas de frente para a restinga.",
  t: "Reserve os restaurantes mais famosos (o Bira atende só com reserva). A praia de Pedra de Guaratiba não é indicada para banho; para mergulho, vá à Prainha ou a Grumari." },

{ n: "Point de Grumari", b: "Grumari (Estrada do Grumari, 2710)", z: "oeste", c: "restaurante", p: ["gastro","casal","familia"], v: 3,
  d: "Restaurante de frutos do mar aberto em 1992 no alto da estrada entre Grumari e Guaratiba, com janelões para a mata e o mar. O carro-chefe são as moquecas, como a de lagosta com camarões grandes.",
  h: "Almoço e fim de tarde, das 11h30 às 19h",
  t: "Emende com uma manhã em Grumari ou na Prainha e uma visita ao Sítio Burle Marx. Só se chega de carro." },

{ n: "Polo gastronômico de Vargem Grande", m: "vargem-grande", b: "Vargem Grande (Estrada dos Bandeirantes)", z: "oeste", c: "restaurante", p: ["gastro","familia","natureza"], v: 2,
  d: "Bairro com clima de cidade do interior, ao pé do Maciço da Pedra Branca. Ao longo da Estrada dos Bandeirantes se espalham restaurantes de comida caseira e mineira, frutos do mar e feijoada, muitos com quintal e mesas ao ar livre. As cachoeiras do bairro ficam a uma caminhada de distância.",
  t: "Vá no almoço de sábado ou domingo e reserve o fim da manhã para um banho de cachoeira." },

{ n: "Passeio de lancha nas Ilhas Tijucas", m: "ilhas-tijucas", b: "Saída da Barra da Tijuca (Ilha da Coroa)", z: "oeste", c: "passeio", p: ["natureza","esporte","casal","familia"], v: 3,
  d: "Arquipélago desabitado a poucos quilômetros da Barra. Os passeios de lancha duram cerca de 3 horas, com paradas para banho e snorkel em águas claras, chance de ver tartarugas e volta pelos canais da Barra, onde aparecem jacarés e capivaras. Também dá para ir de stand up paddle com guia (cerca de 40 minutos de remada).",
  pr: "Passeios de lancha a partir de cerca de US$ 85 por pessoa",
  t: "O horário de saída muda com maré e vento; em mar agitado, algumas empresas transferem a saída para a Urca." },

{ n: "Jogo no Maracanã com guia", m: "jogo-no-maracana", b: "Maracanã", z: "norte", c: "passeio", p: ["esporte","curticao","classico","familia"], v: 3,
  d: "Pacotes com ingresso, guia e transporte chegam ao estádio com antecedência para ver as torcidas montarem bandeirões, mosaicos e charangas. O guia explica os cantos, os rituais e as rivalidades dos clássicos cariocas.",
  pr: "Pacotes a partir de cerca de R$ 430 a 450 por pessoa",
  t: "Os jogos exigem cadastro biométrico algumas horas antes da partida — faça logo após comprar. Na dúvida sobre para quem torcer, vá de roupa neutra." },

{ n: "Tour gastronômico na Pequena África", m: "tour-gastronomico-pequena-africa", b: "Saúde e Gamboa (saída da Praça Mauá)", z: "centro", c: "passeio", p: ["historico","gastro","estudante"], v: 3,
  d: "Caminhadas com guias especializados em herança afro-brasileira, saindo da Praça Mauá ou do MAR, que unem a história do Valongo e do samba a paradas em restaurantes de chefs negros e pratos afro-brasileiros. Alguns roteiros terminam na roda da Pedra do Sal.",
  pr: "Em geral de US$ 80 a 130 por pessoa, conforme o pacote",
  t: "Prefira guias e empresas da própria região. Há também o circuito 'Caminhos da Tia Ciata', conduzido por descendentes da matriarca do samba." },

{ n: "Aula de samba no pé", m: "aula-de-samba", b: "Copacabana, Ipanema e Botafogo", z: "sul", c: "passeio", p: ["curticao","estudante","casal","lgbt"], v: 2,
  d: "Aulas de uma hora para iniciantes ensinam o passo básico, a postura e a história do samba, em escolas como a Bezerra Dance (Copacabana) e a Rio Samba Dancer (Ipanema). Algumas experiências terminam numa roda de samba com música ao vivo.",
  pr: "Aula em grupo a partir de cerca de R$ 100 a 150",
  t: "Faça a aula no começo da viagem e estreie o passo na Pedra do Sal ou num ensaio de escola de samba." },

{ n: "Ilha de Paquetá", b: "Baía de Guanabara", z: "centro", c: "passeio", p: ["familia","casal","historico","gratis"], v: 1,
  d: "Ilha sem carros, que é um bairro do Rio: casarões, praias calmas, bicicletas e carrinhos elétricos. A barca sai da Praça XV.",
  t: "Vá cedo no fim de semana, alugue bicicleta e almoce por lá." },

{ n: "Barca para Niterói", b: "Praça XV", z: "centro", c: "passeio", p: ["casal","estudante","gratis"], v: 1,
  d: "Travessia de cerca de 20 minutos pela Baía, com vista do Rio. Do outro lado, o MAC de Oscar Niemeyer (já em outra cidade).",
  t: "Vá no fim da tarde e volte com a cidade iluminada." },

{ n: "Voo livre — asa-delta e parapente", m: "voo-livre", b: "Pedra Bonita → São Conrado", z: "floresta", c: "passeio", p: ["esporte","casal"], v: 3,
  d: "Voo duplo com instrutor decolando da rampa da Pedra Bonita e pousando na praia de São Conrado — cerca de 10 a 15 minutos de pura vista.",
  t: "Só com empresas e instrutores credenciados. O voo depende do vento." },

{ n: "Voo de helicóptero", b: "Morro da Urca / Lagoa", z: "sul", c: "passeio", p: ["casal","classico"], v: 3,
  d: "Voos panorâmicos sobre Cristo, Pão de Açúcar e orla, de poucos minutos até meia hora.",
  pr: "A partir de ~R$ 560 (7 min)",
  t: "Escolha dias de céu limpo e leve óculos escuros para a foto." },

{ n: "Passeio Marítimo da Marinha", b: "Centro (Espaço Cultural da Marinha)", z: "centro", c: "passeio", p: ["familia","historico","idoso"], v: 2,
  d: "Embarcação histórica percorre a Baía de Guanabara em cerca de 1h25, passando por Escola Naval, fortalezas, Ilha Fiscal e Niterói.",
  t: "O ingresso inclui visita ao Espaço Cultural da Marinha." },

{ n: "Do Leme ao Pontal", m: "leme-ao-pontal", b: "Toda a orla, do Leme ao Recreio", z: "sul", c: "passeio", p: ["esporte","familia","casal","gratis","classico"], v: 0,
  d: "O caminho que dá nome à canção de Tim Maia: a orla inteira, do Leme à Pedra do Pontal, passando por Copacabana, Arpoador, Ipanema, Leblon, São Conrado, Barra e Recreio. Faça de bicicleta pelas ciclovias, a pé por trechos ou de carro com paradas nos mirantes.",
  t: "Domingos e feriados as pistas da orla fecham para carros em vários trechos — dia perfeito para pedalar. Bikes compartilhadas por aplicativo cobrem a Zona Sul." },

{ n: "Aula de surf", b: "Arpoador, Barra, Macumba e Prainha", z: "oeste", c: "passeio", p: ["esporte","estudante"], v: 2,
  d: "Escolinhas oferecem aulas para iniciantes com prancha e lycra; ondas mais suaves pela manhã.",
  t: "Use protetor solar resistente à água e beba muita água." },

{ n: "Stand up paddle e caiaque", m: "stand-up-paddle", b: "Praia Vermelha, Urca e Lagoa", z: "sul", c: "passeio", p: ["esporte","casal"], v: 2,
  d: "Remadas em águas calmas com vista para o Pão de Açúcar ou o Cristo.",
  t: "Vá de manhã, quando o vento é mais fraco." },

{ n: "Ilhas Cagarras", b: "Saída da Marina da Glória / Barra", z: "sul", c: "passeio", p: ["natureza","esporte","casal"], v: 3,
  d: "Monumento Natural a cerca de 5 km de Ipanema: passeios de barco com mergulho e chance de ver tartarugas e aves marinhas.",
  t: "Leve remédio para enjoo se for sensível ao balanço." },

{ n: "Turismo comunitário no Santa Marta", m: "santa-marta", b: "Botafogo", z: "sul", c: "passeio", p: ["historico","estudante"], v: 1,
  d: "Guias moradores contam a história da comunidade; no alto, a laje onde Michael Jackson gravou um clipe em 1996 e um mirante.",
  t: "Faça somente com guia morador credenciado e respeite a privacidade das casas." },

{ n: "Aula de capoeira", b: "Vários bairros", z: "sul", c: "passeio", p: ["esporte","estudante","familia"], v: 1,
  d: "Aulas experimentais para iniciantes. A roda de capoeira é Patrimônio Cultural Imaterial da Humanidade pela UNESCO (2014).",
  t: "Use roupa leve e vá sem medo de errar." },

{ n: "Futevôlei e vôlei de praia", m: "futevolei", b: "Copacabana e Ipanema", z: "sul", c: "passeio", p: ["esporte","curticao"], v: 1,
  d: "O futevôlei nasceu nas areias de Copacabana. Dá para fazer aula em várias redes da orla, cedo ou no fim da tarde.",
  t: "Pergunte nas redes da areia — muitas aceitam iniciantes." },

/* ---------- BATE-VOLTA: FORA DA CAPITAL ---------- */
{ n: "Niterói — MAC e Caminho Niemeyer", m: "niteroi-mac", b: "Niterói (Boa Viagem)", z: "fora", c: "batevolta", p: ["classico","historico","estudante","casal"], v: 1, dist: "Barca de 20 min + táxi",
  d: "O Museu de Arte Contemporânea, de Oscar Niemeyer, foi inaugurado em 1996 no Mirante da Boa Viagem e parece um disco voador pousado sobre a baía, com vista para o Pão de Açúcar e o Rio. O pátio é aberto todos os dias; as galerias, de terça a domingo. Perto do terminal das barcas fica o Caminho Niemeyer, outro conjunto de prédios do arquiteto.",
  pr: "Galerias: R$ 20 (meia R$ 10); às quartas, grátis",
  h: "Galerias de terça a domingo, das 10h às 18h; pátio todos os dias, das 9h às 18h",
  ir: "Barca na Praça XV até a Estação Araribóia (cerca de 20 minutos) e, de lá, táxi ou aplicativo até o MAC.",
  q: "MAC Niterói",
  t: "Vá à tarde para ver o pôr do sol atrás do Rio a partir da rampa vermelha." },

{ n: "Fortaleza de Santa Cruz da Barra", b: "Niterói (Jurujuba)", z: "fora", c: "batevolta", p: ["historico","estudante","familia"], v: 1, dist: "≈ 1h do Centro do Rio",
  d: "Na entrada da Baía de Guanabara, bem em frente ao Pão de Açúcar, é a maior fortaleza do Brasil colonial: começou a ser erguida no século XVI e guarda 45 canhões dos séculos XVIII e XIX. Ainda pertence ao Exército, e a visita é guiada por militares.",
  h: "De terça a domingo, das 9h às 16h, com saídas a cada hora",
  ir: "Barca até Niterói e táxi ou aplicativo até Jurujuba; de carro, pela Ponte Rio–Niterói.",
  q: "Fortaleza de Santa Cruz da Barra Niterói",
  t: "Combine no mesmo dia com o MAC e um almoço de frutos do mar na vila de pescadores de Jurujuba." },

{ n: "Itacoatiara e o Costão", b: "Niterói (Região Oceânica)", z: "fora", c: "batevolta", p: ["natureza","esporte","casal","gratis"], v: 0, dist: "≈ 1h de carro",
  d: "Praia de cerca de 700 m dentro do Parque Estadual da Serra da Tiririca, entre o Costão e a Mata Atlântica, e um dos picos de ondas grandes mais conhecidos do país. A trilha do Costão (217 m) começa no canto esquerdo da praia e leva cerca de 30 minutos até o mirante, com vista do litoral e da Pedra do Elefante.",
  ir: "Carro ou aplicativo pela Ponte Rio–Niterói, sentido Região Oceânica (cerca de 1 hora sem trânsito); de ônibus, vá até o Centro de Niterói e siga para Itacoatiara.",
  q: "Praia de Itacoatiara Niterói",
  t: "Nos fins de semana de verão, chegue antes das 9h. O mar é forte: só entre perto do guarda-vidas. O pôr do sol no alto do Costão é o mais disputado." },

{ n: "Petrópolis — Museu Imperial e centro histórico", m: "petropolis", b: "Petrópolis (Região Serrana)", z: "fora", c: "batevolta", p: ["historico","familia","idoso","classico"], v: 1, dist: "≈ 70 km · 1h30",
  d: "A cidade de verão de Dom Pedro II. O Museu Imperial, antigo palácio do imperador, guarda a coroa imperial e o principal acervo do período, e a visita é feita de pantufas. A pé dá para emendar a Catedral, o Palácio de Cristal e as ruas de casarões.",
  pr: "Museu Imperial: cerca de R$ 10; grátis aos domingos desde maio de 2026",
  h: "Palácio de terça a domingo, das 10h às 18h (bilheteria até 17h)",
  ir: "Ônibus de linha saem da Rodoviária Novo Rio (cerca de 1h30 de viagem); de carro, uns 70 km pela BR-040.",
  q: "Museu Imperial Petrópolis",
  t: "Leve casaco: a serra é bem mais fresca que o Rio. Reserve duas horas só para o museu." },

{ n: "Teresópolis — Parque Nacional da Serra dos Órgãos", m: "serra-dos-orgaos", b: "Teresópolis (Região Serrana)", z: "fora", c: "batevolta", p: ["natureza","esporte","familia"], v: 1, dist: "≈ 1h30 a 2h de carro",
  d: "Criado em 1939, é o terceiro parque nacional mais antigo do Brasil e tem mais de 200 km de trilhas. É a casa do Dedo de Deus, marco da escalada no país, e da travessia Petrópolis–Teresópolis. Na sede de Teresópolis há trilhas curtas, poços e mirantes para quem vai só passar o dia.",
  ir: "Carro pela BR-116, com o Dedo de Deus aparecendo na subida da serra, ou ônibus da Rodoviária Novo Rio até Teresópolis. A sede fica na Av. Rotariana, no bairro Soberbo.",
  q: "Parque Nacional da Serra dos Órgãos Teresópolis",
  t: "Confira ingresso e horários no site do ICMBio antes de subir. Trilhas longas e travessias pedem guia e planejamento." },

{ n: "Arraial do Cabo", b: "Região dos Lagos", z: "fora", c: "batevolta", p: ["natureza","casal","esporte","curticao"], v: 2, dist: "≈ 165 km · 3h",
  d: "Água azul-turquesa o ano inteiro, graças à ressurgência, que traz água fria e limpa do fundo do mar. O passeio de barco passa pela Ilha do Farol (só acessível em barco autorizado), Gruta Azul e Praia do Forno; em terra, as Prainhas do Pontal do Atalaia são o cartão-postal. É conhecida como a capital nacional do mergulho.",
  pr: "Passeio de barco coletivo de 4 horas a partir de cerca de R$ 160 por pessoa (2026)",
  ir: "Excursões de um dia saem de madrugada da Zona Sul e da Barra; de carro, uns 165 km pela Ponte Rio–Niterói e Via Lagos; há ônibus na Rodoviária Novo Rio.",
  t: "Reserve o barco com agência legalizada e pergunte se a taxa ambiental da cidade está incluída. Na alta temporada, vale dormir lá." },

{ n: "Búzios", b: "Região dos Lagos", z: "fora", c: "batevolta", p: ["casal","curticao","natureza","gastro"], v: 2, dist: "≈ 3h de carro",
  d: "Península com mais de 20 praias, das calmas como João Fernandes e Ferradura às de onda como Geribá. À noite, a Rua das Pedras e a Orla Bardot concentram restaurantes, bares e lojas, com a estátua de Brigitte Bardot à beira-mar.",
  ir: "Carro pela Ponte Rio–Niterói e Via Lagos; ônibus saem da Rodoviária Novo Rio, e agências fazem excursões de um dia.",
  t: "Num bate-volta, escolha duas praias e o pôr do sol na Orla Bardot. Para aproveitar a noite, durma lá." },

{ n: "Ilha Grande", b: "Angra dos Reis (Costa Verde)", z: "fora", c: "batevolta", p: ["natureza","esporte","casal"], v: 2, dist: "≈ 2h até o cais + lancha",
  d: "Ilha sem carros, coberta de Mata Atlântica, Patrimônio Mundial da Unesco junto com Paraty. A Vila do Abraão é a porta de entrada; de lá saem trilhas e barcos para Lopes Mendes, Lagoa Azul e Lagoa Verde.",
  ir: "Carro, ônibus ou transfer até Conceição de Jacareí (Mangaratiba) e lancha rápida até o Abraão; também há barcos a partir de Angra dos Reis.",
  q: "Vila do Abraão Ilha Grande",
  t: "Angra criou em 2026 uma Taxa de Turismo Sustentável, mas a cobrança foi suspensa em novembro: confira antes de ir. A ilha rende muito mais com pelo menos uma noite." },

{ n: "Paraty", b: "Costa Verde", z: "fora", c: "batevolta", p: ["historico","casal","gastro","natureza"], v: 2, dist: "≈ 250 km · 4h",
  d: "Centro histórico colonial fechado a carros, com ruas de pedra, casarões brancos de portas coloridas e a Igreja de Santa Rita, de 1722. Em dias de lua cheia, a maré invade algumas ruas e espelha o casario. Em volta há praias, ilhas, alambiques de cachaça e cachoeiras.",
  ir: "Ônibus da Rodoviária Novo Rio até a rodoviária de Paraty, ao lado do centro histórico; de carro, pela Rio–Santos (BR-101).",
  q: "Centro Histórico de Paraty",
  t: "São cerca de 4 horas de estrada para cada lado: melhor com pelo menos uma noite. Use tênis, porque as pedras do centro são irregulares." }
];

/* ---------------- ROTEIROS PRONTOS ---------------- */
GUIA.ROTEIROS = [
{ k: "1dia", nome: "Rio em 1 dia", para: "Primeira vez, pouco tempo", dur: "1 dia",
  resumo: "Os dois cartões-postais, Santa Teresa e Lapa, com pôr do sol no Pão de Açúcar.",
  passos: [
    { h: "8h", t: "Cristo Redentor", d: "Trem do Corcovado no primeiro horário possível (compre antes)." },
    { h: "11h", t: "Santa Teresa", d: "Táxi até o Largo do Guimarães; ande pelo bairro e pegue o bondinho." },
    { h: "12h30", t: "Escadaria Selarón e Arcos da Lapa", d: "Desça a pé pela escadaria até a Lapa." },
    { h: "13h30", t: "Almoço no Centro", d: "Confeitaria Colombo ou Bar Luiz, a poucas quadras." },
    { h: "16h", t: "Pão de Açúcar", d: "Suba uma hora antes do pôr do sol e espere as luzes acenderem." },
    { h: "19h", t: "Mureta da Urca", d: "Chope e bolinho do Bar Urca à beira da Baía." },
    { h: "21h", t: "Noite", d: "Samba ao vivo na Lapa ou jantar em Copacabana." }
  ],
  dica: "Custo aproximado com ingressos: R$ 350 a 500 por pessoa, sem hospedagem." },

{ k: "3dias", nome: "3 dias essenciais", para: "Primeira vez", dur: "3 dias",
  resumo: "Zona Sul e os ícones no 1º dia, Centro e Porto no 2º, praia e natureza no 3º.",
  passos: [
    { dia: "Dia 1 · Ícones da Zona Sul" },
    { h: "8h", t: "Cristo Redentor", d: "Primeiro trem do Corcovado." },
    { h: "12h", t: "Almoço em Botafogo", d: "Polo de bares e restaurantes perto do metrô." },
    { h: "15h", t: "Pista Cláudio Coutinho e Pão de Açúcar", d: "Caminhada plana e bondinho no fim da tarde." },
    { h: "20h", t: "Jantar em Copacabana", d: "Quiosques ou Churrascaria Palace." },
    { dia: "Dia 2 · Centro histórico e Porto" },
    { h: "9h30", t: "Praça XV e Paço Imperial", d: "Arco do Teles, Antiga Sé e Candelária." },
    { h: "11h30", t: "CCBB e Mosteiro de São Bento", d: "Exposições gratuitas e barroco dourado." },
    { h: "13h", t: "Almoço", d: "Casa Paladino ou Bar Luiz." },
    { h: "14h30", t: "Museu do Amanhã e MAR", d: "Grátis às terças. Volte pelo Boulevard Olímpico." },
    { h: "17h", t: "Pequena África", d: "Cais do Valongo e Morro da Conceição." },
    { h: "19h", t: "Pedra do Sal ou Lapa", d: "Roda de samba (segunda) ou casas de samba da Lapa." },
    { dia: "Dia 3 · Praia e natureza" },
    { h: "8h", t: "Jardim Botânico", d: "Abertura, com pássaros e palmeiras imperiais." },
    { h: "11h", t: "Praia de Ipanema", d: "Mate, biscoito Globo e mergulho." },
    { h: "15h", t: "Lagoa de bicicleta", d: "Volta completa com vista para o Cristo." },
    { h: "17h30", t: "Pôr do sol no Arpoador", d: "Aplauso coletivo na pedra." },
    { h: "20h", t: "Jantar no Leblon", d: "Jobi ou Bracarense para fechar." }
  ],
  dica: "Concentre as compras de ingresso no dia anterior e use metrô entre Zona Sul e Centro." },

{ k: "centro", nome: "Centro histórico a pé", para: "Histórico, estudantes", dur: "1 dia",
  resumo: "Quatro séculos de Rio em cerca de 5 km de caminhada.",
  passos: [
    { h: "9h", t: "Cinelândia", d: "Theatro Municipal, Biblioteca Nacional e Museu Nacional de Belas Artes." },
    { h: "10h30", t: "Confeitaria Colombo", d: "Pausa para café e pastel de nata." },
    { h: "11h15", t: "Real Gabinete Português de Leitura", d: "O salão de leitura mais bonito da cidade." },
    { h: "12h", t: "Largo da Carioca", d: "Convento de Santo Antônio e São Francisco da Penitência." },
    { h: "13h", t: "Almoço no Bar Luiz", d: "Cozinha alemã desde 1887." },
    { h: "14h30", t: "Praça XV", d: "Paço Imperial, Arco do Teles e Antiga Sé." },
    { h: "15h30", t: "Candelária e CCBB", d: "Exposição gratuita no CCBB." },
    { h: "16h30", t: "Mosteiro de São Bento", d: "Talha dourada e vista do Porto." },
    { h: "17h30", t: "Praça Mauá", d: "Pôr do sol no Boulevard Olímpico; segunda, siga para a Pedra do Sal." }
  ],
  dica: "Faça em dia útil (mais seguro e com tudo aberto). Sapatos confortáveis e garrafa de água." },

{ k: "estudante", nome: "Estudante econômico", para: "Estudantes, orçamento curto", dur: "1 dia (terça-feira)",
  resumo: "Um dia inteiro de cultura gastando menos de R$ 50.",
  passos: [
    { h: "10h", t: "Museu do Amanhã", d: "Grátis às terças — reserve antes." },
    { h: "12h30", t: "MAR — Museu de Arte do Rio", d: "Também grátis às terças. Suba ao terraço." },
    { h: "13h30", t: "Almoço barato", d: "Lanchonetes do Centro ou Rotisseria Sírio Libanesa (Largo do Machado)." },
    { h: "14h30", t: "Espaço Cultural da Marinha", d: "Grátis às terças, no Boulevard." },
    { h: "16h", t: "CCBB", d: "Sempre gratuito." },
    { h: "17h30", t: "Escadaria Selarón", d: "VLT até a Lapa (R$ 5)." },
    { h: "19h", t: "Beco do Rato", d: "Samba de raiz, geralmente sem couvert." }
  ],
  dica: "Leve a carteira estudantil. Transporte municipal (ônibus, BRT, VLT) custa R$ 5 e aceita cartão de débito por aproximação no VLT e no BRT." },

{ k: "noite", nome: "Curtição de fim de semana", para: "Curtição e noite", dur: "Sexta a segunda",
  resumo: "Botafogo, Lapa, praia de ressaca e a segunda sagrada da Pedra do Sal.",
  passos: [
    { dia: "Sexta" },
    { h: "19h", t: "Happy hour em Botafogo", d: "Polo de bares perto do metrô." },
    { h: "23h", t: "Balada", d: "Comuna, Fonte ou Fosfobox." },
    { h: "4h", t: "Saideira", d: "Sanduíche de pernil no Cervantes." },
    { dia: "Sábado" },
    { h: "13h", t: "Feijoada com samba", d: "Rio Scenarium ou feijoada tradicional." },
    { h: "17h", t: "Pôr do sol no Arpoador", d: "Depois, banho e descanso." },
    { h: "22h", t: "Lapa", d: "Carioca da Gema, Lapa 40° e a festa de rua." },
    { dia: "Domingo" },
    { h: "11h", t: "Praia no Posto 9", d: "Ressaca na areia; Feira Hippie na Praça General Osório." },
    { h: "18h", t: "Mureta da Urca", d: "Chope de fim de tarde." },
    { dia: "Segunda" },
    { h: "17h", t: "Samba do Trabalhador", d: "Clube Renascença, no Andaraí." },
    { h: "20h", t: "Pedra do Sal", d: "A roda mais famosa do Rio, grátis." }
  ],
  dica: "Combine com o grupo um ponto de encontro e volte sempre de táxi ou aplicativo." },

{ k: "natureza", nome: "Natureza e trilhas", para: "Natureza e aventura", dur: "2 dias",
  resumo: "Da Floresta da Tijuca às praias selvagens de Guaratiba.",
  passos: [
    { dia: "Dia 1 · Floresta da Tijuca" },
    { h: "6h", t: "Pedra Bonita", d: "Nascer do sol na rampa de voo livre." },
    { h: "9h", t: "Voo de asa-delta (opcional)", d: "Pouso na praia de São Conrado." },
    { h: "11h", t: "Floresta da Tijuca", d: "Cascatinha Taunay, Capela Mayrink e Açude da Solidão." },
    { h: "15h", t: "Vista Chinesa e Mesa do Imperador", d: "Os mirantes mais bonitos da floresta." },
    { dia: "Dia 2 · Zona Oeste selvagem" },
    { h: "5h30", t: "Pedra do Telégrafo", d: "Chegue antes da fila." },
    { h: "10h", t: "Grumari e Prainha", d: "Banho de mar em praias sem prédios." },
    { h: "14h", t: "Sítio Roberto Burle Marx", d: "Visita guiada com agendamento." },
    { h: "17h", t: "Pontal", d: "Pôr do sol na Pedra do Pontal (confira a maré)." }
  ],
  dica: "Carro ou aplicativo são quase obrigatórios. Leve 2 litros de água por pessoa e protetor." },

{ k: "familia", nome: "Família com crianças", para: "Família e crianças", dur: "2 dias",
  resumo: "Aquário, bioparque, ciência e praia de mar calmo.",
  passos: [
    { dia: "Dia 1 · Porto e ciência" },
    { h: "9h30", t: "AquaRio", d: "Túnel dos tubarões e tanque de toque." },
    { h: "12h", t: "Almoço no Boulevard", d: "Quiosques e restaurantes da Orla Conde." },
    { h: "13h30", t: "Museu do Amanhã", d: "Exposições interativas." },
    { h: "16h", t: "Roda-gigante Yup Star", d: "Vista da Baía no fim de tarde." },
    { dia: "Dia 2 · Parques e praia" },
    { h: "9h", t: "BioParque do Rio", d: "Na Quinta da Boa Vista." },
    { h: "12h", t: "Piquenique na Quinta", d: "Lagos e gramados." },
    { h: "15h", t: "Praia do Leblon", d: "Baixo Bebê, no Posto 12." },
    { h: "18h", t: "Sorvete na orla", d: "Para fechar com o pôr do sol." }
  ],
  dica: "Crianças pequenas costumam não pagar em várias atrações — leve documento com foto." },

{ k: "casal", nome: "Romântico a dois", para: "Casais", dur: "2 dias",
  resumo: "Santa Teresa, castelos na Baía e os melhores pores do sol.",
  passos: [
    { dia: "Dia 1" },
    { h: "10h", t: "Santa Teresa de bondinho", d: "Parque das Ruínas e Chácara do Céu." },
    { h: "13h", t: "Almoço no Aprazível", d: "Mesa no jardim com vista." },
    { h: "16h", t: "Pão de Açúcar", d: "Pôr do sol lá em cima." },
    { h: "19h", t: "Mureta da Urca", d: "Chope à beira da Baía." },
    { dia: "Dia 2" },
    { h: "9h", t: "Mirante Dona Marta", d: "A melhor foto do Pão de Açúcar." },
    { h: "13h", t: "Ilha Fiscal", d: "O castelinho do Último Baile do Império (qui a dom)." },
    { h: "17h", t: "Arpoador", d: "Aplauso ao pôr do sol." },
    { h: "20h30", t: "Drink no Copacabana Palace ou jazz no Blue Note", d: "Fechamento elegante." }
  ],
  dica: "Reserve restaurantes e o horário da Ilha Fiscal com antecedência." }
];

/* ---------------- AGENDA DO ANO ---------------- */
GUIA.AGENDA = [
  { m: "Janeiro", itens: ["Alta temporada de verão: praias cheias e calor de 30 °C a 40 °C.", "20/1 — Dia de São Sebastião, padroeiro da cidade (feriado municipal).", "Ensaios técnicos na Sapucaí (Série Ouro em 15, 16 e 17/1/2027).", "Blocos de pré-Carnaval nos fins de semana."] },
  { m: "Fevereiro", destaque: true, itens: ["Carnaval 2027: de 6 a 10 de fevereiro.", "Série Ouro na Sapucaí: 5 e 6/2 · Grupo Especial: 7, 8 e 9/2 · Desfile das Campeãs: 13/2.", "Arquibancadas a R$ 250 por noite (meia R$ 125), só nos canais oficiais.", "Centenas de blocos de rua gratuitos por toda a cidade."] },
  { m: "Março", itens: ["1º/3 — Aniversário do Rio (fundado em 1565).", "Fim do verão; águas ainda quentes e menos turistas."] },
  { m: "Abril", itens: ["23/4 — Dia de São Jorge (feriado estadual), com feijoadas e festas.", "Comida di Buteco: concurso de petiscos em bares da cidade (abril a maio)."] },
  { m: "Maio", itens: ["Outono: céu limpo, temperatura agradável e menos chuva — ótimo para trilhas.", "Preços de hospedagem mais baixos."] },
  { m: "Junho", itens: ["Festas juninas em igrejas, escolas e na Feira de São Cristóvão.", "Começa a melhor época para o Cristo sem nuvens."] },
  { m: "Julho", itens: ["Inverno ameno (cerca de 18 °C a 26 °C) e dias secos.", "Férias escolares: museus e atrações mais cheios."] },
  { m: "Agosto", itens: ["Temporada de trilhas e voo livre.", "Boas ondas para surf na Prainha e no Arpoador."] },
  { m: "Setembro", itens: ["7/9 — Independência (feriado nacional; Museu do Amanhã costuma abrir grátis em feriados nacionais).", "Primavera e início dos ensaios nas quadras das escolas de samba."] },
  { m: "Outubro", itens: ["12/10 — Feriado de N. Sra. Aparecida e Dia das Crianças.", "Festa da Penha nos domingos do mês."] },
  { m: "Novembro", itens: ["20/11 — Dia da Consciência Negra (feriado nacional): ótimo momento para roteiros na Pequena África.", "Festival Botecar Rio (em 2026, de 11/11 a 13/12).", "Lançamento dos sambas-enredo e ensaios a todo vapor."] },
  { m: "Dezembro", destaque: true, itens: ["Natal e decoração na orla.", "31/12 — Réveillon de Copacabana: palcos de shows e queima de fogos na praia.", "Metrô com operação especial na virada — acesse com antecedência."] }
];
