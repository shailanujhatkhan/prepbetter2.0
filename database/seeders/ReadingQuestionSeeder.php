<?php

namespace Database\Seeders;

use App\Models\ReadingQuestion;
use Illuminate\Database\Seeder;

class ReadingQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'passage' => 'Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas. Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun\'s heat and raising temperatures. The main greenhouse gases that are causing climate change include carbon dioxide and methane. These come from using gasoline for driving a car or coal for heating a building. Clearing land and forests can also release carbon dioxide. Agriculture, oil and gas operations are major sources of methane emissions.',
                'question' => 'Which option best summarizes the passage?',
                'options' => [
                    'A) Climate change is entirely caused by natural factors and cannot be influenced by human activities.',
                    'B) Human activities, especially burning fossil fuels, are the main cause of climate change since the 1800s.',
                    'C) Greenhouse gases only come from transportation and have little effect on global temperatures.',
                    'D) Climate change only affects temperatures and has no connection to weather patterns.',
                ],
                'correct_answer' => 'B',
                'explanation' => 'The passage clearly states that since the 1800s, human activities—primarily burning fossil fuels—have been the main driver of climate change, generating greenhouse gas emissions that trap heat.',
                'difficulty' => 'easy',
                'topic' => 'Environment',
                'is_active' => true,
            ],
            [
                'passage' => 'The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in history. Almost every aspect of daily life was influenced in some way. Average income and population began to exhibit unprecedented sustained growth. Some economists say that the major effect of the Industrial Revolution was that the standard of living for the general population in the western world began to increase consistently for the first time in history, although others have maintained that it did not begin to meaningfully improve until the late 19th and 20th centuries. GDP per capita was broadly stable before the Industrial Revolution and the emergence of the modern capitalist economy, while the Industrial Revolution began an era of per-capita economic growth in capitalist economies.',
                'question' => 'Which option best summarizes the passage?',
                'options' => [
                    'A) The Industrial Revolution had no effect on economic growth or living standards.',
                    'B) The Industrial Revolution only affected Britain and had no global consequences.',
                    'C) The Industrial Revolution was a major turning point that spurred economic growth and raised living standards, though economists debate when improvements became meaningful.',
                    'D) The Industrial Revolution caused a decline in population and average income across the western world.',
                ],
                'correct_answer' => 'C',
                'explanation' => 'The passage describes the Industrial Revolution as a major turning point that began sustained economic and population growth, while noting economists disagree about when standard of living meaningfully improved.',
                'difficulty' => 'medium',
                'topic' => 'History',
                'is_active' => true,
            ],
            [
                'passage' => 'Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic and display human cognitive skills associated with the human mind, such as learning and problem-solving. This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.',
                'question' => 'Which option best summarizes the passage?',
                'options' => [
                    'A) AI is a natural form of intelligence found only in animals and humans.',
                    'B) AI refers to machine intelligence focused on rational goal-achieving behavior, moving beyond the earlier definition of mimicking human cognition.',
                    'C) AI researchers unanimously agree that AI must replicate human learning and emotions.',
                    'D) Artificial intelligence is exclusively used for solving mathematical problems.',
                ],
                'correct_answer' => 'B',
                'explanation' => 'The passage explains AI has evolved from mimicking human cognition to a broader definition focused on rational agents that perceive their environment and act to achieve goals.',
                'difficulty' => 'medium',
                'topic' => 'Technology',
                'is_active' => true,
            ],
            [
                'passage' => 'Urbanization is the process by which rural areas become urbanized as a result of rural migration and even suburban concentration into cities. The United Nations projected that half of the world\'s population would live in urban areas at the end of 2008. By 2050, 64% of the developing world and 86% of the developed world is expected to be urbanized. Urbanization is closely linked to modernization, industrialization, and the sociological process of rationalization. Urbanization can be seen as a specific condition at a set time (e.g. the proportion of total population or area in cities or towns) or as an increase of that proportion over time.',
                'question' => 'Which option best summarizes the passage?',
                'options' => [
                    'A) Urbanization is a declining global trend with fewer people moving to cities each year.',
                    'B) Urbanization only occurs in developing countries and has no impact on developed nations.',
                    'C) Urbanization is the global shift of populations to urban areas, projected to include the majority of humanity by 2050, and is linked to modernization and industrialization.',
                    'D) The UN projects that urbanization will be complete by 2008 with all populations in cities.',
                ],
                'correct_answer' => 'C',
                'explanation' => 'The passage defines urbanization as the shift to urban living, noting projections that most of humanity will be urbanized by 2050, and links it to modernization and industrialization.',
                'difficulty' => 'hard',
                'topic' => 'Society',
                'is_active' => true,
            ],
            [
                'passage' => 'A healthy diet is a diet that maintains or improves overall health. A healthy diet provides the body with essential nutrition: fluid, macronutrients such as protein, micronutrients such as vitamins, and adequate fibre and food energy. A healthy diet may contain fruits, vegetables, and whole grains, and includes little to no processed food and sweetened beverages. The requirements for a healthy diet can be met from a variety of plant-based and animal-based foods, although a non-animal source of vitamin B12 is needed for those following a vegan diet. Various nutrition guides are published by medical and governmental institutions to educate the public on what they should be eating to be healthy.',
                'question' => 'Which option best summarizes the passage?',
                'options' => [
                    'A) A healthy diet requires eating only plant-based foods and completely avoiding animal products.',
                    'B) A healthy diet, which maintains health through proper nutrition from varied food sources, involves minimizing processed foods, and vegans must find alternative B12 sources.',
                    'C) Processed foods and sweetened beverages are essential components of a healthy diet.',
                    'D) Government institutions discourage the public from following any specific diet guidelines.',
                ],
                'correct_answer' => 'B',
                'explanation' => 'The passage describes a healthy diet as one that provides essential nutrition from varied sources, limits processed food, and notes that vegans need alternative vitamin B12 sources.',
                'difficulty' => 'easy',
                'topic' => 'Health',
                'is_active' => true,
            ],
        ];

        foreach ($questions as $q) {
            ReadingQuestion::updateOrCreate(
                ['passage' => substr($q['passage'], 0, 100)],
                $q
            );
        }
    }
}
