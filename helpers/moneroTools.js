const exec = require('child_process').exec;
const util = require('util');
const portUsed = require('tcp-port-used');
const config = require('config');
const mtc = config.moneroTools;

function portPromise(port) {
  return portUsed.waitUntilUsed(port, 200, mtc.startTimeout);
}

exports.startDaemon = function(onExit) {
  var cmd = 'monerod --rpc-bind-port %s %s';
  exec(util.format(cmd, mtc.daemonPort, mtc.daemonArgs), onExit);
  return portPromise(mtc.daemonPort);
}

exports.startWallet = function(onExit) {
  var cmd = 'monero-wallet-rpc --disable-rpc-login \
    --log-file ./log/monero-wallet-rpc.log \
    --rpc-bind-port %s --wallet-file %s --password %s %s';

  exec(util.format(
    cmd, mtc.walletPort, config.wallet.file, config.wallet.password, mtc.walletArgs
  ), onExit);
  return portPromise(mtc.walletPort);
}
