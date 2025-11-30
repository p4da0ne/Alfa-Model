#!/bin/sh
# Копируем собранные файлы в volume при запуске контейнера
echo "Копирование собранных файлов в volume..."
rm -rf /volume/* /volume/.[!.]* 2>/dev/null || true
cp -a /usr/share/nginx/html/. /volume/ 2>/dev/null || true
echo "Файлы скопированы успешно. Ожидание..."
# Держим контейнер запущенным
tail -f /dev/null

