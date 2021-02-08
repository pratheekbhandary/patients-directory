import React, { FC } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { rest } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom/extend-expect";

import PatientsDetails from ".";

import { Router } from "react-router-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

const isTest = process.env.NODE_ENV === "test";

export const history = isTest
  ? createMemoryHistory({ initialEntries: ["/patient"] })
  : createBrowserHistory();

export const renderInRouter = (Comp: FC) =>
  render(
    <Router history={history}>
      <Comp />
    </Router>
  );

//setup mock server
const server = setupServer(
  rest.get(
    `${process.env.REACT_APP_SERVER_ENDPOINT}/patient/:patientIdFromUrl`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              id: 1,
              first_name: "Filbert",
              last_name: "Klimkov",
              email: "fklimkov0@homestead.com",
              dob: "1978-08-23T18:30:00.000Z",
              gender: "FEMALE",
              phone_no: "3863620780",
              address: "295 Basil Junction",
              city: "Muurla",
              zipcode: "25130",
              created_at: "2021-02-05T12:46:50.398Z",
              updated_at: null,
            },
          ],
        })
      );
    }
  )
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComp = () => renderInRouter(PatientsDetails);

describe("testing component PatientsDetails", () => {
  beforeEach(() => {
    history.push("/patient/1");
  });

  it("check for network data", async () => {
    renderComp();
    await waitFor(() => screen.getByText("Filbert"));
    expect(screen.getByText("Filbert")).toBeInTheDocument();
  });

  it("test if url is loaded", async () => {
    renderComp();
    expect(history.location.pathname).toBe("/patient/1");
  });
});
