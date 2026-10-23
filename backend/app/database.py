import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

logger = logging.getLogger("rca.database")

def create_db_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("sqlite"):
            engine = create_engine(
                db_url,
                connect_args={"check_same_thread": False}
            )
        else:
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=3600
            )
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info(f"Connected to database using {db_url.split('@')[-1] if '@' in db_url else db_url}")
        return engine
    except Exception as e:
        logger.warning(f"Failed to connect to primary DB ({db_url}): {e}. Falling back to SQLite local database.")
        sqlite_fallback = "sqlite:///./rca_pharma.db"
        return create_engine(
            sqlite_fallback,
            connect_args={"check_same_thread": False}
        )

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
