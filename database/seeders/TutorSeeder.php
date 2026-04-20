<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class TutorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tutors')->insert([
            [
                'name' => 'Tamim',
                'email' => 'tamim@gmail.com',
                'specialization' => 'writing',
                'availability' => '{ "Sunday": ["10:00 AM", "2:00 PM"], "Monday": ["11:00 AM"], "Wednesday": ["3:00 PM"] }',
                'experience' => 5,
                'rating' => 4.9,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Lily',
                'email' => 'lily@gmail.com',
                'specialization' => 'writing',
                'availability' => '{ "Sunday": ["11:00 AM", "3:00 PM"], "Monday": ["11:00 AM"], "Wednesday": ["3:00 PM"] }',
                'experience' => 4,
                'rating' => 4.2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Dan',
                'email' => 'dan@gmail.com',
                'specialization' => 'speaking',
                'availability' => '{ "Sunday": ["10:00 AM", "2:00 PM"], "Tuesday": ["11:00 AM"], "Wednesday": ["3:00 PM"] }',
                'experience' => 4,
                'rating' => 4.8,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Ben',
                'email' => 'ben@gmail.com',
                'specialization' => 'speaking',
                'availability' => '{ "Sunday": ["10:00 AM", "2:00 PM"], "Monday": ["11:00 AM"], "Thursday": ["3:00 PM"] }',
                'experience' => 4,
                'rating' => 4.6,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}