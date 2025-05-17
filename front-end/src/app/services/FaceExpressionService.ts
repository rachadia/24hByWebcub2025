import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root',
})
export class FaceExpressionService {
  private modelsLoaded = false;

  async loadModels(): Promise<void> {
    const MODEL_URL = '/assets/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    this.modelsLoaded = true;
  }

  async detectExpressions(videoElement: HTMLVideoElement): Promise<faceapi.FaceExpressions[] | null> {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    return detections.map(d => d.expressions);
  }
}
