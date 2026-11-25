<?php

namespace Tests\Integration\MySql;

use Tests\TestCase;

class MySqlSuiteEnvironmentTest extends TestCase
{
    public function test_suite_uses_isolated_connection_settings_without_database_access(): void
    {
        $connection = config('database.connections.mysql');

        $this->assertSame('testing', app()->environment());
        $this->assertSame('mysql', config('database.default'));
        $this->assertSame('mysql', $connection['host']);
        $this->assertSame('3306', (string) $connection['port']);
        $this->assertSame('', $connection['unix_socket']);
        $this->assertSame('batani_company_ci_test', $connection['database']);
        $this->assertSame('batani_ci_test', $connection['username']);
        $this->assertEmpty($connection['url']);
    }
}
