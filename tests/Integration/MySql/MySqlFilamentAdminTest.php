<?php

namespace Tests\Integration\MySql;

use App\Models\User;
use Filament\Auth\Pages\Login;
use Illuminate\Support\Facades\Auth;
use Livewire\Livewire;

class MySqlFilamentAdminTest extends MySqlTestCase
{
    public function test_mysql_admin_flag_and_panel_authorization(): void
    {
        $nonAdmin = User::factory()->create();
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();

        try {
            $this->assertFalse($nonAdmin->fresh()->is_admin);
            $this->assertTrue($admin->fresh()->is_admin);
            $this->actingAs($nonAdmin)->get('/admin')->assertForbidden();

            Auth::logout();
            Livewire::test(Login::class)
                ->fillForm(['email' => $admin->email, 'password' => 'password'])
                ->call('authenticate')
                ->assertHasNoErrors();

            $this->assertAuthenticatedAs($admin);
            $this->get('/admin')->assertOk();
        } finally {
            Auth::logout();
            $admin->delete();
            $nonAdmin->delete();
        }
    }
}
