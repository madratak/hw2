<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;


class Playlist extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'playlists';
    protected $primaryKey = '_id';
    protected $fillable = ['creator','name','time','caption','songs','userLikes'];
    public $timestamps = false;

    public function user(){
        return $this->belongsTo('App\Models\User','creator','username');
    }

    public function comments(){
        return $this->hasMany('App\Models\Comment','namePlaylist','name');
    }
}
