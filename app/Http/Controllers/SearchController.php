<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use App\Models\User;

class SearchController extends Controller
{
    public function searchUsernames($username){
        if(!Session::get('username')){
            return redirect('login');
        }

        $users = User::get(); 
        $lenght = strlen($username);
        $nicknames = [];
        for($i=0; $i<count($users); $i++){
            $nickname = $users[$i]->username;
            if(strcmp($username,substr($nickname,0,$lenght))==0){
                array_push($nicknames,['username'=> $nickname, 'profile_picture'=>$users[$i]->profile_picture]);
            }
        }
        return json_encode($nicknames);
    }

    public function getProfile($nickname){
        if(!Session::get('username')){
            return redirect('login');
        }
        if(Session::get('username')===$nickname)
            return redirect('myprofile');        

        $user = User::where('username', $nickname)->first();
        $profile_picture = isset($user->profile_picture) ? $user->profile_picture : "/img/default-avatar.png"; 
        $userInfo = ['username' => $user->username, 'profile_picture' => $profile_picture, 
                    'countPlaylists' => count($user->playlists), 'countFollowers' => count($user->followers), 
                    'countFollowed' => count($user->followed)];
        return view('searchedProfile')->with('userInfo', $userInfo);
    }

    public function followTF($nickname){
        if(!Session::get('username')){
            return redirect('login');
        }
        $user = User::where('username', $nickname)->first();
        if(array_search(Session::get('username'), $user->followers)!==false)
            return true;
        return false;
    }

    public function follow_unfollow(){
        if(!Session::get('username')){
            return redirect('login');
        }
        $followers = User::where('username', request('username'))->first()->followers;
        $followed = User::where('username', Session::get('username'))->first()->followed;
        if ((($key = array_search(Session::get('username'), $followers)) !== false)) {
            unset($followers[$key]);
            User::where('username', request('username'))->update(['followers' => $followers]);
            $key = array_search(request('username'), $followed);
            unset($followed[$key]);
            User::where('username', Session::get('username'))->update(['followed' => $followed]);
            return "unfollowed";
        } else {
            array_push($followers,Session::get('username'));
            User::where('username', request('username'))->update(['followers' => $followers]);
            array_push($followed,request('username'));
            User::where('username',Session::get('username'))->update(['followed' => $followed]);
            return "followed";
        }
    }
}