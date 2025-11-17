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
* Revalidação e experiência fluida

---

## 🛠 Processo de Desenvolvimento

O desenvolvimento deste desafio técnico seguiu um fluxo estruturado para garantir **qualidade, escalabilidade e clareza**:

1. **Planejamento e análise dos requisitos**
2. **Setup do projeto**
3. **Desenvolvimento Backend**
4. **Desenvolvimento Frontend**
5. **Integração e testes locais**
6. **Refinamento e boas práticas**

---

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

Aplicação disponível em:

👉 `http://localhost:3000`

---

## 📨 Observações sobre o envio de e-mail no ambiente local

* O sistema utiliza **uma caixa de e-mail simulada** para testes de convite.
* Uma nova aba abrirá no navegador com o e-mail simulado.
* Se a aba não abrir, habilite pop-ups ou permita janelas externas no navegador.

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

### 🔐 Autenticação com JWT (HttpOnly Cookie)

### 🏢 Multi-tenant com `activeCompanyId`

### 📄 Paginação no Backend

### 🧱 Controllers + Services

### 🎨 UI — Tailwind + Shadcn

### ⚙ `useCompanyActions` Hook

---

## 🔐 Fluxo de Convite por Token

1. Usuário envia convite
2. API gera JWT com `{ email, companyId }`
3. Link: `/signup?invite=<token>`
4. No signup: token é validado
5. Usuário é criado e recebe membership
6. `activeCompanyId` configurado automaticamente

---

## ⏱ Tempo Total Gasto

**De quarta-feira até segunda-feira (5 dias).**

---

## ✔ Conclusão

Este projeto foi desenvolvido com foco em:

* Segurança
* Escalabilidade
* Manutenibilidade
* Boas práticas
* Arquitetura limpa
* Experiência de usuário
* Fidelidade aos requisitos do desafio
