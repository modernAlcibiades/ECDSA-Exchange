
const SHA256 = require('crypto-js/sha256');

const BASE_TXN = {
    from: "",
    to: "",

}

class Account {
    constructor(_name, _pubkey, _balance) {
        this.name = _name;
        this.public_key = _pubkey;
        this.balance = _balance;
    }

    getBalance() {
        return this.balance;
    }

    setBalance(balance) {
        this.balance = balance;
    }

    getPubkey() {
        return this.public_key;
    }

    verifyMessage(msg, signature) {
        const _msgHash = SHA256(msg).toString();
        return this.public_key.verify(_msgHash, signature);
    }
}


class Ledger {
    constructor(_transactions = [], _accounts = {}) {
        this.transactions = _transactions;
        this.accounts = _accounts;
    }

    addAccount(pubkey, balance = 0) {
        const name = pubkey.substring(2, 12);
        if (!(name in this.accounts)) {
            this.accounts[name] = new Account(name, pubkey, balance);
            return name, `Account ${pubkey} added with balance ${balance}`;
        }
        return name, `Account ${pubkey} exists`;
    }

    getBalance(name) {
        if (name.length > 12) {
            name = name.substring(2, 12); // Check this
        }
        if (name in this.accounts) {
            return this.accounts[name].getBalance();
        } else return 0;
    }

    transfer(from, to, amount, signature) {
        if ((from in this.accounts) && (to in this.accounts)) {
            // Check if the amount is correct
            const balance_from = this.accounts[from].getBalance();
            const balance_to = this.accounts[to].getBalance();
            if (balance_from >= amount && amount >= 0) {
                // Check if the message can be authenticated
                const message = JSON.stringify({ "from": from, "to": to, "amount": amount });
                if (this.accounts.from.verify(message, signature)) {
                    this.accounts[from].setBalance(balance_from - amount);
                    this.accounts[from].setBalance(balance_to + amount);
                } else {
                    return "Cannot authenticate. Please check signature.";
                }
            } else {
                return "Balance insufficient";
            }
        }
        return "Account not found";
    }

    verifySignature(from, amount, signature) {

    }
}

module.exports = Ledger;