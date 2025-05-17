import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {
  private modelsLoaded = false;

  constructor() { }

  async loadModels() {
    if (this.modelsLoaded) return;

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/assets/models')
      ]);
      this.modelsLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face detection models:', error);
      throw error;
    }
  }

  async detectFaces(imageElement: HTMLImageElement | HTMLCanvasElement) {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      const detections = await faceapi.detectAllFaces(
        imageElement,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceExpressions();

      return detections;
    } catch (error) {
      console.error('Error detecting faces:', error);
      throw error;
    }
  }

  async detectSingleFace(imageElement: HTMLImageElement | HTMLCanvasElement) {
    if (!this.modelsLoaded) {
      await this.loadModels();
    }

    try {
      const detection = await faceapi.detectSingleFace(
        imageElement,
        new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();
      return detection;
    } catch (error) {
      console.error('Error detecting face:', error);
      throw error;
    }
  }
} 