#!/bin/bash

set -e

echo "🔧 Corrigindo configuração do Nginx (acme-challenge)..."

NGINX_CONF="./nginx/default.conf"

# Faz backup antes
cp "$NGINX_CONF" "${NGINX_CONF}.bak"

# Substitui o root por alias corretamente
sed -i 's|root /var/www/certbot;|alias /var/www/certbot/.well-known/acme-challenge/;|' "$NGINX_CONF"

echo "✅ Configuração corrigida com alias."

echo "🔄 Reiniciando Nginx..."
docker-compose restart nginx
sleep 5

echo "📁 Criando diretório do desafio e arquivo de teste..."
mkdir -p certbot/www/.well-known/acme-challenge
echo "nginx_ok" > certbot/www/.well-known/acme-challenge/teste

echo "⏳ Aguardando alguns segundos para o Nginx responder..."
sleep 3

echo "🌐 Testando acesso ao arquivo de desafio..."
HTTP_TEST=$(curl -s http://cse.bomanejo.com.br/.well-known/acme-challenge/teste || echo "")

if [[ "$HTTP_TEST" == "nginx_ok" ]]; then
  echo "✅ Teste OK! Iniciando Certbot..."
else
  echo "❌ O arquivo de teste não respondeu corretamente. Verifique o Nginx e o domínio."
  exit 1
fi

echo "🚀 Executando Certbot..."
docker-compose run --rm certbot certonly \
	-v \
  --webroot --webroot-path=/var/www/certbot \
  --email michaelsoliveira@gmail.com \
  --agree-tos --no-eff-email \
  -d cse.bomanejo.com.br

echo "✅ Certificado gerado com sucesso!"

