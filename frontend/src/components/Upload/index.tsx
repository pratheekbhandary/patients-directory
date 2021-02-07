import {
  FC,
  useState,
  useCallback,
  useRef,
  ChangeEvent,
  MouseEvent,
} from "react";
import {
  Message,
  Button,
  Modal,
  Spinner,
  Text,
} from "@innovaccer/design-system";

const UPLOADING = "uploading";
const ERROR = "Error: ";

const Upload: FC = () => {
  const [modalState, setModalState] = useState(false);
  const [notification, setNotification] = useState("");

  const toggle = useCallback(() => {
    setModalState((state) => !state);
  }, []);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      hiddenFileInput.current?.click();
    },
    [hiddenFileInput]
  );
  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const fileUploaded = event.target.files[0];
        const formData = new FormData();
        formData.append("csv", fileUploaded);
        try {
          setNotification(UPLOADING);
          const res = await fetch(
            `${process.env.REACT_APP_SERVER_ENDPOINT}/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const { message, rowCount } = await res.json();
          setNotification(`${message}! Patient count: ${rowCount}`);
          setTimeout(() => {
            setNotification("");
          }, 3000);
        } catch (err) {
          setNotification(`${ERROR}${err}`);
          setTimeout(() => {
            setNotification("");
          }, 3000);
        }
      }
    },
    []
  );

  const displayNoti = useCallback(() => {
    if (notification === UPLOADING) {
      return (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
          }}
        >
          <Message appearance="info">
            <Spinner appearance="secondary" className="mr-3" size="small" />
            Uploading...
          </Message>
        </div>
      );
    } else if (notification.startsWith(ERROR)) {
      return (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
          }}
        >
          <Message appearance="alert">{notification}</Message>
        </div>
      );
    } else {
      return (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
          }}
        >
          <Message appearance="success">{notification}</Message>
        </div>
      );
    }
  }, [notification]);
  console.log({ notification });
  return (
    <>
      <div
        style={{
          margin: "10px",
          marginRight: "50px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {notification && displayNoti()}
        <Button
          appearance="primary"
          onClick={handleClick}
          disabled={notification === UPLOADING}
        >
          Upload file
        </Button>
        <input
          id="upload"
          type="file"
          accept="text/csv"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </div>
      <Modal open={modalState} dimension="large" onClose={toggle}></Modal>
    </>
  );
};

export default Upload;
