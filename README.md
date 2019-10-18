# Mutant-recruiting

API REST based on Koa server to detect if any human is a mutant.

#### Requirements
Things what you need to install the server
- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)

### Versions

Koa | Node | Yarn
--- | --- | ---
***2.10*** | ***=8.11.3*** | ***1.13.0***

### Get started
- Clone the project
```
git clone https://github.com/yofr4nk/mutant-recruiting.git
```

### Run docker-compose to install and run the server
```
docker-compose up
```

### After to install the app, you can go to
API | Method | Body
--- | --- | ---
***http://localhost:3001/mutants*** | ***POST*** | ***{ dna: ['CTA', 'GAT', 'CTA'] }***
***http://localhost:3001/stats*** | ***GET*** |

### To run tests
- make sure you have MongoDB instance running (There are component tests using the database).
- The test run with: 
```
- yarn test
- or
- yarn test:coverage
```

