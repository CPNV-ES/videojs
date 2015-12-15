# VideoJS

## Requirement

This project run on javascript framework : [Meteor](https://www.meteor.com/)

Then, you need to install meteor here : [https://www.meteor.com/install](https://www.meteor.com/install)

## Run VideoJS

For start this project, go to project root directory with your terminal :
```bash
/folder/of/project > meteor --settings settings.json
```

## Open interface

Videojs open automaticaly interface in your default browser but you can access manually from [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Documentation generation
Please install :
```bash
npm install jaguarjs-jsdoc jsdoc
```

Then generate the documentation :
```bash
node_modules/.bin/jsdoc client collections public server packages -t node_modules/jaguarjs-jsdoc -r -c jsdoc.json -d docs -r README.md
```
