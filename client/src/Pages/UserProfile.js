import React, { useState, useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { HyperContext } from "../Context/context";
import { useHistory } from "react-router-dom";
import { findProfileByUsername } from "../services/profile";
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
    margin: 45px 0px;
    background: red;
  }
`;

const MessageCard = styled.div`
  position: relative;
  display: block;
  width: 480px;
  min-height: 300px;
  height: 100px;
  margin: 40px 10px;
  overflow: hidden;
  border-radius: 10px;
  transition: all 0.4s;
  box-shadow: 0px 0px 80x -25px rgb(0 0 0 / 50%);
  transition: all 0.4s;
  :hover {
    transform: scale(1.02);
    transition: all 0.4s;
    height: auto;
  }
  .blur_back {
    position: absolute;
    top: 0;
    z-index: 1;
    height: 100%;
    right: 0;
    background-size: cover;
    border-radius: 11px;
    width: 100%;
    background-position: 50% 50% !important;
  }
  .bright_back_error {
    background: url("./img/404.svg");
  }
  .info_section {
    position: relative;
    width: 100%;
    height: 100%;
    background-blend-mode: multiply;
    z-index: 2;
    border-radius: 10px;
    background: linear-gradient(to top, #e5e6e6 50%, transparent 100%);
    display: inline-grid;
    .movie_header {
      position: relative;
      padding: 25px;
      height: 40%;
      width: 100%;
      margin-top: 85px;
      .cover {
        position: relative;
        float: left;
        margin-right: 20px;
        height: 120px;
        box-shadow: 0 0 20px -10px rgb(0 0 0 / 50%);
      }
      h1 {
        color: black;
        font-weight: 400;
      }
      h4 {
        color: #555;
        font-weight: 400;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
  @media (max-width: 1024px) {
    width: 50%;
  }
  @media (max-width: 1440px) {
    width: 45%;
  }
`;

export default function UserProfile(props) {
  const { t } = useTranslation();
  const { state } = useContext(HyperContext);
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState({});

  let history = useHistory();

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;

    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <div className="paper">{children}</div>}
      </div>
    );
  };

  useEffect(() => {
    const username = props.match.params.username;

    const findProfile = async () => {
      if (username) {
        const response = await findProfileByUsername(state.token, username);
        if (response?.success === false) {
          setError(response);
        } else {
          setProfile(response);
        }
      } else {
        setError({
          error: t("No username found !"),
        });
      }
    };
    findProfile();

    // eslint-disable-next-line
  }, []);
  return (
    <Wrapper>
      <div className="container">
        {error.error ? (
          <Container>
            <MessageCard>
              <div className="info_section">
                <div className="movie_header">
                  <img className="cover" src="./img/1.jpg" alt="cover" />
                  <h1>{t(error.error)}</h1>
                </div>
              </div>
            </MessageCard>
          </Container>
        ) : (
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
              </Tabs>
            </Paper>

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
                {profile.username}
              </Typography>
              <form className="form">
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    style={{ margin: "20px 0 20px 0", textAlign: "center" }}
                  >
                    <LabelImage type="file">
                      <img
                        src={
                          profile.profile
                            ? profile.profile
                            : "./img/avatar.jpeg"
                        }
                        alt="avatar"
                      />
                    </LabelImage>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <WhiteBorderTextField
                      variant="outlined"
                      defaultValue={profile.firstname}
                      margin="normal"
                      fullWidth
                      label={t("First Name")}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <WhiteBorderTextField
                      variant="outlined"
                      margin="normal"
                      defaultValue={profile.lastname}
                      fullWidth
                      label={t("Last Name")}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="submit"
                    onClick={() => {
                      history.push("/library");
                    }}
                  >
                    {t("Browse Movies")}
                  </Button>
                </Grid>
              </form>
            </TabPanel>
          </Container>
        )}
      </div>
    </Wrapper>
  );
}
