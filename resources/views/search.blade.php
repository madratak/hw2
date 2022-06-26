@extends('layouts.page')

@section('head')
    @parent
    <title>Cerca</title>
    <script src="{{ url('js/search.js') }}" defer="true"></script>
    <link rel="stylesheet" href="{{ url('css/search.css') }}" />
@endsection

@section('contents')
    <div id="searchPeople">   
        <form id="inputUser">
            <input type="text" name="searchUser" id="searchUser" placeholder="Inserisci l'username...">
            <input type="submit" value="Cerca" class="hidden">
        </form>
        <div id="infoPage"><p>Cerca utenti e comincia a seguirli!<p></div>
        <div id="getUsers" class="hidden"></div>
    </div>
@endsection

@section('comments')
@endsection