import bcrypt from "bcryptjs";

const COST = 12;
export const MIN_PASSWORD_LENGTH = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, COST);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

let dummy: Promise<string> | undefined;
/** Compared against when the email is unknown so response time doesn't reveal which emails exist. */
export const dummyHash = () => (dummy ??= bcrypt.hash("not-a-real-password", COST));
