const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
//const ljs = require('./ledger.js');
// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// Todo: add default addresses
// Add ledger in the background for accounting
const start_accounts = 3;

const Ledger = new require('./ledger');
const ledger = new Ledger();
for (let i = 0; i < start_accounts; i++) {
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate();
  const publicKey = key.getPublic().encode('hex');
  // Starting balance random between 50-100
  const balance = Math.floor((Math.random() * 50) + 50);
  ledger.addAccount(publicKey, balance);
  console.log("Public Key :", `0x${publicKey}`);
  console.log("Private Key :", `0x${privateKey.toString()}`);
  console.log("-".repeat(30));
}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = ledger.getBalance(address) || 0;
  res.send({ balance });
});

app.get('/addresses', (req, res) => {
  console.log(Object.keys(ledger.accounts));
  res.send({ "addr": Object.keys(ledger.accounts) });
});

app.post('/add', (req, res) => {
  const { public_key, balance } = req.body;
  const [addr, result] = ledger.addAccount(public_key, balance);
  res.send({ "addr": addr, "result": result });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const result = ledger.transfer(sender, recipient, amount, signature);
  res.send({ "balance": ledger.getBalance(sender), "result": result });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
