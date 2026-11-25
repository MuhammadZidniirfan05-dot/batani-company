<?php

namespace Tests\Integration\MySql;

use Tests\Support\MySqlIntegrationSetup;
use Tests\TestCase;

abstract class MySqlTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        MySqlIntegrationSetup::prepare();
    }
}
