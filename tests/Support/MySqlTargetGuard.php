<?php

namespace Tests\Support;

use RuntimeException;

final class MySqlTargetGuard
{
    public static function run(
        array $target,
        string $environment,
        bool $configurationCached,
        string|false $optIn,
        callable $operation,
    ): mixed {
        if ($optIn !== '1'
            || $environment !== 'testing'
            || $configurationCached
            || $target['default'] !== 'mysql'
            || $target['driver'] !== 'mysql'
            || $target['host'] !== 'mysql'
            || (string) $target['port'] !== '3306'
            || $target['unix_socket'] !== ''
            || $target['database'] !== 'batani_company_ci_test'
            || $target['username'] !== 'batani_ci_test'
            || ! empty($target['url'])) {
            throw new RuntimeException('MySQL integration target is not the isolated CI test database.');
        }

        return $operation();
    }
}
