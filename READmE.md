# Iplan

Iplan is a simple task management app.

## Getting Started

You have to add a .env file in the root directory of the project. The .env file contains all environmental variables that 
are needed to up and run this api. After you added then .env file to the root of the project dir you have add this variables to your .env file and edit if there is anything that has to
e changed depending on your machine:
```
NODE_ENV      = 'development'
AUTHOR        = 'eliasandualem8@gmail.com'
VERSION       = 'v1'
PORT          = '3000'
BASE_URL      = '/v1'

MONGO_URI        = 'mongodb://localhost:27017/iplan'
MONGO_URI_TESTS  = 'mongodb://localhost:27017/iplan_test'
```

### Installing

```
npm install
npm start
```

You can check the postman collection [here](https://www.getpostman.com/collections/f52c5faa591387fd27fa).


## Built With

* [Expressjs](https://expressjs.com/) - The web framework used

## Authors

* **Elias Andualem** - *Initial work* - [Iplan](https://github.com/Elias8/Iplan-api)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

