export function validEmailCheck(email: string) {
  var pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  
  return !pattern.test(email);
}

export function validBirthCheck(birth: string) {
  var pattern =  /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  return !pattern.test(birth);
}

export function validInterface<T>(obj: T, interfaceCheck: T): boolean {
  for (const key in interfaceCheck) {
    if (!obj.hasOwnProperty(key) || typeof obj[key] !== typeof interfaceCheck[key]) {
      return false;
    }
  }
  return true;
}

export function validType<T>(value: any, validTypes: T[]): value is T {
  return validTypes.includes(value as T);
}

export function splitStudentNumber(studentNumber: string) {
  const student_id = parseInt(studentNumber); // 문자열을 정수로 변환
  const grade = Math.floor(student_id / 1000); // 학년 추출
  const clazz = Math.floor((student_id % 1000) / 100); // 반 추출
  const number = student_id % 100; // 번호 추출
  
  return {
    grade,
    class: clazz,
    number
  };
}