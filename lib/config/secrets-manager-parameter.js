'use strict';

const parameter = require("./parameter");
const PREFIX = '/aws/reference/secretsmanager/';

function secretsManagerParameter(props) {
  if (!props.name.startsWith(PREFIX)) {
    props.name = PREFIX + props.name;
  }
  return new parameter.Parameter(props);
}

module.exports = { secretsManagerParameter };
