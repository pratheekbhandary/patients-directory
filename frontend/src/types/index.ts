export enum Gender {
  male = "MALE",
  female = "FEMALE",
  notKnown = "NOT_KNOWN",
  notApplicable = "NOT_APPLICABLE",
}

export interface PatientsInterface {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  dob: Date;
  gender: Gender;
  phone_no: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
  created_at: Date;
  updated_at: Date | null;
}
