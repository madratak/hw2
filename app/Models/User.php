<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;


class User extends Model
{
   protected $connection = 'mongodb';
   protected $collection = 'users';
   protected $primaryKey = '_id';
   protected $fillable = ['username','password','profile_picture','mail','followed','followers'];
   protected $hidden = ['password'];
   public $timestamps = false;

   public function playlists(){
      return $this->hasMany('App\Models\Playlist', 'creator','username');
   }

   public function comments(){
      return $this->hasMany('App\Models\Comment', 'writer', 'username');
   }
}
