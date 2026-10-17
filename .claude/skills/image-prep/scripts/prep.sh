#!/usr/bin/env bash
# Resize and compress one image for the site (macOS sips, no extra installs).
# Usage: prep.sh <input> <output.jpg|output.png> <width> [jpeg-quality=80]
# - Never upscales: if the input is narrower than <width>, it keeps the input width.
# - .jpg output flattens transparency; use .png only for logos/graphics with transparency.
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <input> <output.jpg|output.png> <width> [jpeg-quality=80]" >&2
  exit 2
fi

input=$1 output=$2 width=$3 quality=${4:-80}
ext=$(echo "${output##*.}" | tr '[:upper:]' '[:lower:]')

case "$ext" in
  jpg|jpeg) format=jpeg ;;
  png) format=png ;;
  *) echo "Output must be .jpg or .png (sips cannot write webp)" >&2; exit 2 ;;
esac

src_width=$(sips -g pixelWidth "$input" | awk '/pixelWidth/{print $2}')
has_alpha=$(sips -g hasAlpha "$input" | awk '/hasAlpha/{print $2}')
target=$(( src_width < width ? src_width : width ))

if [[ "$format" == jpeg && "$has_alpha" == yes ]]; then
  echo "note: input has an alpha channel; transparent areas will be flattened in the JPEG" >&2
fi

mkdir -p "$(dirname "$output")"
if [[ "$format" == jpeg ]]; then
  sips -s format jpeg -s formatOptions "$quality" --resampleWidth "$target" "$input" --out "$output" >/dev/null
else
  sips -s format png --resampleWidth "$target" "$input" --out "$output" >/dev/null
fi

in_kb=$(( $(stat -f %z "$input") / 1024 ))
out_kb=$(( $(stat -f %z "$output") / 1024 ))
dims=$(sips -g pixelWidth -g pixelHeight "$output" | awk '/pixel/{printf "%s", (n++ ? "x" : "") $2}')
echo "$output  ${dims}  ${in_kb} KB -> ${out_kb} KB"
