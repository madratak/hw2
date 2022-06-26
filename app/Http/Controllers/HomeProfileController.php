<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use App\Models\User;
use App\Models\Playlist;
use App\Models\Comment;
use Carbon\Carbon;

class HomeProfileController extends Controller
{
    public function home(){
        if(!Session::get('username') && !Cookie::get('username')){
            return redirect("login");
        }
        $user = User::where('username',Session::get('username'))->first();
        return view('home')->with('username', $user->username);
    }

    public function modalSearch($type, $song){
        // Controllo accesso
        if(!Session::get('username'))
        {
            return redirect('login');
        }
        // Richiesta token
        $client_id = env('SPOTIFY_CLIENT_ID');
        $client_secret = env('SPOTIFY_CLIENT_SECRET');
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "https://accounts.spotify.com/api/token");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
        $headers = array("Authorization: Basic ".base64_encode($client_id.":".$client_secret));
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        $token=json_decode(curl_exec($curl))->access_token;
        curl_close($curl);
        if($type=="playlist"){
            $url = 'https://api.spotify.com/v1/playlists/44SmkW2zYTkTxVXBTZU7In/tracks';
        } elseif($type=="track"){
            $query = urlencode($song);
            $url = 'https://api.spotify.com/v1/search?type=track&limit=20&q='.$query ;
        }
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$token)); 
        $res=curl_exec($curl);
        curl_close($curl);
        // print_r($res);
        $output=[];
        // echo $res;
        if($type=="playlist"){
            $temp=json_decode($res)->items;
            for($i=0; $i<50; $i++){
                $output[] = $temp[$i]->track->id;
            }
        } elseif($type=="track"){
            $temp=json_decode($res)->tracks->items;    
            for($i=0; $i<20; $i++){
                $output[] = $temp[$i]->id;
            }
        }
        echo json_encode($output);
    }

    public function postPlaylist(){
        if(!Session::get('username')){
            return redirect('login');
        }

        if(empty(request('title')) || empty(json_decode(request('songs'))))
            return "Dati mancanti";
        $in = Playlist::where('username', Session::get('username'))->where('title',request('title'))->first();
        if(isset($in))
            return "Presente";

        $playlist = new Playlist;
        $playlist->creator = Session::get('username');
        $playlist->name = request('title');
        $playlist->time = Carbon::now()->toDateTimeString();
        $playlist->caption = request('caption');
        $playlist->songs = json_decode(request('songs'));
        $playlist->userLikes = [];

        $playlist->save();
        return;
    }

    public function getPlaylistsHome(){
        if(!Session::get('username')){
            return redirect('login');
        }
        
        $followed = User::where('username', Session::get('username'))->first()->followed;
        $playlists = Playlist::where('creator',Session::get('username'))->orWhereIn('creator',$followed)->orderBy('time','DESC')->get();  
        
        for($i=0; $i<count($playlists); $i++){
            $picture = $playlists[$i]->user->profile_picture == null ? "img/default-avatar.png" : $playlists[$i]->user->profile_picture;           
            $time = $this->getTime($playlists[$i]->time);
            $liked = in_array(Session::get('username'),$playlists[$i]->userLikes)?  1: 0;
            $playlists[$i] = ['username' => $playlists[$i]->creator,
                              'picture' => $picture,
                              'title' => $playlists[$i]->name,
                              'num_likes' => count($playlists[$i]->userLikes),
                              'caption' => $playlists[$i]->caption,
                              'time' => $time,
                              'liked' => $liked,
                              'songs' => $playlists[$i]->songs                            
                            ];
        }
        return json_encode($playlists);
    }

    public function getTime($timestamp) {           
        $old = strtotime($timestamp); 
        $diff = time() - $old;           
        $old = date('d/m/y', $old);

        if ($diff /60 <1) {
            return intval($diff%60)." secondi fa";
        } else if (intval($diff/60) == 1)  {
            return "Un minuto fa";  
        } else if ($diff / 60 < 60) {
            return intval($diff/60)." minuti fa";
        } else if (intval($diff / 3600) == 1) {
            return "Un'ora fa";
        } else if ($diff / 3600 <24) {
            return intval($diff/3600) . " ore fa";
        } else if (intval($diff/86400) == 1) {
            return "Ieri";
        } else if ($diff/86400 < 30) {
            return intval($diff/86400) . " giorni fa";
        } else {
            return $old; 
        }
    }

    public function like_unlike(){
        if(!Session::get('username')){
            return redirect('login');
        }
        $newUserLikes = Playlist::where('creator', request('creator'))->where('name',request('title'))->first()->userLikes;
        if ((($key = array_search(Session::get('username'), $newUserLikes)) !== false)) {
            unset($newUserLikes[$key]);
            Playlist::where('creator', request('creator'))->where('name',request('title'))->update(['userLikes' => $newUserLikes]);
        }
        else {
            array_push($newUserLikes,Session::get('username'));
            Playlist::where('creator', request('creator'))->where('name',request('title'))->update(['userLikes' => $newUserLikes]);
        }
        return count($newUserLikes);   
    }

    public function getOrSendComment(){
        if(!Session::get('username')){
            return redirect('login');
        }

        if(!empty(request('playlist')) && !empty(request("creator"))){
            if(!empty(request('comment'))){
                $comment = new Comment;
                $comment->writer = Session::get('username');
                $comment->creatorPlaylist = request('creator');
                $comment->namePlaylist = request('playlist');
                $comment->time = Carbon::now()->toDateTimeString();
                $comment->comment = request('comment');
                $comment->save();
            }
            $playlist =  Playlist::where('creator',request("creator"))->where('name',request('playlist'))->first();
            $creator = $playlist->creator;
            $allComments = $playlist->comments->toArray();
            for($i=0; $i<count($allComments); $i++){        
                 $time = $this->getTime($allComments[$i]['time']);
                 $allComments[$i] = ['username' => $allComments[$i]['writer'],
                                 'comment' => $allComments[$i]['comment'],
                                 'time' => $time,                          
                                 ];
            }
            $allInfo[] = array('creator' => $creator, 'playlist' => $playlist->name, 'allComments' => $allComments);
            return json_encode($allInfo);
        }
    }

    public function search(){
        if(!Session::get('username')){
            return redirect('login');
        }
        return view('search');
    }

    public function myprofile(){
        if(!Session::get('username')){
            return redirect('login');
        }
        $user = User::where('username', Session::get('username'))->first();
        $profile_picture = isset($user->profile_picture) ? $user->profile_picture : "img/default-avatar.png"; 
        $userInfo = ['username' => $user->username, 'profile_picture' => $profile_picture, 
                    'countPlaylists' => count($user->playlists), 'countFollowers' => count($user->followers), 
                    'countFollowed' => count($user->followed)];
        return view('profile')->with('userInfo', $userInfo);
    }

    public function getPlaylistsProfile($username){
        if(!Session::get('username')){
            return redirect('login');
        }
        $userSession = User::where('username', $username)->first();

        $playlists = Playlist::where('creator',$userSession->username)->orderBy('time','DESC')->get();  
        
        $picture = $userSession->profile_picture == null ? "/img/default-avatar.png" : $userSession->profile_picture;

        for($i=0; $i<count($playlists); $i++){       
            $time = $this->getTime($playlists[$i]->time);
            $liked = in_array(Session::get('username'),$playlists[$i]->userLikes)?  1: 0;
            $playlists[$i] = ['username' => $userSession->username,
                                'picture' => $picture,
                                'title' => $playlists[$i]->name,
                                'num_likes' => count($playlists[$i]->userLikes),
                                'caption' => $playlists[$i]->caption,
                                'time' => $time,
                                'liked' => $liked,
                                'songs' => $playlists[$i]->songs,
                                'garbage' => true                            
                            ];
        }
        return json_encode($playlists);
    }

    public function getLikedPlaylists(){
        if(!Session::get('username')){
            return redirect('login');
        }

        $playlists = Playlist::where('userLikes',Session::get('username'))->orderBy('time','DESC')->get();  

        for($i=0; $i<count($playlists); $i++){   
            $picture = $playlists[$i]->user->profile_picture == null ? "img/default-avatar.png" : $playlists[$i]->user->profile_picture;
            $time = $this->getTime($playlists[$i]->time);
            $liked = in_array(Session::get('username'),$playlists[$i]->userLikes)?  1: 0;
            $playlists[$i] = ['username' => $playlists[$i]->user->username,
                                'picture' => $picture,
                                'title' => $playlists[$i]->name,
                                'num_likes' => count($playlists[$i]->userLikes),
                                'caption' => $playlists[$i]->caption,
                                'time' => $time,
                                'liked' => $liked,
                                'songs' => $playlists[$i]->songs                            
                            ];
        }
        return json_encode($playlists);
    }

    public function deletePlaylist(){
        if(Session::get('username')===request('creator')){
            Playlist::where('creator',request('creator'))->where('name',request('title'))->delete();
            Comment::where('creatorPlaylist',request('creator'))->where('namePlaylist',request('title'))->delete();
            return true;
        }
        return false;
    }

    public function whoFollow($category,$nickname){
        if(!Session::get('username')){
            return redirect('login');
        }

        $user = USER::where('username',$nickname)->first();
        if($category==="followers")
            $usersFollow = $user->followers;
        if($category==="followed")
            $usersFollow = $user->followed;       
        
        for($i=0; $i<count($usersFollow); $i++){
            $user = User::where('username', $usersFollow[$i])->first()->toArray();
            $picture = $user['profile_picture'] == null ? "/img/default-avatar.png" : $user['profile_picture'];
            $usersFollow[$i] = ['picture' => $picture, 'username' => $user['username'] ];
        }

        $infoFollow = ['type' => $category, 'usersFollow' => $usersFollow];

        return json_encode($infoFollow);
    }
}