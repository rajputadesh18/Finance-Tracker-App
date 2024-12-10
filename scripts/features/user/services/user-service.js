// Logic for Login/ Logout
// User Related Logic will be written here

export function login(userInfo){
    if(localStorage){
    if(localStorage.user){
        // already register , do login
        alert("Already Register");
    }
    else{
        // new user , login
        localStorage.user = JSON.stringify(userInfo);
        alert("User Register ");
        
    }
}
else{
    alert("Outdated Browser and Not Having Support of localStorage...");
}
}
export function isAlreadyLogin(){

}
export function logOut(){

}