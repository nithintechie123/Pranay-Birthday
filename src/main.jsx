import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Camera,
  Gift,
  Heart,
  Music2,
  Pause,
  Rotate3D,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react';
import './styles.css';

const friendName = 'Pranay';
const photoPath = 'https://res.cloudinary.com/kzrqz50e/image/upload/v1783195424/IMG_20260705_012657_bl6h3z.jpg';

const birthdaySong = [
  { frequency: 392, duration: 0.28 },
  { frequency: 392, duration: 0.22 },
  { frequency: 440, duration: 0.48 },
  { frequency: 392, duration: 0.48 },
  { frequency: 523.25, duration: 0.48 },
  { frequency: 493.88, duration: 0.9 },
  { frequency: null, duration: 0.18 },
  { frequency: 392, duration: 0.28 },
  { frequency: 392, duration: 0.22 },
  { frequency: 440, duration: 0.48 },
  { frequency: 392, duration: 0.48 },
  { frequency: 587.33, duration: 0.48 },
  { frequency: 523.25, duration: 0.9 },
  { frequency: null, duration: 0.18 },
  { frequency: 392, duration: 0.28 },
  { frequency: 392, duration: 0.22 },
  { frequency: 783.99, duration: 0.48 },
  { frequency: 659.25, duration: 0.48 },
  { frequency: 523.25, duration: 0.48 },
  { frequency: 493.88, duration: 0.48 },
  { frequency: 440, duration: 0.9 },
  { frequency: null, duration: 0.18 },
  { frequency: 698.46, duration: 0.28 },
  { frequency: 698.46, duration: 0.22 },
  { frequency: 659.25, duration: 0.48 },
  { frequency: 523.25, duration: 0.48 },
  { frequency: 587.33, duration: 0.48 },
  { frequency: 523.25, duration: 1.1 },
  { frequency: null, duration: 0.6 },
];

function playTone(audioContext, destination, frequency, duration) {
  if (!frequency) {
    return;
  }

  const startAt = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const noteGain = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, startAt);
  noteGain.gain.setValueAtTime(0.0001, startAt);
  noteGain.gain.exponentialRampToValueAtTime(0.85, startAt + 0.025);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startAt + Math.max(duration - 0.04, 0.05));

  oscillator.connect(noteGain);
  noteGain.connect(destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            '--x': `${(index * 31) % 100}%`,
            '--delay': `${(index % 9) * 0.42}s`,
            '--duration': `${6 + (index % 7) * 0.4}s`,
            '--hue': `${(index * 47) % 360}`,
          }}
        />
      ))}
    </div>
  );
}

function CelebrationDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {['#ff7aa2', '#ffdf80', '#7dd3fc', '#c4f080'].map((color, index) => (
        <span
          key={color}
          className="balloon"
          style={{
            '--balloon-color': color,
            '--balloon-left': `${8 + index * 27}%`,
            '--balloon-delay': `${index * 1.35}s`,
            '--balloon-size': `${54 + index * 8}px`,
          }}
        />
      ))}
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="spark-dot"
          style={{
            '--spark-left': `${(index * 37) % 100}%`,
            '--spark-top': `${12 + ((index * 29) % 72)}%`,
            '--spark-delay': `${index * 0.24}s`,
          }}
        />
      ))}
    </div>
  );
}

function MusicPlayer() {
  const audioContextRef = React.useRef(null);
  const masterGainRef = React.useRef(null);
  const nextNoteTimerRef = React.useRef(null);
  const noteIndexRef = React.useRef(0);
  const isPlayingRef = React.useRef(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = React.useState(false);

  const stopMusic = React.useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    if (nextNoteTimerRef.current) {
      window.clearTimeout(nextNoteTimerRef.current);
      nextNoteTimerRef.current = null;
    }
  }, []);

  const scheduleNextNote = React.useCallback(() => {
    if (!isPlayingRef.current || !audioContextRef.current || !masterGainRef.current) {
      return;
    }

    const note = birthdaySong[noteIndexRef.current];
    playTone(audioContextRef.current, masterGainRef.current, note.frequency, note.duration);
    noteIndexRef.current = (noteIndexRef.current + 1) % birthdaySong.length;
    nextNoteTimerRef.current = window.setTimeout(scheduleNextNote, note.duration * 1000);
  }, []);

  const startMusic = React.useCallback(async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      setAutoplayBlocked(true);
      return;
    }

    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      const masterGain = audioContext.createGain();
      const delay = audioContext.createDelay();
      const feedback = audioContext.createGain();

      masterGain.gain.value = 0.18;
      delay.delayTime.value = 0.16;
      feedback.gain.value = 0.18;

      masterGain.connect(audioContext.destination);
      masterGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      masterGainRef.current = masterGain;
    }

    try {
      await audioContextRef.current.resume();
      setAutoplayBlocked(false);
      setIsPlaying(true);
      isPlayingRef.current = true;

      if (!nextNoteTimerRef.current) {
        scheduleNextNote();
      }
    } catch {
      stopMusic();
      setAutoplayBlocked(true);
    }
  }, [scheduleNextNote, stopMusic]);

  React.useEffect(() => {
    const timer = window.setTimeout(startMusic, 350);
    const unlockMusic = () => startMusic();

    window.addEventListener('pointerdown', unlockMusic, { once: true });
    window.addEventListener('keydown', unlockMusic, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', unlockMusic);
      window.removeEventListener('keydown', unlockMusic);
      stopMusic();

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [startMusic, stopMusic]);

  const toggleAudio = async () => {
    if (isPlaying) {
      stopMusic();
      return;
    }

    await startMusic();
  };

  return (
    <div className="music-player inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-3 py-2 text-white backdrop-blur">
      <button
        type="button"
        onClick={toggleAudio}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ffdf80] text-[#251933] shadow-lg shadow-[#ffdf80]/25 transition hover:scale-105"
        aria-label={isPlaying ? 'Pause birthday music' : 'Play birthday music'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button>
      <span className="pr-2 text-sm font-semibold text-white/82">
        {isPlaying ? 'Birthday song playing' : autoplayBlocked ? 'Tap to Start Music' : 'Starting song'}
      </span>
    </div>
  );
}

function PhotoFrame() {
  const [hasPhoto, setHasPhoto] = React.useState(true);
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <button
      type="button"
      className={`photo-flip group relative mx-auto block w-full max-w-[360px] animate-float text-left outline-none ${
        isFlipped ? 'is-flipped' : ''
      }`}
      onClick={() => setIsFlipped((current) => !current)}
      aria-label="Flip birthday photo card"
      aria-pressed={isFlipped}
    >
      <div className="spin-glow absolute -inset-5 rounded-[2rem] bg-[conic-gradient(from_120deg,#ffdf80,#ff7aa2,#7dd3fc,#c4f080,#ffdf80)] opacity-80 blur-2xl" />
      <div className="photo-flip-inner relative aspect-[4/5] rounded-[1.75rem]">
        <div className="photo-face photo-front absolute inset-0 overflow-hidden rounded-[1.75rem] border border-white/35 bg-white/15 p-3 shadow-glow backdrop-blur">
          <div className="relative h-full overflow-hidden rounded-[1.25rem] bg-[#231b38]">
            {hasPhoto ? (
              <img
                src={photoPath}
                alt={`${friendName}'s birthday photo`}
                onError={() => setHasPhoto(false)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-white">
                <Camera className="h-14 w-14 text-[#ffdf80]" strokeWidth={1.6} />
                <div>
                  <p className="font-display text-3xl">Add a photo</p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Put your image in the public folder as friend-photo.jpg.
                  </p>
                </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/58 to-transparent p-5">
              <p className="photo-label text-sm font-bold uppercase tracking-[0.28em] text-[#ffdf80]">
                Birthday Star
              </p>
              <p className="photo-name font-display text-4xl text-white">{friendName}</p>
            </div>
          </div>
        </div>

        <div className="photo-face photo-back absolute inset-0 overflow-hidden rounded-[1.75rem] border border-white/35 bg-[#24183d] p-3 shadow-glow backdrop-blur">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.25rem] bg-[radial-gradient(circle_at_22%_20%,rgba(255,223,128,.28),transparent_34%),linear-gradient(145deg,#39255f,#12374c)] p-7 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-[#ffdf80]" />
            <div>
              <p className="font-display text-4xl leading-tight text-white">Keep smiling, {friendName}</p>
              <p className="mt-4 text-sm leading-6 text-white/74">
                May this birthday flip into a year full of surprises, joy, and memories
                that stay bright for a long time.
              </p>
            </div>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/82">
              <Rotate3D className="h-4 w-4 text-[#ffdf80]" />
              Tap to flip back
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/22 bg-black/22 text-white/86 backdrop-blur transition group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-[#ffdf80]">
        <Rotate3D className="h-5 w-5" />
      </div>
    </button>
  );
}

function WishCard({ icon: Icon, title, text, delay = '0ms' }) {
  return (
    <article
      className="wish-card rounded-lg border border-white/16 bg-white/[0.08] p-5 shadow-2xl shadow-black/10 backdrop-blur"
      style={{ '--card-delay': delay }}
    >
      <div className="wish-icon mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/12 text-[#ffdf80]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-2xl text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">{text}</p>
    </article>
  );
}

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#140f24] text-white">
      <Confetti />
      <CelebrationDecor />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,215,128,.22),transparent_26%),radial-gradient(circle_at_86%_20%,rgba(125,211,252,.20),transparent_28%),linear-gradient(135deg,#140f24_0%,#2c1748_48%,#0f2d40_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <section className="relative z-20 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
        <div className="animate-pop">
          <div className="badge-pulse mb-7 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/82 backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#ffdf80]" />
            A little celebration made with a lot of heart
          </div>

          <h1 className="hero-title max-w-3xl font-display text-6xl leading-[0.95] text-white sm:text-7xl lg:text-8xl">
            Happy Birthday, <span className="text-[#ffdf80]">{friendName}</span>!
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/76">
            Wishing you a day filled with loud laughter, unexpected surprises, and every
            little thing that makes you feel celebrated. May this year bring bright
            moments, brave choices, and stories worth remembering.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#wishes"
              className="shine-button group inline-flex items-center gap-2 rounded-full bg-[#ffdf80] px-5 py-3 font-semibold text-[#251933] shadow-lg shadow-[#ffdf80]/25 transition hover:-translate-y-1 hover:bg-white"
            >
              <Gift className="h-5 w-5" />
              Open Wishes
            </a>
            <a
              href="#memory"
              className="pulse-button inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/9 px-5 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-white/16"
            >
              <Heart className="h-5 w-5 text-[#ff7aa2]" />
              See Memory
            </a>
          </div>

          <div className="mt-6">
            <MusicPlayer />
          </div>
        </div>

        <PhotoFrame />
      </section>

      <section id="wishes" className="relative z-20 mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          <WishCard
            icon={Star}
            title="Shine Brighter"
            text="May the year ahead keep giving you reasons to smile and chances to become even more yourself."
            delay="0ms"
          />
          <WishCard
            icon={Music2}
            title="Good Vibes"
            text="May your days carry the kind of energy that turns ordinary plans into favorite memories."
            delay="140ms"
          />
          <WishCard
            icon={Gift}
            title="Big Wins"
            text="May every goal you chase meet you halfway with luck, courage, and a perfect bit of timing."
            delay="280ms"
          />
        </div>
      </section>

      <section id="memory" className="relative z-20 mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="memory-panel overflow-hidden rounded-lg border border-white/16 bg-white/[0.08] p-6 backdrop-blur md:p-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/10 to-transparent" />
            <p className="font-display text-3xl leading-tight text-white sm:text-4xl">
              Here&apos;s to more celebrations, more inside jokes, more late-night plans,
              and many more years of friendship. Have the happiest birthday, {friendName}.
            </p>
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/12">
              <div className="h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-[#ffdf80] to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
