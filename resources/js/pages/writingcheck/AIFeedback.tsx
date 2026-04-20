import { usePage, router } from '@inertiajs/react';

export default function AIFeedback() {
  const { props } = usePage<any>();

  const {
    id,
    original,
    corrections,
    band_score,
  } = props;

  return (
    <div className="min-h-screen bg-gray-200 relative py-8 px-10">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black">
          AI Writing Feedback
        </h1>
        <p className="text-gray-600 mt-2">
          grammar analysis powered by AI
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex justify-center">
        <div className="w-[700px] bg-indigo-50 border border-indigo-100 rounded-2xl p-8">

          {/* ORIGINAL TEXT */}
          <h2 className="font-bold text-lg text-center mb-4">
            Original Text
          </h2>

          <div className="mb-6 bg-white p-4 rounded-xl border">
            <p className="text-gray-800">{original}</p>
          </div>

          {/* BAND SCORE */}
          {band_score !== undefined && (
            <p className="text-center font-semibold mb-4 text-gray-700">
              Band Score: {band_score}
            </p>
          )}

          {/* CORRECTIONS */}
          <h2 className="font-bold text-lg text-center mb-4">
            Corrections
          </h2>

          {corrections?.length > 0 ? (
            corrections.map((c: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl mb-3 border">

                <p className="text-gray-800">
                  <b>Issue:</b> {c.message}
                </p>

                <p className="text-gray-800">
                  <b>Wrong Text:</b> {c.incorrect_text}
                </p>

                <p className="text-gray-800">
                  <b>Suggestions:</b>{' '}
                  {c.suggestions?.length
                    ? c.suggestions.map((s: any) => s.value).join(', ')
                    : 'No suggestions'}
                </p>

              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No corrections found 🎉
            </p>
          )}

        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => router.visit('/dashboard')}
          className="bg-gray-300 px-5 py-2 rounded-lg text-gray-900 font-semibold hover:bg-gray-400 transition"
        >
          Back
        </button>
      </div>

    </div>
  );
}