document
  .getElementById("generateBtn")
  .addEventListener("click", send);

async function send(){

    const prompt = document.getElementById("prompt").value;

    document.getElementById("result").innerText = "Generating...";

    const res = await fetch("http://localhost:8000/generate",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({prompt})
    });

    const data = await res.json();

    document.getElementById("result").innerText = data.code;
}