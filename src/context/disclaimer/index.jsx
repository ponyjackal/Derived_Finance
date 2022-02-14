import React, { createContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#111",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DisclaimerContext = createContext({});

export const DisclaimerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <DisclaimerContext.Provider value={{}}>
      {children}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, textAlign: "justify" }}
          >
            You are NOT ALLOWED to access or use the Services or Web application
            if you are located, incorporated, or otherwise established in, or a
            citizen or resident of (i) the United States of America, the
            province of Ontario in Canada, the province of Québec in Canada, the
            Hong Kong Special Administrative Region of the People's Republic of
            China, the Republic of Seychelles, Bermuda, Burundi, Central African
            Republic, Democratic Republic of Congo, Eritrea, Guinea-Bissau,
            Libya, Mali, Palestine, Somalia, South Sudan, Western Sahara, Yemen,
            Cuba, Crimea and Sevastopol, Iran, Syria, North Korea or Sudan; (ii)
            any state, country or other jurisdiction that is embargoed by the
            United States of America.
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ textAlign: "justify" }}
          >
            You are NOT ALLOWED to use or access our services via any interface
            if you are under the legal age as defined in your jurisdiction.
          </Typography>
          <div className="flex justify-center">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "14px",
                textTransform: "uppercase",
              }}
              onClick={handleClose}
            >
              OK
            </Button>
          </div>
        </Box>
      </Modal>
    </DisclaimerContext.Provider>
  );
};
