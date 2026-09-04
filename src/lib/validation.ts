const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

export function cleanText(value: string) {
  return value.replace(CONTROL_CHARS, "").trim();
}

export function readFormText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return cleanText(value);
}

export function readFormInt(formData: FormData, key: string, max: number) {
  const raw = readFormText(formData, key).replaceAll(",", "");
  if (!/^-?\d+$/.test(raw)) {
    return null;
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value > max || value < -max) {
    return null;
  }
  return value;
}

export function isRecordId(value: string) {
  return /^[a-z0-9]{20,32}$/i.test(value);
}

export function validateLoginId(value: string) {
  if (value.length < 2 || value.length > 40) {
    return "아이디는 2~40자로 입력하세요.";
  }
  if (/\s/.test(value) || /[<>"'\\/]/.test(value)) {
    return "아이디에 공백이나 < > \" ' \\ / 는 사용할 수 없습니다.";
  }
  return null;
}

export function validatePersonName(value: string) {
  if (value.length < 1 || value.length > 40) {
    return "이름은 1~40자로 입력하세요.";
  }
  return null;
}

export function validatePassword(value: string) {
  if (value.length < 8 || value.length > 72) {
    return "비밀번호는 8~72자로 입력하세요.";
  }
  if (/\s/.test(value)) {
    return "비밀번호에 공백을 넣을 수 없습니다.";
  }
  return null;
}

export function validateProductName(value: string) {
  if (value.length < 1 || value.length > 80) {
    return "상품 이름은 1~80자로 입력하세요.";
  }
  return null;
}

export function validateNote(value: string) {
  if (value.length > 200) {
    return "메모는 200자 이하로 입력하세요.";
  }
  return null;
}

export async function getRequestKey() {
  const { headers } = await import("next/headers");
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "local";
  return ip.slice(0, 64);
}
