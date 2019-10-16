proc=$(lsof -ti:8000)
kill -9 $proc

java -Djava.library.path=../../dynamoDB/DynamoDBLocal_lib -jar ../../dynamoDB/DynamoDBLocal.jar -sharedDb &
node ../node_modules/crockstack/cli.js --env-vars "devvariables.json" 
