<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\Support\MySqlTargetGuard;
use Tests\TestCase;

class MySqlTargetGuardTest extends TestCase
{
    private const SAFE_TARGET = [
        'default' => 'mysql',
        'driver' => 'mysql',
        'host' => 'mysql',
        'database' => 'batani_company_ci_test',
        'username' => 'batani_ci_test',
        'url' => null,
    ];

    public function test_safe_target_runs_operation(): void
    {
        $result = MySqlTargetGuard::run(self::SAFE_TARGET, 'testing', false, '1', fn () => 'ran');

        $this->assertSame('ran', $result);
    }

    #[DataProvider('unsafeTargets')]
    public function test_unsafe_target_never_runs_database_operation(
        array $target,
        string $environment,
        bool $cached,
        string|false $optIn,
    ): void {
        $called = false;

        try {
            MySqlTargetGuard::run($target, $environment, $cached, $optIn, function () use (&$called): void {
                $called = true;
            });
            $this->fail('Unsafe target should have been rejected.');
        } catch (RuntimeException $exception) {
            $this->assertSame('MySQL integration target is not the isolated CI test database.', $exception->getMessage());
        }

        $this->assertFalse($called);
    }

    public static function unsafeTargets(): array
    {
        return [
            'missing opt-in' => [self::SAFE_TARGET, 'testing', false, false],
            'wrong environment' => [self::SAFE_TARGET, 'local', false, '1'],
            'cached configuration' => [self::SAFE_TARGET, 'testing', true, '1'],
            'wrong driver' => [[...self::SAFE_TARGET, 'driver' => 'sqlite'], 'testing', false, '1'],
            'wrong default' => [[...self::SAFE_TARGET, 'default' => 'sqlite'], 'testing', false, '1'],
            'wrong host' => [[...self::SAFE_TARGET, 'host' => '127.0.0.1'], 'testing', false, '1'],
            'wrong database' => [[...self::SAFE_TARGET, 'database' => 'company'], 'testing', false, '1'],
            'root user' => [[...self::SAFE_TARGET, 'username' => 'root'], 'testing', false, '1'],
            'URL override' => [[...self::SAFE_TARGET, 'url' => 'mysql://example.invalid/test'], 'testing', false, '1'],
        ];
    }
}
