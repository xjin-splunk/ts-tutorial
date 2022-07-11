// import fs package that allows us to access the file system
const fs = require("fs");


// Create markdown message from the json file 
  function createMessage(filename: string) : any[] {
  // read the file
  const jsonFile = fs.readFileSync(filename);

  // parse json file
  const jsonMsg = JSON.parse(jsonFile);

  // create the message
  let message: any[] = [[{data: 'Title', header: true}, {data: 'Comments', header: true}]];
    
  // add json message to the table
  for(const key in jsonMsg) {
    const value = jsonMsg[key];
        
    message.push([`${key}`, `${value}`]);
   }

  return message;
}

// read from json file and log the message
// const message = createMessage("comments.json");   // hard code the filename
// console.log(message);

// get essential packages
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    // get filename and read the message
    const filename = core.getInput("json_file");
    const message = createMessage(filename);

    // create message table with job summaries
    // https://github.blog 2022-05-09-supercharging-github-actions-with-job-summaries/
    await core.summary
    .addHeading('Json File Comments')
    .addTable(message)
    .write()

}

run();