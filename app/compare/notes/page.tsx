import { NoteComparisonTool } from '@/components/note-comparison-tool';

export default function NoteComparisonPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
              Note Comparison
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare fragrance notes and discover similarities between your
            favorites.
          </p>
        </div>

        <NoteComparisonTool />
      </div>
    </div>
  );
}
