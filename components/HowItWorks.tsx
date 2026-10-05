const STEPS = [
  { title: "Choisissez une voiture" },
  { title: "Envoyez vos dates sur WhatsApp" },
  { title: "Récupérez les clés" },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-20 sm:py-24" aria-labelledby="titre-etapes">
      <div className="container-x">
        <h2 id="titre-etapes" className="text-4xl font-extrabold sm:text-5xl">
          Comment ça marche
        </h2>
        <ol className="relative mt-10 grid gap-6 md:grid-cols-3 md:gap-10">
          <span className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-line md:block" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink font-display text-2xl font-extrabold text-brand">
                {i + 1}
              </span>
              <div className="self-center">
                <h3 className="text-xl font-extrabold md:mt-2">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {s.title}
                </h3>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
