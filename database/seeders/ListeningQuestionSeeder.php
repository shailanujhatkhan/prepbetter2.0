<?php

namespace Database\Seeders;

use App\Models\ListeningQuestion;
use Illuminate\Database\Seeder;

class ListeningQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'youtube_video_id' => 'qI2LxF5sR2c',
                'title' => 'IELTS Listening — Test 1',
                'text' => 'What is the main topic discussed in this listening passage?',
                'options' => [
                    'A university accommodation application',
                    'A job interview preparation guide',
                    'A travel booking conversation',
                    'A medical appointment discussion',
                ],
                'correct_answer' => 0,
            ],
            [
                'youtube_video_id' => 'YjwHsdFZPxE',
                'title' => 'IELTS Listening — Test 2',
                'text' => 'According to the speaker, what is the most important factor mentioned?',
                'options' => [
                    'Cost of living',
                    'Location and transport links',
                    'Quality of facilities',
                    'Number of available rooms',
                ],
                'correct_answer' => 1,
            ],
            [
                'youtube_video_id' => '28EFRJaA2JQ',
                'title' => 'IELTS Listening — Test 3',
                'text' => 'What does the speaker say about the deadline?',
                'options' => [
                    'It has already passed',
                    'It can be extended upon request',
                    'It is the end of the month',
                    'There is no strict deadline',
                ],
                'correct_answer' => 2,
            ],
            [
                'youtube_video_id' => 'Af4kqQ8hdhE',
                'title' => 'IELTS Listening — Test 4',
                'text' => 'What is the purpose of the phone call in the recording?',
                'options' => [
                    'To make a complaint about a service',
                    'To enquire about course enrolment',
                    'To confirm a reservation',
                    'To request a refund',
                ],
                'correct_answer' => 1,
            ],
            [
                'youtube_video_id' => 'GPbPAC0xS1s',
                'title' => 'IELTS Listening — Test 5',
                'text' => 'Which statement best summarises the speaker\'s main argument?',
                'options' => [
                    'Public transport should be free for students',
                    'Cycling is the safest way to commute',
                    'Remote work reduces traffic congestion',
                    'Urban planning needs more green spaces',
                ],
                'correct_answer' => 2,
            ],
            [
                'youtube_video_id' => 'fi3uJy8KsUU',
                'title' => 'IELTS Listening — Test 6',
                'text' => 'What problem does the student mention to the tutor?',
                'options' => [
                    'Difficulty finding research sources',
                    'Not understanding the assignment brief',
                    'Conflict with a group member',
                    'Insufficient time to complete the task',
                ],
                'correct_answer' => 3,
            ],
            [
                'youtube_video_id' => 'a5UADG2c0sw',
                'title' => 'IELTS Listening — Test 7',
                'text' => 'What does the speaker recommend doing first?',
                'options' => [
                    'Register online before the event',
                    'Contact the organiser by email',
                    'Read the programme in advance',
                    'Arrive at least 30 minutes early',
                ],
                'correct_answer' => 0,
            ],
            [
                'youtube_video_id' => '8uFBMD23d5k',
                'title' => 'IELTS Listening — Test 8',
                'text' => 'What is the overall tone of the conversation?',
                'options' => [
                    'Formal and tense',
                    'Informal and friendly',
                    'Neutral and informative',
                    'Urgent and alarming',
                ],
                'correct_answer' => 2,
            ],
        ];

        foreach ($questions as $q) {
            ListeningQuestion::updateOrCreate(
                ['youtube_video_id' => $q['youtube_video_id']],
                $q
            );
        }
    }
}
