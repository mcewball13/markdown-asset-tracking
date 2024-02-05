"use client";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useCallback, useState } from "react";

export default function Home() {
  const [fileContents, setFileContents] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copyableText, setCopyableText] = useState<string>("");

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        console.log(text);
        setFileContents(text as string);
      };
      reader.readAsText(file);
    },
    [setFileContents]
  );

  const handleSubmit = useCallback(async () => {
    if (!fileContents) {
      setErrorMessage("No file uploaded");
      return;
    }
    const response = await fetch("api/markdown", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ markdown: fileContents }),
    });

    const data = await response.json();
    console.log("response", data);
    if (response.ok) {
      setCopyableText(data);
      setErrorMessage("");
    } else {
      setErrorMessage("Error submitting file");
    }
  }, [fileContents]);

  const handleDataCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(copyableText);
  }, [copyableText]);

  return (
    <main className={styles.main}>
      <Container>
        <Grid container spacing={2}>
          <Grid container item xs={2}>
            <Grid item>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  accept=".md"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            <Grid item>
              {fileContents && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
              {errorMessage && <p>{errorMessage}</p>}
            </Grid>
          </Grid>
          <Grid container item xs={10}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              multiline
              minRows={5}
              maxRows={5}
              margin="normal"
              value={copyableText}
              label="Hello World"
              fullWidth
            />
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDataCopyToClipboard}
              >
                Copy
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
