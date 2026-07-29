import { useSignal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "@/lib/utils.ts";
import Counter from "@/islands/Counter.tsx";

export default define.page(function Home(ctx) {
  const count = useSignal(3);

  return (
    <main class="px-4 py-8 mx-auto min-h-screen font-sans">
      <Head>
        <title>Fresh counter</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        {ctx.state.sessionId && <p>{ctx.state.sessionId}</p>}
        <Counter count={count} />
      </div>
    </main>
  );
});
