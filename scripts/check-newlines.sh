#!/usr/bin/env bash

missing_files=0

echo "🔍 Checking newline at end of all text files..."

find . \
  -type f \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  -exec sh -c '
    file="$1"
    if file "$file" | grep -iqE "text"; then
      if ! tail -c1 "$file" | read -r _; then
        printf "❌ NO NEWLINE: %s\n" "$file"
        exit 1
      else
        printf "✔ OK: %s\n" "$file"
      fi
    fi
  ' _ {} \; || missing_files=$?

if [ "$missing_files" -eq 0 ]; then
  echo "🎉 All files have correct newline!"
else
  echo "⚠️ Some files are missing newline!"
  exit 1
fi



