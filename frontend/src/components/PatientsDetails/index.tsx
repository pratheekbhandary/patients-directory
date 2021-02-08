import { useLocation } from "react-router-dom";
import { useEffect, FC, useState, useCallback } from "react";
import { PatientsInterface } from "../../types";
import {
  Placeholder,
  PlaceholderParagraph,
  Card,
  Heading,
  Text,
} from "@innovaccer/design-system";
import { calculateAge } from "../../util";

interface PatientDetailsProps {
  patientDetailsProp?: PatientsInterface;
}

const PatientsDetails: FC<PatientDetailsProps> = ({ patientDetailsProp }) => {
  const location = useLocation();
  const [patientDetails, setPatientDetails] = useState(patientDetailsProp);
  const [loading, setLoading] = useState(true);

  const patientIdFromUrl = location.pathname.split("/")[2];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_ENDPOINT}/patient/${patientIdFromUrl}`
        );
        const { data } = await res.json();
        if (res.status >= 400 && res.status < 600) {
          throw new Error(data);
        }
        setPatientDetails(data[0]);
      } catch (err) {
        //TODO: notify
        console.error("Could not fetch patient data", err);
      }
      setLoading(false);
    }
    if (patientDetailsProp == null) {
      fetchData();
    }
  }, [patientDetailsProp, patientIdFromUrl]);

  const wrapLoader = useCallback(
    (
      label: string,
      path: keyof PatientsInterface,
      translate?: (data: string) => string
    ) => {
      return (
        <div
          className="mb-5"
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              width: "40%",
              marginRight: "20px",
              textAlign: "right",
            }}
          >
            <Text appearance="default" size="regular" weight="strong">
              {label + " :"}
            </Text>
          </div>
          <div
            style={{
              width: "50%",
              textAlign: "left",
            }}
          >
            {loading && (
              <Placeholder className="w-50">
                <PlaceholderParagraph length="medium" />
              </Placeholder>
            )}
            {!loading && (
              <Text appearance="default" size="regular" weight="medium">
                {translate
                  ? translate(patientDetails![path] as string)
                  : (patientDetails![path] as string) || "NA"}
              </Text>
            )}
          </div>
        </div>
      );
    },
    [patientDetails, loading]
  );

  return (
    <div
      className="patients-details-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="h-50 w-50">
        <Card shadow="medium">
          <div className="p-7">
            <div
              className="pt-5"
              style={{
                background: "transparent",
                textAlign: "left",
                marginLeft: "10%",
              }}
            >
              <Heading appearance="default" size="m">
                Patient Details
              </Heading>
            </div>
            <br />
            <div className="w-90 mr-5 ml-5">
              {wrapLoader("First Name", "first_name")}
              {wrapLoader("Last Name", "last_name")}
              {wrapLoader("Email", "email")}
              {wrapLoader("Age", "dob", calculateAge)}
              {wrapLoader("Gender", "gender", (d) =>
                d === "MALE" ? "Male" : "Female"
              )}
              {wrapLoader("City", "city")}
              {wrapLoader("Contact", "phone_no")}
              {wrapLoader("Address", "address")}
              {wrapLoader("Zip Code", "zipcode")}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientsDetails;
