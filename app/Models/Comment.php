<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;


class Comment extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'comments';
    protected $fillable = ['writer','creatorPlaylist','namePlaylist','comment','time'];
    public $timestamps = false;

    public function playlist(){
        return $this->belongsTo('App\Models\Playlist','namePlaylist','name');
    }

    public function user(){
        return $this->belongsTo('App\Models\User','writer','username');
    }
}
