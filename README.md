# 🐱 CutVerse V1

> Cute • Random • Fun ✨

CutVerse é uma experiência web nostálgica que entrega conteúdo aleatório usando um backend FastAPI.
O usuário aperta o botão "Girar Sorte" e recebe uma surpresa gerada a partir de APIs públicas.

---

## 🚀 O que está pronto

* Interface kawaii em HTML, CSS e JavaScript puro
* Backend Python com FastAPI
* Rota única `/api/random` que escolhe uma API aleatória
* Integração com várias APIs externas
* Suporte para imagens e GIFs
* Estrutura de projeto limpa para expansão futura

---

## 🧩 Arquitetura

O frontend não chama APIs externas diretamente.
O fluxo é:

1. Frontend faz `fetch('/api/random')`
2. Backend FastAPI seleciona uma API disponível
3. Backend retorna a URL do conteúdo para o frontend
4. Frontend exibe a surpresa na tela

---

## 📁 Estrutura do projeto

```text
cutverse/

├── Frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
│
├── Backend/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── random.py
│   │   └── schemas.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── providers.py
│   ├── __init__.py
│   └── main.py
│
├── index.html
├── home.html
├── requirements.txt
└── README.md
```

---

## 🧪 APIs integradas

* CATAAS (Gatos)
* The Cat API (Gatos)
* Dog API (Cachorros)
* Random Fox (Raposas)
* Random Duck (Patos)
* Shibe Online (Shibes)
* Capybara API (Capivaras)
* Meme API (Memes)
* Tenor (GIFs)
* Picsum (Imagens aleatórias)

---

## 🛠 Instalação local

1. Crie e ative um ambiente virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Instale as dependências:

```powershell
pip install -r requirements.txt
```

3. Inicie o backend:

```powershell
uvicorn Backend.main:app --reload --host 0.0.0.0 --port 8000
```

4. Abra `home.html` no navegador ou use um servidor estático local.

> Se você estiver servindo o frontend em outra origem, ajuste `window.CUTVERSE_API_URL` em `home.html` para o endereço do backend.

---

## 💡 Notas de deploy

* Frontend pode ser hospedado no GitHub Pages
* Backend pode ser hospedado no Render, Koyeb ou outra plataforma compatível com FastAPI
* No deploy, garanta que o frontend aponte para o backend remoto usando `window.CUTVERSE_API_URL`

---

## 🌸 Roadmap

### V2

* Cache inteligente
* Mais fontes de conteúdo
* Layout ainda mais colecionável

### V3

* Biblioteca própria de mídia
* Estrutura pronta para uploads e conteúdo gerado pela comunidade

---

## 💖 Filosofia

CutVerse é sobre surpresas simples e diversão instantânea.
Cada clique deve ser uma descoberta fofa e nostálgica.
