import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {DURATION, FPS} from './timeline';

export const Root: React.FC = () => (
  <Composition id="CanvaAd" component={Ad} durationInFrames={DURATION * FPS} fps={FPS} width={1080} height={1920} />
);
