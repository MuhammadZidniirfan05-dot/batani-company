<?php

namespace Tests\Integration\MySql;

use Illuminate\Support\Facades\Artisan;
use Tests\Support\MySqlTargetGuard;
use Tests\TestCase;

abstract class MySqlTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        MySqlTargetGuard::run([
            'default' => config('database.default'),
            'driver' => config('database.connections.mysql.driver'),
            'host' => config('database.connections.mysql.host'),
            'database' => config('database.connections.mysql.database'),
            'username' => config('database.connections.mysql.username'),
            'url' => config('database.connections.mysql.url'),
        ], app()->environment(), app()->configurationIsCached(), getenv('MYSQL_INTEGRATION_TEST'), function (): void {
            Artisan::call('migrate', ['--force' => true]);
        });
    }
}
