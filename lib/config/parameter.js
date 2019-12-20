'use strict';

const aws_sdk = require("aws-sdk");
const refreshable = require("./refreshable");

class Parameter extends refreshable.Refreshable {
  constructor (props) {
    super(props.maxAge);
    this.name = props.version ? props.name + ':' + props.version : props.name;
    this.withDecryption = props.withDecryption || true;
    this.ssmClient = new aws_sdk.SSM(props.ssmConfiguration);
  }

  get value() {
    if (!this.cachedResult || this.isExpired()) {
      this.refresh();
    }
    return new Promise((resolve, reject) => {
      this.cachedResult.then(data => {
        if (data.Parameter && data.Parameter.Value) {
          return data.Parameter.Type === 'StringList'
            ? resolve(data.Parameter.Value.split(','))
            : resolve(data.Parameter.Value);
        }
        return reject(new Error(`The value is missing for parameter ${this.name}`));
      }).catch(err => reject(err));
    });
  }

  refreshParameter() {
    this.cachedResult = this.getParameter(this.name, this.withDecryption);
  }

  getParameter(name, withDecryption) {
    const params = {
      Name: name,
      WithDecryption: withDecryption
    };
    return this.ssmClient.getParameter(params).promise();
  }
}

module.exports = { Parameter };
