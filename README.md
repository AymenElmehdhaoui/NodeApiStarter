The main purpose of this repository is to display a reusable API project starter with Node.js TypeScript.
I will try to keep it as up-to-date as possible, but community contributions and recommendations for improvement are encouraged and welcome.

# Pre-reqs
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)

# Getting started
- Clone the repository
```
git clone https://github.com/AymenElmehdhaoui/NodeApiStarter.git <project_name>
```
- Install dependencies
```
cd <project_name>
npm install
```
- Configure your mongoDB server
```bash
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db
```
- Start your mongoDB server
```
mongod
```
- Build and run the project
```
npm run build
npm start
```
Finally, all the Api are available in `http://host:port/api/v1`, default URL `http://localhost:3000/api/v1` 

### Running TSLint
Like the rest of our build steps, we use npm scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build   // runs full build including TSLint
npm run tslint  // runs only TSLint
```

### Setup ENV file configuration
Set All the environment variables in the `.env.example` file. All this variables are available in `process.env`. 
Rename `.env.example` to `.env`

### Generate SSl certificate 
This step is optional. If you want to generate SSL certificate, run `./generate-ssl.sh`.
The SSL files will be available in `./dist/config/sslcerts`, If you want to use the HTTPS protocol, make sure that you set the `SECURE` env variable to true. all the Api are available in `https://host:port/api/v1/`, default URL `https://localhost:443/api/v1/` 

## Project Structure
The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship       |
| **node_modules**         | Contains all your npm dependencies |
| **postman**        |  Contains the exported Apis from PostMan |
| **src**                  | Contains your source code that will be compiled to the dist dir |
| **src/config**           | Express server, MongoDB initiation and options. you may find ssl certificates folder in dist/src/config if you run `./generate-ssl.sh`   |
| **src/routes/api**              |  Contains all your routes declarations  |
| **src/controllers**      | Controllers define functions that respond to various http requests |
| **src/models**           | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB       |
| **src/middlewares/policies**         |  Contains all your routers policies |
| **src/middlewares/helpers**         |  Contains all your helpers functions |
| **src/services**         |  Contains all your shared services |
| **src/templates**        |  Contains all email templates |
| **src**/server.ts        | Entry point to your express app |
| **src**/App.ts           | Init and create Express server |
| .env.example             | API keys, tokens, passwords, database URI... |
| .travis.yml              | Used to configure Travis CI build |
| package.json             | File that contains npm dependencies as well as build scripts |
| tsconfig.json            | Config settings for compiling server code written in TypeScript |
| tslint.json              | Config settings for TSLint code style checking |
| copyStaticFiles.ts       | Copy static files : email templates |
| generate-ssl.sh          | Generate the SSL certificates. This files will be available in `./dist/config/sslcerts`| 

### Users Roles
- guest: user not authenticated
- userNotConfirmed: authenticated user without account confirmation
- user: authenticated user with account confirmation
- admin: administrator

**Note!** All users inherit privilege from each other:  admin>user>userNotConfirmed>guest


### NPM scripts
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
Below is a list of all the scripts this template has available:


| Npm Script | Description  |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Does the same as 'npm run serve'. Can be invoked with `npm start` |
| `build`                   | Full build. Runs ALL build tasks (`build`, `start`)       |
| `dev`                     | Full build. Serve the build (`build-ts`, `tslint`)       |
| `serve`                   | Runs node on `dist/server.js` which is the apps entry point |
| `watch-node`              | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task          |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed                   | 
| `tslint`                  | Runs TSLint on project files |
| `debug`                   | Performs a full build and then serves the app in watch mode |
| `serve-debug`             | Runs the app with the --inspect flag |
| `copy-static-files`       | copy templates files in dist |

### Api routes
All the Apis are available in the `api` folder under `src`. 

All the apis starts with api version that you can set it up in `.env` file under `ApiVersion`.

The default `ApiVersion` is `/api/v1`. Some apis need user to authenticated, make sure that you send for JWT in the `AuthFlag` from the request header


| Api | roles  | Description  |
| ------------------------- | --------------------------- | --------------------------- |
| `/api/v1/auth/signup` | guest  | Sign up API: `post`  |
| `/api/v1/auth/signin` | guest  | Sign in API: `post`  |
| `/api/v1/auth/forgot` | guest  | forgot password API, send password email template to the provided email: `post`  |
| `/api/v1/auth/password/reset/:resetPasswordToken` | guest  | Reset password: `post`  |
| `/api/v1/auth/confirmation` | userNotConfirmed  | Send email to ask account confirmation: `post`  |
| `/api/v1/auth/confirmation/:userID` | userNotConfirmed  | Confirm account: `get`  |
| `/api/v1/users/:userId` | admin  | Get user by Id: `get`  |
| `/api/v1/users/:userId` | admin or current user | Update user by Id: `patch`  |
| `/api/v1/users/:userId` | admin or current user  | Delete user by Id: `delete`  |
| `/api/v1/me` | current user  | get current user : `get`  |
| `/api/v1/me` | current user  | Update current user : `patch`  |
| `/api/v1/me` | current user  | Delete current user : `delete`  |
| `/api/v1/articles` | User must be authenticated  | Delete all articles : `get`  |
| `/api/v1/articles` | admin ou user| Create article : `post`  |
| `/api/v1/articles/:articleId` | User must be authenticated  | Get article By Id : `get`  |
| `/api/v1/articles/:articleId` | admin or user  | Update article By Id : `put`  |
| `/api/v1/articles/:articleId` | admin or user  | Delete article By Id : `delete`  |
All the Apis are available in the postman folder exported as postman json collection
This module cover
- Configurable environment (.env)
- Authentication (JWT)
- Authorisation (ACL)
- Log (winston, morgan)
- Limit request (express-rate-limit)
- Secure header (helmet)
- Inversion of control (inversify)
- HTTP/HTTPS
- Gracefull shutdown (godaddy terminus)

This module was inspired by :

[Mean.js](https://github.com/meanjs/mean)
[TypeScript-Node-Starter](https://github.com/Microsoft/TypeScript-Node-Starter)

