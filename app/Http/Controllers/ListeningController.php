<?php

namespace App\Http\Controllers;

use App\Models\ListeningQuestion;
use App\Services\YoutubeService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ListeningController extends Controller
{
    private const PLAYLIST_URL     = 'https://www.youtube.com/watch?v=qI2LxF5sR2c&list=PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt';
    private const CACHE_TTL_HOURS  = 6;

    public function index(): Response
    {
        $this->syncPlaylistIfStale();

        $questions = ListeningQuestion::whereNotNull('youtube_video_id')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('listening/index', [
            'questions' => $questions,
        ]);
    }

    private function syncPlaylistIfStale(): void
    {
        $playlistId = YoutubeService::extractPlaylistId(self::PLAYLIST_URL);

        if (! $playlistId) {
            return;
        }

        $lastSync = ListeningQuestion::where('playlist_id', $playlistId)
            ->whereNotNull('synced_at')
            ->max('synced_at');

        if ($lastSync && Carbon::parse($lastSync)->gt(now()->subHours(self::CACHE_TTL_HOURS))) {
            return; // Cache still fresh
        }

        try {
            $videos = (new YoutubeService())->getPlaylistVideos(self::PLAYLIST_URL);

            if (empty($videos)) {
                return;
            }

            $now = now();

            foreach ($videos as $video) {
                $existing = ListeningQuestion::where('youtube_video_id', $video['video_id'])->first();

                if ($existing) {
                    // Only refresh metadata + synced_at — preserve admin-set MCQ fields
                    $existing->update([
                        'playlist_id' => $playlistId,
                        'title'       => $video['title'],
                        'synced_at'   => $now,
                    ]);
                } else {
                    // New video from playlist — insert with placeholder MCQ
                    ListeningQuestion::create([
                        'youtube_video_id' => $video['video_id'],
                        'playlist_id'      => $playlistId,
                        'title'            => $video['title'],
                        'text'             => 'Watch the video and answer the question below.',
                        'options'          => ['Option A', 'Option B', 'Option C', 'Option D'],
                        'correct_answer'   => 0,
                        'synced_at'        => $now,
                    ]);
                }
            }
        } catch (\Throwable $e) {
            Log::error('Listening playlist sync failed', ['error' => $e->getMessage()]);
        }
    }
}
