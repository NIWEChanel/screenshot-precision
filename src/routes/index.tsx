import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import tulips from "@/assets/tulips.jpg.asset.json";
import cat from "@/assets/cat.png.asset.json";
import photo1 from "@/assets/photo1.jpg.asset.json";
import photo2 from "@/assets/photo2.jpg.asset.json";
import songAsset from "@/assets/bloodline.mp3.asset.json";

// Change the secret code here
const SECRET_CODE = "6666";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Little Surprise For You 💕" },
      { name: "description", content: "Enter our secret code to unlock surprises made with love." },
      { property: "og:title", content: "A Little Surprise For You 💕" },
      { property: "og:description", content: "Enter our secret code to unlock surprises made with love." },
    ],
  }),
  component: Index,
});

type Screen = "lock" | "hub" | "tulips" | "playlist" | "letter";

function Index() {
  const [screen, setScreen] = useState<Screen>("lock");
  return (
    <main className="min-h-screen px-4 py-10 text-foreground">
      <div key={screen} className="animate-pop mx-auto max-w-5xl">
        {screen === "lock" && <Lock onNext={() => setScreen("hub")} />}
        {screen === "hub" && <Hub go={setScreen} />}
        {screen === "tulips" && <Tulips back={() => setScreen("hub")} />}
        {screen === "playlist" && <Playlist back={() => setScreen("hub")} />}
        {screen === "letter" && <Letter back={() => setScreen("hub")} />}
      </div>
    </main>
  );
}

function Title({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <header className="mb-8 text-center">
      <h1 className="font-display text-3xl text-primary drop-shadow-sm sm:text-5xl">🎀 {children} 🎀</h1>
      {sub && <p className="mt-3 text-lg font-semibold text-muted-foreground">{sub}</p>}
    </header>
  );
}

function PinkButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:scale-105"
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius)] border-2 border-border bg-card p-6 shadow-soft ${className}`}>{children}</div>;
}

function CirclePhoto({ src, alt, pos, size = "w-36 h-36 sm:w-44 sm:h-44", delay = 0 }: { src: string; alt: string; pos: string; size?: string; delay?: number }) {
  return (
    <div className="animate-floaty relative" style={{ animationDelay: `${delay}s` }}>
      <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary via-sky to-primary opacity-70 blur-md" />
      <div className="relative rounded-full bg-gradient-to-tr from-primary via-card to-sky p-1.5 shadow-soft">
        <img src={src} alt={alt} style={{ objectPosition: pos }} className={`${size} rounded-full border-4 border-card object-cover`} />
      </div>
      <span className="absolute -right-1 -top-1 text-3xl drop-shadow">💖</span>
      <span className="absolute -bottom-2 -left-1 text-2xl drop-shadow">🎀</span>
    </div>
  );
}

function Lock({ onNext }: { onNext: () => void }) {
  const [pin, setPin] = useState("");
  const [wrong, setWrong] = useState(false);
  const unlocked = pin === SECRET_CODE;

  const press = (d: string) => {
    if (unlocked || pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4 && next !== SECRET_CODE) {
      setWrong(true);
      setTimeout(() => { setPin(""); setWrong(false); }, 900);
    }
  };

  return (
    <>
      <Title>Enter our secret code</Title>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center gap-6">
          <CirclePhoto src={photo1.url} alt="Her" pos="50% 40%" />
          <span className="animate-floaty text-4xl text-primary">♥</span>
          <CirclePhoto src={photo2.url} alt="Him" pos="43% 45%" delay={1} />
        </div>
        <Card className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex justify-center gap-4 text-4xl">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={i < pin.length ? (wrong ? "text-destructive" : "text-primary") : "text-border"}>
                {i < pin.length ? "♥" : "♡"}
              </span>
            ))}
          </div>
          {unlocked ? (
            <div className="flex flex-col items-center gap-4">
              <span className="rounded-full bg-success px-5 py-2 font-bold text-primary-foreground">Unlocked! 💕</span>
              <PinkButton onClick={onNext}>Next ➔</PinkButton>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((k) => (
                <button
                  key={k}
                  onClick={() => (k === "C" ? setPin("") : k === "⌫" ? setPin(pin.slice(0, -1)) : press(k))}
                  className="aspect-square rounded-2xl bg-background text-2xl font-bold text-primary transition hover:scale-105 hover:bg-border active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>
          )}
          {wrong && <p className="mt-3 text-center text-sm font-semibold text-destructive">Not quite, try again 💗</p>}
        </Card>
      </div>
    </>
  );
}

function Gift({ n, onClick }: { n: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-3 transition hover:-translate-y-2">
      <div className="relative h-36 w-36 sm:h-44 sm:w-44">
        <div className="absolute inset-x-0 top-8 bottom-0 rounded-2xl bg-sky shadow-soft" />
        <div className="absolute inset-x-[-6px] top-4 h-8 rounded-xl bg-sky brightness-95 transition group-hover:-translate-y-3 group-hover:rotate-[-6deg]" />
        <div className="absolute inset-y-4 left-1/2 w-5 -translate-x-1/2 bg-primary" />
        <div className="absolute left-1/2 top-[-10px] -translate-x-1/2 text-4xl transition group-hover:-translate-y-3">🎀</div>
      </div>
      <span className="font-display text-xl text-primary">Gift {n}</span>
    </button>
  );
}

function Hub({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <Title sub="Your surprises are waiting for you">You unlocked it</Title>
      <div className="flex flex-wrap justify-center gap-10">
        <Gift n={1} onClick={() => go("tulips")} />
        <Gift n={2} onClick={() => go("playlist")} />
        <Gift n={3} onClick={() => go("letter")} />
      </div>
    </>
  );
}

const QUOTES = [
  "You make my heart bloom",
  "Life feels sweeter with you",
  "You make every moment special",
  "I choose you every day",
  "My love for you keeps growing",
  "My heart will always choose you",
];

function Tulips({ back }: { back: () => void }) {
  const left = QUOTES.slice(0, 3);
  const right = QUOTES.slice(3);
  const Bubble = ({ q, i }: { q: string; i: number }) => (
    <div className="animate-floaty rounded-3xl border-2 border-border bg-card px-4 py-3 text-center font-semibold shadow-soft" style={{ animationDelay: `${i * 0.5}s` }}>
      💗 {q}
    </div>
  );
  return (
    <>
      <Title>Your Favorite Tulips</Title>
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-5">{left.map((q, i) => <Bubble key={q} q={q} i={i} />)}</div>
        <Card className="mx-auto p-3">
          <img src={tulips.url} alt="Pink tulip bouquet" width={1024} height={1024} className="w-full max-w-sm rounded-2xl" />
          <p className="mt-2 text-center text-2xl">♥ ♥ ♥</p>
        </Card>
        <div className="flex flex-col gap-5">{right.map((q, i) => <Bubble key={q} q={q} i={i + 3} />)}</div>
      </div>
      <div className="mt-10 text-center"><PinkButton onClick={back}>Back to Surprises ↩</PinkButton></div>
    </>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Playlist({ back }: { back: () => void }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [len, setLen] = useState(35);
  const [vol, setVol] = useState(80);

  useEffect(() => { if (audio.current) audio.current.volume = vol / 100; }, [vol]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) { void a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
  };
  const restart = () => { if (audio.current) { audio.current.currentTime = 0; setT(0); } };

  return (
    <>
      <Title sub="Our song, our story 💕">Bloodline</Title>
      <audio
        ref={audio}
        src={songAsset.url}
        loop
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setLen(e.currentTarget.duration)}
      />
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Card className="mx-auto w-full max-w-xs text-center">
          <div className="mx-auto w-fit">
            <CirclePhoto src={photo1.url} alt="Her" pos="50% 40%" size="w-44 h-44" />
          </div>
          <h2 className="mt-5 font-display text-3xl text-primary">Bloodline</h2>
          <p className="text-muted-foreground">Made for us ♥</p>
          <div className="mt-4 h-2 rounded-full bg-background">
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(t / (len || 1)) * 100}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{fmt(t)}</span><span>{fmt(len)}</span></div>
          <div className="mt-3 flex items-center justify-center gap-6 text-2xl text-primary">
            <button onClick={restart} aria-label="Restart">⏮</button>
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:scale-110">
              {playing ? "❚❚" : "▶"}
            </button>
            <button onClick={restart} aria-label="Replay">🔁</button>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            🔈<input type="range" min={0} max={100} value={vol} onChange={(e) => setVol(+e.target.value)} className="w-full accent-[var(--primary)]" />🔊
          </label>
        </Card>
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <Card className="absolute inset-0 flex items-center justify-center p-8">
            <div className={`relative aspect-square w-full rounded-full bg-foreground shadow-soft ${playing ? "animate-spin-slow" : ""}`}
              style={{ backgroundImage: "repeating-radial-gradient(circle, transparent 0 6px, oklch(1 0 0 / .08) 6px 7px)" }}>
              <img src={photo2.url} alt="" style={{ objectPosition: "43% 45%" }} className="absolute left-1/2 top-1/2 h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary object-cover" />
            </div>
            <div className={`absolute right-6 top-6 h-1/2 w-2 origin-top rounded-full bg-muted-foreground transition-transform ${playing ? "rotate-[25deg]" : "rotate-0"}`} />
          </Card>
          {playing && ["♫", "♪", "♥", "♬"].map((n, i) => (
            <span key={i} className="animate-note absolute text-3xl text-primary" style={{ left: `${10 + i * 25}%`, top: "5%", animationDelay: `${i * 0.6}s` }}>{n}</span>
          ))}
        </div>
      </div>
      <div className="mt-10 text-center"><PinkButton onClick={back}>Next ➔</PinkButton></div>
    </>
  );
}

function Letter({ back }: { back: () => void }) {
  return (
    <>
      <Title>A Letter From My Heart</Title>
      <div className="lined-paper mx-auto max-w-2xl rounded-[var(--radius)] border-2 border-border px-8 py-6 font-hand text-2xl leading-[36px] shadow-soft sm:px-12">
        <p>My love,</p>
        <p>Every day with you feels like a little gift I get to unwrap again and again. You make ordinary moments feel magical, and my heart feels at home whenever you're near.</p>
        <p>Thank you for your laugh, your patience, and the way you love me exactly as I am. I'm so grateful for every memory we've made — and so excited for all the ones still waiting for us.</p>
        <p>I love you more than words could ever hold.</p>
      </div>
      <div className="mt-6 flex flex-col items-center">
        <img src={cat.url} alt="Cute cat holding a heart" width={816} height={816} loading="lazy" className="animate-floaty w-36" />
        <p className="font-display text-2xl text-primary">Always, forever. 💕</p>
      </div>
      <div className="mt-8 text-center"><PinkButton onClick={back}>Back ↩</PinkButton></div>
    </>
  );
}
