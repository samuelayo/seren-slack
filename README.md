# Seren Slack
An Api that responds to bot slash commands and interactions.

### Installation 
Run the following 
```
1. $ git clone https://github.com/samuelayo/seren-slack.git
2. $ cd seren-slack
3. $ npm i 

```

### Running the app

- Rename `env.sample` file to `.env`, fill the variables and save.
- `DEFAULT_DATABASE_URI` Takes the default mongodb connection string.
- `PORT` Takes the port in which we want the app to run on, defaults to 8000 if not set.

#### Without Docker
Run
`$ npm start`

#### With Docker
Run the following
```
1. Build the docker image - $ docker build -t seren-slack .
2. Run the docker image - $ docker run -d -p 80:${PORT} seren-slack

```

### API Documentation
Navigate your browser to the /guide route of the app.

### Testing
To test the app, run:
` $ npm run test`