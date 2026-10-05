/* ========================================
   CIDADE ATIVA
   Script principal
======================================== */


/* ========================================
   CONFIGURAÇÕES
======================================== */

const STORAGE_KEY = "cidadeAtiva_ocorrencias";
const THEME_KEY = "tema";


const categorias = [
    "Buracos e vias",
    "Iluminação pública",
    "Limpeza urbana",
    "Sinalização",
    "Áreas verdes",
    "Transporte público",
    "Outros"
];


/* ========================================
   FUNÇÕES GERAIS
======================================== */

// Rola até uma seção
function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// Gera protocolo
function gerarProtocolo() {

    const ano = new Date().getFullYear();

    const numero = Math.floor(
        100000 + Math.random() * 900000
    );

    return `${ano}-${numero}`;
}


// Obtém ocorrências
function obterOcorrencias() {

    try {

        const dados = localStorage.getItem(STORAGE_KEY);

        if (!dados) {
            return [];
        }

        const ocorrencias = JSON.parse(dados);

        return Array.isArray(ocorrencias)
            ? ocorrencias
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar ocorrências:",
            erro
        );

        return [];
    }
}


// Salva ocorrências
function salvarOcorrencias(ocorrencias) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ocorrencias)
    );
}


// Escapa texto para evitar HTML indevido
function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ========================================
   MENU MOBILE
======================================== */

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", function () {

        nav.classList.toggle("is-open");

        const aberto = nav.classList.contains("is-open");

        menuBtn.setAttribute(
            "aria-expanded",
            aberto ? "true" : "false"
        );

    });


    // Fecha o menu ao clicar em um link
    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("is-open");

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });
}


/* ========================================
   BOTÕES "REGISTRAR PROBLEMA"
======================================== */

document.querySelectorAll("a, button").forEach(function (elemento) {

    const texto = elemento.textContent
        .trim()
        .toLowerCase();

    if (texto.includes("registrar um problema")) {

        elemento.addEventListener("click", function (event) {

            const destino = document.getElementById("registrar");

            if (destino) {

                event.preventDefault();

                scrollToSection("registrar");

            }

        });

    }

});


/* ========================================
   CATEGORIAS DO FORMULÁRIO
======================================== */

const categorySelect =
    document.getElementById("category");

if (categorySelect) {

    // Evita duplicar categorias
    if (categorySelect.options.length <= 1) {

        categorias.forEach(function (categoria) {

            const option =
                document.createElement("option");

            option.value = categoria;
            option.textContent = categoria;

            categorySelect.appendChild(option);

        });

    }
}


/* ========================================
   UPLOAD E PRÉ-VISUALIZAÇÃO DA FOTO
======================================== */

const uploadArea =
    document.getElementById("uploadArea");

const imageInput =
    document.getElementById("image");

const fileName =
    document.getElementById("fileName");

const imagePreview =
    document.getElementById("cidadeAtivaImagePreview");

const previewImage =
    document.getElementById("cidadeAtivaPreviewImage");


if (uploadArea && imageInput) {

    uploadArea.addEventListener(
        "click",
        function () {

            imageInput.click();

        }
    );


    imageInput.addEventListener(
        "change",
        function () {

            const arquivo = this.files[0];

            if (!arquivo) {

                if (fileName) {
                    fileName.textContent = "";
                }

                if (imagePreview) {
                    imagePreview.hidden = true;
                }

                if (previewImage) {
                    previewImage.src = "";
                }

                return;
            }


            // Verifica se é imagem
            if (!arquivo.type.startsWith("image/")) {

                alert(
                    "Selecione um arquivo de imagem."
                );

                this.value = "";

                return;
            }


            if (fileName) {
                fileName.textContent =
                    arquivo.name;
            }


            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    if (previewImage) {

                        previewImage.src =
                            evento.target.result;

                    }

                    if (imagePreview) {

                        imagePreview.hidden =
                            false;

                    }

                };


            leitor.readAsDataURL(arquivo);

        }
    );

}


/* ========================================
   REGISTRO DE OCORRÊNCIA
======================================== */

const reportForm =
    document.getElementById("reportForm");


if (reportForm) {

    reportForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ----------------------------
               CAMPOS
            ---------------------------- */

            const categoria =
                document.getElementById(
                    "category"
                )?.value.trim();


            const titulo =
                document.getElementById(
                    "title"
                )?.value.trim();


            const descricao =
                document.getElementById(
                    "description"
                )?.value.trim();


            const endereco =
                document.getElementById(
                    "address"
                )?.value.trim();


            const bairro =
                document.getElementById(
                    "neighborhood"
                )?.value.trim();


            const referencia =
                document.getElementById(
                    "reference"
                )?.value.trim() || "";


            const nome =
                document.getElementById(
                    "name"
                )?.value.trim();


            const email =
                document.getElementById(
                    "email"
                )?.value.trim();


            /* ----------------------------
               VALIDAÇÃO
            ---------------------------- */

            if (
                !categoria ||
                !titulo ||
                !descricao ||
                !endereco ||
                !bairro
            ) {

                alert(
                    "Preencha todos os campos obrigatórios."
                );

                return;
            }


            /* ----------------------------
               PROTOCOLO
            ---------------------------- */

            const protocolo =
                gerarProtocolo();


            /* ----------------------------
               DATA
            ---------------------------- */

            const agora =
                new Date();


            const data =
                agora.toLocaleDateString(
                    "pt-BR"
                );


            const hora =
                agora.toLocaleTimeString(
                    "pt-BR",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            /* ----------------------------
               FOTO
            ---------------------------- */

            let foto = "";


            if (
                imageInput &&
                imageInput.files &&
                imageInput.files[0]
            ) {

                const arquivo =
                    imageInput.files[0];


                // Limite aproximado de 2 MB
                if (
                    arquivo.size >
                    2 * 1024 * 1024
                ) {

                    alert(
                        "A foto deve ter no máximo 2 MB."
                    );

                    return;
                }


                foto =
                    await converterImagemParaBase64(
                        arquivo
                    );

            }


            /* ----------------------------
               OCORRÊNCIA
            ---------------------------- */

            const ocorrencia = {

                protocolo: protocolo,

                categoria: categoria,

                titulo: titulo,

                descricao: descricao,

                endereco: endereco,

                bairro: bairro,

                referencia: referencia,

                nome: nome || "Cidadão",

                email: email || "",

                data: data,

                hora: hora,

                status: "Em análise",

                foto: foto,

                latitude: null,

                longitude: null

            };


            /* ----------------------------
               SALVA
            ---------------------------- */

            const ocorrencias =
                obterOcorrencias();


            ocorrencias.push(
                ocorrencia
            );


            salvarOcorrencias(
                ocorrencias
            );


            /* ----------------------------
               ATUALIZA SITE
            ---------------------------- */

            atualizarTabelaOcorrencias();

            atualizarMapaCidade();

            atualizarMapaInferior();


            /* ----------------------------
               LIMPA FORMULÁRIO
            ---------------------------- */

            reportForm.reset();


            if (fileName) {
                fileName.textContent = "";
            }


            if (imagePreview) {
                imagePreview.hidden = true;
            }


            if (previewImage) {
                previewImage.src = "";
            }


            /* ----------------------------
               MOSTRA PROTOCOLO
            ---------------------------- */

            alert(
                "Solicitação registrada com sucesso!\n\n" +
                "Seu protocolo é:\n" +
                protocolo +
                "\n\nGuarde esse número para acompanhar sua solicitação."
            );


            /* ----------------------------
               ACOMPANHAMENTO
            ---------------------------- */

            const protocolInput =
                document.getElementById(
                    "protocolInput"
                );


            if (protocolInput) {

                protocolInput.value =
                    protocolo;

            }


            scrollToSection(
                "acompanhar"
            );


            /* ----------------------------
               MOSTRA AUTOMATICAMENTE
            ---------------------------- */

            setTimeout(function () {

                consultarProtocolo(
                    protocolo
                );

            }, 500);

        }
    );

}


/* ========================================
   CONVERTER FOTO
======================================== */

function converterImagemParaBase64(
    arquivo
) {

    return new Promise(
        function (resolve, reject) {

            const leitor =
                new FileReader();


            leitor.onload =
                function () {

                    resolve(
                        leitor.result
                    );

                };


            leitor.onerror =
                function () {

                    reject(
                        leitor.error
                    );

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


/* ========================================
   ACOMPANHAMENTO DE PROTOCOLO
======================================== */

const searchProtocol =
    document.getElementById(
        "searchProtocol"
    );


if (searchProtocol) {

    searchProtocol.addEventListener(
        "click",
        function () {

            const input =
                document.getElementById(
                    "protocolInput"
                );


            if (!input) {
                return;
            }


            const protocolo =
                input.value.trim();


            consultarProtocolo(
                protocolo
            );

        }
    );

}


/* Permite apertar Enter no protocolo */

const protocolInput =
    document.getElementById(
        "protocolInput"
    );


if (protocolInput) {

    protocolInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                consultarProtocolo(
                    this.value.trim()
                );

            }

        }
    );

}


/* Consulta protocolo */

function consultarProtocolo(
    protocolo
) {

    const resultado =
        document.getElementById(
            "trackingResult"
        );


    if (!resultado) {
        return;
    }


    if (!protocolo) {

        resultado.innerHTML = `
            <div class="tracking-result-card">
                <strong>Digite um número de protocolo.</strong>
                <p>
                    Exemplo: 2026-123456
                </p>
            </div>
        `;

        return;
    }


    const ocorrencias =
        obterOcorrencias();


    const ocorrencia =
        ocorrencias.find(
            function (item) {

                return (
                    item.protocolo
                        .toLowerCase() ===
                    protocolo.toLowerCase()
                );

            }
        );


    if (!ocorrencia) {

        resultado.innerHTML = `
            <div class="tracking-result-card">
                <strong>Protocolo não encontrado.</strong>
                <p>
                    Confira o número informado e tente novamente.
                </p>
            </div>
        `;

        return;
    }


    let classeStatus = "";


    if (
        ocorrencia.status ===
        "Resolvido"
    ) {

        classeStatus =
            "resolvido";

    } else if (
        ocorrencia.status ===
            "Em andamento" ||
        ocorrencia.status ===
            "Em atendimento"
    ) {

        classeStatus =
            "andamento";

    }


    resultado.innerHTML = `

        <div class="tracking-result-card">

            <header>

                <div>
                    <strong>Protocolo</strong>

                    <p class="ticket-id">
                        ${escaparHTML(
                            ocorrencia.protocolo
                        )}
                    </p>
                </div>

                <span class="ticket-status ${classeStatus}">
                    ${escaparHTML(
                        ocorrencia.status
                    )}
                </span>

            </header>


            <div>
                <strong>Problema</strong>
                <p>
                    ${escaparHTML(
                        ocorrencia.titulo
                    )}
                </p>
            </div>


            <div>
                <strong>Categoria</strong>
                <p>
                    ${escaparHTML(
                        ocorrencia.categoria
                    )}
                </p>
            </div>


            <div>
                <strong>Local</strong>
                <p>
                    ${escaparHTML(
                        ocorrencia.endereco
                    )}
                </p>
            </div>


            <div>
                <strong>Bairro</strong>
                <p>
                    ${escaparHTML(
                        ocorrencia.bairro
                    )}
                </p>
            </div>


            ${
                ocorrencia.referencia
                    ? `
                    <div>
                        <strong>
                            Ponto de referência
                        </strong>
                        <p>
                            ${escaparHTML(
                                ocorrencia.referencia
                            )}
                        </p>
                    </div>
                    `
                    : ""
            }


            <div>
                <strong>Data</strong>
                <p>
                    ${escaparHTML(
                        ocorrencia.data
                    )}
                    ${
                        ocorrencia.hora
                            ? " às " +
                              escaparHTML(
                                  ocorrencia.hora
                              )
                            : ""
                    }
                </p>
            </div>


            <div>
                <strong>Descrição</strong>
                <p>
                    ${escaparHTML(
                        ocorrencia.descricao
                    )}
                </p>
            </div>


            ${
                ocorrencia.foto
                    ? `
                    <div>
                        <strong>Foto enviada</strong>

                        <img
                            src="${ocorrencia.foto}"
                            alt="Foto da ocorrência"
                            style="
                                width:100%;
                                max-width:360px;
                                margin-top:10px;
                                border-radius:12px;
                            "
                        >
                    </div>
                    `
                    : ""
            }

        </div>

    `;
}


/* ========================================
   MODO ESCURO
======================================== */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


function atualizarIconeTema() {

    if (!themeToggle) {
        return;
    }


    const modoEscuro =
        document.body.classList.contains(
            "dark-mode"
        );


    themeToggle.textContent =
        modoEscuro
            ? "☀️"
            : "🌙";

}


const temaSalvo =
    localStorage.getItem(
        THEME_KEY
    );


if (temaSalvo === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}


atualizarIconeTema();


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            const modoEscuro =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                THEME_KEY,
                modoEscuro
                    ? "dark"
                    : "light"
            );


            atualizarIconeTema();

        }
    );

}


/* ========================================
   MAPA SUPERIOR - CITY MAP
======================================== */

let cityMap = null;
let cityMarkers = [];


function inicializarMapaCidade() {

    const elemento =
        document.getElementById(
            "cityMap"
        );


    if (
        !elemento ||
        typeof L === "undefined"
    ) {

        return;

    }


    if (cityMap) {
        return;
    }


    cityMap =
        L.map(
            "cityMap",
            {
                zoomControl: false,
                attributionControl: true
            }
        ).setView(
            [-5.706, -35.307],
            13
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(cityMap);


    atualizarMapaCidade();


    setTimeout(function () {

        cityMap.invalidateSize();

    }, 300);

}


/* Atualiza mapa superior */

function atualizarMapaCidade() {

    if (!cityMap) {
        return;
    }


    cityMarkers.forEach(
        function (marker) {

            cityMap.removeLayer(
                marker
            );

        }
    );


    cityMarkers = [];


    const ocorrencias =
        obterOcorrencias();


    ocorrencias.forEach(
        function (ocorrencia) {

            if (
                ocorrencia.latitude === null ||
                ocorrencia.longitude === null
            ) {

                return;

            }


            const cor =
                obterCorStatus(
                    ocorrencia.status
                );


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
                    ${escaparHTML(
                        ocorrencia.titulo
                    )}
                </strong>

                <br>

                ${escaparHTML(
                    ocorrencia.categoria
                )}

                <br>

                ${escaparHTML(
                    ocorrencia.bairro
                )}

                <br><br>

                <strong>Status:</strong>
                ${escaparHTML(
                    ocorrencia.status
                )}

                <br>

                <strong>Protocolo:</strong>
                ${escaparHTML(
                    ocorrencia.protocolo
                )}

            `);


            marcador.addTo(
                cityMap
            );


            cityMarkers.push(
                marcador
            );

        }
    );

}


/* Cor do marcador */

function obterCorStatus(
    status
) {

    if (
        status === "Resolvido"
    ) {

        return "#2E8B57";

    }


    if (
        status === "Em atendimento" ||
        status === "Em andamento"
    ) {

        return "#F4C430";

    }


    return "#DC3545";
}


/* ========================================
   MAPA REAL - REAL MAP
======================================== */

let realMap = null;


function inicializarMapaReal() {

    const elemento =
        document.getElementById(
            "realMap"
        );


    if (
        !elemento ||
        typeof L === "undefined"
    ) {

        return;

    }


    if (realMap) {
        return;
    }


    realMap =
        L.map(
            "realMap"
        ).setView(
            [-5.706, -35.307],
            13
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(realMap);


    adicionarPontosExemplo(
        realMap
    );


    adicionarOcorrenciasAoMapa(
        realMap
    );


    setTimeout(function () {

        realMap.invalidateSize();

    }, 300);

}


/* Pontos demonstrativos */

function adicionarPontosExemplo(
    mapa
) {

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


    pontos.forEach(
        function (ponto) {

            const marcador =
                L.circleMarker(
                    [
                        ponto.latitude,
                        ponto.longitude
                    ],
                    {
                        radius: 9,
                        color: "#ffffff",
                        weight: 2,
                        fillColor:
                            obterCorStatus(
                                ponto.status
                            ),
                        fillOpacity: 0.9
                    }
                );


            marcador.bindPopup(`

                <strong>
                    ${escaparHTML(
                        ponto.titulo
                    )}
                </strong>

                <br>

                ${escaparHTML(
                    ponto.categoria
                )}

                <br>

                <strong>Status:</strong>
                ${escaparHTML(
                    ponto.status
                )}

            `);


            marcador.addTo(
                mapa
            );

        }
    );

}


/* Adiciona ocorrências reais ao mapa */

function adicionarOcorrenciasAoMapa(
    mapa
) {

    const ocorrencias =
        obterOcorrencias();


    ocorrencias.forEach(
        function (ocorrencia) {

            if (
                ocorrencia.latitude === null ||
                ocorrencia.longitude === null
            ) {

                return;

            }


            const marcador =
                L.circleMarker(
                    [
                        ocorrencia.latitude,
                        ocorrencia.longitude
                    ],
                    {
                        radius: 9,
                        color: "#ffffff",
                        weight: 2,
                        fillColor:
                            obterCorStatus(
                                ocorrencia.status
                            ),
                        fillOpacity: 0.9
                    }
                );


            marcador.bindPopup(`

                <strong>
                    ${escaparHTML(
                        ocorrencia.titulo
                    )}
                </strong>

                <br>

                ${escaparHTML(
                    ocorrencia.categoria
                )}

                <br>

                <strong>Status:</strong>
                ${escaparHTML(
                    ocorrencia.status
                )}

                <br>

                <strong>Protocolo:</strong>
                ${escaparHTML(
                    ocorrencia.protocolo
                )}

            `);


            marcador.addTo(
                mapa
            );

        }
    );

}


/* ========================================
   TABELA DE OCORRÊNCIAS
======================================== */

function atualizarTabelaOcorrencias(
    filtro = "todos"
) {

    const tbody =
        document.querySelector(
            ".requests-table tbody"
        );


    if (!tbody) {
        return;
    }


    let ocorrencias =
        obterOcorrencias();


    if (
        filtro &&
        filtro !== "todos" &&
        filtro !== "all"
    ) {

        ocorrencias =
            ocorrencias.filter(
                function (item) {

                    return (
                        item.status ===
                        filtro
                    );

                }
            );

    }


    if (ocorrencias.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="100%"
                    style="text-align:center;padding:30px;"
                >
                    Nenhuma ocorrência registrada.
                </td>

            </tr>

        `;

        return;
    }


    tbody.innerHTML = "";


    ocorrencias
        .slice()
        .reverse()
        .forEach(
            function (ocorrencia) {

                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        ${escaparHTML(
                            ocorrencia.protocolo
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            ocorrencia.titulo
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            ocorrencia.categoria
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            ocorrencia.bairro
                        )}
                    </td>

                    <td>
                        <span class="status-badge ${classeStatusTabela(
                            ocorrencia.status
                        )}">
                            ${escaparHTML(
                                ocorrencia.status
                            )}
                        </span>
                    </td>

                    <td>
                        ${escaparHTML(
                            ocorrencia.data
                        )}
                    </td>

                `;


                tbody.appendChild(
                    tr
                );

            }
        );

}


/* Classe do status */

function classeStatusTabela(
    status
) {

    if (
        status === "Resolvido"
    ) {

        return "resolvido";

    }


    if (
        status === "Em andamento" ||
        status === "Em atendimento"
    ) {

        return "atendimento";

    }


    if (
        status === "Em análise"
    ) {

        return "analise";

    }


    return "aguardando";
}


/* ========================================
   FILTROS
======================================== */

document
    .querySelectorAll(
        ".filter-btn"
    )
    .forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".filter-btn"
                        )
                        .forEach(
                            function (item) {

                                item.classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                    botao.classList.add(
                        "active"
                    );


                    const filtro =
                        botao.dataset.filter;


                    if (
                        filtro === "resolved"
                    ) {

                        atualizarTabelaOcorrencias(
                            "Resolvido"
                        );

                    } else if (
                        filtro === "all"
                    ) {

                        atualizarTabelaOcorrencias(
                            "todos"
                        );

                    } else {

                        filtrarMapaPorCategoria(
                            filtro
                        );

                    }

                }
            );

        }
    );


/* Filtra marcadores do mapa */

function filtrarMapaPorCategoria(
    categoria
) {

    if (!cityMap) {
        return;
    }


    cityMarkers.forEach(
        function (marker) {

            const ocorrencia =
                marker.ocorrencia;


            if (!ocorrencia) {
                return;
            }


            if (
                ocorrencia.categoria ===
                categoria
            ) {

                marker.addTo(
                    cityMap
                );

            } else {

                cityMap.removeLayer(
                    marker
                );

            }

        }
    );

}


/* ========================================
   BUSCA DA TABELA
======================================== */

const searchBox =
    document.querySelector(
        ".search-box input"
    );


if (searchBox) {

    searchBox.addEventListener(
        "input",
        function () {

            const termo =
                this.value
                    .toLowerCase()
                    .trim();


            const linhas =
                document.querySelectorAll(
                    ".requests-table tbody tr"
                );


            linhas.forEach(
                function (linha) {

                    const texto =
                        linha.textContent
                            .toLowerCase();


                    linha.style.display =
                        texto.includes(
                            termo
                        )
                            ? ""
                            : "none";

                }
            );

        }
    );

}


/* ========================================
   SELECT DA TABELA
======================================== */

const tableFilter =
    document.querySelector(
        ".requests-toolbar select"
    );


if (tableFilter) {

    tableFilter.addEventListener(
        "change",
        function () {

            atualizarTabelaOcorrencias(
                this.value
            );

        }
    );

}


/* ========================================
   MAPA INFERIOR
======================================== */

function atualizarMapaInferior() {

    if (!realMap) {
        return;
    }


    // Recria o mapa para atualizar
    realMap.eachLayer(
        function (layer) {

            if (
                layer instanceof
                L.CircleMarker
            ) {

                realMap.removeLayer(
                    layer
                );

            }

        }
    );


    adicionarPontosExemplo(
        realMap
    );


    adicionarOcorrenciasAoMapa(
        realMap
    );

}


/* ========================================
   INICIALIZAÇÃO
======================================== */

window.addEventListener(
    "load",
    function () {

        inicializarMapaCidade();

        inicializarMapaReal();

        atualizarTabelaOcorrencias();

    }
);


/* ========================================
   ATUALIZAÇÃO AO VOLTAR PARA A PÁGINA
======================================== */

window.addEventListener(
    "storage",
    function () {

        atualizarTabelaOcorrencias();

        atualizarMapaCidade();

        atualizarMapaInferior();

    }
);