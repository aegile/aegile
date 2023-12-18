import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler("test.log")
stream_handler = logging.StreamHandler()
formatter = logging.Formatter(
    "127.0.0.1 - - [%(asctime)s] %(levelname)s %(message)s", datefmt="%d/%b/%Y %H:%M:%S"
)
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)

if not logger.handlers:
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)
