start java -Djava.library.path=../dynamoDB/DynamoDBLocal_lib -jar ../dynamoDB/DynamoDBLocal.jar -sharedDb
node crock/index --parameter-file "../local-environment-vars.json" --db-endpoint http://localhost:8000 --db-batch-write-file "../dynamoDB/mockusers.json"
REM node crock/index --parameter-file "../local-environment-vars.json" --db-endpoint "http://localhost:8000" --db-retain