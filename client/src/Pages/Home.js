import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  height: fit-content;
  background: url("./img/back.jpg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  .container-tran {
    height: fit-content;
    min-height: 90vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px 0;
    background: rgba(51, 51, 51, 0.5);
  }
  h1 {
    color: #fff;
    font-weight: 600;
    font-size: 50px;
    word-break: break-word;
  }
  h3 {
    color: #fff;
    font-weight: 400;
    word-break: break-word;
    margin-bottom: 20px;
  }
  .website-desc {
    height: fit-content;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    div:first-of-type {
      width: 600px;
      word-wrap: break-word;
    }
  }
  .input-home {
    height: 80px;
    width: 800px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    div:first-of-type {
      flex-basis: 70%;
    }
    div:last-of-type {
      flex-basis: 35%;
    }
    input {
      width: 100%;
      height: 100%;
      font-size: 20px;
      padding: 10px;
      :focus {
        outline: none;
      }
    }
    button {
      height: 100%;
      width: 100%;
      background: #e40a17;
      border: none;
      color: #fff;
      font-size: 25px;
      :hover {
        background: rgb(237, 12, 23);
        cursor: pointer;
      }
    }
  }
  @media (max-width: 1024px) {
    background: black;

    .input-home {
      width: 600px;
    }
  }
  @media (max-width: 768px) {
    .website-desc {
      div:first-of-type {
        width: 300px;
      }
    }
    h3 {
      font-size: 15px;
    }
    h1 {
      font-size: 30px;
    }
    .input-home {
      align-items: center;
      flex-direction: column;
      width: 300px;
      /* & div:first-of-type {
        color: red;
        margin-bottom: 20px;
        width: 100%;
      } */
      div:last-of-type {
        width: 150px;
        height: 60px;
        i {
          display: none;
        }
      }
      button {
        font-size: 15px;
      }
      input {
        width: 100%;
        font-size: 15px;
      }
    }
  }
`;

export default function Home() {
  const { t } = useTranslation();
  let history = useHistory();
  
  return (
    <Container>
      <div className='container-tran'>
        <div className='website-desc'>
          <div>
            <h1 className='animate__animated animate__backInDown'>
              {t("Unlimited movies")}
            </h1>
            <h3>{t("Watch anywhere")}</h3>
            <h3>
              {t("Ready to watch")}
            </h3>
          </div>
          <div className='input-home animate__animated animate__backInUp'>
            {/* <div>
              <input type="email" placeholder="Email address" />
            </div> */}
            <div>
              <Link
                onClick={() => {
                  history.push("/register");
                }}>
                <button>
                  {t("Get Started")} <i className='las la-angle-right'></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
