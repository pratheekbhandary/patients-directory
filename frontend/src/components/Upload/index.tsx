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

export const Notification: FC<{
  children: React.ReactNode;
  appearance: "info" | "success" | "alert";
}> = ({ children, appearance }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
      }}
    >
      <Message appearance={appearance}>{children}</Message>
    </div>
  );
};

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
          if (res.status >= 400 && res.status < 600) {
            throw new Error(message);
          }
          setNotification(`${message}! Patient count: ${rowCount}`);
          setTimeout(() => {
            setNotification("");
          }, 3000);
        } catch (err) {
          setNotification(`${err}`);
          setTimeout(() => {
            setNotification("");
          }, 3000);
        }
      }
    },
    []
  );

  const displayNotification = useCallback(() => {
    if (notification === UPLOADING) {
      return (
        <Notification appearance="info">
          <Spinner appearance="secondary" className="mr-3" size="small" />
          Uploading...
        </Notification>
      );
    } else if (notification.startsWith(ERROR)) {
      return <Notification appearance="alert">{notification}</Notification>;
    } else {
      return <Notification appearance="success">{notification}</Notification>;
    }
  }, [notification]);

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
        {notification && displayNotification()}
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
