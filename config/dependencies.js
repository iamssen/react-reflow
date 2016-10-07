const fs = require('fs');

const dependencies = fs.readdirSync(__dirname + '/dependencies/')
                       .map(file => __dirname + '/dependencies/' + file)
                       .map(file => require(file))
                       .reduce((packageJson, dependenciesList) => {
                         Object.keys(dependenciesList).forEach(dependencies => {
                           if (packageJson[dependencies] === undefined) {
                             packageJson[dependencies] = dependenciesList[dependencies];
                           } else {
                             packageJson[dependencies] = Object.assign(dependenciesList[dependencies], packageJson[dependencies]);
                           }
                         });
                         return packageJson;
                       }, {});

const packageJsonPath = __dirname + '/../package.json';
const packageJson = Object.assign({}, require(packageJsonPath), dependencies);

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), {encoding: 'utf8'});