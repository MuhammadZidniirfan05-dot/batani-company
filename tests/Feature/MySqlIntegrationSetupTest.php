<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\Support\MySqlIntegrationSetup;
use Tests\TestCase;

class MySqlIntegrationSetupTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('database.default', 'mysql');
        config()->set('database.connections.mysql', [
            ...config('database.connections.mysql'),
            'driver' => 'mysql',
            'host' => 'mysql',
            'port' => '3306',
            'unix_socket' => '',
            'database' => 'batani_company_ci_test',
            'username' => 'batani_ci_test',
            'url' => null,
        ]);
        app()->instance('config_loaded_from_cache', false);
        putenv('MYSQL_INTEGRATION_TEST=1');
    }

    protected function tearDown(): void
    {
        putenv('MYSQL_INTEGRATION_TEST');
        parent::tearDown();
    }

    public function test_setup_calls_migration_only_after_safe_target_passes(): void
    {
        DB::shouldReceive('connection')->never();
        Artisan::shouldReceive('call')->once()->with('migrate', ['--force' => true])->andReturn(0);

        MySqlIntegrationSetup::prepare();
    }

    #[DataProvider('unsafeSetups')]
    public function test_setup_rejects_unsafe_config_before_migration_or_connection(
        string $case,
        mixed $value,
    ): void {
        match ($case) {
            'opt-in' => putenv('MYSQL_INTEGRATION_TEST'),
            'environment' => app()->instance('env', $value),
            'cache' => app()->instance('config_loaded_from_cache', true),
            'default' => config()->set('database.default', $value),
            default => config()->set("database.connections.mysql.{$case}", $value),
        };

        DB::shouldReceive('connection')->never();
        Artisan::shouldReceive('call')->never();

        try {
            MySqlIntegrationSetup::prepare();
            $this->fail('Unsafe setup must fail before migration.');
        } catch (RuntimeException $exception) {
            $this->assertSame('MySQL integration target is not the isolated CI test database.', $exception->getMessage());
        }
    }

    public static function unsafeSetups(): array
    {
        return [
            'missing opt-in' => ['opt-in', null],
            'wrong environment' => ['environment', 'local'],
            'cached configuration' => ['cache', true],
            'wrong default' => ['default', 'sqlite'],
            'wrong driver' => ['driver', 'sqlite'],
            'wrong host' => ['host', '127.0.0.1'],
            'wrong port' => ['port', '3307'],
            'wrong schema' => ['database', 'company'],
            'root user' => ['username', 'root'],
            'URL override' => ['url', 'mysql://example.invalid/test'],
            'socket override' => ['unix_socket', '/tmp/other.sock'],
            'null socket' => ['unix_socket', null],
        ];
    }
}
