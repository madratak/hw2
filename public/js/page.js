// Modal
function closeModal(event){

    modal.classList.add("hidden");
    offContentSwitch();
    randomLoad();
    document.querySelector("#propSongs").classList.remove("hidden");
    document.querySelector("#searchedSongs").classList.add("hidden");
    document.getElementById("propSongs").classList.remove("hidden");
    document.getElementById("search_song").classList.remove("hidden");
    document.querySelector(".success-animation").classList.add("hidden");
    document.getElementById("searchbox").value="";
}

function openModal(){
    modal.classList.remove("hidden");
}

const modal = document.querySelector("#modal");
const newPostButtons = document.querySelectorAll(".new_post");
for(const newPostButton of newPostButtons)
    newPostButton.addEventListener('click', openModal);
const closeModalButton = document.querySelector("#close_modal svg");
closeModalButton.addEventListener('click',closeModal);

function switchLayoutModal(){
    document.querySelector("#propSongs").classList.remove("hidden");
    document.querySelector("#searchedSongs").classList.add("hidden");
}

document.querySelector("#search_song svg").addEventListener('click', switchLayoutModal);

// CARICAMENTO CANZONI IN MODALE CON RICERCA E DEFAULT
function jsonSearch(json){
    const searchedSongsContainer = document.getElementById("searchedSongs");
    const searchedSongs = searchedSongsContainer.querySelectorAll(".proposal");
    for(const searchedSong of searchedSongs)
        searchedSong.classList.add("hidden");
    searchedSongsContainer.innerHTML="";
    const propsContainer = document.querySelector("#propSongs");
    searchedSongsContainer.classList.add("hidden");
    propsContainer.classList.add('hidden');
    const container = propsContainer.parentElement;
    const loading = document.createElement('img');
    loading.src = "/assets/loading.svg";
    loading.className = "loading";
    container.appendChild(loading);
    const chosenSongs = document.querySelectorAll(".chosenSong");
   for(let trackID of json){
        const iframe = document.createElement('iframe');
        iframe.src = "https://open.spotify.com/embed/track/"+trackID;
        iframe.frameBorder = 0;
        iframe.setAttribute('allowtransparency', 'true');
        iframe.allow = "encrypted-media";
        iframe.classList = "track_iframe";

        const prop= document.createElement('div');
        prop.classList.add('prop');

        prop.appendChild(iframe);

        const proposal=document.createElement('div');
        proposal.classList.add('proposal');
        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        for(const chosenSong of chosenSongs){
            if(chosenSong.childNodes[0].src==="https://open.spotify.com/embed/track/"+trackID){
                checkbox.checked=true;
                break;
            }
        }
        proposal.appendChild(checkbox);
        proposal.appendChild(prop);
        searchedSongsContainer.appendChild(proposal);
    }
    setTimeout(function(){loading.remove();searchedSongsContainer.classList.remove("hidden");}, 1000);
    
    const checkButtons = document.querySelectorAll('.proposal input[type=checkbox]');
    // console.log(checkButton.length);
    for(let i=0; i<checkButtons.length; i++){
        if(checkButtons[i].checked)
            checkButtons[i].addEventListener('click',forgetIDFrame);
        else
            checkButtons[i].addEventListener('click',rememberIDFrame);
    }
}

function search(event){
    const textInput = event.currentTarget.querySelector('input[type=text]').value;
    event.preventDefault();
    document.getElementById('searchbox').blur();
    fetch(BASE_URL + "search/" + encodeURIComponent("track") + "/" + encodeURIComponent(textInput)).then(response=>response.json()).then(jsonSearch);
}

function jsonDefaultSearch(json){
    const propsContainer = document.querySelector("#propSongs");
    const searchedSongsContainer = document.querySelector("#searchedSongs");
    propsContainer.innerHTML="";
    searchedSongsContainer.classList.add("hidden");
    propsContainer.classList.add('hidden');
    const container = propsContainer.parentElement;
    const loading = document.createElement('img');
    loading.src = "/assets/loading.svg";
    loading.className = "loading";
    container.appendChild(loading);
    const chosenSongs = document.querySelectorAll(".chosenSong");
   for(let trackID of json){
        const iframe = document.createElement('iframe');
        iframe.src = "https://open.spotify.com/embed/track/"+trackID;
        iframe.frameBorder = 0;
        iframe.setAttribute('allowtransparency', 'true');
        iframe.allow = "encrypted-media";
        iframe.classList = "track_iframe";

        const prop= document.createElement('div');
        prop.classList.add('prop');

        prop.appendChild(iframe);

        const proposal=document.createElement('div');
        proposal.classList.add('proposal');

        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        // console.log("https://open.spotify.com/embed/track/"+trackID);
        for(const chosenSong of chosenSongs){
            if(chosenSong.childNodes[0].src==="https://open.spotify.com/embed/track/"+trackID){
                checkbox.checked=true;
                break;
            }
        }
        proposal.appendChild(checkbox);
        proposal.appendChild(prop);
        propsContainer.appendChild(proposal);
    }
    setTimeout(function(){loading.remove();propsContainer.classList.remove('hidden');}, 1000);
    
    const checkButtons = document.querySelectorAll('.proposal input[type=checkbox]');
    // console.log(checkButton.length);
    for(let i=0; i<checkButtons.length; i++){
        if(checkButtons[i].checked)
            checkButtons[i].addEventListener('click',forgetIDFrame);
        else
            checkButtons[i].addEventListener('click',rememberIDFrame);
    }
}

function randomLoad(){
    fetch(BASE_URL + "search/"+encodeURIComponent("playlist")+"/"+encodeURIComponent("Top Italia")).then(response=>response.json()).then(jsonDefaultSearch);
}

randomLoad();
const searchButton= document.querySelector("#search_song");
searchButton.addEventListener('submit', search);

//CREAZIONE POST
function forgetIDFrame(event){
    const containerFrame = event.currentTarget.parentNode.querySelector('.prop');
    /*const checkbox = containerFrame.parentNode.parentNode.querySelector('input[type=checkbox]');*/
    const containerSongs = document.querySelector('#propSongs');
    const chosenSongs = containerSongs.querySelectorAll(".chosenSong");
    /*console.log(chosenSongs.length);*/
    for(let i=0; i<chosenSongs.length; i++){
        /*console.log(chosenSongs[i]);
        console.log("Sto per leggere il src del frame");
        console.log(chosenSongs[i].childNodes[0].src);
        console.log(containerFrame.childNodes[0].src);*/
        if(chosenSongs[i].childNodes[0].src === containerFrame.childNodes[0].src){
            chosenSongs[i].innerHTML='';
            chosenSongs[i].parentNode.removeChild(chosenSongs[i]);
            // console.log('rimosso');
            break;
        }
    }

    const checkButtons = document.querySelectorAll('.proposal input[type=checkbox]');
    for(const checkButton of checkButtons){
        if(checkButton.parentNode.querySelector("iframe").src===containerFrame.childNodes[0].src){
            checkButton.checked=false;
            checkButton.removeEventListener('click',forgetIDFrame);
            checkButton.addEventListener('click', rememberIDFrame);
        }
    }  
}

function rememberIDFrame(event){
    const containerFrame = event.currentTarget.parentNode.querySelector('.prop');
    // console.log("selezionato");
    // console.log(containerFrame.childNodes[0].src);
    const chosenFrame = document.createElement('iframe');
    chosenFrame.src = containerFrame.childNodes[0].src;
    chosenFrame.frameBorder = 0;
    chosenFrame.setAttribute('allowtransparency', 'true');
    chosenFrame.allow = "encrypted-media";
    chosenFrame.classList = "track_iframe";
    const deleteSong = document.createElement("img");
    deleteSong.src="./assets/delete_song.svg";
    const chosenSong = document.createElement('div');
    chosenSong.appendChild(chosenFrame);
    chosenSong.appendChild(deleteSong);
    chosenSong.classList.add("chosenSong");
    chosenSong.classList.add('hidden');
    const containerSongs = document.querySelector('#propSongs');
    containerSongs.appendChild(chosenSong);

    const checkButtons = document.querySelectorAll('.proposal input[type=checkbox]');
    for(const checkButton of checkButtons){
        if(checkButton.parentNode.querySelector("iframe").src===chosenFrame.src){
            checkButton.checked=true;
            checkButton.removeEventListener('click',rememberIDFrame);
            checkButton.addEventListener('click',forgetIDFrame );
        }
    }
}

function deleteSongChosen(event){
    const deleteButton = event.currentTarget;
    const songToDelete = deleteButton.parentNode;
    const chosenSongs = document.querySelectorAll(".chosenSong");
    const checkboxes = document.querySelectorAll(".proposal input[type=checkbox]");
    console.log(checkboxes.length);
    for(let i=0; i<chosenSongs.length; i++){
        console.log(chosenSongs[i].childNodes[0].src);
        console.log(songToDelete.childNodes[0].src);
        if(chosenSongs[i].childNodes[0].src === songToDelete.childNodes[0].src){
            for(let j=0; j<checkboxes.length; j++){
                // console.log(checkboxes[j].parentNode.childNodes[1].querySelector('iframe').src);
                // console.log(songToDelete.querySelector('iframe').src);
                if(checkboxes[j].parentNode.childNodes[1].querySelector('iframe').src === songToDelete.childNodes[0].src){
                    checkboxes[j].checked=false;
                    checkboxes[j].removeEventListener('click',forgetIDFrame);
                    checkboxes[j].addEventListener('click', rememberIDFrame);
                    // console.log('Ho tolto la spunta');
                }
            }
            chosenSongs[i].innerHTML='';
            chosenSongs[i].parentNode.removeChild(chosenSongs[i]);
            // console.log('rimosso');
            break;
        }
    }
}

function onContentSwitch(event){
    document.getElementById("back_button").classList.remove("hidden");
    const contentPropSongs = document.getElementById("propSongs");
    const searchedSongsContainer = document.getElementById("searchedSongs");
    const propSongs = contentPropSongs.querySelectorAll(".proposal");
    searchedSongsContainer.classList.add("hidden");
    contentPropSongs.classList.remove("hidden");
    const searchedSongs = searchedSongsContainer.querySelectorAll(".proposal");
    const chosenSongs = contentPropSongs.querySelectorAll(".chosenSong");
    for(const searchedSong of searchedSongs)
        searchedSong.classList.add("hidden");
    for(const propSong of propSongs)
        propSong.classList.add("hidden");
    for(const chosenSong of chosenSongs)
        chosenSong.classList.remove("hidden");

    event.currentTarget.textContent="Pubblica";
    event.currentTarget.removeEventListener("click", onContentSwitch);
    event.currentTarget.addEventListener("click", postPlaylist);

    const deleteSongButtons = document.querySelectorAll(".chosenSong img");
    for(const deleteSongButton of deleteSongButtons){
        deleteSongButton.addEventListener('click', deleteSongChosen);
    }

    document.querySelector("#search_song svg").classList.add("hidden");
    document.querySelector("#search_song input[type=text]").classList.add("hidden");
    const textAreas = document.querySelectorAll("#search_song textarea");
    const areaInput = document.getElementById("search_song")
    areaInput.style.flexDirection = "column";
    areaInput.style.height = "50%";
    for(const textarea of textAreas)
        textarea.classList.remove("hidden");
}

function offContentSwitch(event){
    document.getElementById("back_button").classList.add("hidden");
    document.getElementById("continue_button").removeEventListener("click", postPlaylist);
    document.getElementById("continue_button").addEventListener("click", onContentSwitch);
    document.getElementById("continue_button").textContent="Avanti";
    const contentPropSongs = document.getElementById("propSongs");
    
    const propSongs = contentPropSongs.querySelectorAll(".proposal");
    const chosenSongs = contentPropSongs.querySelectorAll(".chosenSong");
    for(const propSong of propSongs)
        propSong.classList.remove("hidden");
    for(const chosenSong of chosenSongs)
        chosenSong.classList.add("hidden"); 

    document.querySelector("#search_song svg").classList.remove("hidden");
    document.querySelector("#search_song input[type=text]").classList.remove("hidden");
    const textAreas = document.querySelectorAll("#search_song textarea");

    const areaInput = document.getElementById("search_song")
    areaInput.style.removeProperty("flex-direction");
    areaInput.style.height = "8%";

    for(const textarea of textAreas)
        textarea.classList.add("hidden");
    
}

const buttonPreLoad = document.getElementById("continue_button");
buttonPreLoad.addEventListener('click', onContentSwitch);
document.getElementById("back_button").addEventListener('click', offContentSwitch);


function textPlaylistPost(text){
    console.log(text);
    
    if(text==="Dati mancanti"){
        setTimeout(function(){window.alert("Non hai compilato tutti i campi");}, 200);
        return;
    }
    if(text==="Presente"){
        document.getElementById("insertName").style.borderColor="Red";
        setTimeout(function(){window.alert("Hai già una playlist con questo nome!");}, 200);
        return;
    }

    document.getElementById("search_song").classList.add("hidden");
    const postedSongs = document.querySelectorAll(".chosenSong");
    for(const postedSong of postedSongs)
        postedSong.parentNode.removeChild(postedSong);
    

    document.getElementById("propSongs").innerHTML="";
    document.getElementById("propSongs").classList.add("hidden");
    document.querySelector(".success-animation").classList.remove("hidden");
    document.getElementById("insertName").style.borderColor="rgba(128, 128, 128, 0.664)";
    document.getElementById("insertName").value="";
    document.getElementById("insertCaption").value="";
    document.getElementById("searchbox").value="";
    setTimeout(function(){closeModal();contents.scrollTo(0,0);}, 2200);
    if(location.pathname==="/home")
        loadPostsFromDatabase();
    if(location.pathname==="/myprofile"){
        loadPostProfile();
        const countPlaylists = document.querySelectorAll(".count")[0];
        countPlaylists.textContent = parseInt(countPlaylists.textContent)+1;
    }
}


function postPlaylist(event){
    console.log("Pubblicato");
    const title = document.getElementById("insertName").value;
    const caption = document.getElementById("insertCaption").value;
    console.log(title+" "+caption);
    const songsPost = document.querySelectorAll(".chosenSong iframe");
    const urlSongsPost = new Array();
    for(const songPost of songsPost){
        // console.log(songPost.src);  
        urlSongsPost.push(songPost.src);
    }
    console.log(urlSongsPost);
    event.preventDefault();

    const form_data = new FormData();
    form_data.append('caption', caption);
    form_data.append('title', title);
    form_data.append('songs', JSON.stringify(urlSongsPost));
    form_data.append('_token', csrf_token);

    fetch(BASE_URL + "post",{method: 'post', body: form_data}).then(response=>response.text()).then(textPlaylistPost);
}

