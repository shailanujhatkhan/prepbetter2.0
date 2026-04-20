import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10">

      {/* Header (matches dashboard typography) */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold tracking-tight">
          Book a Private IELTS Tutor
        </h1>
        <p className="text-muted-foreground mt-2">
          Schedule a session with an expert
        </p>
      </div>

      {/* Cards (same system as dashboard sections) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

        {/* SPEAKING */}
        <Card
          onClick={() => router.visit("/book-tutor/speaking")}
          className="cursor-pointer transition-shadow hover:shadow-md"
        >
          <CardHeader className="text-center">
            <CardTitle>Speaking</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Book speaking practice sessions
          </CardContent>
        </Card>

        {/* WRITING */}
        <Card
          onClick={() => router.visit("/book-tutor/writing")}
          className="cursor-pointer transition-shadow hover:shadow-md"
        >
          <CardHeader className="text-center">
            <CardTitle>Writing</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Book writing feedback sessions
          </CardContent>
        </Card>

      </div>

      {/* Back button (dashboard style muted button) */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => router.visit('/dashboard')}
          className="
            px-4 py-2
            rounded-lg
            bg-muted
            hover:bg-muted/80
            text-foreground
            font-medium
          "
        >
          Back
        </button>
      </div>

    </div>
  );
}