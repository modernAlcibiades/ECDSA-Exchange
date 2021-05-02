import "./index.scss";

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

const server = "http://localhost:3042";

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = parseInt(document.getElementById("send-amount").value);
  const recipient = document.getElementById("recipient").value;

  // To avoid storing private in a variable directly
  const _msghash = SHA256(JSON.stringify({ "from": sender, "to": recipient, "amount": amount }));
  console.log(_msghash.toString());
  const full_signature = ec.keyFromPrivate(document.getElementById("key").value).sign(_msghash.toString());
  const signature = { r: full_signature.r.toString(16), s: full_signature.s.toString(16) };
  console.log(signature);

  const body = JSON.stringify({
    sender, amount, recipient, signature
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' } }).then(response => {
    return response.json();
  }).then(({ balance, result }) => {
    document.getElementById("balance").innerHTML = balance;
    if (result) {
      document.getElementById('error-message').innerHTML = result;
    }
  });
});

// Added code
// Update sender addresses list
document.getElementById("exchange-address").addEventListener('focus', () => {
  let dropdown = document.getElementById("exchange-address");
  console.log(dropdown.length);
  if (dropdown[0].value === "Address") {
    fetch(`${server}/addresses`).then((response) => {
      return response.json();
    }).then(({ addr }) => {
      //let dropdown = document.getElementById("exchange-address");
      console.log(addr);
      for (var i = 0; i < addr.length; i++) {
        console.log(addr[i]);
        let option = document.createElement('option');
        option.text = addr[i];
        option.value = addr[i];
        dropdown.add(option);
      }
      dropdown.remove(0);
    });
  }
}
);

document.getElementById("recipient").addEventListener('focus', () => {
  let dropdown = document.getElementById("recipient");
  console.log(dropdown.length);
  if (dropdown[0].value === "Recipient") {
    fetch(`${server}/addresses`).then((response) => {
      return response.json();
    }).then(({ addr }) => {
      //let dropdown = document.getElementById("recipient");
      console.log(addr);
      for (var i = 0; i < addr.length; i++) {
        console.log(addr[i]);
        let option = document.createElement('option');
        option.text = addr[i];
        option.value = addr[i];
        dropdown.add(option);
      }
      dropdown.remove(0);
    });
  }
}
);

// Update balance for chosen address
document.getElementById("exchange-address").addEventListener('input', ({ target: { value } }) => {
  if (value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});