const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

initializeApp();

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

exports.createStudentUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
        "unauthenticated",
        "You must be signed in to create a student account.",
    );
  }

  const db = getFirestore();
  const callerSnapshot = await db.collection("users").doc(request.auth.uid).get();
  const callerProfile = callerSnapshot.exists ? callerSnapshot.data() : null;

  if (
    !callerProfile ||
    callerProfile.role !== "teacher" ||
    callerProfile.active === false
  ) {
    throw new HttpsError(
        "permission-denied",
        "Only an active teacher account can create students.",
    );
  }

  const data = request.data || {};
  const displayName = String(data.displayName || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const temporaryPassword = String(data.temporaryPassword || "");
  const gradeId = String(data.gradeId || "").trim();
  const avatarId = data.avatarId == null ? null : String(data.avatarId).trim() || null;

  if (!displayName) {
    throw new HttpsError("invalid-argument", "Display name is required.");
  }
  if (!isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "Enter a valid email address.");
  }
  if (temporaryPassword.length < 6) {
    throw new HttpsError(
        "invalid-argument",
        "Temporary password must contain at least 6 characters.",
    );
  }
  if (!gradeId) {
    throw new HttpsError("invalid-argument", "Grade is required.");
  }

  let userRecord;
  try {
    userRecord = await getAuth().createUser({
      email,
      password: temporaryPassword,
      displayName,
    });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      throw new HttpsError(
          "already-exists",
          "A user with this email already exists.",
      );
    }
    if (error.code === "auth/invalid-email") {
      throw new HttpsError("invalid-argument", "Enter a valid email address.");
    }
    if (error.code === "auth/invalid-password") {
      throw new HttpsError(
          "invalid-argument",
          "Temporary password does not meet Firebase requirements.",
      );
    }
    console.error("Unable to create Firebase Auth student:", error);
    throw new HttpsError(
        "internal",
        "The student account could not be created.",
    );
  }

  try {
    await db.collection("users").doc(userRecord.uid).set({
      role: "student",
      displayName,
      email: userRecord.email,
      gradeId,
      avatarId,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    try {
      await getAuth().deleteUser(userRecord.uid);
    } catch (rollbackError) {
      console.error(
          "Failed to roll back orphan Firebase Auth student:",
          userRecord.uid,
          rollbackError,
      );
    }
    console.error("Unable to create Firestore student profile:", error);
    throw new HttpsError(
        "internal",
        "The student profile could not be created. The account was rolled back.",
    );
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userRecord.displayName,
  };
});
