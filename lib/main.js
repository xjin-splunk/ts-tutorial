"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import fs package that allows us to access the file system
const fs = require("fs");
// Create markdown message from the json file 
function createMessage(filename) {
    // read the file
    const jsonFile = fs.readFileSync(filename);
    // parse json file
    const jsonMsg = JSON.parse(jsonFile);
    // create the message
    let message = [[{ data: 'Title', header: true }, { data: 'Comments', header: true }]];
    // add json message to the table
    for (const key in jsonMsg) {
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // get filename and read the message
        const filename = core.getInput("json_file");
        const message = createMessage(filename);
        // create message table with job summaries
        // https://github.blog 2022-05-09-supercharging-github-actions-with-job-summaries/
        yield core.summary
            .addHeading('Json File Comments')
            .addTable(message)
            .write();
    });
}
run();
