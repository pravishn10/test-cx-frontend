console.log('Client side detectIntent file is loaded!');

const queryForm = document.querySelector("form");
const submit = document.querySelector("input");
const messageOne = document.querySelector("#message-1");

// messageOne.textContent = "From JS";

queryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const queryText = submit.value;

    messageOne.textContent = "Loading...";

    fetch("/detectIntentText?text="+queryText)
    .then(res => {
        res.json().then(data => {
            messageOne.textContent = "";
            if(data.error) {
                messageOne.textContent = data.error;
            } else {
                for(const botMessage of data.text){
                    messageOne.textContent += botMessage;
                }
            }
        });
    });
});