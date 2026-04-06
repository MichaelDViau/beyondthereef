#!/usr/bin/env bash
set -euo pipefail

for f in *.html; do
  # remove old head include if present
  sed -i 's#<script defer src="assets/common/i18n.js"></script>##g' "$f"

  # inject right after first <body...> if missing
  if ! grep -q '<script src="i18n.js"></script>' "$f"; then
    perl -0777 -i -pe 's#(<body[^>]*>)#$1\n<script src="i18n.js"></script>#i' "$f"
  fi

done

echo "Injected i18n.js into HTML files."
