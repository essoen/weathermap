/**
 * Execute async tasks in batches with concurrency control and pauses.
 * Individual task failures are caught and returned as { error } objects.
 */
export async function batchFetch(tasks, { concurrency = 5, pauseMs = 200 } = {}) {
  const results = [];

  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (task) => {
        try {
          return { data: await task() };
        } catch (err) {
          return { error: err.message };
        }
      }),
    );
    results.push(...batchResults);

    // Pause between batches (but not after the last one)
    if (i + concurrency < tasks.length) {
      await new Promise((r) => setTimeout(r, pauseMs));
    }
  }

  return results;
}
