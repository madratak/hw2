@extends('layouts.login_signup')

@section('head')
@parent
    <title>Accedi</title>
@endsection

@section('error')
    @if($error)
        <section>
            <p class='errore'>
                <strong>
                L'username o la password inserite non sono corrette.<br>
                Riprova!
                </strong>
            </p>
        </section>
    @endif
@endsection

@section('h2')
    <h2>Accedi</h2>
@endsection

@section('form')
    <p>
        <label><input type="text" name="username" placeholder="Username" value='{{ old("username") }}' required></label>
    </p>
    <p>
        <label><input type="password" name="password" placeholder="Password" required></label>
    </p>
    <p id="connected">
        <input type='checkbox' name='check' value="1"><span>Ricorda l'accesso</span>
    </p>
@endsection

@section('Question')
    <p>Non hai un account? <a href="{{ url('signup') }}">Iscriviti</a></p>
@endsection