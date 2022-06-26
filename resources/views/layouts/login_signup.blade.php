<html>
    <head>
        
        @section('head')
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="{{ url('css/login&signup.css') }}" />
        <link rel="icon" type="image/png" href="{{ url('img/favicon.png') }}">
        <link href="http://fonts.cdnfonts.com/css/gotham" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
            const BASE_URL = "{{ url('/') }}/";
        </script>
        @show

    </head>
    <body>
        @yield('error')
        <section>
            <img src="{{ url('img/blog.png') }}">
            @yield('h2')
            <form name="form_blog" method='post'>
                @csrf
                @yield('form')
                <p>
                    <label id="submit"><input type="submit"><label>
                </p>
            </form>
        </section>
        <section>
            @yield('Question')
        </section>
    </body>
</html>