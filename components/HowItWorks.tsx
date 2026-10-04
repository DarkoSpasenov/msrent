const STEPS = [
  { title: "Choisissez votre voiture", text: "Consultez nos véhicules et choisissez celui qui correspond à vos besoins." },
  { title: "Envoyez votre demande", text: "Sélectionnez vos dates et contactez-nous directement via WhatsApp." },
  { title: "Récupérez votre voiture", text: "Nous confirmons votre réservation et vous récupérez votre véhicule." },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-20 sm:py-28" aria-labelledby="titre-etapes">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="kicker">Comment ça marche</span>
          <h2 id="titre-etapes" className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Trois étapes. Pas de compte, pas de paiement en ligne.
          </h2>
        </div>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          <span className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-line md:block" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink font-display text-2xl font-extrabold text-brand">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-extrabold md:mt-2">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-xs leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
