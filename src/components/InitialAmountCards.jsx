import { formatCurrency } from "../utils/currency";

function InitialAmountCards({ sittweAmount, yangonAmount, initialAmount }) {
  const cards = [
    { title: "Sittwe amount", value: formatCurrency(sittweAmount) },
    { title: "Yangon amount", value: formatCurrency(yangonAmount) },
    { title: "Initial amount", value: formatCurrency(initialAmount) },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-md border border-black/8 bg-white p-6 text-neutral-950 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
        >
          <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
          <p className="mt-4 text-3xl font-semibold text-neutral-950">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}

export default InitialAmountCards;
