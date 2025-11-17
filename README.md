# 🧩 Altaa Digital — Desafio Técnico (SaaS Multi-Tenant)

Este repositório contém a solução completa do desafio técnico da **Altaa Digital**, desenvolvida utilizando **Next.js App Router**, **API Routes**, **PostgreSQL**, **Prisma**, autenticação via **JWT em HttpOnly Cookies**, e arquitetura escalável com isolamento multi-tenant baseado em `companyId`.

A aplicação implementa:

* Autenticação (login/signup)
* Multi-tenant com `activeCompanyId` por sessão
* Listagem de empresas e seleção de empresa ativa
* Gerenciamento de membros (CRUD + roles)
* Convite de usuários via token
* Isolamento por empresa em todas as queries
* UI moderna com Tailwind + Shadcn
* Arquitetura organizada com controllers, services, hooks e validações
* Paginação backend

## 📃 Sobre

Para o desenvolvimento desse projeto iniciei por entender o enunciado do desafio e planejar as funcionalidades. 

Utilizei diversas ferramentas, algumas eu já conhecia e outras não.

Busquei me atentar aos detalhes e entregar não só o necessário mas também todos os requisitos desejáveis, além de funcionalidades extras mas simples, como a alternância entre tema claro e escuro.

As funcionalidades desenvolvidas nesse projeto foram:

- Fluxo de cadastro
  - Login
  - Registro
  - Logout
- Dashboard
  - Listar empresas (com paginação)
  - Selecionar empresas
  - Criar empresa
- Empresa
  - Apagar empresa
  - Convidar membros (selecionando também o cargo do convite)
  - Expulsar membros
- Geral
  - Tema claro e escuro

## 🚀 Como rodar localmente

### 1. Clone o projeto

```bash
git clone git@github.com:lucasSCsantos/desafio-altaa.git
cd desafio-altaa
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz copiando o `.env.example`:

```bash
cp .env.example .env
```

Preencha com suas credenciais locais.

Exemplo de `.env.example`:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432

DATABASE_URL="postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>"

JWT_KEY=your_jwt_key
SENDER_EMAIL=your_email@example.com
```

> Observação: O fluxo de convite utiliza uma **caixa de e-mail simulada** no navegador, portanto **não é necessário nenhum serviço externo de e-mail**.

### 4. Suba o PostgreSQL (com Docker)

```bash
docker compose up -d
```

Ou manualmente:

```bash
docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 5. Rode as migrations

```bash
npx prisma migrate deploy
```

### 6. Rode o seed

```bash
npx prisma db seed
```

### 7. Execute o servidor

```bash
npm run dev
```

Aplicação local disponível em:

👉 `https://localhost:3000/`

Aplicação em produção disponível em:

👉 `https://desafio-altaa-one.vercel.app/`

---

# 📄 Documentação da API

A documentação completa da API pode ser visualizada em:

👉 **`/docs`** (rota em desenvolvimento usando Swagger)

---

# 🧪 CI e Qualidade

-   Lint\
-   Testes E2E\
-   Pipeline GitHub Actions com:
    -   install\
    -   lint\
    -   test
   
---

# 🔐 Segurança

-   Cookies HttpOnly + Secure + SameSite\
-   Hash de senha com bcrypt\
-   Validações Zod em toda a aplicação\
-   Usuário só acessa empresas onde possui membership\
-   Garantias:
    -   ADMIN não remove OWNER\
    -   Empresa nunca fica sem OWNER\
    -   Convites expiram\
    -   Convites duplicados retornam o existente
  
---

## 📨 Observações sobre o envio de e-mail no ambiente local

* O sistema utiliza **uma caixa de e-mail simulada** para testes de convite.
* Uma nova aba abrirá no navegador com o e-mail simulado.
* Se a aba não abrir, habilite pop-ups ou permita janelas externas no navegador.

---

## 🛠 Processo de Desenvolvimento

O desenvolvimento deste desafio técnico seguiu um fluxo estruturado para garantir **qualidade, escalabilidade e clareza**:


1. **Planejamento e análise dos requisitos**
   - Leitura e revisão do enunciado do desafio
   - Definição das funcionalidades essenciais
   - Pesquisa e design

2. **Setup do projeto**
   - Criação do projeto Next.js com App Router
   - Configuração do PostgreSQL com Docker
   - Integração com Prisma e geração do schema inicial

3. **Desenvolvimento Backend**
   - Estruturação em **controllers + services**
   - Implementação do **multi-tenant** via `activeCompanyId` por sessão
   - Autenticação JWT com cookies HttpOnly
   - Endpoints para gestão de empresas, membros e convites

4. **Desenvolvimento Frontend**
   - Estrutura de páginas públicas e privadas
   - Componentização com Tailwind + Shadcn
   - Hooks customizados (`useCompanyActions`, `useAuth`) para facilitar lógica e reuso
   - Feedbacks visuais e fluxo de usuário consistente

5. **Integração e testes locais**
   - Seed do banco para testes
   - Simulação do envio de e-mails em ambiente local
   - Testes manuais de fluxo de convite, login e seleção de empresa ativa

6. **Refinamento e boas práticas**
   - Implementação da **paginação backend** e validação de dados via Zod
   - Documentação da api com Swagger
   - Testes e2e com Cypress
   - Pipeline de CI para lint + test
   - Revisão de segurança e autenticação
   - Organização do código
   - Documentação do projeto e instruções de execução local

---

## 🏗 Arquitetura

```
├── 📁 .github
├── 📁 cypress
├── 📁 prisma
│   ├── 📁 migrations
├── 📁 public
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 (private)
│   │   │   ├── 📁 company
│   │   │   │   └── 📁 [id]
│   │   ├── 📁 (public)
│   │   │   ├── 📁 accept-invite
│   │   │   ├── 📁 login
│   │   │   └── 📁 signup
│   │   ├── 📁 api
│   │   │   ├── 📁 auth
│   │   │   │   ├── 📁 accept-invite
│   │   │   │   ├── 📁 login
│   │   │   │   ├── 📁 logout
│   │   │   │   ├── 📁 me
│   │   │   │   └── 📁 signup
│   │   │   ├── 📁 companies
│   │   │   └── 📁 company
│   │   │       ├── 📁 [id]
│   │   │       │   ├── 📁 invite
│   │   │       │   ├── 📁 select
│   │   │       ├── 📁 member
│   │   ├── 📁 docs
│   ├── 📁 components
│   │   ├── 📁 ui
│   ├── 📁 generated
│   ├── 📁 hooks
│   ├── 📁 lib
│   ├── 📁 modules
│   │   ├── 📁 company
│   │   ├── 📁 invite
│   │   ├── 📁 membership
│   │   └── 📁 user
│   ├── 📁 schemas
│   ├── 📁 types
```

---

## 🧠 Decisões Técnicas

### 🏢 App Router + API Routes
- Para manter backend e frontend no mesmo repositório e facilitar o fluxo de desenvolvimento e facilitar o deploy em uma única plataforma. Alm disso as rotas isoladas são mais fáceis de testar e entender

### 📄 Paginação no Backend

- Apesar de ser um projeto pequeno decidi seguir a boa prática de fazer a paginação no backend pra não ter risco de problemas de performance e tornar escalável

### 🎨 UI

- Decidi utilizar Tailwind + Shadcn UI para desenvolvimento das páginas e componentes, pois o shadcn tira a necessidade de baixar uma biblioteca completa de componentes. Além disso também tem fácil integração com a ferramenta v0 engine a qual utilizei para desenvolver o design
- Para logo da empresa utilizei emojis como representação para não ter que lidar com imagens considerando o tamanho do projeto

### ⚙ Testes

- Desenvolvi testes e2e, para testar fluxos básicos do sistema, os testes não atingem todas as funcionalidades, mas testam os fluxo de: login, registro e criação de empresa

---

## ✅ Entrega dos Requisitos

### Funcionalidades Obrigatórias
✔ Auth (signup/login/logout via JWT HttpOnly)  
✔ Multi-tenant com activeCompanyId  
✔ CRUD de empresas  
✔ Gerenciamento de membros com roles (OWNER / ADMIN / MEMBER)  
✔ Convites com token + fluxo completo  
✔ Paginação no backend  
✔ Proteção de rotas + middleware  
✔ Isolamento por companyId

### Diferenciais Entregues
✔ Docker + docker-compose  
✔ Seed automatizado (Prisma)  
✔ Testes E2E (Cypress)  
✔ CI com GitHub Actions (lint + test)  
✔ Swagger documentando toda API  
✔ Tema claro/escuro (bônus)  

## Boas Práticas Aplicadas
✔ Padrão de Services + Controllers
✔ Tratamento global de erros com resposta padronizada (ApiError)
✔ Tipagem forte end-to-end
✔ Pastas bem segmentadas por domínio
✔ Middleware de autorização por papel

---

## ⏱ Tempo Total Gasto

**De quarta-feira até segunda-feira (5 dias).**

---

## ✔ Conclusão

Este projeto foi desenvolvido buscando reproduzir, a arquitetura e as preocupações de um sistema SaaS multi-tenant. A solução aborda os pilares essenciais, segurança, isolamento de dados, escalabilidade e organização, e entrega uma base que pode ser expandida para cenários reais.