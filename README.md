# Sushini 🍣

## TODO
- [x] add new sushi to the db
- [x] get varierties from the db
- [x] add varieties from admin
- [x] update stock from admin
- [ ] order from chat and discount stock
- [ ] order and register purchase

### details

- db name: sushini
- frontend -> 5173
- mongoDB port -> 27017
- llama engine -> 8080
- pgvector -> 5432

## how to run

- launch the docker compose
```bash
cd infra/
sudo docker compose up 
```

- navigate to the scripts folder and install the virtual enviroment

```bash
cd scripts/
./install_env.sh
```
- source this new virtual env
```bash
source .venv/bin/activate
```

- create the embeddings from the knowledge base
```bash
./install_env.sh
```

