<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('login');
});

Route::get('login','App\Http\Controllers\LoginController@login_form');
Route::get('logout', 'App\Http\Controllers\LoginController@logout');
Route::get('signup', 'App\Http\Controllers\SignUpController@signup_form');
Route::post('signup', 'App\Http\Controllers\SignUpController@signup');
Route::get('signup/mail/{q}', 'App\Http\Controllers\SignUpController@checkMail');
Route::get('signup/username/{q}', 'App\Http\Controllers\SignUpController@checkUsername');
Route::post('login', 'App\Http\Controllers\LoginController@checkLogin');

Route::get('home','App\Http\Controllers\HomeProfileController@home');


Route::get('search/{type}/{name}', 'App\Http\Controllers\HomeProfileController@modalSearch');

Route::post('post', 'App\Http\Controllers\HomeProfileController@postPlaylist');
Route::get('getHome', 'App\Http\Controllers\HomeProfileController@getPlaylistsHome');
Route::post('likeUnlike', 'App\Http\Controllers\HomeProfileController@like_unlike');

Route::post('comments', 'App\Http\Controllers\HomeProfileController@getOrSendComment');
Route::get('searchPeople','App\Http\Controllers\HomeProfileController@search');
Route::get('getUsernames/{username}','App\Http\Controllers\SearchController@searchUsernames');

Route::get('myprofile', 'App\Http\Controllers\HomeProfileController@myprofile');

Route::get('profile/{username}', 'App\Http\Controllers\SearchController@getProfile');
Route::get('playlistsProfile/{username}', 'App\Http\Controllers\HomeProfileController@getPlaylistsProfile');
Route::get('likedPlaylists', 'App\Http\Controllers\HomeProfileController@getLikedPlaylists');
Route::post('deletePlaylist', 'App\Http\Controllers\HomeProfileController@deletePlaylist');
Route::get('followTF/{username}', 'App\Http\Controllers\SearchController@followTF');
Route::post('followUnfollow', 'App\Http\Controllers\SearchController@follow_unfollow');

Route::get('whoFollow/{category}/{username}', 'App\Http\Controllers\HomeProfileController@whoFollow');


