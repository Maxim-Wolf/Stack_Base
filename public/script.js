const Register_Page = document.getElementById("Register_Page");
const text_login3 = document.getElementById("text_login3");
const text_register3 = document.getElementById("text_register3");
const Login_Page = document.getElementById("Login_Page");
const register_input_email = document.getElementById("register_input_email");
const register_input_password = document.getElementById("register_input_password");
const register_btn = document.getElementById("register_btn");
const login_btn = document.getElementById("login_btn");
const login_input_email = document.getElementById("login_input_email");
const Projects_Page = document.getElementById("Projects_Page");
const login_input_password = document.getElementById("login_input_password");
const Server_Offine_Page = document.getElementById("Server_Offine_Page");
const questions_maintenance = document.getElementById("questions_maintenance");
const Estimated_time_p_2 = document.getElementById("Estimated_time_p_2");
const Maintenance_value_1 = document.getElementById("Maintenance_value_1")
const Maintenance_value_2 = document.getElementById("Maintenance_value_2")
login_btn.addEventListener("click",()=>{
    login();
})
register_btn.addEventListener("click",register);
text_login3.addEventListener("click",get_register_page);
text_register3.addEventListener("click",get_login_page);
window.addEventListener("load",async ()=>{
await check_session();
})
function hidePages () {
    Register_Page.style.display = "none";
    Login_Page.style.display = "none";
    Projects_Page.style.display = "none";
    Server_Offine_Page.style.display = "none";
}
function get_projects_page () {
    hidePages()
    Projects_Page.style.display = "flex";
}

function get_register_page () {
    hidePages();
    Register_Page.style.display = "grid";
}
function get_login_page () {
    hidePages();
    Login_Page.style.display = "grid";
}
function SetUILoggedIn () {
    document.body.style.backgroundColor = "white";
    get_projects_page();
}
function showMessage(message, type = "info", duration = 3000) {
    const bar = document.getElementById("message-bar");

    bar.textContent = message;

    bar.className = "";
    bar.classList.add(type);

    bar.classList.add("show");


    setTimeout(() => {
        bar.classList.remove("show");
    }, duration);
}
async function register () {
    const email = register_input_email.value.toLowerCase()
    const password = register_input_password.value;
    if(!email || !password){
        return showMessage("Please fill in all required fields.","error")
    }
    let res = await fetch("/rs/register",{
        credentials: "include",
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({
            email,
            password
        })
    })
    if(res.status === 502){
        showMessage("Server are offline","error")
        return
    }
    if(!res.ok){
        console.log(res.status)
        showMessage("email is already taken","error")
        return
    }
    showMessage("Account has been created","succes");
}
login_input_email.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});
login_input_password.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        login();
    }
});
async function login() {
    if(!login_input_email || !login_input_password){
        return showMessage("Please fill in all required fields.","error")
    }
    let value_email = login_input_email.value.toLowerCase();
    let value_password = login_input_password.value;
    let res = await fetch("/rs/login",{
        credentials: "include",
        headers: {"Content-Type":"application/json"},
        method: "POST",
        body: JSON.stringify({
            email: value_email,
            password: value_password
        })
    })
    if(res.status === 502){
        showMessage("Server are offline","error")
        return
    }
    if(res.status === 401){
        showMessage("Email or password is wrong","error")
        return
    }
    if(res.status === 200){
        showMessage("Succesfully logged in","succes")
        check_session();
        return
    }
    else{
        showMessage("An error has occurred. Please try again later.","error")
    }
}
async function check_session () {
    let res = await fetch("/rs/check_session",{
        credentials: "include",
        method: "GET",
        headers: {"Content-Type":"application/json"}
    })
    if(res.status === 502){
    hidePages();
    Server_Offine_Page.style.display = "grid";
    const now = new Date();
    const formatted_start_time = new Date(temporary_Data[0].start_time).toLocaleString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});
    console.log("now: "+ now)
    const end = new Date(temporary_Data[0].end_time);
    const result = getDateDifference(
        now,
        end
);
    Maintenance_value_1.textContent = formatted_start_time;
    Maintenance_value_2.textContent = temporary_Data[0].reason
    startCountdown(result.hours,result.minutes);
    return "offline"
    }
    if(res.status === 401){
    return "unautherized"
    }
    if (res.status === 200){
        SetUILoggedIn()
    }
}
const temporary_Data = [
    { start_time: "2026-04-20T08:00:00", end_time: "2026-04-20T21:54:00", reason: "Fatal Security Error" }
];
function getDateDifference(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let diffMs = endDate - startDate; 

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
}
function startCountdown(hours, minutes) {
    let totalMinutes = hours * 60 + minutes;
    if (totalMinutes <= 0) {
            Estimated_time_p_2.textContent = "Soon ready";
            console.log("Soon ready")
            return;
        }
    Estimated_time_p_2.textContent = "~" + totalMinutes + " min";

    const timer = setInterval(() => {
        totalMinutes--;

        if (totalMinutes <= 0) {
            Estimated_time_p_2.textContent = "Soon ready";
            console.log("Soon ready")
            clearInterval(timer);
            window.location.reload();
            return;
        }
        Estimated_time_p_2.textContent = "~" + totalMinutes + " min";
        console.log("Soon ready")
    }, 60000); 
}