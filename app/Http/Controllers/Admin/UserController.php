<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'       => ['required', 'string', 'min:8'],
            'role'           => ['required', 'string', Rule::in(['student', 'tutor', 'admin'])],
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

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        $tutor = $user->tutor?->only(['specialization', 'band', 'experience', 'rating']);

        return Inertia::render('admin/users/edit', [
            'editUser' => [
                ...$user->only('id', 'name', 'email', 'role'),
                'tutor' => $tutor,
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password'       => ['nullable', 'string', 'min:8'],
            'role'           => ['required', 'string', Rule::in(['student', 'tutor', 'admin'])],
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

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted.');
    }
}