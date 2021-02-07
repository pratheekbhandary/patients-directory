export function calculateAge(birthday: string): string {
  // birthday is a date
  var ageDifMs = Date.now() - new Date(birthday).getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return String(Math.abs(ageDate.getUTCFullYear() - 1970));
}
