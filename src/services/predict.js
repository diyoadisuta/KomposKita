const tf = require('@tensorflow/tfjs-node');
const path = require('path');
import fs from 'fs';

export class PredictService {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    const modelPath = path.resolve('./src/services/model_tfjs/model.json');
    this.model = await tf.loadGraphModel(`file://${modelPath}`);
    console.log('Model loaded successfully');
  }

  async predictImage(file) {
    if (!this.model) {
      await this.loadModel();
    }

    if (!file || !file[0].filepath) {
      throw new Error('Invalid file object: missing filepath');
    }

    const imageBuffer = fs.readFileSync(file[0].filepath);

    const tensor = tf.node
      .decodeImage(imageBuffer)
      .resizeNearestNeighbor([512, 512])
      .toFloat()
      .div(tf.scalar(127.5))
      .sub(tf.scalar(1.0))
      .expandDims();

    const predict = await this.model.predict(tensor);
    const score = await predict.data();
    const confidenceScore = Math.max(...score);
    const label = tf.argMax(predict, 1).dataSync()[0];

    const resultLabels = [
      'Sampah Organik Basah (LAYAK KOMPOS)',
      'Sampah Organik Kering (LAYAK KOMPOS)',
      'Sampah Tidak Layak Kompos',
    ];

    console.log(confidenceScore)
    const resultLabel = resultLabels[label];
    return { label: resultLabel };
  }
}
