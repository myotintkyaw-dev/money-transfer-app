import { formatCurrency } from "../utils/currency";

function TransactionMetricsCards({
  transactionAmount,
  commissionAmount,
  timesCount,
  usedAmount,
}) {
  const cards = [
    {
      title: "Commission amount",
      value: formatCurrency(commissionAmount),
    },
    {
      title: "Times count",
      value: String(timesCount),
    },
    {
      title: "Transaction amount",
      value: formatCurrency(transactionAmount),
    },
    {
      title: "Used",
      value: formatCurrency(usedAmount),
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-md border border-black/8 bg-white p-6 text-neutral-950 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
        >
          <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
          <p className="mt-4 text-2xl font-semibold text-neutral-950">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}

export default TransactionMetricsCards;
