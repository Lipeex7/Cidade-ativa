// Rola a página até uma seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// Gera um número de protocolo
function gerarProtocolo() {
    const ano = new Date().getFullYear();
    const numero = Math.floor(100000 + Math.random() * 900000);

    return `${ano}-${numero}`;
}

// Pega as ocorrências salvas
function obterOcorrencias() {
    const dados = localStorage.getItem("ocorrencias");

    if (dados) {
        return JSON.parse(dados);
    }

    return [];
}

// Salva as ocorrências
function salvarOcorrencias(ocorrencias) {
    localStorage.setItem(
        "ocorrencias",
        JSON.stringify(ocorrencias)
    );
}

// Categorias
const categorias = [
    "Buracos e vias",
    "Iluminação pública",
    "Limpeza urbana",
    "Sinalização",
    "Áreas verdes",
    "Transporte público",
    "Outros"
];

// Coloca as categorias no formulário
const categorySelect = document.getElementById("category");

if (categorySelect) {
    categorias.forEach(function(categoria) {
        const option = document.createElement("option");

        option.value = categoria;
        option.textContent = categoria;

        categorySelect.appendChild(option);
    });
}

// Formulário de registro
const reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Pega os dados do formulário
        const categoria = document.getElementById("category").value;
        const titulo = document.getElementById("title").value;
        const descricao = document.getElementById("description").value;
        const endereco = document.getElementById("address").value;
        const bairro = document.getElementById("neighborhood").value;
        const nome = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        // Cria o protocolo
        const protocolo = gerarProtocolo();

        // Cria a ocorrência
        const ocorrencia = {
            protocolo: protocolo,
            categoria: categoria,
            titulo: titulo,
            descricao: descricao,
            endereco: endereco,
            bairro: bairro,
            nome: nome,
            email: email,
            data: new Date().toLocaleDateString("pt-BR"),
            status: "Em análise"
        };

        // Pega as ocorrências existentes
        const ocorrencias = obterOcorrencias();

        // Adiciona a nova ocorrência
        ocorrencias.push(ocorrencia);

        // Salva
        salvarOcorrencias(ocorrencias);

        // Limpa o formulário
        reportForm.reset();

        // Mostra o protocolo
        alert(
            "Solicitação registrada com sucesso!\n\n" +
            "Seu protocolo é: " + protocolo
        );

        // Vai para a área de acompanhamento
        scrollToSection("acompanhar");

        // Coloca o protocolo no campo
        const protocolInput = document.getElementById("protocolInput");

        if (protocolInput) {
            protocolInput.value = protocolo;
        }
    });
}

// Botão de consultar protocolo
const searchProtocol = document.getElementById("searchProtocol");

if (searchProtocol) {

    searchProtocol.addEventListener("click", function() {

        const input = document.getElementById("protocolInput");
        const resultado = document.getElementById("trackingResult");

        const protocolo = input.value.trim();

        // Verifica se o campo está vazio
        if (!protocolo) {
            resultado.innerHTML = `
                <p>Digite um número de protocolo.</p>
            `;

            return;
        }

        // Procura a ocorrência
        const ocorrencias = obterOcorrencias();

        const ocorrencia = ocorrencias.find(function(item) {
            return item.protocolo === protocolo;
        });

        // Se não encontrar
        if (!ocorrencia) {
            resultado.innerHTML = `
                <p>Protocolo não encontrado.</p>
            `;

            return;
        }

        // Mostra os dados da ocorrência
        resultado.innerHTML = `
            <div class="tracking-result-card">

                <div>
                    <strong>Protocolo</strong>
                    <p>${ocorrencia.protocolo}</p>
                </div>

                <div>
                    <strong>Problema</strong>
                    <p>${ocorrencia.titulo}</p>
                </div>

                <div>
                    <strong>Categoria</strong>
                    <p>${ocorrencia.categoria}</p>
                </div>

                <div>
                    <strong>Bairro</strong>
                    <p>${ocorrencia.bairro}</p>
                </div>

                <div>
                    <strong>Data</strong>
                    <p>${ocorrencia.data}</p>
                </div>

                <div>
                    <strong>Status</strong>
                    <p>${ocorrencia.status}</p>
                </div>

                <div>
                    <strong>Descrição</strong>
                    <p>${ocorrencia.descricao}</p>
                </div>

            </div>
        `;
    });
}

// Botão de modo escuro
const themeToggle = document.getElementById("themeToggle");

// Verifica se o usuário já escolheu um tema
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// Alterna entre claro e escuro
if (themeToggle) {

    themeToggle.addEventListener("click", function() {

        document.body.classList.toggle("dark-mode");

        // Verifica qual tema está ativo
        const modoEscuro = document.body.classList.contains("dark-mode");

        if (modoEscuro) {
            themeToggle.textContent = "☀️";
            localStorage.setItem("tema", "dark");
        } else {
            themeToggle.textContent = "🌙";
            localStorage.setItem("tema", "light");
        }

    });

}

// ========================================
// MAPA REAL DE EXTREMOZ
// ========================================

const mapa = document.getElementById("realMap");

if (mapa) {

    // Coordenadas aproximadas do centro de Extremoz
    const latitude = -5.706;
    const longitude = -35.307;

    // Cria o mapa
    const map = L.map("realMap").setView(
        [latitude, longitude],
        13
    );

    // Adiciona o mapa do OpenStreetMap
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }
    ).addTo(map);

    // Ocorrências de exemplo
    const pontos = [

        {
            latitude: -5.7043,
            longitude: -35.3043,
            titulo: "Buraco na via",
            categoria: "Buracos e vias",
            status: "Em aberto"
        },

        {
            latitude: -5.6995,
            longitude: -35.3005,
            titulo: "Problema na iluminação",
            categoria: "Iluminação pública",
            status: "Em atendimento"
        },

        {
            latitude: -5.7105,
            longitude: -35.3090,
            titulo: "Limpeza urbana",
            categoria: "Limpeza urbana",
            status: "Resolvido"
        }

    ];

    // Cria os pontos no mapa
    pontos.forEach(function(ponto) {

        let cor = "red";

        if (ponto.status === "Em atendimento") {
            cor = "orange";
        }

        if (ponto.status === "Resolvido") {
            cor = "green";
        }

        const marcador = L.circleMarker(
            [ponto.latitude, ponto.longitude],
            {
                radius: 9,
                color: "#ffffff",
                weight: 2,
                fillColor: cor,
                fillOpacity: 0.9
            }
        );

        marcador.bindPopup(`
            <strong>${ponto.titulo}</strong>
            <br>
            <span>${ponto.categoria}</span>
            <br>
            <strong>Status:</strong> ${ponto.status}
        `);

        marcador.addTo(map);

    });

}

// ==========================================
// MAPA REAL - STATUS DA CIDADE
// ==========================================

const cityMapElement = document.getElementById("cityMap");

if (cityMapElement && typeof L !== "undefined") {

    // Centro de Extremoz/RN
    const latitude = -5.706;
    const longitude = -35.307;

    const cityMap = L.map("cityMap", {
        zoomControl: false,
        attributionControl: true
    }).setView([latitude, longitude], 13);

    // OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }).addTo(cityMap);


    // ==========================================
    // PONTOS DE EXEMPLO
    // ==========================================

    const pontosCidade = [

        {
            latitude: -5.7043,
            longitude: -35.3043,
            titulo: "Buraco na via",
            categoria: "Buracos e vias",
            status: "Em aberto"
        },

        {
            latitude: -5.6995,
            longitude: -35.3005,
            titulo: "Problema na iluminação",
            categoria: "Iluminação pública",
            status: "Em atendimento"
        },

        {
            latitude: -5.7105,
            longitude: -35.3090,
            titulo: "Limpeza urbana",
            categoria: "Limpeza urbana",
            status: "Resolvido"
        }

    ];


    // ==========================================
    // CRIA OS MARCADORES
    // ==========================================

    pontosCidade.forEach(function(ponto) {

        let cor = "#DC3545";

        if (ponto.status === "Em atendimento") {
            cor = "#F4C430";
        }

        if (ponto.status === "Resolvido") {
            cor = "#2E8B57";
        }

        const marcador = L.circleMarker(
            [ponto.latitude, ponto.longitude],
            {
                radius: 7,
                color: "#ffffff",
                weight: 2,
                fillColor: cor,
                fillOpacity: 1
            }
        );

        marcador.bindPopup(`
            <strong>${ponto.titulo}</strong>
            <br>
            ${ponto.categoria}
            <br>
            <strong>Status:</strong> ${ponto.status}
        `);

        marcador.addTo(cityMap);

    });

}

// ======================================================
// CIDADE ATIVA
// Sistema de ocorrências + LocalStorage
// ======================================================


// ======================================================
// CONFIGURAÇÕES
// ======================================================

const STORAGE_KEY = "cidadeAtiva_ocorrencias";

const categorias = [
    "Buracos e vias",
    "Iluminação pública",
    "Limpeza urbana",
    "Sinalização",
    "Áreas verdes",
    "Transporte público",
    "Outros"
];


// ======================================================
// FUNÇÕES DO LOCALSTORAGE
// ======================================================

function obterOcorrencias() {

    try {

        const dados = localStorage.getItem(STORAGE_KEY);

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error("Erro ao ler ocorrências:", erro);

        return [];

    }

}


function salvarOcorrencias(ocorrencias) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(ocorrencias)
        );

        return true;

    } catch (erro) {

        console.error("Erro ao salvar ocorrências:", erro);

        return false;

    }

}


// ======================================================
// GERADOR DE PROTOCOLO
// ======================================================

function gerarProtocolo() {

    const agora = new Date();

    const ano = agora.getFullYear();

    const mes = String(agora.getMonth() + 1).padStart(2, "0");

    const dia = String(agora.getDate()).padStart(2, "0");

    const numero = Math.floor(
        1000 + Math.random() * 9000
    );

    return `CA-${ano}${mes}${dia}-${numero}`;

}


// ======================================================
// SCROLL PARA SEÇÕES
// ======================================================

function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// PREENCHER CATEGORIAS
// ======================================================

function carregarCategorias() {

    const categorySelect =
        document.getElementById("category");

    if (!categorySelect) {
        return;
    }

    categorias.forEach(function(categoria) {

        const option = document.createElement("option");

        option.value = categoria;

        option.textContent = categoria;

        categorySelect.appendChild(option);

    });

}

carregarCategorias();


// ======================================================
// REGISTRO DE OCORRÊNCIA
// ======================================================

const reportForm =
    document.getElementById("reportForm");


if (reportForm) {

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();


        // ----------------------------------------------
        // PEGAR DADOS DO FORMULÁRIO
        // ----------------------------------------------

        const categoria =
            document.getElementById("category").value;

        const titulo =
            document.getElementById("title").value.trim();

        const descricao =
            document.getElementById("description").value.trim();

        const endereco =
            document.getElementById("address").value.trim();

        const bairro =
            document.getElementById("neighborhood").value;

        const nome =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();


        // ----------------------------------------------
        // VALIDAR
        // ----------------------------------------------

        if (
            !categoria ||
            !titulo ||
            !descricao ||
            !endereco ||
            !bairro ||
            !nome ||
            !email
        ) {

            alert(
                "Preencha todos os campos obrigatórios."
            );

            return;

        }


        // ----------------------------------------------
        // GERAR PROTOCOLO
        // ----------------------------------------------

        const protocolo = gerarProtocolo();


        // ----------------------------------------------
        // CRIAR OCORRÊNCIA
        // ----------------------------------------------

        const novaOcorrencia = {

            protocolo: protocolo,

            titulo: titulo,

            categoria: categoria,

            descricao: descricao,

            endereco: endereco,

            bairro: bairro,

            nome: nome,

            email: email,

            data: new Date().toISOString(),

            status: "Em análise",

            // Coordenadas serão adicionadas
            // posteriormente pelo sistema de mapa.
            latitude: null,

            longitude: null

        };


        // ----------------------------------------------
        // PEGAR OCORRÊNCIAS EXISTENTES
        // ----------------------------------------------

        const ocorrencias =
            obterOcorrencias();


        // ----------------------------------------------
        // ADICIONAR NOVA OCORRÊNCIA
        // ----------------------------------------------

        ocorrencias.push(novaOcorrencia);


        // ----------------------------------------------
        // SALVAR
        // ----------------------------------------------

        const salvou =
            salvarOcorrencias(ocorrencias);


        if (!salvou) {

            alert(
                "Não foi possível salvar a ocorrência."
            );

            return;

        }


        // ----------------------------------------------
        // LIMPAR FORMULÁRIO
        // ----------------------------------------------

        reportForm.reset();


        // ----------------------------------------------
        // ATUALIZAR INTERFACE
        // ----------------------------------------------

        atualizarIndicadores();

        atualizarTabela();

        atualizarMapa();


        // ----------------------------------------------
        // MOSTRAR PROTOCOLO
        // ----------------------------------------------

        alert(
            "Solicitação registrada com sucesso!\n\n" +
            "Seu protocolo é:\n" +
            protocolo
        );


        // ----------------------------------------------
        // PREENCHER CONSULTA AUTOMATICAMENTE
        // ----------------------------------------------

        const protocolInput =
            document.getElementById("protocolInput");

        if (protocolInput) {

            protocolInput.value =
                protocolo;

        }


        // ----------------------------------------------
        // IR PARA ACOMPANHAMENTO
        // ----------------------------------------------

        scrollToSection("acompanhar");

    });

}


// ======================================================
// CONSULTAR PROTOCOLO
// ======================================================

const searchProtocol =
    document.getElementById("searchProtocol");


if (searchProtocol) {

    searchProtocol.addEventListener("click", function() {

        const input =
            document.getElementById("protocolInput");

        const resultado =
            document.getElementById("trackingResult");


        if (!input || !resultado) {
            return;
        }


        const protocolo =
            input.value.trim().toUpperCase();


        if (!protocolo) {

            resultado.innerHTML = `
                <div class="tracking-result-card">
                    <strong>Digite um protocolo.</strong>
                </div>
            `;

            return;

        }


        const ocorrencias =
            obterOcorrencias();


        const ocorrencia =
            ocorrencias.find(function(item) {

                return item.protocolo === protocolo;

            });


        if (!ocorrencia) {

            resultado.innerHTML = `
                <div class="tracking-result-card">
                    <strong>Protocolo não encontrado.</strong>
                    <p>
                        Verifique o número informado
                        e tente novamente.
                    </p>
                </div>
            `;

            return;

        }


        resultado.innerHTML = `

            <div class="tracking-result-card">

                <div class="tracking-result-header">

                    <div>
                        <small>PROTOCOLO</small>
                        <strong>
                            ${ocorrencia.protocolo}
                        </strong>
                    </div>

                    <span class="ticket-status">
                        ${ocorrencia.status}
                    </span>

                </div>

                <div class="tracking-details">

                    <div>
                        <small>Problema</small>
                        <strong>
                            ${ocorrencia.titulo}
                        </strong>
                    </div>

                    <div>
                        <small>Categoria</small>
                        <strong>
                            ${ocorrencia.categoria}
                        </strong>
                    </div>

                    <div>
                        <small>Bairro</small>
                        <strong>
                            ${ocorrencia.bairro}
                        </strong>
                    </div>

                    <div>
                        <small>Data</small>
                        <strong>
                            ${formatarData(ocorrencia.data)}
                        </strong>
                    </div>

                </div>

                <div class="tracking-description">

                    <small>Descrição</small>

                    <p>
                        ${ocorrencia.descricao}
                    </p>

                </div>

            </div>

        `;

    });

}


// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const dataObj = new Date(data);

    return dataObj.toLocaleDateString(
        "pt-BR"
    );

}


// ======================================================
// INDICADORES
// ======================================================

function atualizarIndicadores() {

    const ocorrencias =
        obterOcorrencias();


    const total =
        ocorrencias.length;


    const resolvidos =
        ocorrencias.filter(function(item) {

            return item.status === "Resolvido";

        }).length;


    const andamento =
        ocorrencias.filter(function(item) {

            return (
                item.status === "Em andamento" ||
                item.status === "Em atendimento"
            );

        }).length;


    const analise =
        ocorrencias.filter(function(item) {

            return (
                item.status === "Em análise" ||
                item.status === "Aguardando"
            );

        }).length;


    const totalElement =
        document.querySelector(
            '[data-stat="total"]'
        );


    const resolvedElement =
        document.querySelector(
            '[data-stat="resolved"]'
        );


    const progressElement =
        document.querySelector(
            '[data-stat="progress"]'
        );


    const waitingElement =
        document.querySelector(
            '[data-stat="waiting"]'
        );


    if (totalElement) {
        totalElement.textContent = total;
    }


    if (resolvedElement) {
        resolvedElement.textContent =
            resolvidos;
    }


    if (progressElement) {
        progressElement.textContent =
            andamento;
    }


    if (waitingElement) {
        waitingElement.textContent =
            analise;
    }

}


// ======================================================
// TABELA DE SOLICITAÇÕES
// ======================================================

function atualizarTabela() {

    const tabela =
        document.getElementById(
            "requestsTable"
        );


    if (!tabela) {
        return;
    }


    const ocorrencias =
        obterOcorrencias();


    tabela.innerHTML = "";


    ocorrencias
        .slice()
        .reverse()
        .forEach(function(ocorrencia) {

            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    ${ocorrencia.protocolo}
                </td>

                <td>
                    ${ocorrencia.titulo}
                </td>

                <td>
                    ${ocorrencia.categoria}
                </td>

                <td>
                    ${ocorrencia.bairro}
                </td>

                <td>
                    ${formatarData(ocorrencia.data)}
                </td>

                <td>
                    <span class="status-badge">
                        ${ocorrencia.status}
                    </span>
                </td>

            `;


            tabela.appendChild(linha);

        });

}


// ======================================================
// MAPA SUPERIOR
// ======================================================

let cityMap = null;

let cityMarkers = [];


// Inicializar mapa

function inicializarMapa() {

    const mapaElement =
        document.getElementById("cityMap");


    if (
        !mapaElement ||
        typeof L === "undefined"
    ) {

        return;

    }


    // Evita criar o mapa duas vezes

    if (cityMap) {
        return;
    }


    // Extremoz/RN

    const latitude = -5.706;

    const longitude = -35.307;


    cityMap = L.map("cityMap", {

        zoomControl: false

    }).setView(
        [latitude, longitude],
        13
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap"

        }
    ).addTo(cityMap);


    atualizarMapa();

}


// ======================================================
// ATUALIZAR MARCADORES
// ======================================================

function atualizarMapa() {

    if (!cityMap) {
        return;
    }


    // Remover marcadores antigos

    cityMarkers.forEach(function(marker) {

        cityMap.removeLayer(marker);

    });


    cityMarkers = [];


    const ocorrencias =
        obterOcorrencias();


    ocorrencias.forEach(function(ocorrencia) {


        // Só cria marcador se existir localização

        if (
            ocorrencia.latitude === null ||
            ocorrencia.longitude === null
        ) {

            return;

        }


        let cor = "#DC3545";


        if (
            ocorrencia.status === "Em andamento" ||
            ocorrencia.status === "Em atendimento"
        ) {

            cor = "#F4C430";

        }


        if (
            ocorrencia.status === "Resolvido"
        ) {

            cor = "#2E8B57";

        }


        const marcador =
            L.circleMarker(

                [
                    ocorrencia.latitude,
                    ocorrencia.longitude
                ],

                {

                    radius: 7,

                    color: "#ffffff",

                    weight: 2,

                    fillColor: cor,

                    fillOpacity: 0.9

                }

            );


        marcador.bindPopup(`

            <strong>
                ${ocorrencia.titulo}
            </strong>

            <br>

            ${ocorrencia.categoria}

            <br>

            ${ocorrencia.bairro}

            <br><br>

            <strong>Status:</strong>
            ${ocorrencia.status}

            <br>

            <strong>Protocolo:</strong>
            ${ocorrencia.protocolo}

        `);


        marcador.addTo(cityMap);


        cityMarkers.push(marcador);

    });

}


// ======================================================
// MODO ESCURO
// ======================================================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const temaSalvo =
    localStorage.getItem("tema");


if (
    temaSalvo === "dark" &&
    themeToggle
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeToggle.textContent = "☀️";

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "dark-mode"
            );


            const modoEscuro =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (modoEscuro) {

                themeToggle.textContent = "☀️";

                localStorage.setItem(
                    "tema",
                    "dark"
                );

            } else {

                themeToggle.textContent = "🌙";

                localStorage.setItem(
                    "tema",
                    "light"
                );

            }

        }
    );

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

atualizarIndicadores();

atualizarTabela();


// Aguarda o Leaflet estar carregado

if (
    typeof L !== "undefined"
) {

    inicializarMapa();

} else {

    window.addEventListener(
        "load",
        function() {

            inicializarMapa();

        }
    );

}
