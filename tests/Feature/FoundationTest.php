<?php

namespace Tests\Feature;

use Tests\TestCase;

class FoundationTest extends TestCase
{
    public function test_home_renders_the_indonesian_blade_page_without_a_database(): void
    {
        $this->withoutVite();

        $this->get(route('home'))
            ->assertOk()
            ->assertViewIs('home')
            ->assertSee('lang="id"', false)
            ->assertSeeText('Website profil perusahaan sedang disiapkan.');
    }

    public function test_configured_company_name_is_escaped_in_the_page(): void
    {
        $this->withoutVite();
        config(['app.name' => '<script>alert("name")</script>']);

        $this->get(route('home'))
            ->assertOk()
            ->assertSee(e(config('app.name')), false)
            ->assertDontSee(config('app.name'), false);
    }

    public function test_health_endpoint_does_not_require_database_connectivity(): void
    {
        config(['database.default' => 'mysql', 'database.connections.mysql.port' => 1]);

        $this->get('/up')->assertOk();
    }

    public function test_unknown_routes_return_not_found(): void
    {
        $this->get('/halaman-tidak-ada')->assertNotFound();
    }
}
