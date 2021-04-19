import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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
    width: 100%; // Fix IE 11 issue.
  }
  .submit {
    margin: 25px 0px;
    background: red;
  }
`;

export default function Notfound() {
  const { t } = useTranslation();

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
                fontSize: "40px",
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {t("404")}
            </Typography>

            <form className="form">
              <Button
                href="/library"
                fullWidth
                variant="contained"
                color="primary"
                className="submit"
              >
                {t("back")}
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </Wrapper>
  );
}
