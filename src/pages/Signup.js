import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";

import Camera from "react-html5-camera-photo";
import "../camera.css";

import FormData from "form-data";
import axios from "axios";

const baseURL = "https://d3hrgbj4h2mmru.cloudfront.net";
//const baseURL = "http://localhost:8080";

// import Back from '../components/common/Back';

const backgroundShape = require("../images/shape.svg");

const logo = require("../images/bett-logo.png");
const logoMS = require("../images/microsoft-logo.png");
const logoFC = require("../images/fc-logo.png");

const numeral = require("numeral");
numeral.defaultFormat("0");

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary["A100"],

    marginTop: 10,
    padding: 20
  },
  grid: {
    margin: `0`
  },
  smallContainer: {
    width: "100%"
  },
  bigContainer: {
    width: "100%"
  },
  logo: {
    display: "block",
    textAlign: "center"
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stepGrid: {
    width: "100%"
  },
  buttonBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center"
  },
  button: {
    backgroundColor: theme.palette.primary["A100"]
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  stepper: {
    backgroundColor: "transparent"
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42
  },
  formControl: {
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  modal: {
    position: "absolute",
    width: "90%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
    outline: "none",
    margin: "5%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  done: {
    width: "100px",
    height: "100px",
    fill: "#4dd4a7"
  },
  error: {
    width: "100px",
    height: "100px",
    fill: "#ff7600"
  }
});

const getSteps = () => {
  return ["Info", "Aceite", "Fotos"];
};

class Signup extends Component {
  state = {
    activeStep: 0,
    receivingAccount: "",
    termsChecked: false,
    loading: true,
    labelWidth: 0,
    pictureArray: [],
    modalPicture: "",
    modalOpen: false,
    modalPictureIndex: 0,
    userId: this.props.match.params.userId,
    errored: false,
    username: "--",
    fullName: "",
    email: "",
    emailValid: false
  };

  componentDidMount() {
    this.getUser();
  }

  handleNext = error => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
      errored: error
    }));
    if (this.state.activeStep === 2) {
      this.submitPictures();
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name == "email") {
      this.validateEmail(event.target.value);
    }
  };

  handleTerms = event => {
    this.setState({ termsChecked: event.target.checked });
  };

  stepActions() {
    if (this.state.activeStep === 0) {
      return "Quero participar";
    }
    if (this.state.activeStep === 1) {
      return "Aceito os termos";
    }
    if (this.state.activeStep === 2) {
      return "Enviar Fotos";
    }
    return "Next";
  }

  onTakePhoto(base64picture) {
    if (this.state.pictureArray.length < 24) {
      this.setState(state => {
        state.pictureArray.push(base64picture);
        return { pictureArray: state.pictureArray };
      });
    }
  }

  showModal = event => {
    this.setState({
      modalPicture: event.target.src,
      modalOpen: true,
      modalPictureIndex: event.target.id
    });
  };

  closeModal = event => {
    this.setState({ modalOpen: false });
  };

  deletePicture = event => {
    this.setState(state => {
      state.pictureArray.splice(state.modalPictureIndex, 1);
      return { pictureArray: state.pictureArray };
    });
    this.closeModal();
  };

  validatePictures = event => {
    if (this.state.pictureArray.length < 6) {
      console.error("Picutures < 6");
    }
  };

  validateEmail = email => {
    console.log("validating: " + email);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let test = re.test(String(email).toLowerCase());
    console.log("validating: " + test);
    this.setState({ emailValid: test });
  };

  getUser = () => {
    let URL = baseURL + "/users/" + this.state.userId;
    axios
      .get(URL, {})
      .then(response => {
        //handle success
        console.log(response);
        this.setState({ username: response.data.user.name });
      })
      .catch(error => {
        console.error(error);
      });
  };

  submitPictures = event => {
    let data = new FormData();
    //let URL = baseURL + '/add-person'
    let URL = baseURL + "/add-person";

    data.append(
      "user",
      JSON.stringify({
        name: this.state.fullName,
        email: this.state.email
      })
    );

    for (let i = 0; i < this.state.pictureArray.length; i++) {
      let pic = this.state.pictureArray[i];
      data.append("file_" + i, pic);
    }
    axios
      .post(URL, data, {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data;`
        }
      })
      .then(response => {
        //handle success
        this.handleNext();
      })
      .catch(error => {
        //handle error
        console.error(error);
        this.handleNext(true);
      });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, loading } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid item xs={12}>
                <div className={classes.logo}>
                  <img
                    width={150}
                    src={logoFC}
                    alt=""
                    style={{ margin: "12px" }}
                  />
                  <img width={150} src={logo} alt="" />
                  <img
                    width={150}
                    src={logoMS}
                    alt=""
                    style={{ margin: "12px" }}
                  />
                </div>
                <div className={classes.stepContainer}>
                  <div className={classes.stepGrid}>
                    <Stepper
                      classes={{ root: classes.stepper }}
                      activeStep={activeStep}
                      alternativeLabel
                    >
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  {activeStep === 0 && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <Grid item container xs={12}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                              Olá,
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              A Microsoft, em parceria com a Bett Educar e a
                              FCamara está trazendo a experiência de
                              reconhecimento facial para a Sala 2030, o espaço
                              que traz uma prévia da sala de aula do futuro.
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Para participar da dinâmica, basta preencher este
                              cadastro com seu nome e fotos e aceitar nosso
                              termo de privacidade.
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Dica: para faciliar a captura das fotos com
                              qualidade, acesse esse link do seu celular.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <Grid item container xs={12}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                              Política de privacidade
                            </Typography>
                            <Typography color="secondary" gutterBottom>
                              Armazenamento
                            </Typography>
                            <List component="nav">
                              <ListItem style={{ padding: 0 }}>
                                <ListItemIcon>
                                  <DoneIcon />
                                </ListItemIcon>
                                <ListItemText
                                  style={{ padding: "5px 0" }}
                                  inset
                                  primary="Não armazenamos suas fotos em nenhum momento"
                                />
                              </ListItem>
                              <ListItem style={{ padding: 0 }}>
                                <ListItemIcon>
                                  <DoneIcon />
                                </ListItemIcon>
                                <ListItemText
                                  style={{ padding: "5px 0" }}
                                  inset
                                  primary="Armazenamos apenas as características numéricas do reconhecimento facial"
                                />
                              </ListItem>
                            </List>
                            <Typography color="secondary" gutterBottom>
                              Uso dos dados
                            </Typography>
                            <List>
                              <ListItem style={{ padding: 0 }}>
                                <ListItemIcon>
                                  <DoneIcon />
                                </ListItemIcon>
                                <ListItemText
                                  style={{ padding: "5px 0" }}
                                  inset
                                  primary="Os dados serão exclusivamente utilizados para reconhecimento do seu rosto nos espaços do evento"
                                />
                              </ListItem>
                            </List>
                          </Grid>
                        </Grid>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className={classes.smallContainer}>
                      <Paper className={classes.paper}>
                        <div>
                          <div>
                            <Typography variant="subtitle1" gutterBottom>
                              Nome:
                            </Typography>
                            <FormControl
                              variant="outlined"
                              className={classes.formControl}
                            >
                              <TextField
                                name="fullName"
                                onChange={this.handleChange}
                              />
                            </FormControl>
                            <br />
                            <br />
                            <Typography variant="subtitle1" gutterBottom>
                              E-mail
                            </Typography>
                            <FormControl
                              variant="outlined"
                              className={classes.formControl}
                            >
                              <TextField
                                name="email"
                                type="email"
                                onChange={this.handleChange}
                              />
                            </FormControl>
                          </div>
                          <br />
                          <div>
                            <Typography variant="subtitle1" gutterBottom>
                              Fotos
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Tire pelo menos 6 fotos (máximo 24), com boa
                              iluminação e com apenas seu rosto visível.
                            </Typography>
                          </div>
                          <Camera
                            onTakePhoto={dataUri => {
                              this.onTakePhoto(dataUri);
                            }}
                          />
                          <div style={{ textAlign: "center" }}>
                            {this.state.pictureArray.map(
                              (base64picture, index) => (
                                <img
                                  src={base64picture}
                                  width={50}
                                  key={index}
                                  id={index}
                                  onClick={this.showModal}
                                  style={{ margin: 3 }}
                                  alt=""
                                />
                              )
                            )}
                          </div>
                          <Modal
                            open={this.state.modalOpen}
                            onBackdropClick={this.closeModal}
                          >
                            <div className={classes.modal}>
                              <div>
                                <img
                                  src={this.state.modalPicture}
                                  width="100%"
                                  height="100%"
                                  alt=""
                                />
                              </div>
                              <div>
                                <Button
                                  onClick={this.closeModal}
                                  className={classes.backButton}
                                  size="large"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={this.deletePicture}
                                  className={classes.button}
                                  size="large"
                                >
                                  Excluir
                                </Button>
                              </div>
                            </div>
                          </Modal>
                        </div>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div className={classes.bigContainer}>
                      <Paper className={classes.paper}>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div style={{ width: 380, textAlign: "center" }}>
                            <div style={{ marginBottom: 32 }}>
                              <Typography
                                variant="h6"
                                style={{ fontWeight: "bold" }}
                                gutterBottom
                              >
                                Enviando dados
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                Suas fotos estão sendo processadas
                              </Typography>
                            </div>
                            <div>
                              <Fade
                                in={loading}
                                style={{
                                  transitionDelay: loading ? "800ms" : "0ms"
                                }}
                                unmountOnExit
                              >
                                <CircularProgress
                                  style={{
                                    marginBottom: 32,
                                    width: 100,
                                    height: 100
                                  }}
                                />
                              </Fade>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </div>
                  )}
                  {activeStep === 4 && (
                    <div className={classes.bigContainer}>
                      <Paper className={classes.paper}>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div style={{ width: 380, textAlign: "center" }}>
                            <div style={{ marginBottom: 32 }}>
                              <Typography
                                variant="h6"
                                style={{ fontWeight: "bold" }}
                                gutterBottom
                              >
                                Sucesso!
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                Em breve você receberá um link para testar o
                                reconhecimento
                              </Typography>
                            </div>
                            <div>
                              <Fade
                                in={loading}
                                style={{
                                  transitionDelay: loading ? "800ms" : "0ms"
                                }}
                                unmountOnExit
                              >
                                {this.state.errored ? (
                                  <ErrorIcon className={classes.error} />
                                ) : (
                                  <DoneIcon className={classes.done} />
                                )}
                              </Fade>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </div>
                  )}
                  {activeStep !== 3 && activeStep !== 4 && (
                    <div className={classes.buttonBar}>
                      <Button
                        onClick={this.handleBack}
                        className={classes.backButton}
                        size="large"
                        style={activeStep === 0 ? { display: "none" } : {}}
                      >
                        Voltar
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        size="large"
                        disabled={
                          (this.state.pictureArray.length < 6 ||
                            this.state.pictureArray.length > 24 ||
                            this.state.fullName.length < 3 ||
                            !this.state.emailValid) &&
                          activeStep === 2
                        }
                      >
                        {this.stepActions()}
                      </Button>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Signup));
