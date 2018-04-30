#!/usr/bin/env node

const exec = require('child_process').exec;
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const args = process.argv.slice(2);
let configRead = false;
let commands = null;

const initConfig = {
    "ping": [
        {
            "name": "Ping example1",
            "command": "ping www.example1.com"
        },
        {
            "name": "Ping example2",
            "command": "ping www.example2.com"
        }
    ],
    "list": [
        {
            "name": "List all files",
            "command": "ls -lah"
        }
    ]
};

if(!args.length){
    showUsage();
    return;
}

switch(args[0]){
    case 'init':
        initializeEdev();
        break;
    case 'ls':
        listScenarios();
        break;
    case 'run':
        runScenario();
        break;
    default:
        showUsage();
        break;
}

function readConfigFile(){
    if(configRead){
        return;
    }

    try {
        configRead = true;
        commands = JSON.parse(fs.readFileSync('./edev.json').toString());
    } catch (e) {
        log(chalk`{red edev.json is missing}`);
        log(chalk`You should run {green edev init}`);
    }
}

function initializeEdev(){
    fs.writeFileSync('./edev.json', JSON.stringify(initConfig, null, 4));
    log(chalk`{green edev.json} was created`);
}

function showUsage(){
    log(chalk`\n{green edev} [COMMAND]`);
    log(chalk`   {green init} initialize the config file`);
    log(chalk`   {green run [SCENARIO NAME]} run a scenario`);
    log(chalk`   {green ls} list all scenarios\n`);
}

function listScenarios() {
    readConfigFile();

    if(!commands){
        return;
    }
    log(chalk`\n{bold Available scenarios:}\n`);

    for (let key in commands) {
        log(chalk`{green ${key}}`);

        for (let i = 0; i < commands[key].length; i++) {
            log(`   | ${commands[key][i].name}`);
        }
        log('');
    }
}

function runScenario(){
    readConfigFile();

    if(!commands){
        return;
    }

    const scenario = args[1];
    if(!scenario){
        log(chalk`{red No scenario name provided}`);
        log(chalk`Usage: {green edev run [SCENARIO NAME]}`);
        listScenarios();
        return;
    }

    const currentScenario = commands[scenario];
    if(!currentScenario){
        log(chalk`{red.bold ${scenario}} {red is not defined in edev.json}`);
        return;
    }

    currentScenario.forEach(command => {
        const process = exec(command.command);

        log(chalk`{green.underline ${command.name}} {green started}`);

        process.stdout.on('data', function (data) {
            log(chalk`{dim ${command.name}} \n${data.toString()}`)
        });

        process.stderr.on('data', (data) => {
            log(chalk`{dim ${command.name}} \n{red ${data.toString()}}`)
        })
    });
}
