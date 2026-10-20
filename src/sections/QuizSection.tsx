import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/SectionHeading';
import { quizQuestions, quizResults, initialWeights } from '@/data/quiz';
import { scrollToId } from '@/hooks/useLenis';

type Phase = 'intro' | 'playing' | 'result';

/**
 * Квиз «Какой ты герой аниме?»: десять вопросов, взвешенные ответы,
 * итог — архетип с рекомендациями.
 */
export function QuizSection() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [weights, setWeights] = useState<Record<string, number>>(initialWeights);
  const [picked, setPicked] = useState<number | null>(null);

  const winner = useMemo(() => {
    let best = 'герой';
    let bestVal = -1;
    for (const [k, v] of Object.entries(weights)) {
      if (v > bestVal) {
        bestVal = v;
        best = k;
      }
    }
    return quizResults[best];
  }, [weights]);

  const start = () => {
    setPhase('playing');
    setCurrent(0);
    setWeights(initialWeights());
    setPicked(null);
  };

  const answer = (ai: number) => {
    if (picked !== null) return;
    setPicked(ai);
    const w = { ...weights };
    const weightsMap = quizQuestions[current].answers[ai].weights;
    for (const [k, v] of Object.entries(weightsMap)) w[k] = (w[k] ?? 0) + v;
    setWeights(w);
    window.setTimeout(() => {
      setPicked(null);
      if (current + 1 >= quizQuestions.length) {
        setPhase('result');
      } else {
        setCurrent((c) => c + 1);
      }
    }, 420);
  };

  const q = quizQuestions[current];

  return (
    <section id="quiz" className="relative overflow-hidden bg-[#08080b] py-28 md:py-36" aria-label="Квиз">
      {/* Фоновый арт */}
      <img
        src="/anime/assets/hero-city.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
      />

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
        <SectionHeading
          index="08"
          jp="試験"
          title="Квиз героя"
          lead="Десять вопросов о том, как вы живёте, — и мы скажем, каким архетипом вас бы нарисовали. Без правильных ответов, только веса характера."
          accent="volt"
        />

        <div className="border border-white/15 bg-[#07070a]/90 backdrop-blur-sm">
          {/* Прогресс */}
          {phase !== 'intro' && (
            <div className="border-b border-white/10">
              <div
                className="h-[3px] bg-gradient-to-r from-neon to-volt transition-all duration-500"
                style={{
                  width: `${phase === 'result' ? 100 : (current / quizQuestions.length) * 100}%`,
                }}
                aria-hidden="true"
              />
            </div>
          )}

          {phase === 'intro' && (
            <div className="p-8 text-center md:p-14">
              <p className="font-jp text-lg tracking-[0.5em] text-neutral-500">冒険の始まり</p>
              <h3 className="font-display mt-4 text-4xl font-light text-white md:text-5xl">
                Какой ты герой аниме?
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
                Шесть архетипов ждут своего портрета. Отвечайте интуитивно — герой внутри уже
                знает ответы.
              </p>
              <button
                onClick={start}
                className="group relative mt-8 overflow-hidden border border-white/30 px-12 py-4 text-[12px] uppercase tracking-[0.3em] text-white transition-colors hover:text-[#060608]"
              >
                <span className="absolute inset-0 -translate-x-full bg-neon transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative">Начать квиз</span>
              </button>
            </div>
          )}

          {phase === 'playing' && q && (
            <div className="p-8 md:p-12" key={q.id}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                  Вопрос {current + 1} / {quizQuestions.length}
                </span>
                <span className="font-jp text-xs tracking-[0.4em] text-neutral-600">
                  質問
                </span>
              </div>
              <h3 className="font-display mt-4 text-3xl font-light leading-tight text-white md:text-4xl">
                {q.question}
              </h3>
              <p className="mt-2 text-sm italic text-neutral-500">{q.hint}</p>

              <div className="mt-8 grid gap-3 md:grid-cols-2" role="group" aria-label="Варианты ответа">
                {q.answers.map((a, ai) => (
                  <button
                    key={ai}
                    onClick={() => answer(ai)}
                    aria-pressed={picked === ai}
                    className={`border p-5 text-left text-sm leading-relaxed transition-all duration-200 ${
                      picked === ai
                        ? 'border-volt bg-volt/10 text-white'
                        : picked !== null
                          ? 'border-white/10 text-neutral-500'
                          : 'border-white/15 text-neutral-200 hover:border-white/50 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="font-display mr-3 text-lg text-volt" aria-hidden="true">
                      {String.fromCharCode(65 + ai)}
                    </span>
                    {a.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'result' && (
            <div className="p-8 text-center md:p-14">
              <p className="font-jp text-lg tracking-[0.5em] text-volt">{winner.jp}</p>
              <h3 className="font-display mt-4 text-5xl font-light text-white md:text-6xl">
                {winner.title}
              </h3>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-300">
                {winner.description}
              </p>
              <div className="mt-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Вам подойдут:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {winner.matches.map((m) => (
                    <button
                      key={m}
                      onClick={() => scrollToId('catalog')}
                      className="border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-neon hover:text-neon"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={start}
                className="mt-10 border border-white/25 px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-neutral-300 transition-colors hover:border-white hover:text-white"
              >
                Пройти ещё раз
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
