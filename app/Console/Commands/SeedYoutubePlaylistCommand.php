<?php

namespace App\Console\Commands;

use App\Models\ListeningQuestion;
use App\Services\YoutubeService;
use Illuminate\Console\Command;

class SeedYoutubePlaylistCommand extends Command
{
    protected $signature = 'youtube:seed-playlist {url : YouTube playlist URL}';

    protected $description = 'Seed listening questions from a YouTube playlist';

    public function handle(): int
    {
        $url = $this->argument('url');
        $service = new YoutubeService();

        $this->info('Fetching videos from playlist...');
        $videos = $service->getPlaylistVideos($url, 50);

        if (empty($videos)) {
            $this->error('No videos found or API key not configured.');
            $this->line('Make sure YOUTUBE_API_KEY is set in your .env file');
            return 1;
        }

        $this->info("Found " . count($videos) . " videos");

        foreach ($videos as $index => $video) {
            $this->line("Processing: {$video['title']}");

            // Create listening question (you can customize this logic)
            ListeningQuestion::firstOrCreate(
                ['youtube_video_id' => $video['video_id']],
                [
                    'title' => $video['title'],
                    'text' => 'Listen to the audio and answer the question below.',
                    'options' => json_encode([
                        'Option A',
                        'Option B',
                        'Option C',
                        'Option D',
                    ]),
                    'correct_answer' => 0,
                ]
            );
        }

        $this->info("Playlist seeding complete!");
        return 0;
    }
}
