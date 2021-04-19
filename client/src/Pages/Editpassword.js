import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import { Snackbar, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { changePassword } from "../services/profile";
import { HyperContext } from "../Context/context";
import { logout } from "../services/auth";
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

export default function Editpassword() {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(HyperContext);
  const [message, setMessage] = useState({});
  const { register, handleSubmit, errors } = useForm();
  const [open, setOpen] = useState(false);

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  //*SUBMIT DATA TO EDIT PASSWORD

  const onSubmit = async (data) => {
    const editpassword = await changePassword(state.token, data);
    if (editpassword.success === true) {
      await logout(state.token, dispatch);
      setMessage(editpassword);
      setOpen(true);
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}>
        {message.success === true ? (
          <Alert onClose={handleClose} severity='success' variant='filled'>
            {t(message.message)}
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity='error' variant='filled'>
            {t(message.error)}
          </Alert>
        )}
      </Snackbar>

      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <WhiteBorderTextField
              variant='outlined'
              margin='normal'
              fullWidth
              name='oldpassword'
              label={t('Old Password')}
              type='password'
              id='oldpassword'
              inputRef={register({
                required: t("You must provide your oldpassword !"),
              })}
            />
            {errors.oldpassword && (
              <Box variant='filled' color='red' style={{ fontSize: "12px" }}>
                {errors.oldpassword.message}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <WhiteBorderTextField
              variant='outlined'
              margin='normal'
              fullWidth
              name='newpassword'
              label={t('New Password')}
              type='password'
              id='newpassword'
              inputRef={register({
                required: t("You must provide your newpassword !"),
                pattern: {
                  value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/,
                  message:
                    t("Password must be at least eight characters long"),
                },
              })}
            />
            {errors.newpassword && (
              <Box variant='filled' color='red' style={{ fontSize: "12px" }}>
                {errors.newpassword.message}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <WhiteBorderTextField
              variant='outlined'
              margin='normal'
              fullWidth
              name='confirmpassword'
              label={t('Retype Password')}
              type='password'
              id='confirmpassword'
              inputRef={register({
                required: t("You must confirm your password !"),
              })}
            />
            {errors.confirmpassword && (
              <Box variant='filled' color='red' style={{ fontSize: "12px" }}>
                {errors.confirmpassword.message}
              </Box>
            )}
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            className='submit'
            color='primary'>
            {t("Save")}
          </Button>
        </Grid>
      </form>
    </div>
  );
}
