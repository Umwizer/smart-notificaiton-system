export interface PasswordCheck {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  /** 0 (empty or very weak) to 4 (strong) */
  score: 0 | 1 | 2 | 3 | 4;
  /** Meets the minimum rules */
  valid: boolean;
}

export function checkPassword(pw: string): PasswordCheck {
  const length = pw.length >= 8;
  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const number = /\d/.test(pw);
  const symbol = /[^A-Za-z0-9]/.test(pw);

  let score = [length, upper && lower, number, symbol].filter(Boolean).length;
  if (!length) score = Math.min(score, 1);
  if (pw.length === 0) score = 0;

  return {
    length, upper, lower, number,
    score: score as PasswordCheck["score"],
    valid: length && upper && lower && number,
  };
}