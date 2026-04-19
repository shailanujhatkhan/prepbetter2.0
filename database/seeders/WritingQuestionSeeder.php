<?php

namespace Database\Seeders;

use App\Models\WritingQuestion;
use Illuminate\Database\Seeder;

class WritingQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $defaultHints = [
            'questions' => [
                'Is the figure going up, down, or fluctuating?',
                'Is the change sudden or gradual?',
                'What are the key differences between categories?',
            ],
            'verbs' => ['increased', 'rose', 'grew', 'climbed', 'declined', 'fell', 'dropped', 'remained stable'],
            'adverbs' => ['gradually', 'steadily', 'sharply', 'dramatically', 'slightly', 'significantly'],
            'sentence_structures' => [
                'The figure for ___ increased steadily from ___ to ___ between ___ and ___.',
                'There was a gradual rise in ___ over the period shown.',
                'Overall, ___ experienced the most significant change.',
            ],
        ];

        $questions = [
            [
                'type' => 'task1',
                'title' => 'Total Revenue of ABC Corp., 2018-2022',
                'prompt_text' => 'The bar chart below shows the total revenue of ABC Corporation from 2018 to 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
                'chart_type' => 'bar_graph',
                'difficulty' => 'easy',
                'image_path' => 'writing-images/bar-revenue.png',
                'hints' => $defaultHints,
            ],
            [
                'type' => 'task1',
                'title' => 'Internet Users by Region, 2010-2020',
                'prompt_text' => 'The bar chart shows the number of internet users in millions across four regions from 2010 to 2020. Summarise the information by selecting and reporting the main features.',
                'chart_type' => 'bar_graph',
                'difficulty' => 'medium',
                'image_path' => 'writing-images/bar-internet.png',
                'hints' => $defaultHints,
            ],
            [
                'type' => 'task1',
                'title' => 'Average Temperature in London, 2015-2023',
                'prompt_text' => 'The line graph below shows the average monthly temperature in London over a period of 8 years. Summarise the information and make comparisons where relevant.',
                'chart_type' => 'line_graph',
                'difficulty' => 'medium',
                'image_path' => 'writing-images/line-temperature.png',
                'hints' => $defaultHints,
            ],
            [
                'type' => 'task1',
                'title' => 'Population Growth Trends in Three Cities',
                'prompt_text' => 'The line graph compares population growth in three major cities between 2000 and 2025. Write a report describing the main trends.',
                'chart_type' => 'line_graph',
                'difficulty' => 'hard',
                'image_path' => 'writing-images/line-population.png',
                'hints' => $defaultHints,
            ],
            [
                'type' => 'task1',
                'title' => 'Household Expenditure Breakdown',
                'prompt_text' => 'The pie chart below shows the average household expenditure breakdown in a typical family. Summarise the information.',
                'chart_type' => 'pie_chart',
                'difficulty' => 'easy',
                'image_path' => 'writing-images/pie-expenditure.png',
                'hints' => $defaultHints,
            ],
            [
                'type' => 'task1',
                'title' => 'Energy Sources Distribution by Country',
                'prompt_text' => 'The pie charts show the distribution of energy sources in three countries. Compare the main features.',
                'chart_type' => 'pie_chart',
                'difficulty' => 'hard',
                'image_path' => 'writing-images/pie-energy.png',
                'hints' => $defaultHints,
            ],
            [
                'type' => 'task1',
                'title' => 'City Centre Development Plan',
                'prompt_text' => 'The two maps below show a city centre before and after redevelopment. Summarise the changes.',
                'chart_type' => 'map',
                'difficulty' => 'medium',
                'image_path' => 'writing-images/map-city.png',
                'hints' => [
                    'questions' => ['What has been added or removed?', 'What has changed location?', 'What remains the same?'],
                    'verbs' => ['was replaced by', 'was converted into', 'was demolished', 'was constructed', 'remained unchanged'],
                    'adverbs' => ['to the north of', 'adjacent to', 'in the centre of', 'on the outskirts'],
                    'sentence_structures' => [
                        'The most notable change is that ___ was replaced by ___.',
                        'In contrast to the original plan, ___ now occupies the area where ___ used to be.',
                    ],
                ],
            ],
            [
                'type' => 'task1',
                'title' => 'Chocolate Manufacturing Process',
                'prompt_text' => 'The diagram shows the process of manufacturing chocolate. Summarise the information by describing the main stages.',
                'chart_type' => 'process_diagram',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'questions' => ['How many stages are there?', 'What is the first and last stage?', 'Are there any parallel processes?'],
                    'verbs' => ['begins with', 'is followed by', 'undergoes', 'is then', 'results in', 'is completed by'],
                    'adverbs' => ['firstly', 'subsequently', 'following this', 'finally', 'at this stage'],
                    'sentence_structures' => [
                        'The process begins with ___ and ends with ___.',
                        'At the next stage, ___ is ___.',
                        'The final product is obtained after ___.',
                    ],
                ],
            ],
            
            // ── Task 2: Essay Writing ─────────────────────────────────────────────
            // Agree/Disagree
            [
                'type' => 'task2',
                'title' => 'Remote Work Benefits',
                'prompt_text' => 'Some people believe that working from home is more productive than working in an office. To what extent do you agree or disagree with this statement?',
                'essay_type' => 'agree_disagree',
                'difficulty' => 'easy',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction (thesis) → Body 1 (agree/disagree) → Body 2 (counterpoint) → Conclusion',
                    'useful_phrases' => ['I agree/disagree with this view', 'to some extent', 'on the other hand', 'however', 'in conclusion'],
                ],
            ],
            [
                'type' => 'task2',
                'title' => 'Technology and Human Interaction',
                'prompt_text' => 'Technology has made human interaction less important. Do you agree or disagree?',
                'essay_type' => 'agree_disagree',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Supporting arguments → Counterargument → Conclusion',
                    'useful_phrases' => ['While it is true that', 'Nevertheless', 'I would argue that', 'In my opinion'],
                ],
            ],
            
            // Advantage/Disadvantage
            [
                'type' => 'task2',
                'title' => 'Living in a Multicultural Society',
                'prompt_text' => 'What are the advantages and disadvantages of living in a multicultural society?',
                'essay_type' => 'advantage_disadvantage',
                'difficulty' => 'easy',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Advantages (Body 1-2) → Disadvantages (Body 3-4) → Conclusion',
                    'useful_phrases' => ['The main advantage is', 'Another benefit is', 'However, there are disadvantages', 'One drawback is'],
                ],
            ],
            [
                'type' => 'task2',
                'title' => 'Early Specialization in Education',
                'prompt_text' => 'Discuss the advantages and disadvantages of specializing in one subject from an early age.',
                'essay_type' => 'advantage_disadvantage',
                'difficulty' => 'hard',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Advantages → Disadvantages → Balanced conclusion',
                    'useful_phrases' => ['It could be argued that', 'Despite these advantages', 'On balance'],
                ],
            ],
            
            // Discussion
            [
                'type' => 'task2',
                'title' => 'Environmental Responsibility',
                'prompt_text' => 'Discuss different views about whether governments or individuals should take responsibility for environmental protection. Give your own opinion.',
                'essay_type' => 'discussion',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → View 1 (government responsibility) → View 2 (individual responsibility) → Your opinion → Conclusion',
                    'useful_phrases' => ['Some argue that', 'Others believe that', 'It can be said that', 'From my perspective'],
                ],
            ],
            [
                'type' => 'task2',
                'title' => 'University Education Purpose',
                'prompt_text' => 'Some people believe university education should be free, while others argue it should be paid. Discuss both views and give your opinion.',
                'essay_type' => 'discussion',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Supporting view 1 → Supporting view 2 → Your opinion → Conclusion',
                    'useful_phrases' => ['Those who support this view', 'Conversely', 'In my view'],
                ],
            ],
            
            // Problem/Solution
            [
                'type' => 'task2',
                'title' => 'Urban Congestion',
                'prompt_text' => 'Traffic congestion is a serious problem in many cities. What are the causes and what solutions can be recommended?',
                'essay_type' => 'problem_solution',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Causes (Body 1-2) → Solutions (Body 3-4) → Conclusion',
                    'useful_phrases' => ['A main cause is', 'Another reason is', 'One solution would be', 'To address this problem'],
                ],
            ],
            [
                'type' => 'task2',
                'title' => 'Youth Unemployment',
                'prompt_text' => 'Young people in many countries are facing unemployment. What are the causes of this problem and what measures could be taken to address it?',
                'essay_type' => 'problem_solution',
                'difficulty' => 'hard',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Multiple causes → Multiple solutions → Conclusion',
                    'useful_phrases' => ['This is primarily due to', 'Firstly', 'Secondly', 'To tackle this issue'],
                ],
            ],
            
            // Two-Part
            [
                'type' => 'task2',
                'title' => 'Public Transportation Investment',
                'prompt_text' => 'Should governments invest more in public transportation? What other measures could improve city transport?',
                'essay_type' => 'two_part',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Answer to question 1 → Answer to question 2 → Conclusion',
                    'useful_phrases' => ['As for the first question', 'Regarding the second point', 'Additionally'],
                ],
            ],
            [
                'type' => 'task2',
                'title' => 'Work-Life Balance and Flexible Work',
                'prompt_text' => 'Why is work-life balance important? How can flexible working practices help employees achieve this balance?',
                'essay_type' => 'two_part',
                'difficulty' => 'medium',
                'image_path' => null,
                'hints' => [
                    'structure' => 'Introduction → Importance of work-life balance → Benefits of flexible work → Conclusion',
                    'useful_phrases' => ['To answer the first part', 'Flexible work can help by', 'This leads to'],
                ],
            ],
        ];

        foreach ($questions as $q) {
            if (! empty($q)) {
                WritingQuestion::create($q);
            }
        }
    }
}
