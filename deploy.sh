npm run install:linux --prefix server/commonlayer/nodejs/

sam package --template-file server/template.yaml --output-template-file packaged.yaml --profile phillip --s3-bucket wwdd-build-bucket-us-east-1
sam deploy --template-file packaged.yaml --stack-name flashgang-dev  --profile phillip --capabilities CAPABILITY_NAMED_IAM --region us-east-1 --parameter-overrides 'DynamoDbEndpoint='
