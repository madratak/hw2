@extends('layouts.login_signup')

@section('head')
@parent
    <title>Registrati</title>
    <script src="{{ url('js/signup.js') }}" defer="true"></script>
@endsection

@section('h2')
    <h2>Registrati</h2>
@endsection

@section('form')
    <p class="username">
        <label><input type="text" name="username" placeholder="Username" value='{{ old("username") }}' required></label>
        <span class="errore hidden">Username non disponibile!</span>
    </p>
    <p class="mail">
        <label><input type="text" name="mail" placeholder="Mail" value='{{ old("mail") }}'></label>
        <span class="errore hidden">Indirizzo email non valido!</span>
    </p>
    <p class="password">
        <label><input type="password" name="password" placeholder="Password" value='{{ old("password") }}'></label>
        <span class="errore hidden">Inserisci almeno 8 caratteri</span>
    </p>
    <p class="c_password">
        <label><input type="password" name="c_password" placeholder="Conferma Password" value='{{ old("c_password") }}'></label>
        <br>
        <span class="errore hidden">Le password non coincidono</span>
    </p>
@endsection

@section('Question')
    <p>Hai già un account? <a href="{{ url('login') }}">Accedi</a></p>
@endsection