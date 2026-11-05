#!/bin/sh
# Create the link page for one affiliate: ./new-affiliate.sh DANI23
# The code must match public.affiliates.code (capital letters and numbers, max 10).
CODE=$(printf '%s' "$1" | tr '[:lower:]' '[:upper:]' | tr -cd 'A-Z0-9' | cut -c1-10)
[ -n "$CODE" ] || { echo "Usage: ./new-affiliate.sh CODE"; exit 1; }
mkdir -p "$CODE"
sed "s/__CODE__/$CODE/" _template.html > "$CODE/index.html"
echo "Created $CODE/index.html -> https://go.veraid.org/$CODE"
