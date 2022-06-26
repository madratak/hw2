function modifyFollowers(text){
    console.log(text);
    const numFollowers = document.querySelectorAll('.count')[1];
    console.log(numFollowers);
    if(text==="unfollowed")
        numFollowers.textContent = parseInt(numFollowers.textContent)-1;
    else
        numFollowers.textContent = parseInt(numFollowers.textContent)+1;
}

function follow(event){
    const followButton = event.currentTarget;
    followButton.textContent = "Segui già";
    followButton.style.backgroundColor = "rgba(185, 185, 185, 0.8)";
    const form_data = new FormData();
    form_data.append('username', document.getElementById('username').textContent);
    form_data.append('_token', csrf_token);
    fetch(BASE_URL + "followUnfollow",{method: 'post', body: form_data}).then(response=>response.text()).then(modifyFollowers);
    followButton.removeEventListener('click',follow);
    followButton.addEventListener('click',unfollow);
}
function unfollow(event){
    const followButton = event.currentTarget;
    followButton.textContent = "Segui";
    followButton.style.backgroundColor = "rgba(185, 185, 185, 0.25)";
    const form_data = new FormData();
    form_data.append('username', document.getElementById('username').textContent);
    form_data.append('_token', csrf_token);
    fetch(BASE_URL + "followUnfollow",{method: 'post', body: form_data}).then(response=>response.text()).then(modifyFollowers);;
    followButton.addEventListener('click',follow);
    followButton.removeEventListener('click',unfollow);
}

function createFollowButton(text){
    const followButton = document.createElement('div');
    followButton.setAttribute('id','follow_unfollow');
    if(text){
        followButton.textContent = "Segui già";
        followButton.style.backgroundColor = "rgba(185, 185, 185, 0.8)";
        followButton.removeEventListener('click',follow);
        followButton.addEventListener('click',unfollow);
    } else{
        followButton.textContent = "Segui";
        followButton.style.backgroundColor = "rgba(185, 185, 185, 0.25)";
        followButton.addEventListener('click',follow);
        followButton.removeEventListener('click',unfollow);
    }
    document.getElementById('info').appendChild(followButton);
}

fetch(BASE_URL + "followTF/" +encodeURI(document.getElementById('username').textContent)).then(response=>response.text()).then(createFollowButton);

// Caricamento playlists del profilo
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
        feed.style.justifyContent ="normal";

        const likeButton = document.createElement("div");
        likeButton.classList.add("like_svg");
        const svgLikeTR = document.createElement("img");
        if(json[i].liked==0){
            svgLikeTR.src="/assets/like.svg";
            svgLikeTR.addEventListener('click', like);
        } else{
            svgLikeTR.src="/assets/like_d.svg";
            svgLikeTR.addEventListener('click', unlike);
        }
        likeButton.appendChild(svgLikeTR);

        const commentButton = document.createElement("div");
        commentButton.classList.add("comment_svg");
        const svgComment = document.createElement("img");
        svgComment.src = "/assets/comment.svg";
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
        feed.appendChild(likeButton);
        feed.appendChild(commentButton);
        
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
    const posts = document.querySelectorAll(".post");
    for(const post of posts)
        post.parentNode.removeChild(post);
    fetch(BASE_URL + "playlistsProfile/"+ encodeURIComponent(document.getElementById('username').textContent)).then(response=>response.json()).then(jsonFetchPost);
    document.querySelector('.infoNoPost').textContent = "Non sono state caricate playlists!";
}

loadPostProfile();