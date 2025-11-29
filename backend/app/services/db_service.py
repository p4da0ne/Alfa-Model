import psycopg2
import psycopg2.extras
from typing import Dict, Any

DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "alfa_db",
    "user": "postgres",
    "password": "password"
}

def get_features(client_id: int) -> Dict[str, Any]:
    query = """
        SELECT *
        FROM client_features
        WHERE client_id = %s
    """

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query, (client_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return dict(row)
        else:
            return {}
    except Exception as e:
        print(f"Ошибка при получении признаков для client_id={client_id}: {e}")
        return {}