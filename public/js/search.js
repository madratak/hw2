function jsonUsernames(json){
    console.log(json);
    const infoPage = document.getElementById("infoPage");
    const matches = document.getElementById("getUsers");
    if(json.length>0){
        infoPage.classList.add("hidden");
        matches.classList.remove("hidden");
    } else{
        infoPage.querySelector("p").textContent = "Nessun utente trovato.";
        infoPage.classList.remove("hidden");
        matches.classList.add("hidden");
    }
    matches.innerHTML = "";
    for(let i in json){
        const match = document.createElement('a');
        match.classList.add('getUser'); 
        const img = document.createElement('img');
        img.classList.add('user_img');
        if(!json[i].profile_picture)
            img.src = "img/default-avatar.png";
        else
            img.src = json[i].profile_picture;
        const username = document.createElement('p');
        username.textContent = "@"+json[i].username;

        match.appendChild(img);
        match.appendChild(username);
        match.href = "/profile/"+ encodeURI(json[i].username);
        matches.appendChild(match);
    }
}

function searchUsers(){
    const textInput = document.querySelector("#inputUser input[type=text]").value;
    const infoPage = document.getElementById("infoPage");
    if(textInput.length>0)
        fetch(BASE_URL + "getUsernames/"+encodeURIComponent(textInput)).then(response=>response.json()).then(jsonUsernames);
    else{
        document.getElementById("getUsers").innerHTML = "";
        document.getElementById("getUsers").classList.add("hidden");
        infoPage.querySelector("p").textContent = "Cerca utenti e comincia a seguirli!";
        infoPage.classList.remove("hidden");
    }
}

const inputUser = document.getElementById("inputUser");

inputUser.addEventListener('input',searchUsers);
