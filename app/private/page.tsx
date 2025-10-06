import { createClient } from "@/utils/supabase/client";

export default async function PrivatePage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <p className="flex min-h-screen flex-col items-center justify-between p-24">
      Private Page - {data?.user?.user_metadata?.username}
    </p>
  );
}
