CALL npm run install:windows --prefix server/commonlayer/nodejs/

CALL sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket wwdd-build-bucket-us-east-1

CALL sam deploy --template-file packaged.yaml --stack-name wwdd  --capabilities CAPABILITY_NAMED_IAM --region us-east-1

CALL client/deploy.bat
