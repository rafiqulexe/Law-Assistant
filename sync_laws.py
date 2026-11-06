"""Check the official Laws of Bangladesh site for new and amended laws.

    python sync_laws.py            # full run
    python sync_laws.py --limit 3  # only the first 3 tracked acts (quick test)

Schedule it monthly (for example a PythonAnywhere scheduled task).
"""
import argparse
import logging

from dotenv import load_dotenv

load_dotenv()

from src.database import init_db  # noqa: E402  (needs .env loaded first)
from src.law_sync import sync  # noqa: E402

if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()

    init_db()
    result = sync(limit=args.limit, progress=lambda line: print(line, flush=True))
    print(result)
