<?php

namespace Database\Seeders;

use App\Models\GuideStep;
use Illuminate\Database\Seeder;

class GuideStepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $steps = [
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null, // applies to all essay types
                'step_order' => 1,
                'title' => 'Topic Understanding',
                'description' => 'Analyze the question carefully',
                'guidance' => 'Read the essay question multiple times. Identify:
• The main topic
• What the question is asking
• Any key terms that need clarification
• Whether you need to give your own opinion',
                'tips' => [
                    'Look for command words: discuss, analyze, evaluate, compare',
                    'Underline the key topic words',
                    'Note if the question has multiple parts',
                    'Clarify if you need to give your personal view',
                ],
                'example' => '"Some people believe that increasing technology in the workplace has led to improved efficiency, while others argue it creates stress and reduces human interaction."

Key topic: Technology impact on the workplace
Key question: Discuss both views and give your opinion',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 2,
                'title' => 'Brainstorming Ideas',
                'description' => 'Generate relevant ideas and arguments',
                'guidance' => 'Write down all ideas related to the topic without judging them yet:
• Arguments supporting one view
• Arguments supporting the opposite view
• Your own position
• Real-world examples
• Possible counterarguments',
                'tips' => [
                    'Spend 5-10 minutes brainstorming',
                    'List ideas in a simple format',
                    'Don\'t worry about order or completeness yet',
                    'Include diverse perspectives',
                    'Think of specific examples to support ideas',
                ],
                'example' => 'Technology benefits:
- Faster communication
- Automated routine tasks
- Better data analysis

Technology drawbacks:
- Reduced face-to-face interaction
- Job displacement concerns
- Information overload
- Screen fatigue',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 3,
                'title' => 'Planning Structure',
                'description' => 'Organize your arguments logically',
                'guidance' => 'Create an outline with your main points:
• Introduction: Topic, context, your thesis
• Body Paragraph 1: First main argument + examples
• Body Paragraph 2: Second main argument + examples
• Body Paragraph 3: Counterargument or additional point
• Conclusion: Summary of key points + final stance',
                'tips' => [
                    'Aim for 3-4 body paragraphs',
                    'Put your strongest argument first',
                    'Use topic sentences for each paragraph',
                    'Plan transitions between paragraphs',
                    'Ensure each paragraph supports your main thesis',
                ],
                'example' => 'I. Introduction - Technology improves workplace efficiency but creates stress
II. Body 1 - Benefits: faster communication, automation
III. Body 2 - Drawbacks: isolated work, stress
IV. Body 3 - Balanced view: technology needs proper management
V. Conclusion - Both benefits and drawbacks need consideration',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 4,
                'title' => 'Writing Introduction',
                'description' => 'Hook the reader and present your thesis',
                'guidance' => 'Your introduction should:
• Hook with context or background about the topic
• Acknowledge the debate or different viewpoints
• Present your thesis statement clearly
• Keep it to 2-3 sentences (50-80 words)',
                'tips' => [
                    'Start with a general statement, then narrow down',
                    'Avoid starting with "In this essay, I will..."',
                    'Make your position clear from the start',
                    'Use varied sentence structures',
                    'Define any key terms if necessary',
                ],
                'example' => 'Technology has become integral to modern workplaces, dramatically changing how employees communicate and perform tasks. While technological advances have undoubtedly increased productivity and efficiency, they have simultaneously introduced new challenges such as workplace stress and reduced human interaction. This essay will examine both the benefits and drawbacks of technology in the workplace.',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 5,
                'title' => 'Writing Body Paragraphs',
                'description' => 'Develop your main arguments with evidence',
                'guidance' => 'Each body paragraph should:
• Start with a clear topic sentence
• Provide 2-3 supporting ideas or examples
• Explain how the evidence relates to your argument
• Use transitions to connect ideas
• Length: 80-120 words per paragraph',
                'tips' => [
                    'Use signal phrases: Furthermore, In addition, On the other hand',
                    'Support claims with specific examples',
                    'Explain the significance of your examples',
                    'Address counterarguments where relevant',
                    'Maintain consistent tone and formality',
                ],
                'example' => 'Topic Sentence: The integration of technology has significantly enhanced workplace productivity.

Supporting idea: Digital communication tools enable instant collaboration across geographical boundaries.

Example: Email, video conferencing, and project management software have reduced meeting times and accelerated decision-making processes.

Explanation: This demonstrates how technology creates efficiency by eliminating delays and facilitating real-time information sharing.',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 6,
                'title' => 'Using Examples Effectively',
                'description' => 'Strengthen arguments with concrete evidence',
                'guidance' => 'Strong examples:
• Are specific and relevant to the argument
• Come from real situations or general knowledge
• Are explained thoroughly
• Show the link to your main point

Types of examples:
• Personal experience
• General observation
• Statistical evidence
• Hypothetical scenarios',
                'tips' => [
                    'Use 2-3 examples per body paragraph',
                    'Always explain WHY the example matters',
                    'Avoid using overly complex or obscure examples',
                    'Ensure examples directly support your argument',
                    'Vary the types of examples you use',
                ],
                'example' => 'Weak: "Technology causes stress at work."

Strong: "Studies show that constant email notifications and expectations for immediate responses create a sense of constant urgency. For instance, many employees report feeling obligated to check work emails during personal time, preventing genuine relaxation and contributing to burnout."',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 7,
                'title' => 'Writing Conclusion',
                'description' => 'Summarize and reinforce your position',
                'guidance' => 'Your conclusion should:
• Restate your thesis in fresh language (do not copy)
• Summarize the main points you discussed
• Give a final perspective on the topic
• Be 50-80 words
• Leave a lasting impression',
                'tips' => [
                    'Do NOT introduce new arguments',
                    'Avoid starting with "In conclusion..."',
                    'Use phrases like: "Overall", "It is clear that", "In summary"',
                    'Connect back to the broader significance',
                    'End with a thought-provoking or forward-looking statement',
                ],
                'example' => 'In summary, while technology undoubtedly improves workplace efficiency and enables global collaboration, it simultaneously presents challenges regarding employee well-being and human connection. Rather than viewing technology as inherently good or bad, organizations should focus on implementing systems that maximize productivity while protecting employee mental health. Striking this balance is essential for sustainable workplace success.',
            ],
            [
                'module' => 'writing',
                'task_type' => 'task2',
                'essay_type' => null,
                'step_order' => 8,
                'title' => 'Full Essay Writing',
                'description' => 'Write your complete essay',
                'guidance' => 'Now that you have planned each section, write your full essay.

Reminder:
• Total word count: 250+ words
• Follow your outline
• Use transition words for flow
• Check grammar as you write
• Maintain consistent tone
• Review spelling and punctuation',
                'tips' => [
                    'Don\'t worry about perfection on first draft',
                    'Write continuously without stopping to edit',
                    'You can revise and improve later',
                    'Keep your planning notes visible for reference',
                    'Manage your time: 5 min plan + 35-40 min writing',
                ],
                'example' => null,
            ],
        ];

        foreach ($steps as $step) {
            GuideStep::create($step);
        }
    }
}
