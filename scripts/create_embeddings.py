from src.embeddings import TextEmbedder
from src.db import PgVectorConnection

file_path = "data/kb.txt"
embedder = TextEmbedder()
embeddings = embedder.generate_embeddings_from_file(file_path)
if embeddings is None:
    raise Exception("An error occurred while generating the embeddings.")
print(f"Generated {len(embeddings)} embeddings.")

db = PgVectorConnection(migrate_mode=True)
db.save_embeddings(embeddings)
print("Embeddings saved!")