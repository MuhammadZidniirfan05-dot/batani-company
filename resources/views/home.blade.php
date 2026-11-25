<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow">
        <title>{{ config('app.name') }}</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-slate-50 font-sans text-slate-900">
        <main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
            <h1 class="text-3xl font-semibold tracking-tight">{{ config('app.name') }}</h1>
            <p class="mt-4 text-lg text-slate-600">Website profil perusahaan sedang disiapkan.</p>
        </main>
    </body>
</html>
