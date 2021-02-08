import {
  render,
  screen,
  queryByAttribute,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import { Simulate } from "react-dom/test-utils";
import Upload, { Notification } from "../Upload";

import { rest } from "msw";
import { setupServer } from "msw/node";
const getById = queryByAttribute.bind(null, "id");

//setup mock server
const server = setupServer(
  rest.post(
    `${process.env.REACT_APP_SERVER_ENDPOINT}/upload`,
    (req, res, ctx) => {
      return res(ctx.json({ message: "Uploaded and saved", rowCount: 100 }));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("testing ui on upload", () => {
  it("for a successful upload", async () => {
    const file = new File(["hello"], "hello.csv", { type: "text/csv" });
    const { container } = render(<Upload />);

    const imageInput = getById(container, "upload");
    Simulate.change(imageInput!, {
      target: ({ files: [file] } as unknown) as EventTarget,
    });
    await waitFor(() =>
      screen.getByText("Uploaded and saved! Patient count: 100")
    );
  });

  it("incase upload fails", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/upload`,
        (req, res, ctx) =>
          res(ctx.status(400), ctx.json({ message: "Unsupported file type" }))
      )
    );
    const file = new File(["hello"], "hello.csv", { type: "text/csv" });
    const { container } = render(<Upload />);

    const imageInput = getById(container, "upload");
    Simulate.change(imageInput!, {
      target: ({ files: [file] } as unknown) as EventTarget,
    });
    await waitFor(() => screen.getByText("Error: Unsupported file type"));
  });

  it("testing upload progress and success", async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/upload`,
        (req, res, ctx) => {
          ctx.delay(1500);
          return res(
            ctx.json({ message: "Uploaded and saved", rowCount: 100 })
          );
        }
      )
    );
    const file = new File(["hello"], "hello.csv", { type: "text/csv" });
    const { container } = render(<Upload />);

    const imageInput = getById(container, "upload");
    Simulate.change(imageInput!, {
      target: ({ files: [file] } as unknown) as EventTarget,
    });
    await waitFor(() => screen.getByText("Uploading..."));
    await waitForElementToBeRemoved(() => screen.getByText("Uploading..."));
    await waitFor(() =>
      screen.getByText("Uploaded and saved! Patient count: 100")
    );
  });
});

describe("tesing notification component", () => {
  it("test render", () => {
    render(<Notification appearance="success">Pat</Notification>);
    expect(screen.getByText("Pat")).toBeInTheDocument();
  });
});
