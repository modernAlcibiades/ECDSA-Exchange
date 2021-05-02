import "./index.scss";

const server = "http://localhost:3042";

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  const body = JSON.stringify({
    sender, amount, recipient
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
// Update addresses list
document.getElementById("exchange-address").addEventListener('focus', () => {
  let dropdown = document.getElementById("exchange-address");
  console.log(dropdown.length);
  if (dropdown.length === 0) {
    fetch(`${server}/addresses`).then((response) => {
      return response.json();
    }).then(({ addr }) => {
      let dropdown = document.getElementById("exchange-address");
      console.log(addr);
      for (var i = 0; i < addr.length; i++) {
        console.log(addr[i]);
        let option = document.createElement('option');
        option.text = addr[i];
        option.value = addr[i];
        dropdown.add(option);
      }
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