import React, { Component } from 'react';
import './App.css';
import './bootstrap.min.css';
import * as ml5 from 'ml5';

class App extends Component {

  state = {
    classifierResults: [],
    selectedFile: null,
    uploadedImage: '',
    imageUrl: ''
  }

  classifyUpload = () => {
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    function modelLoaded() {
      console.log('Model Loaded!');
    }
    const image = document.getElementById('uploadedImg');
    classifier.predict(image, 5, function(err, results) {
      return results;
    })
      .then((results) => {
        this.setResults(results)
      })
    }

  setResults = (results) => {
    this.setState({
      classifierResults: results
    });
  }

  componentDidUpdate = () => {
    if(!this.state.uploadedImage) {
      this.setState({
        uploadedImage: document.getElementById('uploadedImg')
      })
      this.classifyUpload();
    }
  }

  goodboyeCheck = (classifierResults) => {
    var goodboyes = 0;
    for(var i = 0; i < classifierResults.length; i++) {
      if(classifierResults[i].className.includes('golden retriever')) {
        goodboyes++;
      }
    }
    if(goodboyes > 0) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    if(e.target.files.length > 0) {
      let file = e.target.files[0];
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result,
          classifierResults: (<div className="loader"></div>)
        });
      }
      reader.readAsDataURL(file)
    }
  }

  render = () => {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    let goodboye;
    let classifierResults = '';

    if (imagePreviewUrl) {
      $imagePreview = (<img id="uploadedImg" className="imgPreview" alt="results" ref={this.uploadedImage} src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Select an image to check.</div>);
    }

    if(this.state.classifierResults.length > 0){

      classifierResults = this.state.classifierResults.map((pred, i) => {
        let { className, probability } = pred;
        probability = Math.floor(probability * 10000) / 100 + "%";
        return (
          <div className="Classifier-results" key={ i + "" }>{ i+1 }. { className }/{ probability }</div>
        )
      })
      goodboye = this.goodboyeCheck(this.state.classifierResults);
    }

    return (
      <div className="App">
        <div className="App-header">
          <div className="container">
          <h3 className="header-text">Is it a goodboye?</h3>
          <p>Extensive market research has determined that Golden Retreivers are goodboyes,
            upload a photo of your pupper to find out. 
          </p>
          <div className="form-group uploadFile">
            <input type="file" className="form-control-file" onChange={(e)=>this.handleImageChange(e)}></input>
          </div>
          <div className="imgPreviewContainer">
            {$imagePreview}
          </div>
          <h3>{ goodboye }</h3>
          { classifierResults }
          </div>
          <p style={{paddingTop: 20}}>
            <a style={{textDecoration: 'none', color: 'white'}} href="https://github.com/keaton185/goodboyes">Github </a>
          </p>
          <p>
            <span role="img" aria-label="canadian-flag">🇨🇦</span>
          </p>
          </div>
      </div>
    );
  }
}

export default App;