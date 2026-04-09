import { onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { getDateRange } from "../utils/date";

export function buildUserDateQuery(
  collectionRef,
  { userId, filter, customStartDate, customEndDate },
) {
  const constraints = [where("userId", "==", userId)];
  const { startAt, endBefore } = getDateRange(
    filter,
    customStartDate,
    customEndDate,
  );

  if (startAt) {
    constraints.push(where("date", ">=", startAt));
  }

  if (endBefore) {
    constraints.push(where("date", "<", endBefore));
  }

  constraints.push(orderBy("date", "desc"));

  return query(collectionRef, ...constraints);
}

export function mapFirestoreDoc(entry) {
  return {
    id: entry.id,
    ...entry.data(),
  };
}

export function withCreateAuditFields(data) {
  return {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function withUpdateAuditFields(data) {
  return {
    ...data,
    updatedAt: serverTimestamp(),
  };
}

export function subscribeToCollection(queryRef, onData, onError, logContext) {
  return onSnapshot(
    queryRef,
    (snapshot) => {
      onData(snapshot.docs.map(mapFirestoreDoc));
    },
    (error) => {
      console.error(logContext, error);
      onError(error);
    },
  );
}
