import React from 'react'
import './ProfileSubpageGuide.css';

export default function ProfileSubpageGuide() {
  return (
    <div id="flexContainerGuide">
        <h1>Hjælpevideo for oprettelse af tidskapsel</h1>
        <video width="720" height="480" controls >
            <source src="path/to/your/video.mp4" type="video/mp4" />
            <source src="path/to/your/video.webm" type="video/webm" />
            Your browser does not support the video tag.
        </video>
        
        
    </div>

  )
}
