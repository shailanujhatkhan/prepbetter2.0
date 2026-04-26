<?php

namespace Database\Seeders;

use App\Models\Tutor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TutorSeeder extends Seeder
{
    private array $tutorData = [
        [
            'name'           => 'Tamim',
            'email'          => 'tutor@ielts.test',
            'specialization' => 'speaking',
            'availability'   => ['Sunday' => ['09:00', '14:00'], 'Monday' => ['11:00'], 'Wednesday' => ['17:00']],
            'experience'     => 5,
            'rating'         => 4.9,
        ],
        [
            'name'           => 'Lily',
            'email'          => 'lily@ielts.test',
            'specialization' => 'speaking',
            'availability'   => ['Sunday' => ['11:00', '15:00'], 'Monday' => ['13:00'], 'Wednesday' => ['16:00']],
            'experience'     => 4,
            'rating'         => 4.2,
        ],
        [
            'name'           => 'Dan',
            'email'          => 'dan@ielts.test',
            'specialization' => 'writing',
            'availability'   => ['Sunday' => ['10:00', '14:00'], 'Tuesday' => ['11:00'], 'Wednesday' => ['12:00']],
            'experience'     => 4,
            'rating'         => 4.8,
        ],
        [
            'name'           => 'Ben',
            'email'          => 'ben@ielts.test',
            'specialization' => 'listening',
            'availability'   => ['Sunday' => ['11:00', '18:00'], 'Monday' => ['09:00'], 'Thursday' => ['18:00']],
            'experience'     => 4,
            'rating'         => 4.6,
        ],
    ];

    public function run(): void
    {
        foreach ($this->tutorData as $data) {
            // Ensure a User with role=tutor exists for this email
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('password'),
                    'role'     => 'tutor',
                ]
            );

            if ($user->role !== 'tutor') {
                $user->update(['role' => 'tutor']);
            }

            // Create or update the tutor record linked to this user
            Tutor::updateOrCreate(
                ['email' => $data['email']],
                [
                    'user_id'        => $user->id,
                    'name'           => $data['name'],
                    'specialization' => $data['specialization'],
                    'availability'   => $data['availability'],
                    'experience'     => $data['experience'],
                    'rating'         => $data['rating'],
                ]
            );
        }
    }
}