<?php

namespace Tests\Support;

use Illuminate\Support\Facades\Artisan;

final class MySqlIntegrationSetup
{
    public static function prepare(?callable $migrate = null): void
    {
        $connection = config('database.connections.mysql');

        MySqlTargetGuard::run([
            'default' => config('database.default'),
            'driver' => $connection['driver'],
            'host' => $connection['host'],
            'port' => $connection['port'],
            'unix_socket' => $connection['unix_socket'],
            'database' => $connection['database'],
            'username' => $connection['username'],
            'url' => $connection['url'],
        ], app()->environment(), app()->configurationIsCached(), getenv('MYSQL_INTEGRATION_TEST'),
            $migrate ?? static fn () => Artisan::call('migrate', ['--force' => true]));
    }
}
