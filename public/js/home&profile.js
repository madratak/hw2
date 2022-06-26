// GESTIONE LIKE

function textModifyNumLikes(text){
    console.log(text);
}

function unlike(event){
    const containerButton= event.currentTarget.parentNode;
    containerButton.innerHTML='';
    const likedWhite = document.createElement("img");
    likedWhite.src="/assets/like.svg";
    containerButton.appendChild(likedWhite);

    let post = containerButton.parentNode.parentNode;
    if(location.pathname === "/myprofile")
        post = post.parentNode;
    const creator = post.querySelector(".author").textContent;
    const titlePlaylist = post.querySelector(".text strong").textContent;

    const form_data = new FormData();
    form_data.append('creator', creator);
    form_data.append('title', titlePlaylist);
    form_data.append('_token', csrf_token);

    fetch(BASE_URL + "likeUnlike",{method: 'post', body: form_data}).then(response=>response.text()).then(textModifyNumLikes);
    
    const infoLikes = post.querySelector(".num_likes");
    const stringMiPiace = post.querySelector(".string_miPiace");
    infoLikes.textContent = parseInt(infoLikes.textContent)-1;
    if(parseInt(infoLikes.textContent)>0){
        infoLikes.classList.remove("hidden");
        stringMiPiace.classList.remove("hidden");
    }else{
        infoLikes.classList.add("hidden");
        stringMiPiace.classList.add("hidden");
    }
    const button=containerButton.childNodes[0];
    button.removeEventListener('click',unlike);
    button.addEventListener('click',like);
}

function like(event){
    const containerButton= event.currentTarget.parentNode;
    containerButton.innerHTML='';
    const likeRed = document.createElement("img");
    likeRed.src="/assets/like_d.svg";
    containerButton.appendChild(likeRed);

    let post = containerButton.parentNode.parentNode;
    if(location.pathname === "/myprofile")
        post = post.parentNode;
    const creator = post.querySelector(".author").textContent;
    const titlePlaylist = post.querySelector(".text strong").textContent;

    const form_data = new FormData();
    form_data.append('creator', creator);
    form_data.append('title', titlePlaylist);
    form_data.append('_token', csrf_token);

    fetch(BASE_URL + "likeUnlike",{method: 'post', body: form_data}).then(response=>response.text()).then(textModifyNumLikes);

    const infoLikes = post.querySelector(".num_likes");
    const stringMiPiace = post.querySelector(".string_miPiace");
    infoLikes.textContent = parseInt(infoLikes.textContent)+1;
    infoLikes.classList.remove("hidden");
    stringMiPiace.classList.remove("hidden");


    const button=containerButton.childNodes[0];
    button.removeEventListener('click',like);
    button.addEventListener('click',unlike);
}

//GESTIONE COMMENTI

function closeViewComments(){
    document.getElementById("comments").style.display = "none";
}

const button_closeComments = document.getElementById("button_closeComments");
button_closeComments.addEventListener('click', closeViewComments);

function jsonViewComments(json){
    console.log(json);
    document.getElementById("comments").style.display = "flex";
    const upComments = document.getElementById("up_comments");
    const noneView = document.getElementById("start_view");
    console.log(json[0].allComments.length);
    noneView.innerHTML="";
    const creator = document.createElement("p");
    const titlePlaylist = document.createElement("p");
    creator.classList.add("infoPostCreator");
    titlePlaylist.classList.add("infoPostTitlePlaylist");
    creator.classList.add("hidden");
    titlePlaylist.classList.add("hidden");
    creator.textContent = json[0].creator;
    titlePlaylist.textContent = json[0].playlist;
    console.log(creator.textContent);
    console.log(titlePlaylist.textContent);
    
    if(json[0].allComments.length==0){
        const commentsPlaylist = document.querySelectorAll(".single_comment");
        for(const commentPlaylist of commentsPlaylist)
            upComments.removeChild(commentPlaylist);
        const infoPlaylist = upComments.querySelectorAll("p .infoPost");
        for(const pInfo of infoPlaylist)
            upComments.removeChild(pInfo);
        
        upComments.style.justifyContent = "center";
        noneView.classList.remove("hidden");
        noneView.textContent = "La playlist selezionata non presenta commenti.";
        noneView.appendChild(titlePlaylist);
        noneView.appendChild(creator);
    } else{
        noneView.appendChild(titlePlaylist);
        noneView.appendChild(creator);

        upComments.style.justifyContent = "initial";
        noneView.classList.add("hidden");
        
        const commentsPlaylist = document.querySelectorAll(".single_comment");
        for(const commentPlaylist of commentsPlaylist)
            upComments.removeChild(commentPlaylist);

        for(let i in json[0].allComments){
            console.log(json[0].allComments[i]);
            const single_Comment = document.createElement("div");
            single_Comment.classList.add("single_comment");
            const author_date = document.createElement("div");
            author_date.classList.add("author_date");
            const author = document.createElement("strong");
            author.classList.add("author");
            const date = document.createElement("text");
            date.classList.add("date");
            author.textContent = json[0].allComments[i].username;
            date.textContent = json[0].allComments[i].time;

            author_date.appendChild(author);
            author_date.appendChild(date);

            const text_comment = document.createElement("p");
            text_comment.classList.add("text_comment");
            text_comment.textContent = json[0].allComments[i].comment;

            single_Comment.appendChild(author_date);
            single_Comment.appendChild(text_comment);

            upComments.appendChild(single_Comment);
        }
     }    
    const inputcomment = document.querySelector("input");

    const insertCommentButton = document.querySelector("#inputComment");
    insertCommentButton.addEventListener('submit', insertComment); 

}

function viewComments(event){
    const insertCommentButton = document.querySelector("#inputComment input[type=text]");
    insertCommentButton.value = "";   
    let post = event.currentTarget.parentNode.parentNode.parentNode;
    if(location.pathname==="/myprofile")
        post = post.parentNode;
    const creator = post.querySelector(".author").textContent;
    const titlePlaylist = post.querySelector(".text strong").textContent;

    const form_data = new FormData();
    form_data.append('creator', creator);
    form_data.append('playlist', titlePlaylist);
    form_data.append('_token', csrf_token);

    fetch(BASE_URL + "comments",{method: 'post', body: form_data}).then(response=>response.json()).then(jsonViewComments);
}

function insertComment(event){
    event.preventDefault();
    const insertCommentButton = document.querySelector("#inputComment input[type=text]");
    
    const info = document.getElementById("start_view");
    const creator = info.querySelector(".infoPostCreator").textContent;
    const titlePlaylist = info.querySelector(".infoPostTitlePlaylist").textContent;
    const commentInput = insertCommentButton.value;
    insertCommentButton.value = "";
    insertCommentButton.blur();

    const form_data = new FormData();
    form_data.append('creator', creator);
    form_data.append('playlist', titlePlaylist);
    form_data.append('comment',commentInput)
    form_data.append('_token', csrf_token);

    fetch(BASE_URL + "comments",{method: 'post', body: form_data}).then(response=>response.json()).then(jsonViewComments);
}

/* Loading Home e Profile */

const contents = document.getElementById('contents');
contents.classList.add('hidden');
const loadingPlaylists = document.createElement('img');
loadingPlaylists.src = "/assets/loading.svg";
loadingPlaylists.className = "loadingContents";
document.body.insertBefore(loadingPlaylists, document.getElementById('comments'));
setTimeout(function(){document.body.removeChild(loadingPlaylists);contents.classList.remove('hidden');}, 2000);



/* View followers e followed dal profilo*/

function closeViewFollow(){
    if(document.getElementById('viewFollow'))
        document.body.removeChild(document.getElementById('viewFollow'));
}

function createViewFollow(json){
    closeViewFollow();
    const viewFollow = document.createElement('div');
    viewFollow.setAttribute('id','viewFollow');

    const closeView = document.createElement('div');
    closeView.setAttribute('id','closeView');

    const buttonCloseView = document.createElement('button');
    buttonCloseView.style.cursor = "pointer";
    const imgCloseView = document.createElement('img');
    imgCloseView.src = "/assets/close.svg";
    imgCloseView.style.width = "100%";
    buttonCloseView.appendChild(imgCloseView);
    buttonCloseView.addEventListener('click',closeViewFollow);
    const typeFollow = document.createElement('text');
    typeFollow.textContent = "F" + json.type.substring(1);
    closeView.appendChild(buttonCloseView);
    closeView.appendChild(typeFollow);

    viewFollow.appendChild(closeView);

    if(!json.usersFollow.length){
        const advice = document.createElement('text');
        if(json.type==="followers")
            advice.textContent = "Non ci sono seguaci!"
        if(json.type==="followed")
            advice.textContent = "Non ci sono seguiti!"
        viewFollow.appendChild(advice);
    }

    for(let i in json.usersFollow){
        const userFollow = document.createElement('a');
        userFollow.classList.add('userFollow');
        userFollow.href = "/profile/"+encodeURI(json.usersFollow[i].username);;
        const imgFollow = document.createElement('img');
        imgFollow.classList.add('profile_img');
        imgFollow.src = json.usersFollow[i].picture;
        const textUsername = document.createElement('text');
        textUsername.textContent = "@" + json.usersFollow[i].username;
        userFollow.appendChild(imgFollow);
        userFollow.appendChild(textUsername);
        viewFollow.appendChild(userFollow);
    }
    
    document.body.appendChild(viewFollow);
}

function viewFollowers(){
    fetch(BASE_URL + "whoFollow/" + encodeURI('followers') + "/" + encodeURIComponent(document.getElementById('username').textContent)).then(response=>response.json()).then(createViewFollow);
}

function viewFollowed(){
    fetch(BASE_URL + "whoFollow/" + encodeURI('followed') + "/" + encodeURIComponent(document.getElementById('username').textContent)).then(response=>response.json()).then(createViewFollow);
}

if(location.pathname !== "/home"){
    document.querySelectorAll('.Detail')[1].addEventListener('click',viewFollowers);
    document.querySelectorAll('.Detail')[2].addEventListener('click',viewFollowed);
}
