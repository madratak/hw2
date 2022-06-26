<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use App\Models\User;

class LoginController extends Controller
{
    public function login_form()
    {
        if(Session::get('username')){
            return redirect('home');
        }
        if(Cookie::get('username')){
            Session::put('username', Cookie::get('username'));
            return redirect("home");
        }
        $error = Session::get('error');
        Session::forget('error');
        return view('login')->with('error', $error);
    }
   
    public function checkLogin()
    {
        if(Session::get('username')) {
            return redirect('home');
        }

        $user = User::where('username', request('username'))->first();
       
        if(isset($user)) {
            if(password_verify(request('password'), $user->password)) {
                if(request("check"))
                    Cookie::queue(Cookie::make('username', $user->username));
                Session::put('username', $user->username);
                return redirect('home');
            }
        }
            Session::put('error', true);
            return redirect('login')->withInput();
    }

    public function logout()
    {
        Session::flush();
        Cookie::queue(Cookie::forget('username'));
        return redirect('login');
    }
}