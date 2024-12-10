import { initCount } from "../../../shared/auto-increment.js";
import { getCategory } from "../../category/controller/category-controller.js";
import Transaction from "../models/transaction.js";
import transactionOperations from "../services/income-expense-crud.js";

// Glue b/w View and Model
// Controller - DOM (View I/O) + Event Handling (View) + Calling Service 

window.addEventListener('load', init);
function init(){
    bindEvents();
    loadCategory();
    loadAllTransactions();
    printCountTransaction();
}
function bindEvents(){
    document.querySelector('#add').addEventListener('click', addTransaction);
    document.querySelector('#isexpense').addEventListener('change',loadCategory);
    document.querySelector('#delete').disabled = true;
    document.querySelector('#delete').addEventListener('click', deleteForEver);
    document.querySelector('#save').addEventListener('click', saveTransactions);
    document.querySelector('#update').addEventListener('click', updateTransaction);
    document.querySelector('#sort-desc').addEventListener('click', doSort);
}

function doSort(){
    console.log('Sort Call ');
    const transactions = transactionOperations.sort('desc');
    printAllTransactions(transactions);
    printCountTransaction();
}

function updateTransaction(){
    const fields = ['category', 'desc','amount', 'mode', 'date'];
    for(let field of fields){
        if(field == 'amount'){
            transactionObjectForEdit[field] =  parseInt(document.querySelector(`#${field}`).value);
            continue;
        }
        transactionObjectForEdit[field] =  document.querySelector(`#${field}`).value;  
    }
    printAllTransactions(transactionOperations.getAllTransactions());
    printCountTransaction();

}

function loadAllTransactions(){
    if(localStorage){
        if(localStorage.transactions){
            const obj = JSON.parse(localStorage.transactions); // Generic Object
            console.log('Object is ', obj);
            const transcationsArray = obj['transactions-data'];
            const transcations = transcationsArray.map(transcationObj=>{
                const transcation = new Transaction();
                transcation.id = transcationObj.id;
                transcation.desc = transcationObj.desc;
                transcation.date = transcationObj.date;
                transcation.amount = transcationObj.amount;
                transcation.isDeleted = transcationObj.isDeleted;
                transcation.mode = transcationObj.mode;
                transcation.important = transcationObj.important;
                transcation.newlyAdded = transcationObj.newlyAdded;
                transcation.type = transcationObj.type;
                transcation.category = transcationObj.category;
                return transcation;
            });
            transactionOperations.transactions = transcations;
            printAllTransactions(transcations);
            printCountTransaction();
            

        }
        else{
            alert("NO Data Stored , Nothing to Load...");
        }
    }
    else{
        alert("Outdated Browser....");
    }
}

function saveTransactions(){
    // Array Convert JSON
    const obj = {"transactions-data": transactionOperations.getAllTransactions()};
    const json = JSON.stringify(obj);
    if(localStorage){
        localStorage.transactions = json;
        alert("Data Saved....");
    }
    else{
        alert("Outdated Browser");
    }
}

function deleteForEver(){
    // 1. Remove Records from the Array
    const transactions = transactionOperations.remove();
    printAllTransactions(transactions);
    printCountTransaction();
    enableDisable();
    // 2. Clear the Table
    // 3. RePrint the Table from the Array
    // 4. Update the Counts
    // 5. Disable the delete button
    
}
function printAllTransactions(transactions){
    const tbody = document.querySelector('#transactions-rows');
    tbody.innerHTML = '';
    //transactions.forEach(transaction=>printTransaction(transaction));
    transactions.forEach(printTransaction);

    
}
function loadCategory(){
    const isChecked = document.querySelector('#isexpense').checked;
    const category = getCategory((isChecked?'expense':'income'));
    const select = document.querySelector('#category');
    select.innerHTML = '';
    category.forEach(c=>{
        const optionTag = document.createElement('option'); // <option></option>
        optionTag.innerText = c;
        optionTag.value = c;
        select.appendChild(optionTag);
    });
}
const generateId = initCount();
// SRP - 
function addTransaction(){
    const fields = ['category', 'desc','amount', 'mode', 'date'];
    const transactionObject = {}; // Object Literal (Generic - Object Type)
    transactionObject.id = generateId();
    for(let field of fields){
        if(field == 'amount'){
            transactionObject[field] =  parseInt(document.querySelector(`#${field}`).value);
            continue;
        }
        transactionObject[field] =  document.querySelector(`#${field}`).value;
    }
    console.log('Object filled ', transactionObject);
    const transaction = transactionOperations.add(transactionObject);
    printTransaction(transaction);
    printCountTransaction();
    clearFields(fields);
    // Generic Object - Convert Specific Object (Specific Operations)
    // read the fields
    // const category = document.querySelector('#category').value;
    // const desc = document.querySelector('#desc').value;
    // const amount = document.querySelector('#amount').value;
    
}
function clearFields(fields){
    for(let field of fields){
        document.querySelector(`#${field}`).value = '';
    }
}
// This function is going to print a single row of transaction
function printTransaction(transaction){
    const tbody = document.querySelector("#transactions-rows");
    const tr = tbody.insertRow();
    for(let key in transaction){
        
        if(key == 'isDeleted' || key =='newlyAdded' || key =='important' || key == 'type'){
            continue; // skip the current iteration
        }
        
        console.log('key is ', key, ' Value ', transaction[key]);
        const td = tr.insertCell();
        if(key == 'mode'){
            td.innerText  = modes()[transaction[key]];
        } else
        if(key == 'amount'){
            
            td.innerText = transaction[key].toLocaleString('hi');
        }
        else{
        td.innerText = transaction[key];
        }
    }
    const td = tr.insertCell();
    td.appendChild(createIcon('fa-solid fa-pen-to-square me-2 hand', edit, transaction.id)); // Edit Icon
    // <i class="fa-solid fa-trash"></i>
    td.appendChild(createIcon('fa-solid fa-trash hand', toggleMarkDelete, transaction.id)); // Delete Icon

   
     
}

function toggleMarkDelete(){
    const trashIcon = this;
    const transId = trashIcon.getAttribute('transaction-id');
    console.log('toggleMarkDelete', transId);
    transactionOperations.toggleMark(transId);
    const tr = trashIcon.parentNode.parentNode;
    //tr.className= 'alert alert-danger';
    tr.classList.toggle('table-danger');
    printCountTransaction();
    enableDisable();

}
function enableDisable(){
    document.querySelector('#delete').disabled = transactionOperations.countMarked()==0;
}
let transactionObjectForEdit;
function edit(){
    const fields = ['category', 'desc','amount', 'mode', 'date']; // On Screen fields
    console.log('edit' , this);
    const id = this.getAttribute('transaction-id');
    transactionObjectForEdit = transactionOperations.search(id);
    for(let field of fields){
         document.querySelector(`#${field}`).value =  transactionObjectForEdit[field] ;
    }

}

const modes=()=>["", "Cash", "Credit", "UPI"];
   
function printCountTransaction(){
    document.querySelector('#count-transaction').innerText = transactionOperations.getTransactionsCount();
    document.querySelector('#count-marked').innerText = transactionOperations.countMarked();
    document.querySelector('#count-unmarked').innerText = transactionOperations.countUnMarked();
}

function createIcon(className, fn, transactionId){
    // <i class="fa-solid fa-pen-to-square"></i>
    const icon = document.createElement('i'); // <i>
    icon.className = className;
    icon.setAttribute('transaction-id', transactionId);
    //icon.id = transactionId;
    icon.addEventListener('click', fn);
    return icon;
}