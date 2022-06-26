@extends('layouts.page')

@section('head')
    @parent
    <link rel="stylesheet" href="{{ url('css/home&profile.css') }}" />
    <script src="{{ url('js/home&profile.js') }}" defer="true"></script>
    <script src="{{ url('js/profile.js') }}" defer="true"></script>
    <title>Blog {{ $userInfo["username"] }}</title>
@endsection

@section('contents')
    <div id="contents">
        <div id="info">
            <div id="infoUp">
                <img id="propic" src= {{ $userInfo["profile_picture"] }}>
                <section id="infoProfile">
                    <text id="username">{{ $userInfo["username"] }}</text>
                    <section id="details">
                        <div class="Detail">
                            Playlists
                            <h3 class="count">{{ $userInfo["countPlaylists"] }}</h3>
                        </div>
                        <div class="Detail">
                            Seguaci
                            <h3 class="count">{{ $userInfo["countFollowers"] }}</h3>
                        </div>
                        <div class="Detail">
                            Seguiti
                            <h3 class="count">{{ $userInfo["countFollowed"] }}</h3>
                        </div>
                    </section>
                </section>
            </div>
            <div id="bottons">
                <div id="sectionPostProfile">
                    Playlist pubblicate
                </div>
                <div id="sectionLikedProfile">
                    Playlist piaciute
                </div>
            </div>
        </div>
        <text class="infoNoPost hidden"></text>                      
    </div>
@endsection