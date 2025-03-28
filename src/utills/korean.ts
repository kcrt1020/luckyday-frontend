// 한글 조사 처리 유틸 함수

/**
 * 단어의 마지막 글자가 받침이 있는지 확인
 */
function hasFinalConsonant(word: string): boolean {
  if (!word) return false;
  const lastChar = word.charAt(word.length - 1);
  const code = lastChar.charCodeAt(0);
  // 한글 음절 범위 내에 있는지 확인
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/**
 * '이/가' 조사 자동 처리
 */
export function withSubjectParticle(word: string): string {
  return word + (hasFinalConsonant(word) ? "이" : "가");
}

/**
 * '을/를' 조사 자동 처리
 */
export function withObjectParticle(word: string): string {
  return word + (hasFinalConsonant(word) ? "을" : "를");
}

/**
 * '은/는' 조사 자동 처리
 */
export function withTopicParticle(word: string): string {
  return word + (hasFinalConsonant(word) ? "은" : "는");
}
