import { toNumberOrZero } from "./normalize";

export function calculateSummary(transactions) {
  return transactions.reduce(
    (accumulator, transaction) => {
      const value = toNumberOrZero(transaction.amount);

      if (transaction.type === "income" || transaction.type === "receive") {
        accumulator.income += value;
      } else {
        accumulator.expense += value;
      }

      return accumulator;
    },
    { income: 0, expense: 0 },
  );
}

export function calculateTransactionMetrics(transactions) {
  return transactions.reduce(
    (accumulator, transaction) => ({
      transactionAmount:
        accumulator.transactionAmount + toNumberOrZero(transaction.amount),
      commissionAmount:
        accumulator.commissionAmount + toNumberOrZero(transaction.commission),
      timesCount: accumulator.timesCount + 1,
    }),
    { transactionAmount: 0, commissionAmount: 0, timesCount: 0 },
  );
}

export function calculateUsedAmount(useLogs) {
  return useLogs.reduce((total, useLog) => {
    const value = toNumberOrZero(useLog.amount);
    return useLog.type === "out" ? total + value : total - value;
  }, 0);
}

export function calculateInitialAmountSummary(initialAmounts) {
  const currentInitialAmount = initialAmounts[0];

  if (!currentInitialAmount) {
    return { sittweAmount: 0, yangonAmount: 0, initialAmount: 0 };
  }

  return {
    sittweAmount: toNumberOrZero(currentInitialAmount.sittweAmount),
    yangonAmount: toNumberOrZero(currentInitialAmount.yangonAmount),
    initialAmount: toNumberOrZero(currentInitialAmount.initialAmount),
  };
}

export function calculateBalanceSummary(initialAmounts, transactions, useLogs = []) {
  const initialSummary = calculateInitialAmountSummary(initialAmounts);
  const transactionSummary = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.source === "useLog") {
        return accumulator;
      }

      const value = toNumberOrZero(transaction.amount);

      if (transaction.type === "expense" || transaction.type === "send") {
        accumulator.yangonAmount -= value;
        accumulator.sittweAmount += value;
      } else {
        accumulator.sittweAmount -= value;
        accumulator.yangonAmount += value;
      }

      return accumulator;
    },
    {
      sittweAmount: initialSummary.sittweAmount,
      yangonAmount: initialSummary.yangonAmount,
      initialAmount: initialSummary.initialAmount,
    },
  );

  return useLogs.reduce((accumulator, useLog) => {
    const value = toNumberOrZero(useLog.amount);
    const delta = useLog.type === "in" ? value : -value;

    accumulator.initialAmount += delta;

    if (useLog.location === "yangon") {
      accumulator.yangonAmount += delta;
    } else if (useLog.location === "sittwe") {
      accumulator.sittweAmount += delta;
    }

    return accumulator;
  }, transactionSummary);
}
