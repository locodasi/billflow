#!/usr/bin/env bash
#./scripts/dev/migrate.sh [migration_name]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"   # ajustá según cuántos niveles hay
SUPABASE_DIR="$REPO_ROOT"

MIGRATION_NAME="${1:-remote_schema}"

if [ -f "$REPO_ROOT/.env" ]; then
  set -a
  source "$REPO_ROOT/.env"
  set +a
fi

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  read -rsp "SUPABASE_ACCESS_TOKEN: " SUPABASE_ACCESS_TOKEN
  echo
fi
export SUPABASE_ACCESS_TOKEN

if [ -z "${CLOUD_DEV_PROJECT_REF:-}" ]; then
  read -rp "CLOUD_DEV_PROJECT_REF: " CLOUD_DEV_PROJECT_REF
fi

echo "==> Iniciando link con proyecto dev"
supabase --workdir "$SUPABASE_DIR" link --project-ref "$CLOUD_DEV_PROJECT_REF"

echo "==> Obteniendo diff de schema public y user_tables..."

supabase --workdir "$SUPABASE_DIR" db diff \
  --linked \
  --schema public \
  -f "$MIGRATION_NAME"

GENERATED_FILE="$(ls -t "$SUPABASE_DIR/supabase/migrations"/*_"${MIGRATION_NAME}".sql 2>/dev/null | head -n1 || true)"

if [ -z "$GENERATED_FILE" ]; then
  echo "ERROR: no se encontró el archivo de migración generado para '$MIGRATION_NAME'" >&2
  exit 1
fi

echo "==> Listo. Migración generada: $GENERATED_FILE"

echo ""
echo "⚠️  ================================================"
echo "⚠️   REVISAR ANTES DE APLICAR ESTA MIGRACIÓN"
echo "⚠️  ================================================"
echo ""
echo "1) Revisá el .sql generado a mano antes de pushear — el diff"
echo "   automático puede incluir cambios no deseados o faltar algo."
echo ""
echo "2) Las Edge Functions NO se copian con este script — se cargan"
echo "   aparte en supabase/functions/<nombre-funcion>/index.ts"
echo "   (una carpeta por función, con su index.ts adentro; si usás"
echo "   código compartido entre funciones, va en supabase/functions/_shared/)."
echo ""
echo "⚠️  ================================================"
echo ""

read -rp "¿Querés pushear esta migración a producción? [y/N]: " CONFIRM_PUSH

if [[ ! "$CONFIRM_PUSH" =~ ^[Yy]$ ]]; then
  echo "==> Cancelado. La migración quedó generada en: $GENERATED_FILE"
  exit 0
fi

if [ -z "${CLOUD_PROD_PROJECT_REF:-}" ]; then
  read -rp "CLOUD_PROD_PROJECT_REF: " CLOUD_PROD_PROJECT_REF
fi

echo "==> Iniciando link con proyecto prod"
supabase --workdir "$SUPABASE_DIR" link --project-ref "$CLOUD_PROD_PROJECT_REF"

echo "==> Pusheando migración a producción..."
supabase --workdir "$SUPABASE_DIR" db push --linked

echo "==> Migración aplicada en producción."