<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AudioController extends Controller
{
    public function generate(Request $request)
    {
        $text = $request->text;

        $response = Http::withHeaders([
            'xi-api-key' => env('ELEVENLABS_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post(
            'https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID',
            [
                'text' => $text,
                'model_id' => 'eleven_multilingual_v2',
            ]
        );

        return response($response->body(), 200)
            ->header('Content-Type', 'audio/mpeg');
    }
}
