<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class YoutubeService
{
    private string $apiKey;
    private string $baseUrl = 'https://www.googleapis.com/youtube/v3';

    public function __construct()
    {
        $this->apiKey = config('services.youtube.key');
    }

    /**
     * Extract video ID from YouTube URL
     */
    public static function extractVideoId(string $url): ?string
    {
        if (preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.*/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/|youtube\.com/watch\?v=)([^"&?\s]{11})%i', $url, $match)) {
            return $match[1];
        }
        return null;
    }

    /**
     * Extract playlist ID from YouTube URL
     */
    public static function extractPlaylistId(string $url): ?string
    {
        if (preg_match('/(?:youtube\.com.*[?&]list=|youtu\.be.*[?&]list=)([^&\n?#]+)/', $url, $match)) {
            return $match[1];
        }
        return null;
    }

    /**
     * Fetch videos from YouTube playlist
     */
    public function getPlaylistVideos(string $playlistUrl, int $maxResults = 50): array
    {
        $playlistId = self::extractPlaylistId($playlistUrl);
        
        if (!$playlistId) {
            Log::error('Invalid playlist URL', ['url' => $playlistUrl]);
            return [];
        }

        try {
            $videos = [];
            $pageToken = null;

            do {
                $response = Http::get($this->baseUrl . '/playlistItems', [
                    'key' => $this->apiKey,
                    'playlistId' => $playlistId,
                    'part' => 'snippet',
                    'maxResults' => min($maxResults, 50),
                    'pageToken' => $pageToken,
                ]);

                if ($response->failed()) {
                    Log::error('YouTube API error', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    break;
                }

                $data = $response->json();
                
                if (isset($data['items'])) {
                    foreach ($data['items'] as $item) {
                        $videoId = $item['snippet']['resourceId']['videoId'] ?? null;
                        $title = $item['snippet']['title'] ?? 'Untitled';
                        $description = $item['snippet']['description'] ?? '';

                        if ($videoId) {
                            $videos[] = [
                                'video_id' => $videoId,
                                'title' => $title,
                                'description' => $description,
                                'thumbnail' => $item['snippet']['thumbnails']['default']['url'] ?? null,
                            ];
                        }
                    }
                }

                $pageToken = $data['nextPageToken'] ?? null;
                $maxResults -= count($data['items'] ?? []);

            } while ($pageToken && $maxResults > 0);

            return $videos;

        } catch (\Exception $e) {
            Log::error('YouTube service error', ['exception' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get video details
     */
    public function getVideoDetails(string $videoId): ?array
    {
        try {
            $response = Http::get($this->baseUrl . '/videos', [
                'key' => $this->apiKey,
                'id' => $videoId,
                'part' => 'snippet,contentDetails,statistics',
            ]);

            if ($response->failed()) {
                return null;
            }

            $data = $response->json();
            if (isset($data['items'][0])) {
                return $data['items'][0];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('YouTube video details error', ['exception' => $e->getMessage()]);
            return null;
        }
    }
}