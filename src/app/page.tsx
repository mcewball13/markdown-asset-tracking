'use client';
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";

export default function Home() {

  const [fileContents, setFileContents] = useState<string>("");

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      console.log(text);
      setFileContents(text as string)
    };
    reader.readAsText(file);
  };

  return (
    <main className={styles.main}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" accept=".md" onChange={handleFileChange}/>
            </Button>
          </Grid>
          <Grid container item xs={10}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              multiline
              minRows={4}
              margin="normal"
              value={"code"}
              label="Hello World"
              fullWidth
            />
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Copy
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
