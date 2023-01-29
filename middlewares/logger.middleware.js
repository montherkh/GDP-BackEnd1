const { STATUS_CODES } = require('http'); //destructuring assignment.

/**
 * A simple logger middleware that logs the request method and path.
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware function.
 */
module.exports = (req, res, next) => { //putting code in the exports object to be seen and imported as a module.
    const { method, url } = req; //const method = req.method; const url = req.url;
    // method = (GET, POST...etc)
    // url = //abc

    res.removeHeader('X-Powered-By');

    console.info(`${method.toUpperCase()} ${url}`);

    next();
};
