<?php

namespace Tests\Feature;

use App\Models\User;
use Filament\Auth\Pages\Login;
use Filament\Facades\Filament;
use Filament\Notifications\Notification;
use Filament\Panel;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Livewire\Livewire;
use Tests\Support\SqliteMemoryTestCase;

class FilamentAdminTest extends SqliteMemoryTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('migrate', ['--force' => true]);
    }

    public function test_panel_routes_and_public_foundation(): void
    {
        $this->assertCount(1, Filament::getPanels());
        $this->assertSame('admin', Filament::getPanel('admin')->getId());
        $this->get('/admin/login')->assertOk();
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->withoutVite();
        $this->get('/')->assertOk();
        $this->get('/up')->assertOk();
        $this->get('/admin/register')->assertNotFound();
    }

    public function test_non_admin_is_denied_in_testing_and_local(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/admin')->assertForbidden();

        app()->instance('env', 'local');
        $this->get('/admin')->assertForbidden();
    }

    public function test_admin_flag_does_not_authorize_another_panel(): void
    {
        $this->assertFalse($this->adminUser()->canAccessPanel(Panel::make()->id('other')));
    }

    public function test_admin_access_is_revoked_on_next_request(): void
    {
        $user = $this->adminUser();

        Auth::login($user);
        $this->get('/admin')->assertOk();

        DB::table('users')->where('id', $user->id)->update(['is_admin' => false]);
        Auth::forgetGuards();
        $this->get('/admin')->assertForbidden();
    }

    public function test_login_component_accepts_only_admin_with_correct_password(): void
    {
        $admin = $this->adminUser();

        Livewire::test(Login::class)
            ->fillForm(['email' => $admin->email, 'password' => 'password'])
            ->call('authenticate')
            ->assertHasNoErrors();

        $this->assertAuthenticatedAs($admin);
        $this->get('/admin')->assertOk();

        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_wrong_password_and_non_admin_login_do_not_create_admin_session(): void
    {
        $admin = $this->adminUser();
        $nonAdmin = User::factory()->create();

        foreach ([
            [$admin->email, 'incorrect'],
            [$nonAdmin->email, 'password'],
        ] as [$email, $password]) {
            Livewire::test(Login::class)
                ->fillForm(['email' => $email, 'password' => $password])
                ->call('authenticate')
                ->assertHasErrors();

            $this->assertGuest();
            $this->get('/admin')->assertRedirect('/admin/login');
        }
    }

    public function test_sixth_failed_login_is_rate_limited(): void
    {
        $admin = $this->adminUser();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            Livewire::test(Login::class)
                ->fillForm(['email' => $admin->email, 'password' => 'incorrect'])
                ->call('authenticate')
                ->assertHasErrors();
        }

        Livewire::test(Login::class)
            ->fillForm(['email' => $admin->email, 'password' => 'incorrect'])
            ->call('authenticate')
            ->assertHasNoErrors();

        Notification::assertNotified(__('filament-panels::auth/pages/login.notifications.throttled.title', [
            'seconds' => 60,
            'minutes' => 1,
        ]));
        $this->assertGuest();
    }

    public function test_logout_without_csrf_token_is_rejected_when_middleware_is_active(): void
    {
        $admin = $this->adminUser();
        Auth::login($admin);

        app()->bind(PreventRequestForgery::class, fn ($app) => new class($app, $app['encrypter']) extends PreventRequestForgery
        {
            protected function runningUnitTests()
            {
                return false;
            }
        });

        $this->post('/admin/logout')->assertStatus(419);
        $this->assertAuthenticatedAs($admin);
    }

    private function adminUser(): User
    {
        $user = User::factory()->create();
        $user->forceFill(['is_admin' => true])->save();

        return $user;
    }
}
