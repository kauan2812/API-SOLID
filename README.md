# 🏋️ API SOLID - GymPass Style App

API REST para gerenciamento de academias e check-ins, desenvolvida seguindo os princípios **SOLID** e boas práticas de arquitetura limpa.

## 🚀 Tecnologias

- **Bun** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Fastify** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **Docker** - Containerização
- **Zod** - Validação de dados
- **bcryptjs** - Criptografia de senhas

## 🏗️ Arquitetura

Projeto desenvolvido aplicando os **princípios SOLID**:

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Substituição de objetos por suas subclasses
- **I**nterface Segregation: Interfaces específicas e coesas
- **D**ependency Inversion: Dependência de abstrações, não implementações

### Padrões Utilizados

- **Repository Pattern** - Abstração da camada de dados
- **Use Cases** - Encapsulamento das regras de negócio
- **Dependency Injection** - Inversão de dependências
- **Error Handling** - Tratamento centralizado de erros

## ⚡ Como Executar

### Pré-requisitos
- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)

### 1. Clone e instale dependências
```bash
git clone <seu-repositorio>
cd API-SOLID
bun install
```

### 2. Configure ambiente
```bash
cp .env.exemple .env
```

### 3. Inicie o banco de dados
```bash
docker-compose up -d
```

### 4. Execute as migrações
```bash
bun prisma migrate dev
```

### 5. Inicie o servidor
```bash
bun run dev
```

Servidor rodando em: `http://localhost:3333`

## 📋 Funcionalidades

### ✅ Implementadas
- Cadastro de usuários
- Autenticação
- Perfil do usuário
- Check-in em academias
- Cadastro de academias

### 🚧 Em desenvolvimento
- Histórico de check-ins
- Busca de academias
- Validação de check-ins
- Autenticação JWT
- Paginação

## 🧪 Testes

```bash
bun test
```

## 📡 Endpoints

```
POST /users     - Cadastrar usuário
POST /sessions  - Autenticar usuário
```

## 🎯 Conceitos de Estudo

- Princípios SOLID
- Clean Architecture
- Repository Pattern
- Dependency Injection
- Unit Testing
- Error Handling
- Data Validation

---

⭐ Projeto desenvolvido para fins de estudo e aplicação de boas práticas de desenvolvimento!

<br>

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (Até 10KM);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);