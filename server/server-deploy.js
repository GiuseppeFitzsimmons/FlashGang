
const fs = require('fs');
const { execSync, exec, spawn } = require('child_process');
let profileArgument = '';
let templateFile = 'template.yaml';
let deployParametersFile;
let deployParameters = '';
let stackName;
let local;
process.argv.forEach(function (val, index, array) {
    if (val == '--profile') {
        profileArgument = '--profile ' + array[index + 1];
    } else if (val == '--deploy-parameters') {
        deployParametersFile = array[index + 1];
    } else if (val == '--stack-name') {
        stackName = array[index + 1];
    } else if (val == '--local') {
        local = array[index + 1];
    }
});
if (deployParametersFile) {
    let _json = JSON.parse(fs.readFileSync(deployParametersFile))
    let _secrets = JSON.parse(fs.readFileSync('deploy-parameters-secrets.json'));

    if (_json.Parameters) {
        _secrets = Object.assign({}, _secrets.Parameters, _json.Parameters);
    }
    deployParameters = Object.keys(_secrets).map(key => key + '=' + _secrets[key]).join(' ');
    deployParameters = `--parameter-overrides ${deployParameters}`;
    console.log("deployParameters", deployParameters)
} else {
    console.log("--deploy-parameters is a required argument");
    console.log("EXITING");
    process.exit();
}
if (local) {
    //killOldProccesses();
    startDb(function(){
        console.log("DB started, starting server...");
        startServer(deployParameters);
    });
} else {
    var packageCommand = `sam package --template-file ${templateFile} --output-template-file packaged.yaml ${profileArgument} --s3-bucket wwdd-build-bucket-us-east-1`
    var deployCommand = `sam deploy --template-file packaged.yaml --stack-name ${stackName}  ${profileArgument} --region us-east-1 --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND ${deployParameters}`
    execSync(packageCommand);
    console.log(packageCommand);
    execSync(deployCommand);
    console.log(deployCommand);
}


async function startDb(callback) {
    await new Promise( (resolve, reject)=>{
        const child = spawn('java', ['-Djava.library.path=../../dynamoDB/DynamoDBLocal_lib', '-jar', '../../dynamoDB/DynamoDBLocal.jar', '-sharedDb']);
        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
        child.stdout.on('data', (data) => {
            console.log(`Dynamo: ${data}`);
            callback();
        });
        child.stderr.on('data', (data) => {
            console.log(`Dynamo error: ${data}`);
        });
    })
}
async function startServer(deployParameters) {
    var crockCommand = 'crockstack'
    if (process.platform === 'darwin') {
        crockCommand = '../node_modules/crockstack/cli.js';
    }
    if (deployParameters.indexOf('--parameter-overrides ')==0) {
        deployParameters=deployParameters.replace('--parameter-overrides ','');
    }
    execSync('crockstack --parameter-overrides '+deployParameters)/*
    const child = spawn(crockCommand, ['--parameter-overrides',deployParameters]);
    child.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
    });
    child.stdout.on('data', (data) => {
        console.log(`Crockstack: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.log(`Crockstack error: ${data}`);
    });*/
}
function killOldProccesses() {
    if (process.platform === 'darwin') {
        try {
            execSync("proc=$(lsof -ti:8080) && kill -9 $proc");
        } catch (err) {
        }
        try {
            execSync("proc=$(lsof -ti:8000) && kill -9 $proc");
        } catch (err) {
        }
    } else {
        try {
            execSync("FOR /F \"tokens=4 delims= \" %%P IN ('netstat -a -n -o ^| findstr :8080') DO @ECHO TaskKill.exe /PID %%P");
        } catch (err) {
        }
        try {
            execSync("FOR /F \"tokens=4 delims= \" %%P IN ('netstat -a -n -o ^| findstr :8000') DO @ECHO TaskKill.exe /PID %%P");
        } catch (err) {
        }
    }
}
