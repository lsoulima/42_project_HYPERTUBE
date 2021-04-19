import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SecurityTwoToneIcon from "@material-ui/icons/SecurityTwoTone";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { useForm } from "react-hook-form";
import { Snackbar, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { HyperContext } from "../Context/context";
import { settingsAction, ProfileUpAction } from "../services/profile";
import Editpassword from "./Editpassword";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const LabelImage = styled.label`
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  input {
    display: none;
  }
  text-align: center;
  img {
    border-radius: 100%;
    width: 150px;
    height: 150px;
  }
`;

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
    background: url("./img/back.jpg") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;

    /* Set up proportionate scaling */
    width: 100%;
    height: fit-content;

    @media (max-width: 768px) {
      & {
        height: auto;
      }
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
    border-radius: 0 0 15px 15px;
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
    width: 100%; // Fix IE 11 issue.
  }
  .submit {
    margin: 25px 0px;
    background: red;
  }
`;

export default function Settings() {
  const { t } = useTranslation();
  const { state, userInfos, setUserInfos } = useContext(HyperContext);
  const [tab, setTab] = useState(0);
  const [message, setMessage] = useState({});
  const [profileMessage, setProfileMsg] = useState({});
  const { register, handleSubmit, errors } = useForm();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "50%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setDone(false);
    setOpen(false);
  };
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const onFileChange = async (e) => {
    const res = await ProfileUpAction(state.token, e);
    if (res.success) {
      setUserInfos({ ...userInfos, profile: res.data });
    }
    setProfileMsg(res);
    setDone(true);
  };

  const onSubmit = async (data) => {
    const SettingsResponce = await settingsAction(state.token, data);
    setUserInfos({
      ...userInfos,
      ...data,
    });
    // eslint-disable-next-line
    setMessage(SettingsResponce);
    setOpen(true);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;

    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <div className="paper">{children}</div>}
      </div>
    );
  };

  return (
    <Wrapper>
      <div className="container">
        <Container component="main" maxWidth="sm">
          <Paper elevation={5}>
            <Tabs
              value={tab}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textcolor="primary"
              TabIndicatorProps={{ style: { background: "red" } }}
              style={{ background: "rgb(8, 7, 8)", color: "white" }}
            >
              <Tab
                icon={<PersonPinIcon />}
                label="Info"
                style={{ padding: "20px 0" }}
              />
              {userInfos.googleId ||
              userInfos.fortyTwoId ||
              userInfos.githubId ? (
                []
              ) : (
                <Tab
                  icon={<SecurityTwoToneIcon />}
                  label={t("password")}
                  style={{ padding: "20px 0" }}
                />
              )}
            </Tabs>
          </Paper>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={done}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <div className={classes.root}>
              {profileMessage.success === true ? (
                // eslint-disable-next-line
                <Alert variant="outlined" severity="success" variant="filled">
                  {t(profileMessage.message)}
                </Alert>
              ) : (
                // eslint-disable-next-line
                <Alert variant="outlined" severity="error" variant="filled">
                  {t(profileMessage.error)}
                </Alert>
              )}
            </div>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            {message.success === true ? (
              <Alert onClose={handleClose} severity="success" variant="filled">
                {t(message.message)}
              </Alert>
            ) : (
              <Alert onClose={handleClose} severity="error" variant="filled">
                {t(message.error)}
              </Alert>
            )}
          </Snackbar>
          <TabPanel value={tab} index={0}>
            <Typography
              component="h1"
              variant="h5"
              style={{
                fontSize: "40px",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {userInfos.username}
            </Typography>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  style={{ margin: "20px 0 20px 0", textAlign: "center" }}
                >
                  <LabelImage type="file">
                    <img
                      src={
                        userInfos.profile
                          ? userInfos.profile
                          : "./img/avatar.jpeg"
                      }
                      alt="avatar"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(e.target.files[0])}
                    />
                  </LabelImage>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <WhiteBorderTextField
                    variant="outlined"
                    defaultValue={userInfos.firstname}
                    margin="normal"
                    fullWidth
                    id="firstname"
                    label={t("First Name")}
                    name="firstname"
                    autoComplete="firstname"
                    autoFocus
                    inputRef={register({
                      required: t("You must provide your firstname !"),
                      pattern: {
                        value: /^[a-zA-Z ]{3,20}$/,
                        message: t(
                          "The firstname must contain between 3 and 20 letters !"
                        ),
                      },
                    })}
                  />
                  {errors.firstname && (
                    <Box
                      variant="filled"
                      color="red"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.firstname.message}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <WhiteBorderTextField
                    variant="outlined"
                    margin="normal"
                    defaultValue={userInfos.lastname}
                    fullWidth
                    id="lastname"
                    label={t("Last Name")}
                    name="lastname"
                    inputRef={register({
                      required: t("You must provide your lastname!"),
                      pattern: {
                        value: /^[a-zA-Z ]{3,20}$/,
                        message: t(
                          "The lastname  must contain between 3 and 20 letters !"
                        ),
                      },
                    })}
                  />
                  {errors.lastname && (
                    <Box
                      variant="filled"
                      color="red"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.lastname.message}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <WhiteBorderTextField
                    variant="outlined"
                    margin="normal"
                    defaultValue={userInfos.username}
                    fullWidth
                    id="username"
                    label={t("username")}
                    name="username"
                    inputRef={register({
                      required: t("You must provide your username!"),
                      pattern: {
                        value: /^[a-z]+(([-_.]?[a-z0-9])?)+$/,
                        message: t(
                          "The username must contain between 3 and 20 letters or numbers"
                        ),
                      },
                    })}
                  />
                  {errors.username && (
                    <Box
                      variant="filled"
                      color="red"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.username.message}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <WhiteBorderTextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    defaultValue={userInfos.email}
                    id="email"
                    label={t("Email Address")}
                    name="email"
                    autoComplete="email"
                    inputRef={register({
                      required: t("You must provide your email !"),
                      pattern: {
                        value: /[a-zA-Z0-9-_.]{1,50}@[a-zA-Z0-9-_.]{1,50}\.[a-z0-9]{2,10}$/,
                        message: t("Invalid email address !"),
                      },
                    })}
                  />
                  {errors.email && (
                    <Box
                      variant="filled"
                      color="red"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.email.message}
                    </Box>
                  )}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="submit"
                >
                  {t("Save")}
                </Button>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Editpassword />
          </TabPanel>
        </Container>
      </div>
    </Wrapper>
  );
}
