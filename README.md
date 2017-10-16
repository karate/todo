# ToDo web app

A proof-of-concept dockerized flask API with a JS client

## Run locally with python
```
$ pip install -r requirements.txt
$ python app.py
```

## Build with docker
```
docker build -t todo:latest .
docker run -p 5000:5000 todo
```

## Usage
Visit localhost:5000