<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WritingFeedback;
use App\Models\WritingQuestion;
use App\Models\WritingSubmission;
use Illuminate\Database\Seeder;
use Database\Seeders\TutorSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@ielts.test',
            'role' => 'admin',
        ]);

        // Tutor user
        $tutor = User::factory()->create([
            'name' => 'Tutor User',
            'email' => 'tutor@ielts.test',
            'role' => 'tutor',
        ]);

        // Student user
        $student = User::factory()->create([
            'name' => 'Student User',
            'email' => 'student@ielts.test',
            'role' => 'student',
        ]);

        // Extra students
        User::factory(7)->create(['role' => 'student']);

        // Seed guide steps for writing tasks
        $this->call(GuideStepSeeder::class);

        $this->call(WritingQuestionSeeder::class);

        // 👉 SAFE ADDITION (your booking system)
        $this->call(TutorSeeder::class);

        // Seed demo submissions and feedback for the complete flow
        $questions = WritingQuestion::all();

        // Submission 1: Reviewed by tutor (complete flow)
        $submission1 = WritingSubmission::create([
            'user_id' => $student->id,
            'writing_question_id' => $questions[0]->id,
            'content' => "The bar chart illustrates the total revenue of ABC Corporation over a five-year period from 2018 to 2022.\n\nOverall, the company's revenue showed a consistent upward trend throughout the period, with the most significant growth occurring between 2020 and 2022.\n\nIn 2018, ABC Corporation generated approximately 2.5 million dollars in revenue. This figure rose moderately to around 3.2 million in 2019, representing an increase of roughly 28 percent. The following year saw a slight dip to 3.0 million, which could potentially be attributed to economic uncertainties.\n\nHowever, from 2020 onwards, the company experienced substantial growth. Revenue climbed sharply to 4.1 million in 2021, marking the largest year-on-year increase during the period. This upward trajectory continued into 2022, when revenue reached its peak at approximately 5.3 million dollars.\n\nIn summary, ABC Corporation more than doubled its revenue over the five-year period, with particularly strong growth in the final two years.",
            'word_count' => 158,
        ]);

        WritingFeedback::create([
            'writing_submission_id' => $submission1->id,
            'evaluator_type' => 'tutor',
            'evaluator_id' => $tutor->id,
            'band_score' => 7.0,
            'grammar_feedback' => 'Good range of grammatical structures with generally accurate usage. Minor issues with article usage in a few places. Consider varying sentence openings more.',
            'vocabulary_feedback' => 'Effective use of topic-specific vocabulary such as "upward trend", "year-on-year increase", and "upward trajectory". Good range of synonyms for increase/growth.',
            'coherence_feedback' => 'Well-organised with clear progression. Good use of cohesive devices like "However" and "In summary". Each paragraph has a clear focus.',
            'recommendations' => 'Try to include more specific data points and comparisons. You could also mention the overall percentage increase. Consider using more complex sentence structures to aim for a higher band score.',
        ]);

        // Submission 2: Pending review
        WritingSubmission::create([
            'user_id' => $student->id,
            'writing_question_id' => $questions[2]->id,
            'content' => "The line graph depicts the average monthly temperature in London over an eight-year period from 2015 to 2023.\n\nOverall, the temperature pattern followed a predictable seasonal cycle each year, with summers being the warmest and winters the coldest. There appears to be a slight upward trend in peak summer temperatures over the period.\n\nDuring the winter months, temperatures typically fell to their lowest point, averaging around 4 to 6 degrees Celsius. The coldest recorded period was in January 2018, when temperatures dropped to approximately 2 degrees.\n\nConversely, summer temperatures generally peaked between June and August, reaching highs of 22 to 25 degrees Celsius. Notably, the summers of 2022 and 2023 recorded the highest temperatures, exceeding 26 degrees on average.\n\nThe spring and autumn months showed moderate temperatures, typically ranging from 10 to 16 degrees, serving as transitional periods between the extremes.",
            'word_count' => 152,
        ]);

        // Submission 3
        $otherStudent = User::where('role', 'student')->where('id', '!=', $student->id)->first();
        if ($otherStudent) {
            WritingSubmission::create([
                'user_id' => $otherStudent->id,
                'writing_question_id' => $questions[4]->id,
                'content' => "The pie chart shows how a typical family spends their money on different categories.\n\nThe largest portion of household spending goes to housing, which accounts for about 35 percent of the total budget. This is followed by food and groceries at 20 percent, making these two categories together responsible for over half of all household expenditure.\n\nTransportation takes up 15 percent of the budget, while utilities such as electricity and water represent 10 percent. Education and healthcare each account for approximately 8 percent of spending.\n\nThe remaining 4 percent is allocated to entertainment and leisure activities, making it the smallest category of expenditure.\n\nIn conclusion, housing dominates household spending, while discretionary categories like entertainment receive the smallest share.",
                'word_count' => 126,
            ]);
        }
    }
}