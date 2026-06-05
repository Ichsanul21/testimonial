<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Event $event;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::setValue('auto_approve', 'true');
        Setting::setValue('display_theme', 'wedding');

        $this->event = Event::create([
            'name' => 'Test Event',
            'slug' => 'test-event',
            'description' => 'Test Description',
            'date' => '2026-06-05',
            'location' => 'Test Location',
            'icon' => '🎉',
            'color' => '#D4AF37',
            'qr_hash' => 'test_hash_123',
            'is_active' => true,
        ]);

        $this->admin = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
        ]);

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);
        $this->token = $response->json('token');
    }

    public function test_public_can_list_events(): void
    {
        $response = $this->getJson('/api/events');
        $response->assertOk()
            ->assertJsonStructure(['data']);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_public_can_view_event_by_slug(): void
    {
        $response = $this->getJson('/api/events/test-event');
        $response->assertOk()
            ->assertJson(['name' => 'Test Event']);
    }

    public function test_public_can_submit_testimonial(): void
    {
        Storage::fake('public');

        $data = [
            'event_id' => $this->event->id,
            'name' => 'John Doe',
            'phone_email' => 'john@example.com',
            'relationship' => 'Teman',
            'testimonial' => 'Great event!',
        ];

        $response = $this->postJson('/api/testimonials', $data);
        $response->assertCreated()
            ->assertJson(['name' => 'John Doe']);
    }

    public function test_public_can_submit_testimonial_without_photo(): void
    {
        $data = [
            'event_id' => $this->event->id,
            'name' => 'John Doe',
            'phone_email' => 'john@example.com',
            'relationship' => 'Teman',
            'testimonial' => 'Great event!',
        ];

        $response = $this->postJson('/api/testimonials', $data);
        $response->assertCreated();
    }

    public function test_public_can_submit_testimonial_with_photo(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('photo.jpg', 300, 300);

        $response = $this->postJson('/api/testimonials', [
            'event_id' => $this->event->id,
            'name' => 'Jane Doe',
            'phone_email' => 'jane@example.com',
            'relationship' => 'Keluarga',
            'testimonial' => 'Amazing!',
            'photo' => $file,
        ]);

        $response->assertCreated();
        $this->assertNotNull($response->json('photo_url'));
    }

    public function test_submit_rejects_banned_words(): void
    {
        $this->event->update(['banned_words' => 'jelek,buruk']);

        $response = $this->postJson('/api/testimonials', [
            'event_id' => $this->event->id,
            'name' => 'Test',
            'relationship' => 'Teman',
            'testimonial' => 'Acaranya jelek sekali',
        ]);

        $response->assertStatus(422);
    }

    public function test_public_can_list_testimonials(): void
    {
        Testimonial::create([
            'event_id' => $this->event->id,
            'name' => 'Test',
            'relationship' => 'Teman',
            'testimonial' => 'Nice!',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/testimonials');
        $response->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_login(): void
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_admin_can_get_me(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/admin/me');

        $response->assertOk()
            ->assertJson(['user' => ['email' => 'admin@test.com']]);
    }

    public function test_admin_can_get_stats(): void
    {
        Testimonial::create([
            'event_id' => $this->event->id,
            'name' => 'Test',
            'relationship' => 'Teman',
            'testimonial' => 'Nice!',
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/admin/stats');

        $response->assertOk()
            ->assertJsonStructure(['total', 'active', 'takedown']);
        $this->assertEquals(1, $response->json('total'));
    }

    public function test_admin_can_takedown_testimonial(): void
    {
        $testimonial = Testimonial::create([
            'event_id' => $this->event->id,
            'name' => 'Test',
            'relationship' => 'Teman',
            'testimonial' => 'Nice!',
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/admin/testimonials/{$testimonial->id}");

        $response->assertOk();
        $this->assertFalse($testimonial->fresh()->is_active);
    }

    public function test_admin_can_restore_testimonial(): void
    {
        $testimonial = Testimonial::create([
            'event_id' => $this->event->id,
            'name' => 'Test',
            'relationship' => 'Teman',
            'testimonial' => 'Nice!',
            'is_active' => false,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson("/api/admin/testimonials/{$testimonial->id}/restore");

        $response->assertOk();
        $this->assertTrue($testimonial->fresh()->is_active);
    }

    public function test_admin_can_batch_takedown(): void
    {
        $t1 = Testimonial::create(['event_id' => $this->event->id, 'name' => 'A', 'relationship' => 'Teman', 'testimonial' => 'A', 'is_active' => true]);
        $t2 = Testimonial::create(['event_id' => $this->event->id, 'name' => 'B', 'relationship' => 'Teman', 'testimonial' => 'B', 'is_active' => true]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/admin/testimonials/batch', [
                'action' => 'takedown',
                'ids' => [$t1->id, $t2->id],
            ]);

        $response->assertOk();
        $this->assertEquals(2, $response->json('count'));
        $this->assertFalse($t1->fresh()->is_active);
        $this->assertFalse($t2->fresh()->is_active);
    }

    public function test_admin_can_batch_restore(): void
    {
        $t1 = Testimonial::create(['event_id' => $this->event->id, 'name' => 'A', 'relationship' => 'Teman', 'testimonial' => 'A', 'is_active' => false]);
        $t2 = Testimonial::create(['event_id' => $this->event->id, 'name' => 'B', 'relationship' => 'Teman', 'testimonial' => 'B', 'is_active' => false]);

        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/admin/testimonials/batch', [
                'action' => 'restore',
                'ids' => [$t1->id, $t2->id],
            ]);

        $response->assertOk();
        $this->assertEquals(2, $response->json('count'));
        $this->assertTrue($t1->fresh()->is_active);
    }

    public function test_admin_can_manage_settings(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/admin/settings', [
                'key' => 'auto_approve',
                'value' => 'false',
            ]);

        $response->assertOk();
        $this->assertEquals('false', Setting::getValue('auto_approve'));
    }

    public function test_forgot_password_returns_token(): void
    {
        $response = $this->postJson('/api/admin/forgot-password', [
            'email' => 'admin@test.com',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'email']);
    }

    public function test_reset_password_with_valid_token(): void
    {
        $fpResponse = $this->postJson('/api/admin/forgot-password', [
            'email' => 'admin@test.com',
        ]);
        $token = $fpResponse->json('token');

        $response = $this->postJson('/api/admin/reset-password', [
            'email' => 'admin@test.com',
            'token' => $token,
            'password' => 'newpassword123',
        ]);

        $response->assertOk();

        $loginResponse = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.com',
            'password' => 'newpassword123',
        ]);
        $loginResponse->assertOk();
    }

    public function test_photo_deleted_on_takedown(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('photo.jpg');
        $path = $file->store('photos', 'public');

        $testimonial = Testimonial::create([
            'event_id' => $this->event->id,
            'name' => 'Test',
            'relationship' => 'Teman',
            'testimonial' => 'Nice!',
            'photo' => $path,
            'is_active' => true,
        ]);

        Storage::disk('public')->assertExists($path);

        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/admin/testimonials/{$testimonial->id}");

        Storage::disk('public')->assertMissing($path);
        $this->assertNull($testimonial->fresh()->photo);
    }
}
