import {
  collection,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { formatDateInput, parseDateInput } from "../utils/date";
import { toNumberOrZero, toTrimmedString } from "../utils/normalize";
import {
  buildUserDateQuery,
  subscribeToCollection,
  withCreateAuditFields,
} from "./firestoreUtils";

const useLogsCollection = collection(db, "useLogs");

function normalizeUseLogType(type) {
  return type === "out" ? "out" : "in";
}

function normalizeUseLogLocation(location) {
  return location === "yangon" ? "yangon" : "sittwe";
}

function normalizeUseLogPayload(payload) {
  const normalizedDate = payload.date || formatDateInput(new Date());

  return {
    ...payload,
    amount: toNumberOrZero(payload.amount),
    type: normalizeUseLogType(payload.type),
    location: normalizeUseLogLocation(payload.location),
    note: toTrimmedString(payload.note),
    date: Timestamp.fromDate(parseDateInput(normalizedDate)),
  };
}

export function getUseLogsErrorMessage(error) {
  if (error?.code === "failed-precondition") {
    return "This use logs query needs a Firestore composite index. Create it, then reload.";
  }

  if (error?.code === "permission-denied") {
    return "Firestore denied access to use logs. Check your auth state and security rules.";
  }

  return "Failed to load use logs.";
}

export function getUseLogMutationErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firestore denied this request. Please sync and deploy the latest security rules.";
  }

  if (error?.code === "unauthenticated") {
    return "You must be signed in before saving use logs.";
  }

  if (error?.code === "invalid-argument") {
    return "One or more use log values are invalid.";
  }

  return "Unable to save the use log. Please try again.";
}

export function subscribeToUseLogs(options, onData, onError) {
  return subscribeToCollection(
    buildUserDateQuery(useLogsCollection, options),
    onData,
    onError,
    {
      message: "Firestore use logs query failed:",
      filter: options.filter,
      customStartDate: options.customStartDate,
      customEndDate: options.customEndDate,
    },
  );
}

export async function createUseLog(payload) {
  const normalizedPayload = normalizeUseLogPayload(payload);
  const batch = writeBatch(db);
  const useLogRef = doc(useLogsCollection);
  const transactionRef = doc(collection(db, "transactions"));
  const transactionType =
    normalizedPayload.type === "out" ? "expense" : "income";

  batch.set(transactionRef, withCreateAuditFields({
    userId: normalizedPayload.userId,
    amount: normalizedPayload.amount,
    commission: 0,
    sender: "",
    receiver: "",
    note: normalizedPayload.note,
    description: normalizedPayload.note,
    type: transactionType,
    date: normalizedPayload.date,
    source: "useLog",
    useLogId: useLogRef.id,
  }));

  batch.set(useLogRef, withCreateAuditFields({
    ...normalizedPayload,
    transactionId: transactionRef.id,
  }));

  await batch.commit();
}
