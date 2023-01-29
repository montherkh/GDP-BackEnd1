// TODO: Create auth service that will do the following:
// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.
// 2. Create a method that will take in a token and return the user's who owns the token.
const { randomBytes } = require("crypto");
const tokens = require('../databases/tokens');
const Token = require('../models/token.model');
const { usersService } = require("../services/users.service");

class AuthService {
    database;
    userService;

    constructor(database, userService) {
        this.database = database;
        this.userService = userService;
    }

    authenticate(email, password) {
        try {
            const user = this.userService.findUserByEmail(email);

            if (user.password === password) {
                return this.generate(user.id);
            }
            else {
                throw new Error("Passwords don't match");
            }

        } catch (error) {
            throw new Error(error);
        }
    }

    getUser(token) {
        try {
            const id = this.getID(token);

            return this.userService.findOneOrFail(id);

        } catch (error) {
            throw new Error(error);
        }
    }

    generate(id) {
        const index = this.database.findIndex(function (token) {
            return token.userID === id;
        });

        if (index != -1) {
            this.database.splice(index, 1); //deleting the previous token
        }

        const token = new Token(id, randomBytes(64).toString("base64"));
        this.database.push(token);

        return token;
    }

    getID(token) {
        const userToken = this.database.find(function (res) {
            return res.token === token;
        });

        if (!userToken) {
            throw new Error("Token doesn't exist");
        }

        return userToken.userID;
    }
}

const authService = new AuthService(tokens, usersService);

module.exports = authService;