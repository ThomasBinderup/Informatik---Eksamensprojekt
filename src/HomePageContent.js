import React from 'react';
import './HomePageContent.css';
import facebookLogo from './images/facebookLogo.png'
import imagePlaceholder from './images/imagePlaceholder.jpg'

export default function HomePageContent() {
  let createGridItems = (
    <div className="createGridItems">
      <div className="overskriftHeaderHPC">Tidskapsel overskrift</div>
      <div className="innerTimecapsuleContainerHPC">
        <div className="item1ContainerHPC"><img src={imagePlaceholder} className="imageHPC"></img></div>
        <div className="item2ContainerHPC">
      <p className="navnHPC">Navn Efternavn</p>
      <hr></hr>
      <p className="beskrivelseHPC1">Hvad handler denne tidskapsel om?</p>
      <p className="beskrivelseHPC2">Her skal beskrivelsen af tidskapslen være</p>
      </div>
      </div>
      </div>
  )
  return (
    <div id="homePageContentContainer">
      <div className="gridItemHPC" id="gridItemSearchBar">
      <div id="searchBarContainer"><span id="filterIcon" className="material-symbols-outlined">
tune
</span><input id="searchBarInput"/><span className="material-symbols-outlined" id="searchIcon">
search
</span></div>
      </div>
      <div className="gridItemHPC" id="gridItemMainContent">
        {createGridItems}
        {createGridItems}
        {createGridItems}
        {createGridItems}
        {createGridItems}
        {createGridItems}
        {createGridItems}
        {createGridItems}
        </div>
    </div>
  )
}
