function mudarTema(classeTema) {
    document.body.className = classeTema;
}

// BLOQUEIO DE ACESSIBILIDADE 
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        console.log("Acesso negado. Use o mouse.");
    }
});

let diaSelecionado = null; let mesSelecionado = null; let anoSelecionado = "";
const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const displayData = document.getElementById('display-data');
const contDia = document.getElementById('jogo-dia-container');
const contMes = document.getElementById('jogo-mes-container');
const contAno = document.getElementById('jogo-ano-container');
const contChefao = document.getElementById('chefao-container');

// ==========================================
// FASE 1: DIA
// ==========================================
const arena = document.getElementById('arena-bolinhas');
let bolas = [];
let intervaloTrocaNumeros;

function iniciarJogoDia() {
    const lArena = arena.clientWidth; const aArena = arena.clientHeight;
    for (let i = 1; i <= 31; i++) {
        const btn = document.createElement('div');
        btn.className = 'btn-caos'; btn.innerText = i; btn.dataset.valor = i;
        let posX = Math.random() * (lArena - 40); let posY = Math.random() * (aArena - 40);
        let velX = (Math.random() - 0.5) * 20; let velY = (Math.random() - 0.5) * 20;
        
        btn.addEventListener('click', function() {
            diaSelecionado = this.dataset.valor; 
            displayData.innerText = `[ ${diaSelecionado} ] / [ MÊS ] / [ ANO ]`;
            contDia.style.display = 'none'; contMes.style.display = 'block';
            clearInterval(intervaloTrocaNumeros); 
            iniciarJogoMes();
        });
        
        arena.appendChild(btn);
        bolas.push({ el: btn, x: posX, y: posY, vx: velX, vy: velY });
    }
    animarBolas();
    
    intervaloTrocaNumeros = setInterval(() => {
        let valores = [];
        for(let i=1; i<=31; i++) valores.push(i);
        valores.sort(() => Math.random() - 0.5);
        
        bolas.forEach((b, index) => {
            b.el.innerText = valores[index];
            b.el.dataset.valor = valores[index];
        });
    }, 2000);
}

function animarBolas() {
    if (diaSelecionado !== null) return; 
    bolas.forEach(b => {
        b.x += b.vx; b.y += b.vy;
        if (b.x <= 0 || b.x >= arena.clientWidth - 40) b.vx *= -1; 
        if (b.y <= 0 || b.y >= arena.clientHeight - 40) b.vy *= -1; 
        b.el.style.left = `${b.x}px`; b.el.style.top = `${b.y}px`;
    });
    requestAnimationFrame(animarBolas);
}

// ==========================================
// FASE 2: REATOR QUÂNTICO (O MÊS)
// ==========================================
let reatorInterval;
let valorMes = 1;

function iniciarJogoMes() {
    atualizarVisorMes();
    reatorInterval = setInterval(cicloReator, 700);
    moverBotaoTravar(); 
}

function cicloReator() {
    valorMes--;
    if (valorMes < 1) valorMes = 12; 
    atualizarVisorMes();
    moverBotaoTravar();
}

function atualizarVisorMes() {
    document.getElementById('mes-display-gigante').innerText = valorMes.toString().padStart(2, '0');
    document.getElementById('mes-nome-display').innerText = nomesMeses[valorMes - 1];
}

function moverBotaoTravar() {
    const btn = document.getElementById('btn-confirmar-mes');
    const maxX = contMes.clientWidth - btn.clientWidth - 20;
    const maxY = contMes.clientHeight - btn.clientHeight - 20;
    const novoX = Math.max(10, Math.floor(Math.random() * maxX));
    const novoY = Math.max(100, Math.floor(Math.random() * maxY)); 
    btn.style.left = `${novoX}px`;
    btn.style.top = `${novoY}px`;
}

document.getElementById('btn-impulso').addEventListener('click', () => {
    valorMes += 5;
    if (valorMes > 12) valorMes -= 12; 
    atualizarVisorMes();
});

document.getElementById('btn-confirmar-mes').addEventListener('click', () => {
    clearInterval(reatorInterval); 
    mesSelecionado = valorMes;
    displayData.innerText = `[ ${diaSelecionado} ] / [ ${mesSelecionado} ] / [ ANO ]`;
    contMes.style.display = 'none'; contAno.style.display = 'block';
    iniciarJogoAno();
});

// ==========================================
// FASE 3: ANO
// ==========================================
const tecladoContainer = document.getElementById('teclado-container');
const anoDisplay = document.getElementById('ano-display');
let intervaloTeclado;

function iniciarJogoAno() {
    renderizarTeclado();
    intervaloTeclado = setInterval(renderizarTeclado, 700);
}

function renderizarTeclado() {
    if(anoSelecionado.length === 4) return; 
    tecladoContainer.innerHTML = ''; 
    
    let numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    numeros.sort(() => Math.random() - 0.5);
    const rotacoes = [0, 90, 180, 270]; 

    numeros.forEach(num => {
        let btn = document.createElement('button');
        btn.className = 'btn-tecla';
        btn.innerText = num;
        
        let rotacaoAleatoria = rotacoes[Math.floor(Math.random() * rotacoes.length)];
        btn.style.transform = `rotate(${rotacaoAleatoria}deg)`;
        
        btn.onclick = () => {
            if (anoSelecionado.length < 4) {
                anoSelecionado += num;
                anoDisplay.innerText = anoSelecionado.padEnd(4, '_');
                
                if (anoSelecionado.length === 4) {
                    clearInterval(intervaloTeclado); 
                    displayData.innerText = `[ ${diaSelecionado} ] / [ ${mesSelecionado} ] / [ ${anoSelecionado} ]`;
                    setTimeout(() => {
                        contAno.style.display = 'none'; contChefao.style.display = 'block';
                        iniciarChefao();
                    }, 500); 
                } else {
                    clearInterval(intervaloTeclado);
                    renderizarTeclado();
                    intervaloTeclado = setInterval(renderizarTeclado, 700);
                }
            }
        };
        tecladoContainer.appendChild(btn);
    });
}

document.getElementById('btn-limpar-ano').addEventListener('click', () => {
    anoSelecionado = ""; anoDisplay.innerText = "____";
});

// ==========================================
// CHEFÃO FINAL
// ==========================================
let enxameBotoes = [];

function iniciarChefao() {
    const quantidadeFalsos = 14;
    const lArena = contChefao.clientWidth; const aArena = contChefao.clientHeight;

    const btnVerdadeiro = document.createElement('button');
    btnVerdadeiro.className = 'btn-verdadeiro';
    btnVerdadeiro.innerText = 'SALVAR';
    btnVerdadeiro.style.left = `${Math.random() * (lArena - 100)}px`;
    btnVerdadeiro.style.top = `${100 + Math.random() * (aArena - 150)}px`;
    
    btnVerdadeiro.addEventListener('click', () => {
        alert(`🔥 IMPRESSIONANTE! 🔥\nSobreviveu ao Nível Pesadelo!\n\nData final: ${diaSelecionado}/${mesSelecionado}/${anoSelecionado}\n\nConecte isso ao IndexedDB e entregue o projeto!`);
    });
    btnVerdadeiro.addEventListener('mouseenter', moverBotaoAleatoriamente);
    
    contChefao.appendChild(btnVerdadeiro);
    enxameBotoes.push({ el: btnVerdadeiro, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10 });

    for(let i=0; i<quantidadeFalsos; i++) {
        let btnFalso = document.createElement('button');
        btnFalso.className = 'btn-falso';
        btnFalso.innerText = 'SALVAR';
        btnFalso.style.left = `${Math.random() * (lArena - 100)}px`;
        btnFalso.style.top = `${100 + Math.random() * (aArena - 150)}px`;
        
        btnFalso.addEventListener('click', () => {
            alert("⚠️ ERRO! Botão Falso! Tente novamente.");
            moverBotaoAleatoriamente.call(btnFalso); 
        });
        btnFalso.addEventListener('mouseenter', moverBotaoAleatoriamente);

        contChefao.appendChild(btnFalso);
        enxameBotoes.push({ el: btnFalso, vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15 });
    }

    animarEnxame();
}

function moverBotaoAleatoriamente() {
    const maxX = contChefao.clientWidth - this.clientWidth - 10;
    const maxY = contChefao.clientHeight - this.clientHeight - 10;
    const novoX = Math.max(10, Math.floor(Math.random() * maxX));
    const novoY = Math.max(80, Math.floor(Math.random() * maxY)); 
    this.style.left = `${novoX}px`;
    this.style.top = `${novoY}px`;
}

function animarEnxame() {
    enxameBotoes.forEach(b => {
        let posX = parseFloat(b.el.style.left) || 0;
        let posY = parseFloat(b.el.style.top) || 100;
        posX += b.vx; posY += b.vy;

        if (posX <= 0 || posX >= contChefao.clientWidth - 80) b.vx *= -1; 
        if (posY <= 80 || posY >= contChefao.clientHeight - 40) b.vy *= -1; 

        b.el.style.left = `${posX}px`; b.el.style.top = `${posY}px`;
    });
    requestAnimationFrame(animarEnxame);
}

window.onload = iniciarJogoDia;


/* =======================================================
    LÓGICA DOS BICHINHOS PARA O TEMA PASTEL (ATUALIZADO)
    ======================================================= */
function instanciarFilhotes() {
    const container = document.getElementById('pets-container');
    
    // DICA: Para usar as imagens que você fez upload, você pode remover o innerText 
    // e adicionar uma tag <img> ou usar background-image pelo CSS na div do pet!
    const listaPets = ['🐶', '🐱', '🐰', '🐹', '🐼', '🦊', '🐸', '🐣'];
    
    // Aumentei para 12 filhotes para preencher bem as 4 bordas
    for (let i = 0; i < 12; i++) {
        let pet = document.createElement('div');
        pet.className = 'bichinho-pet';
        pet.innerText = listaPets[Math.floor(Math.random() * listaPets.length)];
        
        // O perímetro da tela vai de 0 a 400:
        // 0-100: Topo | 100-200: Direita | 200-300: Base | 300-400: Esquerda
        let perimetro = Math.random() * 400; 
        let sentido = Math.random() > 0.5 ? 1 : -1; // 1 = Horário, -1 = Anti-horário
        let velocidade = (Math.random() * 0.15 + 0.08) * sentido; 
        
        container.appendChild(pet);

        function passearPelasBordas() {
            perimetro += velocidade;
            
            // Mantém o valor em um loop infinito de 0 a 400
            if (perimetro >= 400) perimetro -= 400;
            if (perimetro < 0) perimetro += 400;

            let posX, posY, espelhar;

            // Lógica para mapear o número (0-400) nas coordenadas X e Y
            if (perimetro < 100) {
                // Andando no TOPO (0 a 100)
                posX = perimetro;
                posY = 0;
                espelhar = velocidade > 0 ? -1 : 1;
            } else if (perimetro < 200) {
                // Andando na DIREITA (100 a 200)
                posX = 100;
                posY = perimetro - 100;
                espelhar = velocidade > 0 ? -1 : 1; 
            } else if (perimetro < 300) {
                // Andando na BASE (200 a 300)
                posX = 100 - (perimetro - 200);
                posY = 100;
                espelhar = velocidade > 0 ? 1 : -1;
            } else {
                // Andando na ESQUERDA (300 a 400)
                posX = 0;
                posY = 100 - (perimetro - 300);
                espelhar = velocidade > 0 ? 1 : -1;
            }

            // Multiplicamos por 0.95 para eles não saírem totalmente da área visível (overflow)
            pet.style.left = `${posX * 0.95}vw`;
            pet.style.top = `${posY * 0.94}vh`;
            
            // Vira o rostinho dependendo se está indo para frente ou para trás
            pet.style.transform = `scaleX(${espelhar})`;
            
            requestAnimationFrame(passearPelasBordas);
        }
        
        passearPelasBordas();
    }
}

instanciarFilhotes();
/* ======================================================= */
