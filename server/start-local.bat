start java -Djava.library.path=../../dynamoDB/DynamoDBLocal_lib -jar ../../dynamoDB/DynamoDBLocal.jar -sharedDb
crockstack --env-vars "deply-parameters-local.json" 