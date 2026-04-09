import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { parseDateInput } from "../utils/date";
import { toNumberOrZero, toTrimmedString } from "../utils/normalize";
import {
  buildUserDateQuery,
  subscribeToCollection,
  withCreateAuditFields,
  withUpdateAuditFields,
} from "./firestoreUtils";

const transactionsCollection = collection(db, "transactions");
const useLogsCollection = collection(db, "useLogs");

function normalizeStoredType(type) {
  if (type === "send" || type === "expense") {
    return "expense";
  }

  return "income";
}

function buildLegacyDescription(payload) {
  const note = toTrimmedString(payload.note);

  if (note) {
    return note;
  }

  return "";
}

function normalizeTransactionPayload(payload) {
  return {
    ...payload,
    amount: toNumberOrZero(payload.amount),
    commission: toNumberOrZero(payload.commission),
    sender: toTrimmedString(payload.sender),
    receiver: toTrimmedString(payload.receiver),
    note: toTrimmedString(payload.note),
    description: buildLegacyDescription(payload),
    type: normalizeStoredType(payload.type),
    date: Timestamp.fromDate(parseDateInput(payload.date)),
  };
}

export function getTransactionErrorMessage(error) {
  if (error?.code === "failed-precondition") {
    return "This query needs a Firestore composite index. Create it, then reload.";
  }

  if (error?.code === "permission-denied") {
    return "Firestore denied access. Check your auth state and security rules.";
  }

  return "Failed to load transactions.";
}

export function getTransactionMutationErrorMessage(error, action = "save") {
  if (error?.code === "permission-denied") {
    return "Firestore denied this request. Please sync and deploy the latest security rules.";
  }

  if (error?.code === "unauthenticated") {
    return "You must be signed in before updating transactions.";
  }

  if (error?.code === "invalid-argument") {
    return "One or more transaction values are invalid.";
  }

  return `Unable to ${action} the transaction. Please try again.`;
}

export function subscribeToTransactions(options, onData, onError) {
  return subscribeToCollection(
    buildUserDateQuery(transactionsCollection, options),
    onData,
    onError,
    {
      message: "Firestore transactions query failed:",
      filter: options.filter,
      customStartDate: options.customStartDate,
      customEndDate: options.customEndDate,
    },
  );
}

export function createTransaction(payload) {
  return addDoc(
    transactionsCollection,
    withCreateAuditFields(normalizeTransactionPayload(payload)),
  );
}

export function editTransaction(transactionId, payload) {
  return updateDoc(
    doc(db, "transactions", transactionId),
    withUpdateAuditFields(normalizeTransactionPayload(payload)),
  );
}

async function findLinkedUseLog(transaction) {
  if (transaction.useLogId) {
    return doc(db, "useLogs", transaction.useLogId);
  }

  const useLogType = transaction.type === "income" ? "in" : "out";

  const matchingUseLogsQuery = query(
    useLogsCollection,
    where("userId", "==", transaction.userId),
    where("type", "==", useLogType),
    where("amount", "==", toNumberOrZero(transaction.amount)),
    where("date", "==", transaction.date),
  );
  const snapshot = await getDocs(matchingUseLogsQuery);

  const exactMatch = snapshot.docs.find((entry) => {
    const data = entry.data();
    return toTrimmedString(data.note) === toTrimmedString(transaction.note);
  });

  return exactMatch?.ref ?? snapshot.docs[0]?.ref ?? null;
}

export async function removeTransaction(transactionId) {
  const transactionRef = doc(db, "transactions", transactionId);
  const transactionSnapshot = await getDoc(transactionRef);

  if (!transactionSnapshot.exists()) {
    return;
  }

  const transaction = transactionSnapshot.data();
  const batch = writeBatch(db);

  batch.delete(transactionRef);

  if (transaction.source === "useLog") {
    const linkedUseLogRef = await findLinkedUseLog(transaction);

    if (linkedUseLogRef) {
      batch.delete(linkedUseLogRef);
    }
  }

  await batch.commit();
}
