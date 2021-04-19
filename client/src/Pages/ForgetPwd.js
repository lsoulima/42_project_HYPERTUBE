import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import { resetPwd } from "../services/auth";
import { useForm } from "react-hook-form";
import Alert from "@material-ui/lab/Alert";
import { Snackbar, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const WhiteBorderTextField = styled(TextField)`
  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #fff !important;
  }
  & .MuiOutlinedInput-notchedOutline {
    border-color: #fff;
  }
  & label.Mui-focused {
    color: #fff;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #fff;
    }
  }
  label {
    color: #fff !important;
    font-size: 13px;
  }
  input:hover {
    border-color: red !important;
  }
  input {
    border-color: #fff;
    color: #fff;
  }
`;

const Wrapper = styled.div`
  & {
    background: url("./img/register.jpg") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    /* Set up proportionate scaling */
    width: 100%;
    height: fit-content;
    min-height: 90vh;
    @media (max-width: 768px) {
      height: auto;
    }
  }
  .container {
    padding: 100px 0;
    height: 100%;
    min-height: 90vh;
    width: 100%;
    background: rgba(51, 51, 51, 0.5);
  }
  .paper {
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 15px;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar {
    margin: 50px;
    background-color: red;
  }
  .form {
    width: 100%;
  }
  .submit {
    margin: 25px 0px;
    background: red;
  }
`;

export default function ForgetPwd() {
  const { t } = useTranslation();

  const [message, setMessage] = useState({});
  const { register, handleSubmit, errors } = useForm();
  const [open, setOpen] = useState(false);
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //* SUBMIT THE DATA TO RESET PASSWORD
  const onSubmit = async (data) => {
    const responce = await resetPwd(data);
    setMessage(responce);
    setOpen(true);
  };

  return (
    <Wrapper>
      <div className="container">
        <Container component="main" maxWidth="xs">
          <div className="paper">
            <Typography
              component="h1"
              variant="h5"
              style={{
                alignSelf: "start",
                fontSize: "30px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "20px",
              }}
            >
              {t("Reset Password")}
            </Typography>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              {message.success === true ? (
                <Alert
                  onClose={handleClose}
                  severity="success"
                  variant="filled"
                >
                  {t(message.message)}
                </Alert>
              ) : (
                <Alert onClose={handleClose} severity="error" variant="filled">
                  {t(message.error)}
                </Alert>
              )}
            </Snackbar>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <WhiteBorderTextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label={t("Email Address")}
                name="email"
                autoComplete="email"
                autoFocus
                inputRef={register({
                  required:
                    t("You must provide your email to reset you password !"),
                })}
              />
              {errors.email && (
                <Box variant="filled" color="red" style={{ fontSize: "12px" }}>
                  {errors.email.message}
                </Box>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="submit"
              >
              {t("Reset Password")}
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </Wrapper>
  );
}
