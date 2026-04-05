export type PromptMap = Record<string, [string, string, string]>;

export interface GenerationTask {
  floraName: string;
  stage: 1 | 2 | 3;
  prompt: string;
  outputPath: string;
}

export interface GenerationResult {
  task: GenerationTask;
  status: 'ok' | 'skipped' | 'failed';
  error?: string;
  durationMs?: number;
}
