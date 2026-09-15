FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Lavander Express" \
      org.opencontainers.image.description="Landing page estatica da lavanderia self service Lavander Express" \
      org.opencontainers.image.source="https://github.com/lavander-express/lavander-express"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css main.js /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
