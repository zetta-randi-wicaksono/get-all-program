// *************** IMPORT MODULE ***************
const programModel = require('./program.model');
const programResolver = require('./program.resolver');
const programTypeDef = require('./program.typeDef');

const Program = {
  model: programModel,
  resolver: programResolver,
  typeDef: programTypeDef,
};

// *************** EXPORT MODULE ***************
module.exports = Program;
