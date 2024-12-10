import User from "../models/user-model.js";
import { login } from "../services/user-service.js";

// It is a Glue b/w View and Model
window.addEventListener('load', eventBinding);
function takeUserInput(){
    // DOM 
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const name = document.querySelector('#name').value;
    const user = new User(email, password, name);
    login(user);
    location.href = 'index.html';
    //console.log(email, password, name);
}

function eventBinding(){
    document.querySelector('#go').addEventListener('click', takeUserInput);
}