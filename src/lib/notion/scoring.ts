export type NotionSourceType = "database" | "page";

export type NotionSource = {
  id: string;
  type: NotionSourceType;
  title: string;
  lastEditedTime: string;
};

export type ScoreSamples = {
  rowsOrBlocks: number;
  toDoBlocks?: number;
  hasCheckableBlocks?: boolean;
};

export type ScoreBreakdown = {
  toDoCount: number;
  pageOrRowCount: number;
  titleScore: number;
  hasCheckableBlocks: boolean;
  excluded: boolean;
  finalScore: number;
};

export const TITLE_TASK_RE = /\b(todo|task|to-do|待办)\b/i;
export const TITLE_LIST_RE = /\b(list|checklist)\b/i;
export const TITLE_NEGATIVE_RE = /\b(wiki|note|journal|log)\b/i;

export function scoreSource(
  source: NotionSource,
  samples: ScoreSamples
): ScoreBreakdown {
  const toDoCount = samples.toDoBlocks ?? 0;
  const pageOrRowCount = samples.rowsOrBlocks;
  const hasCheckableBlocks = Boolean(samples.hasCheckableBlocks);

  let titleScore = 0;
  if (TITLE_TASK_RE.test(source.title)) titleScore += 3;
  if (TITLE_LIST_RE.test(source.title)) titleScore += 1;
  if (TITLE_NEGATIVE_RE.test(source.title)) titleScore -= 2;

  let score = 0;
  score += toDoCount * 2;
  score += Math.min(pageOrRowCount, 10) * 0.5;
  score += titleScore;

  const excluded =
    toDoCount === 0 && !hasCheckableBlocks && pageOrRowCount < 3;
  if (excluded) score -= 10;

  return {
    toDoCount,
    pageOrRowCount,
    titleScore,
    hasCheckableBlocks,
    excluded,
    finalScore: score,
  };
}