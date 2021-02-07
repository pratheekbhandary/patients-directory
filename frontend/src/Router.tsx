import { PageHeader } from "@innovaccer/design-system";
import { FC } from "react";
import { Switch, Route } from "react-router-dom";
import PatientsDetails from "./components/PatientsDetails";
import PatientsTable from "./components/PatientsTable";
import Upload from "./components/Upload";

const Router: FC = () => {
  return (
    <>
      <PageHeader title="Patients Directory" />
      <Upload />
      <Switch>
        <Route exact path="/">
          <PatientsTable />
        </Route>
        <Route exact path="/patients">
          <PatientsTable />
        </Route>
        <Route exact path="/patient/:patientId">
          <PatientsDetails />
        </Route>
      </Switch>
    </>
  );
};

export default Router;
