#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# inject-i18n.sh — Run this in your website root folder
# It adds <script src="i18n.js"></script> after every <body> tag
# ═══════════════════════════════════════════════════════════════

echo "🔧 Injecting i18n.js into all HTML files..."

count=0
for f in *.html; do
  [ -f "$f" ] || continue
  
  # Skip if already has i18n.js
  if grep -q 'i18n.js' "$f"; then
    echo "  ⏭  $f (already has i18n.js)"
    continue
  fi
  
  # Insert <script src="i18n.js"></script> right after <body...>
  # Works with <body> or <body style="..."> etc.
  sed -i.bak 's|<body\([^>]*\)>|<body\1>\n<script src="i18n.js"></script>|I' "$f"
  
  count=$((count + 1))
  echo "  ✅ $f"
done

# Clean up .bak files
rm -f *.html.bak

echo ""
echo "✨ Done! Injected i18n.js into $count files."
echo "   Make sure i18n.js is in the same folder as your HTML files."
