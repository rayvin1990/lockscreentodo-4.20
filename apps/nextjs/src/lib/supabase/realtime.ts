import { useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase as supabaseClient } from "@saasfly/db/supabase";

// Generic hook for real-time subscriptions
export function useSupabaseSubscription<T>(
  tableName: string,
  filter?: string,
  initialData?: T[]
) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      setLoading(true);

      try {
        // Initial fetch
        const { data: initialData, error } = await supabaseClient
          .from(tableName)
          .select('*')
          .maybe();

        if (error) throw error;
        if (initialData) setData(initialData);

        // Set up real-time subscription
        channel = supabaseClient
          .channel(`${tableName}_changes`)
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: tableName,
              filter: filter,
            },
            (payload) => {
              console.log('Real-time change received:', payload);

              switch (payload.eventType) {
                case 'INSERT':
                  setData((prev) => [...prev, payload.new as T]);
                  break;
                case 'UPDATE':
                  setData((prev) =>
                    prev.map((item) =>
                      (item as any).id === payload.new.id ? payload.new as T : item
                    )
                  );
                  break;
                case 'DELETE':
                  setData((prev) =>
                    prev.filter((item) => (item as any).id !== payload.old.id)
                  );
                  break;
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              setLoading(false);
            }
          });
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [tableName, filter]);

  return { data, error, loading };
}

// Hook for syncing tasks from Prisma to Supabase
export function useTaskSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncTasksToSupabase = async (tasks: any[], userId: string) => {
    setIsSyncing(true);

    try {
      // Filter out empty tasks and deduplicate by task.id
      const validTasks = tasks.filter(task => task.text && task.text.trim() !== '');
      const uniqueTasks = Array.from(
        new Map(validTasks.map(task => [task.id, task])).values()
      );

      // Get current task IDs from this user
      const currentTaskIds = uniqueTasks.map(task => task.id);

      // Delete tasks that are no longer in the list
      if (currentTaskIds.length > 0) {
        const { error: deleteError } = await supabaseClient
          .from('tasks')
          .delete()
          .eq('user_id', userId)
          .not('notion_task_id', `in.(${currentTaskIds.join(',')})`);

        if (deleteError) {
          console.error('❌ Failed to delete removed tasks:', deleteError);
          // Don't throw here, continue with upsert
        }
      } else {
        // If no tasks, delete all tasks for this user
        const { error: deleteAllError } = await supabaseClient
          .from('tasks')
          .delete()
          .eq('user_id', userId);

        if (deleteAllError) {
          console.error('❌ Failed to delete all tasks:', deleteAllError);
        }
        console.log('ℹ️ No tasks to sync');
        return { success: true };
      }

      // Use upsert to avoid conflicts
      // upsert will update if the task exists (by notion_task_id) or insert if it doesn't
      const tasksToSync = uniqueTasks.map(task => ({
        user_id: userId,
        text: task.text,
        completed: task.isCompleted || false,
        notion_task_id: task.id,
      }));

      const { error } = await supabaseClient
        .from('tasks')
        .upsert(tasksToSync, {
          onConflict: 'notion_task_id',
          ignoreDuplicates: false,
        });

      if (error) throw error;

      // Update sync status
      await supabaseClient
        .from('user_sync_status')
        .upsert({
          user_id: userId,
          notion_connected: true,
          last_sync_at: new Date().toISOString(),
        });

      setLastSync(new Date());
      console.log('✅ Synced tasks to Supabase:', tasksToSync.length);
      return { success: true };
    } catch (error) {
      console.error('❌ Sync error:', error);
      return { success: false, error };
    } finally {
      setIsSyncing(false);
    }
  };

  return { isSyncing, syncTasksToSupabase, lastSync };
}
