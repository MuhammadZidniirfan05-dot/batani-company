<?php

namespace Tests\Support;

use RuntimeException;
use Tests\TestCase;

abstract class SqliteMemoryTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (app()->environment() !== 'testing'
            || app()->configurationIsCached()
            || config('database.default') !== 'sqlite'
            || config('database.connections.sqlite.driver') !== 'sqlite'
            || config('database.connections.sqlite.database') !== ':memory:'
            || ! empty(config('database.connections.sqlite.url'))) {
            throw new RuntimeException('SQLite tests require an isolated in-memory database.');
        }
    }
}
