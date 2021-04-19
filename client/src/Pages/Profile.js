import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import StarIcon from "@material-ui/icons/Star";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { HyperContext } from "../Context/context";
import { useHistory } from "react-router-dom";
import WatchedList from "./WatchedList";
import FavoriteList from "./FavoriteList";
import { useTranslation } from "react-i18next";

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
    padding: 50px 0;
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
const MyCard = styled.div`
  cursor: pointer;
  margin: 10px;
  width: 400px;
  @media (max-width: 768px) {
    width: fit-content;
    height: fit-content;
  }
  height: 400px;
  position: relative;
  /* border: 5px solid #fff; */
  transition: all 0.8s;
  border-radius: 7px;
  box-shadow: 0px 4px 15px ${(props) => props.theme.background_grey_2};
  img {
    border-radius: 7px;
  }
  :focus {
    outline: none;
  }
  .backHover {
    border-radius: 7px;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  &:hover .backHover {
    background: rgba(54, 54, 54, 0.7);
    box-shadow: 0px 0px 50px -25px rgba(255, 0, 0, 0.8);
  }
  &:hover {
    transform: scale(1.05);
    transition: all 0.7s;
    /* border: 5px solid #ffffff; */
  }
  &:hover .backHover {
    opacity: 1;
  }
  &:hover .eye {
    z-index: 100;
  }
  .backHover {
    opacity: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .mvName {
      width: 100%;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 7px;
      background: url("./img/mask-title.png");
      h4,
      h6 {
        text-shadow: 0 0 10px rgb(0 0 0 / 60%);
      }
    }
    .imdbPlace {
      margin: 5px;
      width: 40px;
      height: 30px;
      background: red;
      align-self: flex-start;
      border-radius: 7px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      h3 {
        font-family: ui-sans-serif;
        color: #fff;
        font-size: 15px;
      }
    }
    :hover .play_button {
      opacity: 1;
    }
    .play_button {
      font-size: 70px;
      position: absolute;
      top: 50%;
      opacity: 0;
      z-index: 100;
      color: white;
      left: 50%;
      transform: translate(-50%, -50%);
      :hover {
        color: #ff8585;
        transition: all 0.9s;
      }
    }
  }
  .eye {
    position: absolute;
    top: 0;
    right: 10px;
    color: #ffe600;
    font-size: 30px;
  }
`;

export default function Settings() {
  const { t } = useTranslation();
  const { userInfos } = useContext(HyperContext);
  const [tab, setTab] = useState(0);
  let history = useHistory();
  // eslint-disable-next-line
  const [hovered, setHovered] = useState(false);
  const toggleHover = (value) => setHovered(value);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;

    return (
      <div role='tabpanel' hidden={value !== index}>
        {value === index && <div className='paper'>{children}</div>}
      </div>
    );
  };

  return (
    <Wrapper>
      <div className='container'>
        <Container component='main' maxWidth='sm'>
          <Paper elevation={5}>
            <Tabs
              value={tab}
              onChange={handleChange}
              variant='fullWidth'
              indicatorColor='secondary'
              textcolor='primary'
              TabIndicatorProps={{ style: { background: "red" } }}
              style={{ background: "rgb(8, 7, 8)", color: "white" }}>
              <Tab
                icon={<PersonPinIcon />}
                label='Info'
                style={{ padding: "20px 0" }}
              />
              <Tab
                icon={<VisibilityIcon />}
                label={t("Watched")}
                style={{ padding: "20px 0" }}
              />
              <Tab
                icon={<StarIcon />}
                label={t("Favorite")}
                style={{ padding: "20px 0" }}
              />
            </Tabs>
          </Paper>
          <TabPanel value={tab} index={0}>
            <MyCard
              key={1}
              onMouseEnter={() => toggleHover(true)}
              onMouseLeave={() => toggleHover(false)}>
              <img
                src={
                  userInfos.profile ? userInfos.profile : "./img/avatar.jpeg"
                }
                width='100%'
                height='100%'
                alt='cover'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://t.ly/teEM";
                }}
              />
              <div className='eye'>
                <i className='las la-user  animate__animated animate__wobble animate__infinite'></i>
              </div>
              <div className='backHover'>
                <div className='mvName'>
                  <h3>{userInfos.username}</h3>
                </div>
                <i
                  className='las la-edit play_button'
                  onClick={() => {
                    history.push("/settings");
                  }}
                />
                <div className='mvName'>
                  <h3>{userInfos.firstname}</h3>
                  <h3>{userInfos.lastname}</h3>
                  <h3>{userInfos.email}</h3>
                </div>
              </div>
            </MyCard>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className='submit'
              onClick={() => {
                history.push("/library");
              }}>
              {t("Browse Movies")}
            </Button>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <WatchedList />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <FavoriteList />
          </TabPanel>
        </Container>
      </div>
    </Wrapper>
  );
}
