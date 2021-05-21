const {alias, aliasJest, configPaths} = require('react-app-rewire-alias');

const aliasPaths = configPaths('./alliasPaths.json');

module.exports = alias(aliasPaths);
module.exports.jest = aliasJest(aliasPaths);
