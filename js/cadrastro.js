const emmail = document.querySelector("#email");
const resultMessagem = document.querySelector("#resultMessage");
const emailForm = document.querySelector("emailForm")


emailForm.addEventListener("submit", function (event){
    event.preventDefault();

    const email = email.value;
    
    //alert(email)

    if(isValid){
        resultMessagem.textContent = "E-mail valido!";
        resultMessagem.style.color = "green";
    } else{
        resultMessagem.textContent = "E-mail invalido!";
        resultMessagem.style.color = "red";

    }
});


const valideteEmail = (email) => {
    const regex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    return regex.test(email);
};

function redirecionarParaLogin(){
     window.location.href = "banco.html";
}