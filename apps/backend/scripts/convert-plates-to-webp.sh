#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLATES_DIR="${SCRIPT_DIR}/../public/plates"
QUALITY="${QUALITY:-82}"
MAX_WIDTH="${MAX_WIDTH:-1200}"
OVERWRITE=0
DELETE_PNG=0

for arg in "$@"; do
  case "$arg" in
    --force)
      OVERWRITE=1
      ;;
    --delete-png)
      DELETE_PNG=1
      ;;
    *)
      echo "Argumento no reconocido: $arg" >&2
      echo "Uso: bash apps/backend/scripts/convert-plates-to-webp.sh [--force] [--delete-png]" >&2
      exit 1
      ;;
  esac
done

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg no esta instalado o no esta disponible en PATH." >&2
  exit 1
fi

if [ ! -d "$PLATES_DIR" ]; then
  echo "No existe el directorio de imagenes: $PLATES_DIR" >&2
  exit 1
fi

shopt -s nullglob
png_files=("$PLATES_DIR"/*.png)

if [ "${#png_files[@]}" -eq 0 ]; then
  echo "No hay archivos PNG para convertir en $PLATES_DIR"
  exit 0
fi

converted=0
skipped=0

for input_path in "${png_files[@]}"; do
  output_path="${input_path%.png}.webp"

  if [ -f "$output_path" ] && [ "$OVERWRITE" -ne 1 ]; then
    echo "Saltando $(basename "$input_path"): ya existe $(basename "$output_path")"
    skipped=$((skipped + 1))
    continue
  fi

  ffmpeg -hide_banner -loglevel error \
    $( [ "$OVERWRITE" -eq 1 ] && printf '%s' "-y" || printf '%s' "-n" ) \
    -i "$input_path" \
    -vf "scale='min(iw,${MAX_WIDTH})':-2:flags=lanczos" \
    -c:v libwebp \
    -quality "$QUALITY" \
    -compression_level 6 \
    -preset picture \
    "$output_path"

  if [ "$DELETE_PNG" -eq 1 ]; then
    rm "$input_path"
  fi

  echo "Convertida $(basename "$input_path") -> $(basename "$output_path")"
  converted=$((converted + 1))
done

echo
echo "Conversion terminada:"
echo "- Convertidas: $converted"
echo "- Omitidas: $skipped"
echo "- Directorio: $PLATES_DIR"
