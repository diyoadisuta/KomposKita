const tf = require('@tensorflow/tfjs-node');
const path = require('path');
import fs from 'fs';

// export class PredictService {
//   constructor() {
//     this.model = null;
//   }

//   async loadModel() {
//     const modelPath = path.resolve('./src/model/model.json');
//     this.model = await tf.loadLayersModel(`file://${modelPath}`);
//     console.log('Model loaded successfully');
//   }

//   async predictImage(file) {
//     if (!this.model) {
//       await this.loadModel();
//     }

//     const imageBuffer = fs.readFileSync(file.filepath);

//     const tensor = tf.node
//       .decodeImage(imageBuffer)
//       .resizeNearestNeighbor([512, 512])
//       .expandDims()
//       .toFloat();

//     const predict = await this.model.predict(tensor);
//     const score = await predict.data();
//     const confidenceScore = Math.max(...score);
//     const label = tf.argMax(predict, 1).dataSync()[0];

//     console.log('Confidence Score:', confidenceScore, 'Label:', label);
//     return { label };
//   }
// }

async function testLoadModel() {
  const modelPath = path.resolve('../../src/model/model.json');
  try {
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model loaded successfully');
    console.log(model.summary());
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

testLoadModel();