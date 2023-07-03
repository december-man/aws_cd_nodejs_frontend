import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from 'axios';

type CSVFileImportProps = {
  url: string;
  title: string;
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': '*'
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    
    console.log("uploadFile to", url);

    const token = localStorage.getItem('authentication_token');
    const AuthToken = `Basic ${token}`;
    console.log(token, AuthToken);

    const response = await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file!.name),
      },
      // Task 7: pass authorization header
      headers: {
        'Authorization' : AuthToken 
      },
    });
    console.log("File to upload: ", file!.name);
    console.log("Uploading to: ", response.data);
    const result = await fetch(response.data, {
      method: "PUT",
      body: file,
      headers: CORS_HEADERS
    });
  console.log("Result: ", result);
  setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
