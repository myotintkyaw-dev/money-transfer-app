import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { formatDateInput, parseDateInput } from "../utils/date";
import { toNumberOrZero } from "../utils/normalize";
import {
  buildUserDateQuery,
  subscribeToCollection,
  withCreateAuditFields,
  withUpdateAuditFields,
} from "./firestoreUtils";

const initialAmountsCollection = collection(db, "initialAmounts");

function normalizeInitialAmountPayload(payload) {
  const sittweAmount = toNumberOrZero(payload.sittweAmount);
  const yangonAmount = toNumberOrZero(payload.yangonAmount);
  const dateSource = payload.date || formatDateInput(new Date());

  return {
    ...payload,
    sittweAmount,
    yangonAmount,
    initialAmount: sittweAmount + yangonAmount,
    date: Timestamp.fromDate(parseDateInput(dateSource)),
  };
}

export function getInitialAmountsErrorMessage(error) {
  if (error?.code === "failed-precondition") {
    return "This initial amount query needs a Firestore composite index. Create it, then reload.";
  }

  if (error?.code === "permission-denied") {
    return "Firestore denied access to initial amounts. Check your auth state and security rules.";
  }

  return "Failed to load initial amounts.";
}

export function getInitialAmountMutationErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firestore denied this request. Please sync and deploy the latest security rules.";
  }

  if (error?.code === "unauthenticated") {
    return "You must be signed in before saving initial amounts.";
  }

  if (error?.code === "invalid-argument") {
    return "One or more initial amount values are invalid.";
  }

  return "Unable to save the initial amount. Please try again.";
}

export function subscribeToInitialAmounts(options, onData, onError) {
  return subscribeToCollection(
    buildUserDateQuery(initialAmountsCollection, options),
    onData,
    onError,
    {
      message: "Firestore initial amounts query failed:",
      filter: options.filter,
      customStartDate: options.customStartDate,
      customEndDate: options.customEndDate,
    },
  );
}

export function createInitialAmount(payload) {
  return addDoc(
    initialAmountsCollection,
    withCreateAuditFields(normalizeInitialAmountPayload(payload)),
  );
}

export function editInitialAmount(initialAmountId, payload) {
  return updateDoc(
    doc(db, "initialAmounts", initialAmountId),
    withUpdateAuditFields(normalizeInitialAmountPayload(payload)),
  );
}
