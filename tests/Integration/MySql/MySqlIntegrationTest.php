<?php

namespace Tests\Integration\MySql;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MySqlIntegrationTest extends MySqlTestCase
{
    public function test_mysql_version_schema_and_migration_are_real(): void
    {
        $connection = DB::connection();
        $server = $connection->selectOne('SELECT VERSION() AS version, DATABASE() AS schema_name');

        $this->assertSame('mysql', $connection->getDriverName());
        $this->assertMatchesRegularExpression('/^8\.4\.[0-9]+/', $server->version);
        $this->assertStringNotContainsString('MariaDB', $server->version);
        $this->assertSame('batani_company_ci_test', $server->schema_name);
        $this->assertTrue($connection->getSchemaBuilder()->hasTable('users'));
        $this->assertSame(0, Artisan::call('migrate', ['--force' => true]));
        $this->assertStringContainsString('Nothing to migrate', Artisan::output());
    }

    public function test_user_persistence_unicode_and_unique_constraint(): void
    {
        $email = 'integration-user-10@example.test';
        $name = 'Uji 🌾';

        try {
            $user = User::create(['name' => $name, 'email' => $email, 'password' => 'fixture-not-an-account']);
            $this->assertSame($name, User::findOrFail($user->id)->name);

            $user->update(['name' => 'Diperbarui 🌱']);
            $this->assertSame('Diperbarui 🌱', User::findOrFail($user->id)->name);

            try {
                User::create(['name' => 'Duplikat', 'email' => $email, 'password' => 'fixture-not-an-account']);
                $this->fail('Database unique constraint must reject duplicate email.');
            } catch (QueryException $exception) {
                $this->assertSame('23000', $exception->errorInfo[0]);
            }

            $user->delete();
            $this->assertNull(User::find($user->id));
        } finally {
            User::where('email', $email)->delete();
        }
    }

    public function test_exception_rolls_back_transaction(): void
    {
        $email = 'integration-rollback-10@example.test';

        try {
            DB::transaction(function () use ($email): void {
                User::create(['name' => 'Rollback', 'email' => $email, 'password' => 'fixture-not-an-account']);

                throw new RuntimeException('Intentional rollback fixture.');
            });
            $this->fail('The transaction should throw.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Intentional rollback fixture.', $exception->getMessage());
        }

        $this->assertFalse(User::where('email', $email)->exists());
    }
}
