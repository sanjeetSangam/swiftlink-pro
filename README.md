# 🚀 SwiftLink Pro: Enterprise-Grade Link Management

**SwiftLink Pro** is a high-performance, containerized link shortening platform built to demonstrate master-level Full-Stack and DevOps practices. It features a professional multi-service architecture, automated quality gates, and a secure reverse-proxy infrastructure.

---

## 🏗️ Architecture Blueprint

The project is structured as a **Monorepo**, separating concerns into distinct, isolated services that communicate over a private Docker network.

- **`/web`**: Next.js (App Router) Dashboard for link management.
- **`/api`**: FastAPI (Python 3.11) high-concurrency redirection engine.
- **`/infra`**: Infrastructure-as-Code (Caddy Reverse Proxy configuration).
- **`Database`**: Persistent MongoDB storage with automated health tracking.

---

## 🛠️ Technology Stack

| Layer             | Technology                                                                                                                           |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**      | [Next.js](https://nextjs.org/) (Standalone Node.js build)                                                                            |
| **Backend**       | [FastAPI](https://fastapi.tiangolo.com/) + [Motor](https://motor.readthedocs.io/) (Async MongoDB)                                    |
| **Database**      | [MongoDB 7.0](https://www.mongodb.com/)                                                                                              |
| **Proxy**         | [Caddy v2](https://caddyserver.com/) (Automated Reverse Proxy & SSL)                                                                 |
| **Orchestration** | [Docker Compose](https://docs.docker.com/compose/)                                                                                   |
| **Quality Gates** | [Husky](https://typicode.github.io/husky/), [lint-staged](https://github.com/lint-staged/lint-staged), [Ruff](https://beta.ruff.rs/) |
| **CI/CD**         | [GitHub Actions](https://github.com/features/actions)                                                                                |

---

## 🧠 Key DevOps Learnings & Features

### 1. **Multi-Stage Containerization**

We implemented production-grade `Dockerfiles` using multi-stage builds. This ensures that the final images are lightweight and do not contain build-time dependencies (like source code or compilers), significantly reducing the attack surface.

### 2. **Professional Orchestration & Healthchecks**

The `docker-compose.yml` isn't just a list of services. It uses **Status-aware Dependencies**. The API will not start until the Database is confirmed "Healthy" via an internal `mongosh` ping, preventing startup race conditions.

### 3. **The "Caddy" Reverse Proxy**

Instead of exposing multiple ports, we use Caddy as a single entry point.

- **Security**: All internal services (`web`, `api`, `db`) are hidden from the public internet.
- **Routing**: Caddy intelligently routes `/api/*` to the backend and `/` to the frontend using a prioritized matching algorithm.

### 4. **Environmental Resilience (12-Factor App)**

Configuration is strictly separated from code.

- **`.env`**: A centralized control panel for ports, URIs, and titles.
- **Pydantic `BaseSettings`**: Ensures the API validates and maps environment variables with type safety.

### 5. **Automated Quality Gates**

- **Pre-commit**: Automatically lints and formats code before you can commit.
- **Pre-push**: Automatically attempts a `docker-compose build` to ensure broken infrastructure never hits the remote repository.

---

## 🚀 Getting Started

### **Prerequisites**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running)

### **Local Setup**

1.  **Clone the Repo**:
    ```bash
    git clone <your-repo-url>
    cd swiftlink-pro
    ```
2.  **Initialize Environment**:
    Create a `.env` file in the root (Template provided in project).
3.  **Launch the Stack**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the Project**:
    - **Dashboard**: [http://localhost:8080](http://localhost:8080)
    - **API Health**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

---

## 📈 Future Roadmap

- [ ] **Phase 8**: Integrate Clerk/Auth0 for User Identity.
- [ ] **Phase 9**: Add Redis-based caching for high-speed redirection.
- [ ] **Phase 10**: Implement Grafana/Prometheus for infrastructure monitoring.

---

Created with ❤️ by **Sanjeet Sangam** (DevOps & Full Stack Engineer)
