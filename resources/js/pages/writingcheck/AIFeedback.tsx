import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'AI Feedback', href: '/ai-feedback' },
];

export default function AIFeedback() {
  const { props } = usePage<any>();

  const {
    submission,
    original,
    corrections,
    band_score,
    recommendations,
  } = props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="AI Feedback" />

      <div className="flex flex-col gap-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Writing Feedback
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Grammar analysis powered by AI
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="max-w-3xl mx-auto w-full">
          <Card className="shadow-sm">

            <CardContent className="p-6 flex flex-col gap-6">

              {/* ORIGINAL TEXT */}
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Original Text
                </h2>

                <div className="border rounded-lg p-4 bg-white">
                  <p className="text-gray-800">
                    {original ?? submission?.content ?? "No text available"}
                  </p>
                </div>
              </div>

              {/* BAND SCORE */}
              {band_score !== null && band_score !== undefined && (
                <div className="text-center">
                  <p className="font-semibold text-gray-700">
                    Band Score: {band_score}
                  </p>
                </div>
              )}

              {/* CORRECTIONS */}
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Corrections
                </h2>

                {Array.isArray(corrections) && corrections.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {corrections.map((c: any, i: number) => (
                      <div key={i} className="border rounded-lg p-4 bg-white">

                        <p className="text-gray-800">
                          <span className="font-semibold">Issue:</span> {c.message}
                        </p>

                        <p className="text-gray-800">
                          <span className="font-semibold">Wrong Text:</span> {c.incorrect_text}
                        </p>

                        <p className="text-gray-800">
                          <span className="font-semibold">Suggestions:</span>{' '}
                          {c.suggestions?.length
                            ? c.suggestions.map((s: any) => s.value).join(', ')
                            : 'No suggestions'}
                        </p>

                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center">
                    No corrections found 🎉
                  </p>
                )}
              </div>

              {/* RECOMMENDATIONS */}
              {recommendations && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    Recommendations
                  </h2>

                  <div className="border rounded-lg p-4 bg-white">
                    <p className="text-gray-800">
                      {recommendations}
                    </p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* BACK BUTTON */}
        <div className="fixed bottom-6 right-6">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>

      </div>
    </AppLayout>
  );
}