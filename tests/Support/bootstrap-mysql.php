<?php

require __DIR__.'/../../vendor/autoload.php';

// PHPUnit's XML env override does not replace variables already in the process environment.
foreach ([
    'APP_ENV' => 'testing',
    'DB_CONNECTION' => 'mysql',
    'DB_HOST' => 'mysql',
    'DB_PORT' => '3306',
    'DB_SOCKET' => '',
    'DB_DATABASE' => 'batani_company_ci_test',
    'DB_USERNAME' => 'batani_ci_test',
    'DB_PASSWORD' => 'CI_APP_TEMPORARY_10',
    'DB_URL' => '',
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'array',
    'QUEUE_CONNECTION' => 'sync',
    'MAIL_MAILER' => 'array',
] as $name => $value) {
    putenv("{$name}={$value}");
    $_ENV[$name] = $value;
    $_SERVER[$name] = $value;
}
