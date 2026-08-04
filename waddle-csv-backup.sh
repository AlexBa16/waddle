#!/usr/bin/env bash
# Exportiert stündlich alle Zeiteinträge aus der Waddle-Datenbank als CSV
set -euo pipefail

# ---- Konfiguration -------------------------------------------------
DB_CONTAINER="waddle-db"

# NUTZE EINEN ABSOLUTEN PFAD FÜR CRON!
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_BASE_DIR="${SCRIPT_DIR}/waddle-backups"

# Erstellt für jeden Tag einen eigenen Unterordner (z.B. waddle-backups/2026-08-04)
DATE_STAMP=$(date '+%Y-%m-%d')
TIME_STAMP=$(date '+%H%M%S')
BACKUP_DIR="${BACKUP_BASE_DIR}/${DATE_STAMP}"
# ---------------------------------------------------------------------

mkdir -p "$BACKUP_DIR"

if ! docker inspect "$DB_CONTAINER" >/dev/null 2>&1; then
    echo "$(date '+%F %T') FEHLER: Container '$DB_CONTAINER' läuft nicht." >&2
    exit 1
fi

DB_USER=$(docker exec "$DB_CONTAINER" printenv POSTGRES_USER)
DB_NAME=$(docker exec "$DB_CONTAINER" printenv POSTGRES_DB)

# Fallback falls Env-Variablen im Container nicht gesetzt sind
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-postgres}

# Liste aller Projekte (id|projectname) holen
PROJECT_LIST_SQL="SELECT id, project_name FROM project ORDER BY id;"
mapfile -t PROJECT_LINES < <(
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -t -A -F'|' <<< "$PROJECT_LIST_SQL"
)

COUNT=0
for line in "${PROJECT_LINES[@]}"; do
    [ -z "$line" ] && continue
    PID="${line%%|*}"
    PNAME="${line#*|}"

    SAFE_NAME=$(echo "$PNAME" | tr -c 'A-Za-z0-9_-' '_')
    # Dateiname enthält jetzt die Uhrzeit, um Überschreiben zu verhindern
    OUTFILE="$BACKUP_DIR/${SAFE_NAME}_project${PID}_${TIME_STAMP}.csv"
    TMPFILE="${OUTFILE}.tmp"

    SQL=$(cat <<SQLEOF
COPY (
    SELECT te.id                                           AS "ID",
           to_char(te.start_time, 'DD.MM.YYYY')            AS "Datum",
           to_char(te.start_time, 'HH24:MI')                AS "Von",
           to_char(te.end_time, 'HH24:MI')                  AS "Bis",
           to_char(te.end_time - te.start_time, 'HH24:MI')  AS "Dauer",
           te.description                                  AS "Beschreibung",
           COALESCE(u.username, 'Gelöschter Nutzer')       AS "Nutzer"
    FROM time_entry te
    LEFT JOIN "user" u ON u.id = te.tracked_by_id
    WHERE te.project_id = $PID
    ORDER BY te.start_time
) TO STDOUT WITH CSV HEADER
SQLEOF
)

    # Erst in temporäre Datei schreiben, bei Erfolg umbenennen
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<< "$SQL" > "$TMPFILE"
    mv "$TMPFILE" "$OUTFILE"

    COUNT=$((COUNT + 1))
done

echo "$(date '+%F %T') Backup abgeschlossen: $COUNT Projekt(e) -> $BACKUP_DIR"

## Crontab
# 0 * * * * /pfad/zu/waddle-csv-backup.sh >> /var/log/waddle-backup.log 2>&1
