import { scoreSource, NotionSource, ScoreSamples } from "./scoring";

const NOTION_VERSION = "2022-06-28";
const NOTION_API = "https://api.notion.com/v1";
const CANDIDATE_LIMIT = 5;
const SAMPLE_DB_PAGE_SIZE = 5;
const SAMPLE_BLOCK_PAGE_SIZE = 10;
const CONCURRENCY = 2;
const EARLY_TERM_ZERO_RUN = 2;
const MIN_ACCEPTABLE_SCORE = 1;

export type NotionTask = {
  id: string;
  text: string;
  dueDate?: string;
  lastEditedTime?: string;
};

export type NotionTaskSource = {
  id: string;
  type: "database" | "page";
  title: string;
  taskCount: number;
};

export type DiscoverResult = {
  source: NotionTaskSource;
  tasks: NotionTask[];
  score: number;
  candidatesEvaluated?: Array<{
    title: string;
    type: string;
    score: number;
    reason?: string;
  }>;
  rawSearchCount?: number;
};

type SearchResultItem = {
  object: "database" | "page";
  id: string;
  last_edited_time: string;
  title?: Array<{ plain_text: string }>;
  properties?: Record<string, unknown>;
};

type NotionDatabaseRow = {
  id: string;
  last_edited_time: string;
  properties: Record<string, any>;
};

type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  to_do?: { rich_text: Array<{ plain_text: string }>; checked: boolean };
  last_edited_time?: string;
};

type QueryResponse = {
  results: NotionDatabaseRow[];
  next_cursor?: string | null;
  has_more: boolean;
};

type BlockChildrenResponse = {
  results: NotionBlock[];
  next_cursor?: string | null;
  has_more: boolean;
};

function extractTitle(item: SearchResultItem): string {
  if (item.object === "database") {
    return item.title?.[0]?.plain_text || "(untitled database)";
  }
  const props = item.properties as Record<string, any> | undefined;
  if (!props) return "(untitled page)";
  for (const value of Object.values(props)) {
    if (value?.type === "title" && Array.isArray(value.title) && value.title[0]?.plain_text) {
      return value.title[0].plain_text;
    }
  }
  return "(untitled page)";
}

async function notionFetch<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${NOTION_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Notion API ${path} failed: ${res.status} ${text.slice(0, 200)}`
    );
  }
  return (await res.json()) as T;
}

function toSearchCandidate(item: SearchResultItem): NotionSource | null {
  if (item.object !== "database" && item.object !== "page") return null;
  return {
    id: item.id,
    type: item.object,
    title: extractTitle(item),
    lastEditedTime: item.last_edited_time,
  };
}

async function sampleCandidate(
  token: string,
  candidate: NotionSource
): Promise<ScoreSamples> {
  if (candidate.type === "database") {
    let data: QueryResponse;
    try {
      data = await notionFetch<QueryResponse>(
        token,
        `/databases/${candidate.id}/query`,
        {
          method: "POST",
          body: JSON.stringify({ page_size: SAMPLE_DB_PAGE_SIZE }),
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("404") || msg.includes("not_found")) {
        data = await notionFetch<QueryResponse>(
          token,
          `/data_sources/${candidate.id}/query`,
          {
            method: "POST",
            body: JSON.stringify({ page_size: SAMPLE_DB_PAGE_SIZE }),
          }
        );
      } else {
        throw err;
      }
    }
    const hasCheckable = data.results.some((row) => {
      const props = row.properties || {};
      return Object.values(props).some((p: any) => p?.type === "checkbox");
    });
    return {
      rowsOrBlocks: data.results.length,
      hasCheckableBlocks: hasCheckable,
    };
  }

  const data = await notionFetch<BlockChildrenResponse>(
    token,
    `/blocks/${candidate.id}/children?page_size=${SAMPLE_BLOCK_PAGE_SIZE}`
  );
  const toDoBlocks = data.results.filter((b) => b.type === "to_do").length;
  return {
    rowsOrBlocks: data.results.length,
    toDoBlocks,
    hasCheckableBlocks: toDoBlocks > 0,
  };
}

function pickTitleProperty(properties: Record<string, any>): string {
  const entries = Object.entries(properties);
  const titleEntry = entries.find(([, v]) => v?.type === "title");
  if (titleEntry) return titleEntry[0];
  const nameEntry = entries.find(([k]) => /name|title/i.test(k));
  return nameEntry ? nameEntry[0] : entries[0]?.[0] || "";
}

function pickDateProperty(properties: Record<string, any>): string | undefined {
  const entries = Object.entries(properties);
  const dateEntry = entries.find(([, v]) => v?.type === "date");
  return dateEntry ? dateEntry[0] : undefined;
}

function extractTaskFromRow(row: NotionDatabaseRow): NotionTask {
  const props = row.properties || {};
  const titleKey = pickTitleProperty(props);
  const dateKey = pickDateProperty(props);

  let text = "Untitled";
  if (titleKey) {
    const titleProp = props[titleKey];
    const richText = titleProp?.title;
    if (Array.isArray(richText) && richText[0]?.plain_text) {
      text = richText[0].plain_text;
    }
  }

  let dueDate: string | undefined;
  if (dateKey) {
    const dateProp = props[dateKey];
    const start = dateProp?.date?.start;
    if (start) dueDate = start;
  }

  return {
    id: row.id,
    text,
    dueDate,
    lastEditedTime: row.last_edited_time,
  };
}

function extractTaskFromBlock(block: NotionBlock): NotionTask | null {
  if (block.type !== "to_do") return null;
  const richText = block.to_do?.rich_text || [];
  const text =
    richText.length > 0
      ? richText.map((r) => r.plain_text).join("")
      : "(empty task)";
  return {
    id: block.id,
    text,
    lastEditedTime: block.last_edited_time,
  };
}

async function fetchDatabaseRows(
  token: string,
  databaseId: string
): Promise<NotionDatabaseRow[]> {
  const all: NotionDatabaseRow[] = [];
  let cursor: string | undefined;
  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    let data: QueryResponse;
    try {
      data = await notionFetch<QueryResponse>(
        token,
        `/databases/${databaseId}/query`,
        { method: "POST", body: JSON.stringify(body) }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("404") || msg.includes("not_found")) {
        data = await notionFetch<QueryResponse>(
          token,
          `/data_sources/${databaseId}/query`,
          { method: "POST", body: JSON.stringify(body) }
        );
      } else {
        throw err;
      }
    }
    all.push(...data.results);
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);
  return all;
}

async function fetchPageBlocks(
  token: string,
  pageId: string
): Promise<NotionBlock[]> {
  const all: NotionBlock[] = [];
  let cursor: string | undefined;
  do {
    const query = cursor
      ? `?start_cursor=${encodeURIComponent(cursor)}&page_size=100`
      : "?page_size=100";
    const data = await notionFetch<BlockChildrenResponse>(
      token,
      `/blocks/${pageId}/children${query}`
    );
    all.push(...data.results);
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined;
  } while (cursor);
  return all;
}

export async function fetchTasksFromSource(
  token: string,
  source: NotionTaskSource
): Promise<NotionTask[]> {
  if (source.type === "database") {
    const rows = await fetchDatabaseRows(token, source.id);
    return rows.map(extractTaskFromRow);
  }
  const blocks = await fetchPageBlocks(token, source.id);
  return blocks
    .map(extractTaskFromBlock)
    .filter((t): t is NotionTask => t !== null);
}

type CandidateEvaluation = {
  candidate: NotionSource;
  finalScore: number;
};

export async function discoverBestSource(
  token: string
): Promise<DiscoverResult | null> {
  const searchData = await notionFetch<{ results: SearchResultItem[] }>(
    token,
    "/search",
    {
      method: "POST",
      body: JSON.stringify({
        sort: { direction: "descending", timestamp: "last_edited_time" },
        page_size: CANDIDATE_LIMIT * 2,
      }),
    }
  );

  const rawResults = searchData.results;
  console.log(
    `[Notion] search returned ${rawResults.length} results:`,
    rawResults.map((r: SearchResultItem) => `${r.object} "${extractTitle(r)}"`).join(', ')
  );

  const candidates = rawResults
    .map(toSearchCandidate)
    .filter((c): c is NotionSource => c !== null)
    .slice(0, CANDIDATE_LIMIT);

  if (candidates.length === 0) {
    console.log('[Notion] no valid candidates found in search results');
    return null;
  }

  console.log(
    `[Notion] evaluating ${candidates.length} candidates:`,
    candidates.map((c) => `"${c.title}" (${c.type})`).join(', ')
  );

  const evaluated: CandidateEvaluation[] = [];

  for (const candidate of candidates) {
    try {
      const samples = await sampleCandidate(token, candidate);
      const breakdown = scoreSource(candidate, samples);
      console.log(
        `[Notion] candidate "${candidate.title}" score=${breakdown.finalScore.toFixed(2)} ` +
        `toDo=${breakdown.toDoCount} rows=${breakdown.pageOrRowCount} ` +
        `titleScore=${breakdown.titleScore} checkable=${breakdown.hasCheckableBlocks} excluded=${breakdown.excluded}`
      );
      evaluated.push({ candidate, finalScore: breakdown.finalScore });
    } catch (err) {
      console.warn(
        `[Notion] sample failed for "${candidate.title}" (${candidate.id}):`,
        err instanceof Error ? err.message : err
      );
    }
  }

  if (evaluated.length === 0) {
    console.log('[Notion] all candidates failed evaluation');
    return null;
  }

  const firstDatabase = evaluated.find((e) => e.candidate.type === "database");
  if (firstDatabase) {
    const winner = firstDatabase;
    console.log(
      `[Notion] hardcoded first database winner "${winner.candidate.title}" (score=${winner.finalScore.toFixed(2)}, ignoring all page candidates)`
    );
    const tasks = await fetchTasksFromSource(token, {
      id: winner.candidate.id,
      type: winner.candidate.type,
      title: winner.candidate.title,
      taskCount: 0,
    });
    console.log(
      `[Notion] selected source "${winner.candidate.title}" (${winner.candidate.type}) tasks=${tasks.length}`
    );
    return {
      source: {
        id: winner.candidate.id,
        type: winner.candidate.type,
        title: winner.candidate.title,
        taskCount: tasks.length,
      },
      tasks,
      score: winner.finalScore,
    };
  }

  evaluated.sort((a, b) => b.finalScore - a.finalScore);
  const winner = evaluated[0];
  if (!winner || winner.finalScore < MIN_ACCEPTABLE_SCORE) {
    console.log(
      `[Notion] no database found and top candidate "${winner?.candidate.title}" score=${winner?.finalScore} below minimum ${MIN_ACCEPTABLE_SCORE}`
    );
    return null;
  }

  const tasks = await fetchTasksFromSource(token, {
    id: winner.candidate.id,
    type: winner.candidate.type,
    title: winner.candidate.title,
    taskCount: 0,
  });

  console.log(
    `[Notion] selected source "${winner.candidate.title}" (${winner.candidate.type}) score=${winner.finalScore.toFixed(2)} tasks=${tasks.length}`
  );

  return {
    source: {
      id: winner.candidate.id,
      type: winner.candidate.type,
      title: winner.candidate.title,
      taskCount: tasks.length,
    },
    tasks,
    score: winner.finalScore,
  };
}

export async function diagnoseSearch(
  token: string
): Promise<{
  rawResults: Array<{ object: string; id: string; title: string }>;
  evaluations: Array<{
    title: string;
    type: string;
    score: number;
    reason?: string;
  }>;
}> {
  const searchData = await notionFetch<{ results: SearchResultItem[] }>(
    token,
    "/search",
    {
      method: "POST",
      body: JSON.stringify({
        sort: { direction: "descending", timestamp: "last_edited_time" },
        page_size: CANDIDATE_LIMIT * 2,
      }),
    }
  );

  const rawResults = searchData.results.map((r) => ({
    object: r.object,
    id: r.id,
    title: extractTitle(r),
  }));

  const candidates = rawResults
    .map((_, idx) =>
      toSearchCandidate(searchData.results[idx])
    )
    .filter((c): c is NotionSource => c !== null)
    .slice(0, CANDIDATE_LIMIT);

  const evaluations: Array<{
    title: string;
    type: string;
    score: number;
    reason?: string;
  }> = [];

  for (const candidate of candidates) {
    try {
      const samples = await sampleCandidate(token, candidate);
      const breakdown = scoreSource(candidate, samples);
      evaluations.push({
        title: candidate.title,
        type: candidate.type,
        score: breakdown.finalScore,
        reason: breakdown.excluded
          ? "excluded (no to-do, no checkable, <3 rows)"
          : undefined,
      });
    } catch (err) {
      evaluations.push({
        title: candidate.title,
        type: candidate.type,
        score: 0,
        reason: `sample failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return { rawResults, evaluations };
}

export const __concurrencyLimit = CONCURRENCY;