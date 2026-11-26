<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Support\SqliteMemoryTestCase;

class FilamentAdminSchemaTest extends SqliteMemoryTestCase
{
    public function test_additive_migration_defaults_to_denied_and_rolls_back_only_flag(): void
    {
        Artisan::call('migrate', [
            '--path' => 'database/migrations/0001_01_01_000000_create_users_table.php',
            '--force' => true,
        ]);

        $userId = DB::table('users')->insertGetId([
            'name' => 'Existing fixture',
            'email' => 'existing-fixture@example.test',
            'password' => 'synthetic-fixture',
        ]);

        Artisan::call('migrate', ['--force' => true]);

        $this->assertTrue(Schema::hasColumn('users', 'is_admin'));
        $this->assertFalse(User::findOrFail($userId)->is_admin);

        $newUser = User::factory()->create();
        $this->assertFalse($newUser->fresh()->is_admin);
        $newUser->fill(['is_admin' => true])->save();
        $this->assertFalse($newUser->fresh()->is_admin);

        Artisan::call('migrate', ['--force' => true]);
        $this->assertFalse(User::findOrFail($userId)->is_admin);

        Artisan::call('migrate:rollback', ['--step' => 1, '--force' => true]);
        $this->assertFalse(Schema::hasColumn('users', 'is_admin'));
        $this->assertTrue(Schema::hasTable('users'));
        $this->assertSame(2, DB::table('users')->count());
    }
}
