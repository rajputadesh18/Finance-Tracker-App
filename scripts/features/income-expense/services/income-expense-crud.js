// Service Layer - Logic for CRUD Operations
// export - wrap the things (structure) in an object and then export
// destructure - import {x,y} from 'file'

import Transaction, { timeStamp } from "../models/transaction.js";

// export default - import x from 'file'
const transactionOperations = {
    // Array of Transactions
    flag : true,
    transactions:[], // store Transaction one by one
    getAllTransactions(){
        
        return this.transactions;
    },
    add(transObject){
        const transaction = new Transaction(); // Model
        for(let key in transObject){
            transaction[key] = transObject[key]; // Generic to Specific Conversion
        }
        this.transactions.push(transaction); // Store Specific Object
        console.log('All Trans ', this.transactions);
        return transaction;
    },
    sort(key = 'desc'){

        console.log('********** All Transactions ', this.transactions);
        if(this.flag){
         this.transactions.sort((a,b)=>a.desc.localeCompare(b.desc));
        }
        else{
             this.transactions.sort((a,b)=>b.desc.localeCompare(a.desc));
        }
        this.flag = !this.flag;
        
        return this.transactions;
        // if(key =='desc'){
        // return this.transactions.sort((a,b)=>a.desc.localeCompare(b.desc));
        // }
        // else{
        //    // return this.transactions.sort((a,b)=>a.amount - b.amount);
        // }
    },
    getTransactionsCount(){
        return this.transactions.length;
    },

    remove(){
        // Delete ForEver
        this.transactions = this.transactions.filter(transactionObject=>!transactionObject.isDeleted)
        return this.transactions;
    },
    search(transactionId){
        // if found - return the transaction object, otherwise undefined
        return this.transactions.find((transactionObject)=>transactionObject.id == transactionId);
    },
    toggleMark(transactionId){
        const transObject = this.search(transactionId);
        if(transObject){
            transObject.toggleMark();
        }
    },
    countMarked(){
        return this.transactions.filter(transObject=>transObject.isDeleted).length;
    },
    countUnMarked(){
        return this.transactions.length - this.countMarked();
    },
    
    update(){

    },
    countTransaction(){

    }
}
export default transactionOperations;
// default - use only one time in a single file.