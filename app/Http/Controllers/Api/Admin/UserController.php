<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->search, fn ($q, $s) => $q->where(
                fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")
            ))
            ->when($request->role, fn ($q, $r) => $q->where('role', $r))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'unique:users'],
            'password'       => ['required', 'string', 'min:8'],
            'role'           => ['required', 'in:student,tutor,admin'],
            'specialization' => ['nullable', 'string', Rule::in(['speaking', 'writing', 'listening', 'reading'])],
            'band'           => ['nullable', 'numeric', 'min:0', 'max:9'],
            'experience'     => ['nullable', 'integer', 'min:0'],
            'rating'         => ['nullable', 'numeric', 'min:0', 'max:5'],
        ]);

        $tutorFields = [
            'specialization' => $validated['specialization'] ?? null,
            'band'           => $validated['band'] ?? null,
            'experience'     => $validated['experience'] ?? null,
            'rating'         => $validated['rating'] ?? null,
        ];

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        if ($user->role === 'tutor') {
            $tutor = Tutor::firstOrCreate(
                ['email' => $user->email],
                ['name' => $user->name, 'user_id' => $user->id, ...$tutorFields]
            );
            if (!$tutor->user_id) {
                $tutor->update(['user_id' => $user->id, ...$tutorFields]);
            }
        }

        return response()->json(['data' => $user, 'message' => 'User created.'], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => $user->only(['id', 'name', 'email', 'role', 'created_at'])]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password'       => ['nullable', 'string', 'min:8'],
            'role'           => ['required', 'in:student,tutor,admin'],
            'specialization' => ['nullable', 'string', Rule::in(['speaking', 'writing', 'listening', 'reading'])],
            'band'           => ['nullable', 'numeric', 'min:0', 'max:9'],
            'experience'     => ['nullable', 'integer', 'min:0'],
            'rating'         => ['nullable', 'numeric', 'min:0', 'max:5'],
        ]);

        $tutorFields = [
            'specialization' => $validated['specialization'] ?? null,
            'band'           => $validated['band'] ?? null,
            'experience'     => $validated['experience'] ?? null,
            'rating'         => $validated['rating'] ?? null,
        ];

        $userUpdate = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'role'  => $validated['role'],
        ];
        if (!empty($validated['password'])) {
            $userUpdate['password'] = Hash::make($validated['password']);
        }

        $user->update($userUpdate);

        if ($user->role === 'tutor') {
            $tutor = Tutor::firstOrCreate(
                ['email' => $user->email],
                ['name' => $user->name, 'user_id' => $user->id, ...$tutorFields]
            );
            if (!$tutor->user_id) {
                $tutor->update(['user_id' => $user->id, ...$tutorFields]);
            } else {
                $tutor->update($tutorFields);
            }
        }

        return response()->json(['data' => $user->fresh()->load('tutor'), 'message' => 'User updated.']);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }
}
