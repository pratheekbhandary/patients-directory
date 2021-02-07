const regex = /[']/i;
const res = raw.split("\n").map((row) => {
  let col = [...row.split(",")];

  col = col.map((c) => c.replace(regex, ""));
  return `INSERT INTO "patients" ("first_name", "last_name", "email", "dob", "gender", "phone_no", "address", "city", "zipcode") VALUES ('${col[0].trim()}','${col[1].trim()}','${col[2].trim()}','${col[3].trim()}','${col[4].trim()}','${col[5].trim()}','${col[6].trim()}','${col[7].trim()}','${col[8].trim()}');`;
});
