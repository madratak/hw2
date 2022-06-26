function textReload(text){
    console.log(text);
    const comments = document.querySelectorAll(".single_comment");
    for(const comment of comments)
        comment.parentNode.removeChild(comment);
    const start_view = document.getElementById("start_view");
    start_view.classList.remove("hidden");
    start_view.innerHTML="";
    const text1 = document.createElement('text');
    text1.textContent = " Seleziona ";
    const img = document.createElement('img');
    img.src = "./assets/comment.svg";
    const text2 = document.createElement('text');
    text2.textContent = " di una playlist per visualizzarne i commenti. ";
    start_view.appendChild(text1);
    start_view.appendChild(img);
    start_view.appendChild(text2);
    start_view.parentNode.style.justifyContent = "center";
    if(text){
        loadPostProfile();
        const countPlaylists = document.querySelectorAll(".count")[0];
        countPlaylists.textContent = parseInt(countPlaylists.textContent)-1;
    }
}

function deletePlaylist(event){
    const post = event.currentTarget.parentNode.parentNode;
    const creator = post.querySelector(".author").textContent;
    const title = post.querySelector(".text strong").textContent;

    const form_data = new FormData();
    form_data.append('creator', creator);
    form_data.append('title', title);
    form_data.append('_token', csrf_token);

    fetch(BASE_URL+"deletePlaylist",{method: 'post', body: form_data}).then(response=>response.text()).then(textReload);
}

function scrollBackGarbage(){
    const garbageButton = document.querySelector('.confirmDelete');
    garbageButton.removeEventListener('click',deletePlaylist);
    garbageButton.textContent="";
    const svgGarbage = document.createElement("img");
    svgGarbage.src = "./assets/icons8-delete.svg";
    const text = document.createElement('text');
    text.textContent="Elimina";
    garbageButton.appendChild(svgGarbage);
    garbageButton.appendChild(text);
    garbageButton.classList.remove('confirmDelete');
    garbageButton.addEventListener('click',confirmDeletePlaylist);
    const contents = document.getElementById("contents");
    contents.removeEventListener('scroll', scrollBackGarbage);
}

function confirmDeletePlaylist(event){
    const garbageButton = event.currentTarget;
    garbageButton.removeEventListener('click',confirmDeletePlaylist);
    garbageButton.textContent = "Confermi?";
    garbageButton.classList.add('confirmDelete');
    garbageButton.addEventListener('click',deletePlaylist);
    const contents = document.getElementById("contents"); 
    contents.addEventListener('scroll', scrollBackGarbage);
}

function jsonFetchPost(json){
    console.log("Sto caricando...");
    console.log(json);
    const contents = document.getElementById("contents"); 
    if(json.length==0)
        document.querySelector('.infoNoPost').classList.remove('hidden');
    else
        document.querySelector('.infoNoPost').classList.add('hidden');
    for(let i in json){
        const post = document.createElement("div");
        post.classList.add("post");

        const info_post = document.createElement("div");
        info_post.classList.add("info_post");

        const author_date = document.createElement("a");
        author_date.classList.add("author_date");
        author_date.href = "/profile/"+encodeURI(json[i].username);
        const profile_img = document.createElement("img");
        profile_img.classList.add("profile_img")
        profile_img.src = json[i].picture;

        const author = document.createElement("strong");
        author.classList.add("author");
        author.textContent = json[i].username;

        author_date.appendChild(profile_img);
        author_date.appendChild(author);

        const spentTime = document.createElement("text");
        spentTime.classList.add("date");
        spentTime.textContent = json[i].time;

        info_post.appendChild(author_date);
        info_post.appendChild(spentTime);

        const title_caption = document.createElement("div");
        title_caption.classList.add("text");
        
        const title = document.createElement("strong");
        title.textContent = json[i].title;
        const caption = document.createElement("p");
        caption.textContent = json[i].caption;
        title_caption.appendChild(title)
        title_caption.appendChild(caption);

        const songs = document.createElement("div");
        songs.classList.add("songs");

        for(let j in json[i].songs){
            const iframe = document.createElement('iframe');
            iframe.src = json[i].songs[j];
            iframe.frameBorder = 0;
            iframe.setAttribute('allowtransparency', 'true');
            iframe.allow = "encrypted-media";
            iframe.classList = "track_iframe";
            const song = document.createElement('div');
            song.classList.add('song');
            song.appendChild(iframe);
            songs.appendChild(song);
        }
        
        const feed = document.createElement("div");
        feed.classList.add("feed");

        const interactions = document.createElement("div");
        interactions.classList.add("interactions");

        const likeButton = document.createElement("div");
        likeButton.classList.add("like_svg");
        const svgLikeTR = document.createElement("img");
        if(json[i].liked==0){
            svgLikeTR.src="./assets/like.svg";
            svgLikeTR.addEventListener('click', like);
        } else{
            svgLikeTR.src="./assets/like_d.svg";
            svgLikeTR.addEventListener('click', unlike);
        }
        likeButton.appendChild(svgLikeTR);

        const commentButton = document.createElement("div");
        commentButton.classList.add("comment_svg");
        const svgComment = document.createElement("img");
        svgComment.src = "./assets/comment.svg";
        svgComment.addEventListener('click', viewComments);
        commentButton.appendChild(svgComment);

        const numLikes = document.createElement("div");
        numLikes.classList.add("num_likes");
        numLikes.style.marginTop = "3px";
        numLikes.style.display = "inline";
        numLikes.textContent = json[i].num_likes;
        const stringMiPiace = document.createElement("div");
        stringMiPiace.classList.add("string_miPiace");
        stringMiPiace.style.marginTop = "3px";
        stringMiPiace.style.display = "inline";
        stringMiPiace.textContent = " mi piace";
        if(json[i].num_likes==0){
            numLikes.classList.add("hidden");
            stringMiPiace.classList.add("hidden");
        }
        interactions.appendChild(likeButton);
        interactions.appendChild(commentButton);

        feed.appendChild(interactions);

        if(json[i].garbage){
            const garbageButton = document.createElement("div");
            garbageButton.classList.add("garbage_svg");
            const svgGarbage = document.createElement("img");
            svgGarbage.src = "./assets/icons8-delete.svg";
            const text = document.createElement('text');
            text.textContent="Elimina";
            garbageButton.appendChild(svgGarbage);
            garbageButton.appendChild(text);
            garbageButton.addEventListener('click', confirmDeletePlaylist);
            feed.appendChild(garbageButton);
        }
        
        post.appendChild(info_post);
        post.appendChild(title_caption);
        post.appendChild(songs);
        post.appendChild(feed);
        post.appendChild(numLikes);
        post.appendChild(stringMiPiace);

        contents.appendChild(post);
    }
}

function loadPostProfile(){
    document.querySelector('.infoNoPost').classList.add('hidden');
    document.getElementById('sectionPostProfile').style.backgroundColor = "rgba(0, 0, 0, 0.12)";
    document.getElementById('sectionLikedProfile').style.backgroundColor = null;
    const posts = document.querySelectorAll(".post");
    for(const post of posts)
        post.parentNode.removeChild(post);
    fetch(BASE_URL + "playlistsProfile/"+encodeURIComponent(document.getElementById('username').textContent)).then(response=>response.json()).then(jsonFetchPost);
    document.querySelector('.infoNoPost').textContent = "Non hai caricato ancora nessuna playlist!";
}

loadPostProfile();

function likedPlaylists(){
    document.getElementById('sectionLikedProfile').style.backgroundColor = "rgba(0, 0, 0, 0.12)";
    document.getElementById('sectionPostProfile').style.backgroundColor = null;
    const posts = document.querySelectorAll(".post");
    for(const post of posts)
        post.parentNode.removeChild(post);
    fetch(BASE_URL + "likedPlaylists").then(response=>response.json()).then(jsonFetchPost);  
    document.querySelector('.infoNoPost').textContent = "Non hai messo mi piace a nessuna playlist!";
}

// Bottoni per Playlists pubblicate e piaciute
document.getElementById('sectionLikedProfile').addEventListener('click', likedPlaylists);
document.getElementById('sectionPostProfile').addEventListener('click', loadPostProfile);
