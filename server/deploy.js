const fs=require('fs');
const {execSync} = require('child_process');

let profileArgument='';
let templateFile='template.yaml';
let deployParametersFile;
let buildParametersFile;
let deployParameters='';
let stackName;
process.argv.forEach(function (val, index, array) {
    if (val=='--profile') {
        profileArgument='--profile '+array[index+1];
    } else if (val=='--build-parameters') {
        buildParametersFile=array[index+1];
    } else if (val=='--deploy-parameters') {
        deployParametersFile=array[index+1];
    } else if (val=='--stack-name') {
        stackName=array[index+1];
    }
  });
  if (deployParametersFile) {
      let _json=JSON.parse(fs.readFileSync(deployParametersFile))
      if (_json.Parameters) {
        deployParameters=Object.keys(_json.Parameters).map(key=>key+'='+_json.Parameters[key]).join(' ');
        deployParameters=`--parameter-overrides ${deployParameters}`;
        console.log("deployParameters", deployParameters)
      }
  } else {
      console.log("--deploy-parameters is a required argument");
      console.log("EXITING");
      process.exit();
  }


var packageCommand=`sam package --template-file ${templateFile} --output-template-file packaged.yaml ${profileArgument} --s3-bucket wwdd-build-bucket-us-east-1`
var deployCommand=`sam deploy --template-file packaged.yaml --stack-name ${stackName}  ${profileArgument} --region us-east-1 --capabilities CAPABILITY_NAMED_IAM ${deployParameters}`

execSync(packageCommand);
//console.log(packageCommand);
execSync(deployCommand);
//console.log(deployCommand);

