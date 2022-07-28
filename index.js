//require mongoose module
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var tunnel = require('tunnel-ssh');
var fs = require('fs');

var config = {
  username: 'ubuntu',
  host: 'ec2-34-203-35-13.compute-1.amazonaws.com',
  privateKey: fs.readFileSync(process.cwd() + '/thermelgy.pem'),
  port: 22,
  dstPort: 27017,
  dstHost: 'thermelgy-database.cluster-ctkehdhwcwzl.us-east-1.docdb.amazonaws.com',
  keepAlive: true,
  localHost: '127.0.0.1',
  localPort: 27017,
};

function Temp() {
  tunnel(config, function (error, server) {
    if (error) console.log('SSH connection error: ' + error);
    else console.log('SSH ok');
    const options = {
      ssl: true,
      sslValidate: true,
      sslCA: process.cwd() + '/rds-combined-ca-bundle.pem',
      useNewUrlParser: true,
      tlsAllowInvalidHostnames: true,
      tlsAllowInvalidCertificates: true,
      replicaSet: 'rs0',
      user: 'thermelgy',
      pass: 'thermelgy123',
      readPreference: 'secondaryPreferred',
      retryWrites: false,
      directConnection: true,
    };

    mongoose.connect('mongodb://localhost:27017/thermelgy', options);
    mongoose.connection.on('connected', () => console.log('Mongoose default connection is open'));
    mongoose.connection.on('error', (err) => console.log('Mongoose default connection has occured ' + err + ' error'));
    mongoose.connection.on('disconnected', () => console.log('Mongoose default connection is disconnected'));
  });
}

Temp();
