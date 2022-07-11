
# Develop a Github Actions Projct with TypeScript

## Github Actions

Github Actions is a powerful CI/CD tool that nicely integrated with Github which allows you to write and share action tasks easily. You can find more information at [Github Actions](https://docs.github.com/en/actions). In this tutorial, we will go over how to upload a json file to Github Actions and display the contents on Github Actions with Typescript. 

1. First, let's [create a new git repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) for this project and make a copy/clone of it on your local machine. 

2. Then, create a `comments.json` in the repo folder with comments like below:
```
{
    "Main Branch Comment": "Hello from main"
}
```

3. In your local git repo, create a workflow `yaml` file at `.github/workflows/upload_main_comments.yml` (you may need to create this path yourself). 

The path `.github/workflows/` is the default path that Github Actions looks for, and `upload_main_comments.yml` defines when and what tasks should be run. You can create multiple `.yml` files for multiple workflows (e.g. one for CI and one for test), but for simplicity, we will only create one workflow in this tutorial.

4. In `upload_main_comments.yml` file, type in the following:

```
# name of the worklow
name: Upload and Display Json

# only run this workflow "on" the condition when there is a "push" on "main" branch.
on:
  push:
    branches:
      - "main" 

# define list of "jobs" in the current workflow 
jobs:
  Upload-Display-Json: # name of the current job
    runs-on: ubuntu-latest  # environment 
    name: Upload and Display Json File on Main

    # define each "steps" of the current job
    steps:
        # name of the first step is "Checkout", which "uses" an existing 
        # task from "actions/checkout@v2" that pulls this repo into work space. 
        # "@v2" is the requried version tag.
        # You can find more pre-defined actions here: 
        # https://github.com/actions/
      - name: Checkout
        uses: actions/checkout@v2

        # name of the second step is "Upload Json", which uploads a give file
        # use the keyword "with" to specify the path of the file
      - name: Upload Json
        uses: actions/upload-artifact@v2
        with:
          name: Json-file
          path: comments.json
```

# Test on GitHub Actions

4. Next, let's push everything(`.github/workflows/upload_main_comments.yml` and `comments.json`) to Github. In your git repo, under `Actions` icon, you should be able to see a workflow running with the same name as your commit message. If everything compiles succesfully, `comments.json` should be successfully uploaded to Github Actions.


# Test on local machines

As developers, testing a project on server is extremly insuficient, and it will be much nicer if we can test it on our local machines where we can get immediate feedback.

5. To test Github Actions on local machines, we will use an open source software call `act` (https://github.com/nektos/act). It provides CLI that allows you to run Github Actions right in your terminal. Simply follow the [instructions](https://github.com/nektos/act) to install it.

6. To test our workflow, use the following command to run it locally using `act`(make sure you are in the root folder of your program/git repo). The command simulates a git `push` that triggers our main branch workflow, and set up a local host to upload the json file.
```
$ act --artifact-server-path http://localhost:8080/ push
```

If everything goes successfully, you should be able to see outputs in terminal that are similar to that in Github Actions. You will also see a folder created by `act` that contains the `json` file we just uploaded (since this is only for testing purpose, you may not want to push this folder and file to your Github repo).


# Write Actions with TypeScript

## Setup work environment
Now, let's write our Action pipeline with [TypeScript](https://www.typescriptlang.org). TypeScript is essentially JavaScript with variable types. Becasue Github can only run JavaScipt, we will need to compile TypeScript into JavaScript, which can be done in just one line of code and we will cover it later. To setup work environment for JavaScript programs, we will use [Node.js](https://nodejs.dev) which allows us to run JavaScrupt program outside of the browsers.

7. To initialize a Javascript program, we will use the Node.js package manager `npm`. First, run the following command and follow the instructions to initialize a project's `package.json` file that contains the description, author, dependencies of the program.
```
$ npm init
```
You should see a `package.json` file created in your work space. 

8. Then, type in the following two commands to add essential dependencies to `package.json`.

```
$ npm install --save-prod @actions/github @actions/core
$ npm install --save-dev @vercel/ncc typescript prettier
$ npm i --save-dev @types/node
```

You can double check that `dependencies` section in `package.json` should have been updated, and `package-lock.json` file and `node_modules` folder are created. `package-lock.json` file descibes the exact dependency tree, and `node_modules` contains the actual packages. Thus, anyone with the same `package.json` and `package-lock.json` file should be able to recreate the exact work environment that you had by running `$ npm install` .

## Write TypeScript Prorgam

9. Now, let's write some TypeScript. Create a new file `src/main.ts` and type in the following code:
```
// import fs package that allows us to access the file system
const fs = require("fs");


// Create markdown message from the json file 
function createMessage(filename: string) : string {
  // read the file
  const jsonFile = fs.readFileSync(filename);

  // parse and return 
  const jsonMsg = JSON.parse(jsonFile);

  // create message table
  function createMessage(filename: string) : any[] {
  // read the file
  const jsonFile = fs.readFileSync(filename);

  // parse and return 
  const jsonMsg = JSON.parse(jsonFile);

  let message: any[] = [[{data: 'Title', header: true}, {data: 'Comments', header: true}]];
    
  // add json message to the table
  for(const key in jsonMsg) {
    const value = jsonMsg[key];
        
    message.push([`${key}`, `${value}`]);
   }

  return message;
}

// read from json file and log the message
const message = createMessage("comments.json");
console.log(message);
```

10. Now, we need to compile the TypeScript file and merge all dependecies into a single JavaScript file. We can do so by adding the following scripts in the `scripts` section in the `package.json` file:
```
"scripts": {
    "build": "tsc && ncc build lib/main.js",
    "format": "prettier --write **/*.ts"
}
```

and create a config file `tsconfig.json` for `tsc` command:
```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": false,
    "esModuleInterop": true
  },
  "exclude": ["node_modules"]
}
```

11. Now, run the following command to compile the TypeScript program:
```
$ npm run build
```

This should translate the TypeScript program we just wrote into a `.js` file in `lib/main.js` and merge all dependencies in a single JavaScript file in `dist/index.js`. 

Then, run the actual Javascript program at `dist/index.js` using nodeJS:
```
$ node dist/index.js
```
You should also see the following messega printed in the terminal:
```
[
  [
    { data: 'Title', header: true },
    { data: 'Comments', header: true }
  ],
  [ 'first comment in main branch', 'Hello from main' ]
]
```

12. In reality, we do not want to hard code the file name, but instead, we should pass in the file name through actions. So, first comment out the last two lines in the `src/main.ts`. Then, add the following to the end:
```
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {

    const filename = core.getInput("json_file");

        // read the file
    const jsonFile = fs.readFileSync(filename);

    // parse and return 
    const jsonMsg = JSON.parse(jsonFile);

    const message = createMessage("comments.json");

    await core.summary
    .addHeading('Test Results')
    .addTable(message)
    .write()

}

run();
```

Don't forget to recompile the program:
```
$ npm run build
```

13. Let the Github know about our new action by creating a `action.yml` file with following content:
```
name: 'Show Comments in Actions'
inputs:
  json_file:
    description: 'Where to find the json output of the comments'
    required: true
    default: 'comments.json'


runs:
  using: 'node12'
  main: 'dist/index.js'
```

We also need to add a new step in `main_branch_comments.yml` file:
```
      - name: Display comment
        # Use the action defined in this repository
        uses: ./
        with:
          json_file: "comments.json"
```

14. Now, let's test it again on local machine. 
```
$ act --env GITHUB_STEP_SUMMARY=[PATH-TO-A-FILE] --artifact-server-path http://localhost:8080/ push
```

The flag `GITHUB_STEP_SUMMARY=[PATH-TO-A-FILE]` gives a path of a local file, which is a way to get around with [Job Summaries in act](https://github.com/nektos/act/issues/1187). You can simply use the path to the `json` file we just uploaded 
$ `act --env GITHUB_STEP_SUMMARY=./http:/localhost:8080/1/comments-file/comments.json --artifact-server-path http://localhost:8080/ push` since it will not modify the file itself.

15. Finally, let's run it on Github Actions. Push everything to Github, and go to Github Actions to checkout the result.