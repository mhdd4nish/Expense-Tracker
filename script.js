const incomeAmount = document.getElementById("income");
const expensesAmount = document.getElementById("expenses");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionEle = document.getElementById("description");
const amountEle = document.getElementById("amount");
const balanceEle = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let balance=0;

transactionForm.addEventListener("submit", addTransaction);

function addTransaction(event){
    event.preventDefault();

    const description = descriptionEle.value.trim()
    const amount = parseFloat(amountEle.value);

    if (isNaN(amount) || amount===0) {
        alert("Please enter a valid amount.");
        return;
    }
    
    if(checkValid(amount)===true){
        transactions.push({
        id:Date.now(),
        description,
        amount
    })

    localStorage.setItem("transactions", JSON.stringify(transactions))
    updateTransactionList();
    updateSummary();
    transactionForm.reset();
    }
}

function checkValid(amount) {
    if (balance + amount < 0) {
        alert("Transaction declined: insufficient balance.");
        return false;
    }
    return true;
}

function updateTransactionList(){
    transactionList.innerHTML = "";
    const sortedTransactions = [...transactions].reverse();
    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionEle(transaction);
        transactionList.appendChild(transactionEl);
    })
}

function createTransactionEle(transaction){
    const li = document.createElement("li");
    li.classList.add("entry");
    li.classList.add(transaction.amount > 0? "income" : "expense");
    
    li.innerHTML =`
    <span>${transaction.description}</span>
    <span>${formatCurrency(transaction.amount)}
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    </span>
    `
    return li;
}

function updateSummary(){
    balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0) ;

    const income = (transactions.filter(transaction => transaction.amount>0)).reduce((acc, transaction) => acc+transaction.amount, 0)

    const expenses = (transactions.filter(transaction => transaction.amount<0)).reduce((acc, transaction) => acc+transaction.amount, 0)

    balanceEle.textContent = formatCurrency(balance);
    incomeAmount.textContent = formatCurrency(income);
    expensesAmount.textContent = formatCurrency(expenses);
}

function formatCurrency(number){
    return new Intl.NumberFormat("en-US",{
        style:"currency",
        currency: "USD",
    }).format(number);
}

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);

    localStorage.setItem("transactions", JSON.stringify(transactions))
    updateTransactionList();
    updateSummary();
}

updateSummary();
updateTransactionList();