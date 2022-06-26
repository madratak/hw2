<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use App\Models\User;

class SignUpController extends Controller
{
    public function signup_form()
    {
        if(Session::get('username'))
        {
            return redirect('home');
        }
        if(Cookie::get('username')){
            Session::put('username', Cookie::get('username'));
            return redirect("home");
        }
        $error = Session::get('error');
        Session::forget('error');
        return view('signup')->with('error', $error);
    }

    public function signup()
    {
        if(Session::get('username')){
            return redirect('home');
        }
        $request = request();
        if($this->countErrors($request) === 0) {
            $newUser =  User::create([
            'username' => $request['username'],
            'password' => password_hash($request['password'], PASSWORD_BCRYPT),
            'profile_picture' => null,
            'mail' => $request['mail'],
            'followed' => [],
            'followers' => []
            ]);
            if (isset($newUser)) {
                Session::put('username', $newUser->username);
                Cookie::queue(Cookie::make('username', $newUser->username));
                return redirect('home');
            } 
            else {
                return redirect('signup')->withInput();
            }
        }
        else 
            return redirect('signup')->withInput();
   }

    private function countErrors($data) {
        $error = array();
 
        if(!preg_match('/^[a-zA-Z0-9_]{1,15}$/', $data['username'])) {
            $error[] = "Username non valido";
        } else {
            $username = User::where('username', $data['username'])->first();
            if ($username !== null) {
                $error[] = "Username già utilizzato";
            }
        }

        if (strlen($data["password"]) < 8) {
            $error[] = "Caratteri password insufficienti";
        } 

        if (strcmp($data["password"], $data["c_password"]) != 0) {
            $error[] = "Le password non coincidono";
        }

        if (!filter_var($data['mail'], FILTER_VALIDATE_EMAIL)) {
            $error[] = "Mail non valida";
        } else {
            $mail = User::where('mail', $data['mail'])->first();
            if ($mail !== null) {
                $error[] = "Email già utilizzata";
            }
        }

        return count($error);
    }

    public function checkUsername($query) {
        $exists = User::where('username', $query)->first();
        if(isset($exists))
            return ['exists'=>true];
        else
            return ['exists'=>false];
    }

    public function checkMail($query) {
        $exists = User::where('mail', $query)->first();
        if(isset($exists))
            return ['exists'=>true];
        else
            return ['exists'=>false];
    }
}