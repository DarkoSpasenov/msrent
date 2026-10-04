const STEPS = [
  { title: "Choisissez votre voiture", text: "Consultez nos véhicules et choisissez celui qui correspond à vos besoins." },
  { title: "Envoyez votre demande", text: "Sélectionnez vos dates et contactez-nous directement via WhatsApp." },
  { title: "Récupérez votre voiture", text: "Nous confirmons votre réservation et vous récupérez votre véhicule." },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="border-y border-line bg-surface py-16 sm:py-24" aria-labelledby="titre-etapes">
      <div className="container-x">
        <p className="eyebrow">Comment ça marche</p>
        <h2 id="titre-etapes" className="mt-3 max-w-xl text-3xl font-bold sm:text-4xl">
          Réservez en trois étapes, sans compte ni paiement en ligne.
        </h2>
        <ol className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-[var(--radius-card)] border border-line bg-paper p-6 sm:p-7">
              <span className="font-display text-5xl font-extrabold text-ink/10" aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">
                <span className="sr-only">Étape {i + 1} : </span>
                {s.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
