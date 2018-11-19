# graphql-prisma
prisma deploy

docker-compose up -d

cd prisma
prisma token //to get authorization token
then add header in graphiql
{
  "Authorization":"Bearer TOKEN"
}

to delete databases
prisma delete

deploy
prisma deploy

in .graphqlconfig
this line  "prisma": "prisma/prisma.yml"  is so npm run get-schema can run without needed tokens

jwt.io

pulling stuff from generated file
prisma graphql-import


## After You make changes to datamodel.prisma do this
prisma deploy