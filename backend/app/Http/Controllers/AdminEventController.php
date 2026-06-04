<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminEventController extends Controller
{
    public function index()
    {
        $events = Event::withCount('testimonials')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $events]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7|regex:/^#[a-fA-F0-9]{6}$/',
        ]);

        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;
        while (Event::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $event = Event::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'date' => $validated['date'] ?? null,
            'location' => $validated['location'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'color' => $validated['color'] ?? null,
            'qr_hash' => Str::random(32),
            'is_active' => true,
        ]);

        return response()->json($event, 201);
    }

    public function show(int $id)
    {
        $event = Event::withCount('testimonials')
            ->with('admins:id,name,email')
            ->findOrFail($id);

        return response()->json($event);
    }

    public function update(Request $request, int $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:7|regex:/^#[a-fA-F0-9]{6}$/',
            'is_active' => 'sometimes|boolean',
            'banned_words' => 'nullable|string|max:1000',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(int $id)
    {
        $event = Event::findOrFail($id);

        $testimonialCount = $event->testimonials()->count();
        if ($testimonialCount > 0) {
            return response()->json([
                'message' => "Event memiliki {$testimonialCount} testimonial. Hapus testimonial terlebih dahulu atau nonaktifkan event saja."
            ], 422);
        }

        $event->delete();

        return response()->json(['message' => 'Event berhasil dihapus']);
    }

    public function regenerateQR(int $id)
    {
        $event = Event::findOrFail($id);
        $event->update(['qr_hash' => Str::random(32)]);

        return response()->json([
            'message' => 'QR code berhasil diregenerasi',
            'qr_hash' => $event->fresh()->qr_hash,
            'qr_content_url' => $event->fresh()->qr_content_url,
        ]);
    }

    public function admins(int $id)
    {
        $event = Event::with('admins:id,name,email,role')->findOrFail($id);

        return response()->json(['data' => $event->admins]);
    }

    public function assignAdmin(Request $request, int $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id', Rule::unique('event_user')->where(function ($q) use ($id) {
                return $q->where('event_id', $id);
            })],
        ]);

        $event->admins()->attach($validated['user_id']);

        return response()->json(['message' => 'Admin berhasil ditambahkan ke event']);
    }

    public function createAdminUser(Request $request, int $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'event_admin',
        ]);

        $event->admins()->attach($user->id);

        return response()->json([
            'message' => 'Admin berhasil dibuat dan ditambahkan ke acara',
            'user' => $user,
        ], 201);
    }

    public function removeAdmin(int $id, int $userId)
    {
        $event = Event::findOrFail($id);

        $event->admins()->detach($userId);

        return response()->json(['message' => 'Admin berhasil dihapus dari event']);
    }

    public function users()
    {
        $users = User::select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $users]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|max:255',
            'role' => 'required|string|in:super_admin,event_admin',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json($user, 201);
    }

    public function updateUser(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'sometimes|required|string|in:super_admin,event_admin',
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function deleteUser(int $id)
    {
        $user = User::findOrFail($id);

        if ($user->events()->exists()) {
            $user->events()->detach();
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }

    public function resetPassword(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => 'required|string|min:6|max:255',
        ]);

        $user->update(['password' => bcrypt($validated['password'])]);

        return response()->json(['message' => 'Password berhasil direset']);
    }
}
