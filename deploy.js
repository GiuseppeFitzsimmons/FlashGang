const fs=require('fs');
const {execSync} = require('child_process');
let installed;
let profileArgument='';
let deployParameters='deploy-parameters-dev.json'
let stackName='flashgang-dev'
let environment='dev'
let install='false'
process.argv.forEach(function (val, index, array) {
    if (val=='--profile') {
        profileArgument='--profile '+array[index+1];
    }
    if (val=='--environment') {
        environment=array[index+1];
    }
    if (val=='--install') {
        install=array[index+1];
    }
  });
  if (environment==='local') {
    deployParameters='deploy-parameters-local.json'
    stackName='CrockStack'
  } else if (environment==='prod') {
    deployParameters='deploy-parameters-prod.json'
    stackName='flashgang-prod'
  }
if (install!='false') {
    if (process.platform==='darwin') {
        installed=execSync('npm run install:linux --prefix server/commonlayer/nodejs');
        profileArgument='--profile phillip'
    } else {
        installed=execSync('npm run install:windows --prefix server/commonlayer/nodejs');
    }
    console.log(installed.toString());
    installed=execSync('npm run install:all --prefix server/accountlambda');
    console.log("done installing accountlambda", installed.toString());
    installed=execSync('npm run install:all --prefix server/googleloginlambda');
    console.log("done installing googleloginlambda", installed.toString());
    installed=execSync('npm run install:all --prefix server/polllambda');
    console.log("done installing polllambda", installed.toString());
    installed=execSync('npm run install:all --prefix server/rsvplambda');
    console.log("done installing rsvplambda", installed.toString());
    installed=execSync('npm run install:all --prefix server/synchroniselambda');
    console.log("done installing synchroniselambda", installed.toString());
}

process.chdir('server');
let deployed=execSync(`node deploy.js --stack-name ${stackName} --deploy-parameters ${deployParameters} ${profileArgument}`);
console.log("done deploying server", deployed.toString());
process.chdir('..');
console.log(process.cwd())

