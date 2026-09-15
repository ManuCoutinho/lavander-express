# Lavander Express

Land page para o projeto de CI/CD do Lavander Express criado para a disciplina de DevOps do curso de ADS PUC/PR.

Site estático em HTML, CSS e JavaScript puro — sem build, sem dependências.

## Rodando localmente

Sem Docker:

```bash
python3 -m http.server 8000
```

Com Docker:

```bash
docker build -t lavander-express:local .
docker run -d --name lavander-express -p 8080:80 lavander-express:local
```

Ou com Compose:

```bash
docker compose up -d --build
```

Acesse http://localhost:8080.

## Provando que o container está rodando

```bash
docker ps --filter name=lavander-express            # STATUS deve mostrar (healthy)
curl -i http://localhost:8080/health                # 200 + "ok"
curl -s http://localhost:8080/ | head -5            # HTML da landing page
docker logs lavander-express                        # requisições atendidas pelo nginx
```

Para derrubar:

```bash
docker rm -f lavander-express   # ou: docker compose down
```

## Esteira

| Workflow | Arquivo | O que faz |
| --- | --- | --- |
| Pages | `.github/workflows/static.yml` | publica o site estático no GitHub Pages a cada push na `main` |
| Docker | `.github/workflows/docker.yml` | build da imagem, sobe o container, valida healthcheck e smoke test, publica no GHCR |

A imagem publicada fica em `ghcr.io/<owner>/<repo>` com as tags `latest` e `sha-<commit>`:

```bash
docker run -p 8080:80 ghcr.io/<owner>/<repo>:latest
```

### Configuração necessária no GitHub

- **Settings → Pages → Source: GitHub Actions** (senão o deploy do Pages falha).
- O push para o GHCR usa o `GITHUB_TOKEN`, sem secret extra. Para baixar a imagem sem autenticar, marque o pacote como público em **Packages → Package settings → Change visibility**.
