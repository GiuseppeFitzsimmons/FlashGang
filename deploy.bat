setlocal EnableDelayedExpansion
@echo off
set "setting=NOTHING"
set "install=false"
set "buildfront=false"
set "environment=dev"
for %%x in (%*) do (
   IF "!setting!"=="INSTALL" (
       set "install=%%~x"
   )
   IF "!setting!"=="BUILDFRONT" (
       set "buildfront=%%~x"
   )
   IF "!setting!"=="ENVIRONMENT" (
       set "environment=%%~x"
   )
   set "setting=NEXTSETTING"
   IF "%%~x"=="--install" (set "setting=INSTALL")
   IF "%%~x"=="--buildfront" (set "setting=BUILDFRONT")
   IF "%%~x"=="--environment" (set "setting=ENVIRONMENT")
)
echo deploying with parameters install=%install% buildfront=%buildfront% environment=%environment%

if "%install%"=="true" (
    echo "npm installing"
    CALL npm run install:windows --prefix server/commonlayer/nodejs/
)

CALL sam package --template-file server/template.yaml --output-template-file packaged.yaml --s3-bucket wwdd-build-bucket-us-east-1

CALL sam deploy --template-file packaged.yaml --stack-name flashgang-dev  --capabilities CAPABILITY_NAMED_IAM --region us-east-1 --parameter-overrides 'DynamoDbEndpoint='

if "%buildfront%"=="true" (
    echo "building and deploying client application"
    REM CALL client/deploy.bat
)
