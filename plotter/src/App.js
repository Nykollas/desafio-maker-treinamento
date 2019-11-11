import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import firebase from 'firebase';

/**var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appID: "app-id",
};
**/

//Criando configurações para o Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCwIyDeEhPdYaOyUKeGP9eX6CW7QViV7e8 ",
  databaseURL: "https://autobots-8c357.firebaseio.com",
  projectId: "autobots-8c357",
};

//Inicializando as configurações do firebase
firebase.initializeApp(firebaseConfig);

//Definindo class principal
class App extends Component{
  constructor(props){
    super(props);

    //Inicializando estados a serem utilizados
    this.state = {

      //Armazena os valores dos sensores no formato de um vetor
      data:new Array(),

      //Array de configurações do plotador de gráficos 
      //Cada item da array representa um tipo de gráfico  a ser plotado
      plotter_config:[],
    }
  }
  //Método que define o listener para o ouvir os dados  dos sensores armazenados na nuvem 

  /*
  Comentar aqui a estruturas dos dados:
    Ex:
    dado:{
      value:<int>
      timestamp:<datetime dd:mm:ss:hh:mm:ss>
    }
  */
  getData = () => {
    firebase.database().ref("teste/dado").on("value", (snapshot) => {
        console.log("Atualizando!");
        //Recebendo dado
        let new_value = snapshot.val().value;
        console.log(new_value);
        this.updateData(new_value);
    })
  }
  genYArray = (length) => {
    //Gerando Y Axi Array
    return Array.from(Array(length).keys());
  }

  updateData = (new_value) => {
      //Atualizando dado na aplicação
      this.setState(previousState => {
        data:previousState.data.push(new_value);
      })
      
      //Atualizando gráfico
      this.setState({
        plotter_config:
          [
            {
              x: this.genYArray(this.state.data.length) ,
              y: this.state.data,
              type: 'scatter',
              mode: 'lines+points',
              marker: {color: 'red'},
            }
         ]
      });
  }
  //Executado após o componente ser montado pela primeira vez
  componentDidMount = () => {
    this.getData();
  }

  render = () =>{
    return(
      <div style={{ margin:100, display:"flex", alignItems:'center', justifyContent:'center', boxShadow:"1px 1px 1px 1px gray", borderRadius:10}}>
      <Plot 
        data={
            this.state.plotter_config
          
        }
        layout={ {width: 500, height: 300, title: 'Saída LDR'} }
      />
      <div style={{width:100 , height:300, display:'flex', alignItems:'center', justifyContent:"center"}}>
        <img src={"https://scontent-sea1-1.cdninstagram.com/vp/3877d6ffaee34885af0fdf93741561d4/5DF43171/t51.2885-19/s150x150/50636889_2360679477493752_2564610429405888512_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com"}></img>
      </div>
      </div>
    );
    
  }
}

export default App;

