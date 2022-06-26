@extends('layouts.page')

@section('head')
    @parent
    <link rel="stylesheet" href="{{ url('css/home&profile.css') }}" />
    <script src="{{ url('js/home&profile.js') }}" defer="true"></script>
    <script src="{{ url('js/home.js') }}" defer="true"></script>
    <title>Blog - Home</title>
@endsection

@section('contents')
    <div id="contents"></div>
@endsection
