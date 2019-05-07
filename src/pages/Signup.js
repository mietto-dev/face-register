import React,  { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

import Camera from 'react-html5-camera-photo';
import '../camera.css';


import FormData from 'form-data';
import axios from 'axios'


// import Back from '../components/common/Back';

const backgroundShape = require('../images/shape.svg');

const logo = require('../images/bett-logo.png'); 

const numeral = require('numeral');
numeral.defaultFormat('0');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary['A100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 10,
    padding: 20,
    paddingBottom: 500
  },
  grid: {
    margin: `0`
  },
  smallContainer: {
    width: '100%'
  },
  bigContainer: {
    width: '100%'
  },
  logo: {
    display: 'block',
    textAlign: 'center'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepGrid: {
    width: '100%'
  },
  buttonBar: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: theme.palette.primary['A100']
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 42
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  modal: {
    position: 'absolute',
    width: '90%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
    outline: 'none',
    margin: '5%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  done: {
    width: '100px',
    height: '100px',
    fill: '#4dd4a7'
  }
})

const getSteps = () => {
  return [
    'Info',
    'Aceite',
    'Fotos'
  ];
}

class Signup extends Component {

  state = {
    activeStep: 0,
    receivingAccount: '', 
    termsChecked: false,
    loading: true,
    labelWidth: 0,
    pictureArray: [],
    modalPicture: '',
    modalOpen: false,
    modalPictureIndex: 0,
    userId: this.props.match.params.userId
  }

  componentDidMount() {
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
    if(this.state.activeStep === 2) {
       this.submitPictures()
   }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTerms = event => {
    this.setState({ termsChecked: event.target.checked });
  };

  stepActions() {
    if(this.state.activeStep === 0) {
      return 'Quero participar';
    }
    if(this.state.activeStep === 1) {
      return 'Aceito os termos';
    }
    if(this.state.activeStep === 2) {
      return 'Enviar Fotos';
    }
    return 'Next';
  }

  onTakePhoto (base64picture) {
    if(this.state.pictureArray.length < 24) {
      this.setState(state => {   
        state.pictureArray.push(base64picture)
        return ({ pictureArray: state.pictureArray})
      })
    }
    
  }

  showModal = event => {
    this.setState({ modalPicture: event.target.src, modalOpen: true, modalPictureIndex: event.target.id });
  }

  closeModal = event => {
    this.setState({ modalOpen: false });
  }

  deletePicture = event => {
    this.setState(state => { 
      state.pictureArray.splice(state.modalPictureIndex, 1)
      return ({ pictureArray: state.pictureArray})
    })
    this.closeModal()
  }

  validatePictures = event => {
    if(this.state.pictureArray.length  < 6) {
      console.error('Picutures < 6')
    } 
  }

  submitPictures = event => {
    let data = new FormData();
    //let URL = 'http://ec2-18-234-203-116.compute-1.amazonaws.com/add-person'
    let URL = 'https://d3hrgbj4h2mmru.cloudfront.net/add-person'

    data.append('userId', this.state.userId)

    for(let i = 0; i < this.state.pictureArray.length; i++) {
      let pic = this.state.pictureArray[i];
      data.append('file_' + i, pic);
     
    }
    axios.post(URL, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': `multipart/form-data;`, 
      }
    })
    .then((response) => {
      //handle success
      this.handleNext() 
    }).catch((error) => {
      //handle error
      console.error(error)
    });
    
  }

  render() {

    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, loading } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
      
          <Grid container justify="center">
            <Grid alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.logo}>
                  <img width={150} src={logo} alt="" />
                </div>
                <div className={classes.stepContainer}>
                  <div className={classes.stepGrid}>
                    <Stepper classes={{root: classes.stepper}} activeStep={activeStep} alternativeLabel>
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  { activeStep === 0 && (
                    <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <Grid item container xs={12}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Olá Felipe,
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            A Bett Educar, em parceria com a Microsoft e a FCamara, está 
                            disponibilizando o credenciamento e acesso exclusivo ao evento
                            de forma automática e sem filas por reconhecimento facial.
                          </Typography>
                          <Typography variant="body1" gutterBottom> 
                            Para participar, basta preencher este cadastro com suas fotos e
                            aceitar nosso termo de privacidade.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 1 && (
                  <div className={classes.smallContainer}>
                  <Paper className={classes.paper}>
                  <Grid item container xs={12}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom >
                            Política de privacidade
                          </Typography>
                          <Typography color='secondary' gutterBottom>
                            Armazenamento
                          </Typography>
                          <List component="nav">
                            <ListItem style={{padding: 0}}>
                              <ListItemIcon>
                                <DoneIcon />
                              </ListItemIcon>
                              <ListItemText style={{padding: '5px 0'}} inset primary="Não armazenamos suas fotos em nenhum momento" />
                            </ListItem>
                            <ListItem style={{padding: 0 }}>
                              <ListItemIcon>
                                <DoneIcon />
                              </ListItemIcon>
                              <ListItemText style={{padding: '5px 0'}} inset primary="Armazenamos apenas as características numéricas do reconhecimento facial" />
                            </ListItem>
                          </List>
                          <Typography color='secondary' gutterBottom>
                            Uso dos dados
                          </Typography>
                          <List>
                            <ListItem style={{padding: 0}}>
                              <ListItemIcon>
                                <DoneIcon />
                              </ListItemIcon>
                              <ListItemText style={{padding: '5px 0'}} inset primary="Os dados serão exclusivamente utilizados para credenciamento automático e acesso ao evento" />
                            </ListItem>
                          </List>
                        </Grid>
                      </Grid>
                  </Paper>
                  </div>
                  )}
                  { activeStep === 2 && (
                  <div className={classes.smallContainer}>
                    <Paper className={classes.paper}>
                      <div>
                        <div>
                          <Typography variant="subtitle1" gutterBottom>
                            Fotos
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Tire pelo menos 6 fotos (máximo 24), com boa iluminação e com apenas seu rosto visível.
                          </Typography>
                        </div>
                        <Camera
                          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                          />
                        <div style={{textAlign: 'center'}}>
                          {this.state.pictureArray.map((base64picture, index) => (
                            <img src={base64picture} width={50} key={index} id={index} onClick={this.showModal} style={{margin: 3}} />
                          ))}
                        </div>
                        <Modal open={this.state.modalOpen} onBackdropClick={this.closeModal} >
                          <div className={classes.modal}>
                            <div>
                              <img src={this.state.modalPicture} width='100%' height='100%'/>
                            </div>
                            <div>
                              <Button
                              onClick={this.closeModal}
                              className={classes.backButton}
                              size='large'
                              >
                                Cancelar
                              </Button>
                              <Button
                              onClick={this.deletePicture}
                              className={classes.button}
                              size='large'
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
                  { activeStep === 3 && (
                  <div className={classes.bigContainer}>
                    <Paper className={classes.paper}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: 380, textAlign: 'center'}}>
                          <div style={{marginBottom: 32}}>
                            <Typography variant="h6" style={{fontWeight: 'bold'}} gutterBottom>
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
                                transitionDelay: loading ? '800ms' : '0ms',
                              }}
                              unmountOnExit
                            >
                              <CircularProgress style={{marginBottom: 32, width: 100, height: 100}} />
                            </Fade>
                          </div>
                        </div>
                      </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep === 4 && (
                  <div className={classes.bigContainer}>
                    <Paper className={classes.paper}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{width: 380, textAlign: 'center'}}>
                          <div style={{marginBottom: 32}}>
                            <Typography variant="h6" style={{fontWeight: 'bold'}} gutterBottom>
                              Sucesso!
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Em breve você receberá um link para testar o reconhecimento
                            </Typography>
                          </div>
                          <div> 
                            <Fade
                              in={loading}
                              style={{
                                transitionDelay: loading ? '800ms' : '0ms',
                              }}
                              unmountOnExit
                            >
                              <DoneIcon className={classes.done} />
                            </Fade>
                          </div>
                        </div>
                      </div>
                    </Paper>
                    </div>
                  )}
                  { activeStep !== 3 && activeStep !== 4 && (
                     <div className={classes.buttonBar}>
                      <Button
                      onClick={this.handleBack}
                      className={classes.backButton}
                      size='large'
                      style={activeStep === 0 ? {display: 'none'} : {}}
                      >
                        Voltar
                      </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      size='large'
                      disabled={(this.state.pictureArray.length < 6 || this.state.pictureArray.length > 24) && activeStep === 2}
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
    )
  }
}

export default withRouter(withStyles(styles)(Signup))
